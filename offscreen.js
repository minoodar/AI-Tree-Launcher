// ============================================================================
// AI Tree Launcher — Voice Engine (Offscreen Document)
// ----------------------------------------------------------------------------
// این فایل دو کار انجام می‌دهد که Service Worker (background.js) اصلاً نمی‌تواند:
//   ۱) ضبط میکروفون (getUserMedia + MediaRecorder)
//   ۲) اجرای مدل Whisper (که نیاز به WebAssembly سنگین دارد) بدون فریز کردن تب کاربر
//
// نکتهٔ مهم معماری: listener پیام‌ها همیشه اولین چیزیه که در این فایل اجرا
// می‌شود — قبل از هر import سنگینی. اگر بارگذاری کتابخانهٔ Transformers.js به
// هر دلیلی (مسیر vendor اشتباه، CSP، نبود فایل) شکست بخورد، دیگر نباید کل
// پیام‌رسانی افزونه بی‌صدا بمیرد؛ باید یک خطای صریح برگردد. برای همین import
// کتابخانه به‌صورت lazy (فقط هنگام اولین رونویسی) و داخل try/catch انجام
// می‌شود، نه در بالای فایل.
//
// وابستگی: vendor/transformers.min.js — از پکیج npm @xenova/transformers.
// ============================================================================

const MODEL_ID = 'Xenova/whisper-tiny'; // چندزبانه — فارسی و انگلیسی هر دو پشتیبانی می‌شود
const MAX_RECORD_MS = 60000; // سقف ایمنی: حداکثر ۶۰ ثانیه ضبط پیوسته
const MODEL_LOADING_ANNOUNCE_DELAY_MS = 300; // اگر مدل زیر این زمان از کش لود شود، حالت "loading" اصلاً دیده نمی‌شود

// ---------------------------------------------------------------------------
// فیلترِ دقیق و محدودِ یک هشدارِ بی‌خطرِ شناخته‌شده که خودِ کتابخانهٔ
// transformers.js هنگام دانلود وزن‌های مدل صادر می‌کند: وقتی سرور HuggingFace
// هدر Content-Length را برنمی‌گرداند (رفتار طبیعی CDN/chunked-encoding)،
// کتابخانه فقط برای اطلاع می‌گوید بافر را پویا بزرگ می‌کند — هیچ اثری روی
// صحت مدل یا رونویسی ندارد. فقط همین یک رشتهٔ دقیق فیلتر می‌شود؛ هیچ
// console.warn دیگری (از جمله خطاهای واقعی این افزونه) سرکوب نمی‌شود.
// ---------------------------------------------------------------------------
const _origConsoleWarn = console.warn.bind(console);
console.warn = (...args) => {
  const first = args[0];
  if (typeof first === 'string') {
    if (first.indexOf('Unable to determine content-length') !== -1) return;
    // فیلتر کردن هشدارهای بی‌خطر مربوط به بهینه‌سازی مدل onnxruntime
    if (first.indexOf('Removing initializer') !== -1 || first.indexOf('onnxruntime') !== -1) return;
  }
  _origConsoleWarn(...args);
};

let mediaStream = null;
let mediaRecorder = null;
let audioChunks = [];
let autoStopTimer = null;
let lastRequestedLang = 'auto';

let transformersLib = null; // { pipeline, env } — فقط یک‌بار lazy لود می‌شود
let transcriberInstance = null;
let transcriberLoadingPromise = null;

// ---------------------------------------------------------------------------
// !! این listener باید همیشه اولین کد اجراشونده در فایل باشد !!
// content.js/notepad.js مستقیماً به این صفحه پیام می‌فرستند (چون Offscreen
// Document هم یک context دیگر از همان افزونه است، نیازی به واسطه‌گری
// background.js برای این پیام‌ها نیست). هر شاخه، حتی روی خطای غیرمنتظره، حتماً
// sendResponse را صدا می‌زند — تا کاربر هرگز خطای مبهم «message port closed»
// نبیند و همیشه یک دلیل مشخص بگیرد.
// ---------------------------------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) return;

  if (message.action === 'voiceStart') {
    lastRequestedLang = String(message.lang || 'auto');
    handleVoiceStart()
      .then((ok) => sendResponse({ ok }))
      .catch((err) => sendResponse({ ok: false, error: formatError(err) }));
    return true; // پاسخ async
  }

  if (message.action === 'voiceStop') {
    sendResponse({ ok: true }); // بلافاصله تأیید می‌کنیم؛ نتیجهٔ رونویسی بعداً به‌صورت broadcast می‌رسد
    handleVoiceStop().catch((err) => {
      broadcast({ action: 'voiceError', error: String((err && err.message) || err) });
      broadcast({ action: 'voiceState', state: 'idle' });
    });
    return false;
  }

  if (message.action === 'voiceCancel') {
    handleVoiceCancel();
    sendResponse({ ok: true });
    return false;
  }
});

function broadcast(msg) {
  try { chrome.runtime.sendMessage(msg); } catch (e) { /* هیچ listener‌ای فعلاً گوش نمی‌دهد — بی‌خطر */ }
}

function formatError(err) {
  if (err && err.name && err.message) return err.name + ': ' + err.message;
  return String((err && err.message) || err);
}

function pickSupportedMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
  for (const c of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c)) return c;
  }
  return '';
}

function releaseStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }
}

// ---------------------------------------------------------------------------
// شروع ضبط
// ---------------------------------------------------------------------------
async function handleVoiceStart() {
  if (mediaRecorder && mediaRecorder.state === 'recording') return true;

  // بررسی تشخیصی: اگر mediaDevices اینجا نباشد، به‌جای TypeError مبهم، دلیل
  // دقیق را برمی‌گردانیم (Chrome در بعضی نسخه‌ها/شرایط این را در Offscreen
  // Document به‌درستی مقداردهی نمی‌کند؛ این پیام دقیقاً مشخص می‌کند کدام شرط برقرار نیست).
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
    throw new Error(
      'mediaDevices_unavailable: isSecureContext=' + window.isSecureContext +
      ' protocol=' + location.protocol +
      ' host=' + location.host +
      ' ua=' + navigator.userAgent
    );
  }

  audioChunks = [];
  mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }
  });

  const mimeType = pickSupportedMimeType();
  mediaRecorder = mimeType ? new MediaRecorder(mediaStream, { mimeType }) : new MediaRecorder(mediaStream);
  mediaRecorder.addEventListener('dataavailable', (e) => {
    if (e.data && e.data.size > 0) audioChunks.push(e.data);
  });
  mediaRecorder.start();

  console.log('[AI Tree Voice][offscreen] mic started, broadcasting listening state now');
  broadcast({ action: 'voiceState', state: 'listening' });

  // مدل را همزمان با شروع صحبتِ کاربر پیش‌بارگذاری می‌کنیم (اگر خطا بدهد، فقط
  // لاگ می‌شود؛ خطای واقعی وقتی اهمیت دارد که کاربر واقعاً بخواهد رونویسی شود،
  // که در handleVoiceStop دوباره تلاش و به‌درستی گزارش می‌شود)
  warmupModelInBackground();

  if (autoStopTimer) clearTimeout(autoStopTimer);
  autoStopTimer = setTimeout(() => { handleVoiceStop().catch(() => {}); }, MAX_RECORD_MS);

  return true;
}

// ---------------------------------------------------------------------------
// توقف ضبط + رونویسی
// ---------------------------------------------------------------------------
async function handleVoiceStop() {
  if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }

  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    broadcast({ action: 'voiceState', state: 'idle' });
    return;
  }

  const stopped = new Promise((resolve) => mediaRecorder.addEventListener('stop', resolve, { once: true }));
  mediaRecorder.stop();
  await stopped;
  releaseStream();

  if (!audioChunks.length) {
    broadcast({ action: 'voiceState', state: 'idle' });
    return;
  }

  broadcast({ action: 'voiceState', state: 'processing' });

  try {
    const blob = new Blob(audioChunks, { type: (mediaRecorder && mediaRecorder.mimeType) || 'audio/webm' });
    audioChunks = [];
    const arrayBuffer = await blob.arrayBuffer();
    const pcm16k = await decodeAudioTo16kMono(arrayBuffer);
    const text = await runTranscription(pcm16k);
    broadcast({ action: 'voiceResult', text });
  } catch (err) {
    broadcast({ action: 'voiceError', error: String((err && err.message) || err) });
  } finally {
    broadcast({ action: 'voiceState', state: 'idle' });
  }
}

function handleVoiceCancel() {
  if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    try { mediaRecorder.stop(); } catch (e) {}
  }
  audioChunks = [];
  releaseStream();
  broadcast({ action: 'voiceState', state: 'idle' });
}

// ---------------------------------------------------------------------------
// تبدیل فرمت صدا به Float32Array تک‌کاناله ۱۶۰۰۰Hz — دقیقاً فرمت موردنیاز Whisper
// ---------------------------------------------------------------------------
async function decodeAudioTo16kMono(arrayBuffer) {
  const tempCtx = new AudioContext();
  let decoded;
  try {
    decoded = await tempCtx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    tempCtx.close();
  }

  const targetSampleRate = 16000;
  const targetLength = Math.max(1, Math.ceil(decoded.duration * targetSampleRate));
  const offlineCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = decoded;
  source.connect(offlineCtx.destination);
  source.start(0);

  const rendered = await offlineCtx.startRendering();
  return rendered.getChannelData(0);
}

// ---------------------------------------------------------------------------
// بارگذاری تنبل (lazy) کتابخانه — فقط وقتی واقعاً برای اولین بار لازم شود.
// این‌طوری اگر vendor/transformers.min.js به هر دلیلی گم/خراب باشد، فقط همان
// عملیات رونویسی خطا می‌دهد؛ ضبط صدا و بقیهٔ پیام‌رسانی افزونه سالم می‌ماند.
// ---------------------------------------------------------------------------
async function getTransformersLib() {
  if (transformersLib) return transformersLib;
  transformersLib = await import('./vendor/transformers.min.js');
  return transformersLib;
}

function isActivelyRecording() {
  return !!(mediaRecorder && mediaRecorder.state === 'recording');
}

function getTranscriber() {
  if (transcriberInstance) return Promise.resolve(transcriberInstance);
  if (transcriberLoadingPromise) return transcriberLoadingPromise;

  let announcedLoading = false;
  const loadingTimer = setTimeout(() => {
    // مهم: اگر همین الان کاربر مشغول صحبت‌کردن است (mediaRecorder فعال است)،
    // پیش‌بارگذاریِ خاموش مدل نباید نشانگر «در حال شنیدن» را با «در حال
    // آماده‌سازی» بازنویسی کند — این دقیقاً همان باگی بود که state را همان
    // لحظه‌ای که کاربر داشت صحبت می‌کرد قطع می‌کرد.
    if (isActivelyRecording()) return;
    announcedLoading = true;
    broadcast({ action: 'voiceState', state: 'loading-model' });
  }, MODEL_LOADING_ANNOUNCE_DELAY_MS);

  transcriberLoadingPromise = (async () => {
    const { pipeline, env } = await getTransformersLib();

    env.allowLocalModels = false; // وزن‌های مدل از HuggingFace می‌آیند و در Cache Storage مرورگر می‌مانند
    env.useBrowserCache = true;
    if (env.backends && env.backends.onnx) {
      // فقط خطاهای واقعی لاگ شوند — نه هشدارهای بی‌خطرِ بهینه‌سازِ گراف مثل
      // "Removing initializer ... It is not used by any node" که صرفاً یعنی
      // ONNX Runtime دارد وزن‌های اضافیِ استفاده‌نشده را از گراف پاک می‌کند
      // (رفتار عادی و درست، نه نشانهٔ خرابی)
      env.backends.onnx.logLevel = 'error';
      if (env.backends.onnx.wasm) {
        env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('vendor/');
        // عمداً تک‌نخی: نسخهٔ چندنخی onnxruntime برای اجرا به Web Worker از blob:
        // نیاز دارد که در محیط افزونه محدودیت CSP دارد. برای مدل کوچک
        // whisper-tiny تفاوت سرعت تک‌نخی/چندنخی ناچیز است.
        env.backends.onnx.wasm.numThreads = 1;
      }
    }

    return pipeline('automatic-speech-recognition', MODEL_ID, {
      progress_callback: (p) => {
        // همان دلیل بالا: اگر هنوز داریم ضبط می‌کنیم، درصد پیشرفت را broadcast نکن
        if (isActivelyRecording()) return;
        if (p && p.status === 'progress' && typeof p.loaded === 'number' && typeof p.total === 'number' && p.total > 0) {
          broadcast({
            action: 'voiceModelProgress',
            percent: Math.round((p.loaded / p.total) * 100),
            file: p.file || ''
          });
        }
      }
    });
  })()
    .then((pipe) => {
      clearTimeout(loadingTimer);
      if (announcedLoading) broadcast({ action: 'voiceModelReady' });
      transcriberInstance = pipe;
      transcriberLoadingPromise = null;
      return pipe;
    })
    .catch((err) => {
      clearTimeout(loadingTimer);
      transcriberLoadingPromise = null;
      const msg = 'model_load_failed: ' + String((err && err.message) || err);
      broadcast({ action: 'voiceError', error: msg });
      throw new Error(msg);
    });

  return transcriberLoadingPromise;
}

function warmupModelInBackground() {
  getTranscriber().catch(() => { /* خطا در handleVoiceStop هم گزارش می‌شود، اینجا فقط از throw خام جلوگیری می‌کنیم */ });
}

// Whisper (via transformers.js) expects full lowercase English language names,
// not ISO/BCP-47 codes. zh-Hans and zh-Hant share Whisper's single "chinese"
// token; Traditional script is handled in post-process when UI is zh-Hant.
function mapLangCode(code) {
  const map = {
    en: 'english',
    fa: 'persian',
    ar: 'arabic',
    es: 'spanish',
    de: 'german',
    fr: 'french',
    ja: 'japanese',
    ru: 'russian',
    tr: 'turkish',
    'zh-Hans': 'chinese',
    'zh-Hant': 'chinese',
    'pt-BR': 'portuguese'
  };
  return map[code] || map[String(code || '').toLowerCase()] || null;
}

async function runTranscription(pcmFloat32) {
  const transcriber = await getTranscriber();

  // Force the extension UI language (full English name). Avoid Whisper auto-detect
  // on tiny — accuracy is too low. Never pass raw ISO codes like zh-Hans / pt-BR.
  const requested = lastRequestedLang && lastRequestedLang !== 'auto' ? lastRequestedLang : null;
  const langCode = requested ? mapLangCode(requested) : null;

  const durationSec = pcmFloat32.length / 16000;
  console.log(`[AI Tree Voice][offscreen] audio ready: ${durationSec.toFixed(2)}s (${pcmFloat32.length} samples), lang=${langCode || 'auto'} (ui=${requested || 'auto'})`);

  if (durationSec < 0.35) {
    console.log('[AI Tree Voice] Audio too short, skipping transcription.');
    return '';
  }

  const options = {
    task: 'transcribe',
    // Greedy decoding — most deterministic; reduces hallucination loops on tiny.
    temperature: 0.0,
    // Blocks pathological repetition loops common on tiny / lower-resource langs.
    no_repeat_ngram_size: 3,
    // Short dictation clips are independent; carrying prior text across chunks
    // often seeds more hallucinations on tiny when chunking is enabled.
    condition_on_previous_text: false,
    // Skip emitting text when the clip is mostly silence/noise (tiny loves to invent words there).
    no_speech_threshold: 0.6,
    ...(langCode ? { language: langCode } : {})
  };

  // chunk_length_s/stride_length_s only for long clips — on short notes they trigger
  // the known empty/truncated output path (transformers.js #1358).
  const CHUNKING_THRESHOLD_SEC = 25;
  if (durationSec > CHUNKING_THRESHOLD_SEC) {
    options.chunk_length_s = 30;
    options.stride_length_s = 5;
  }

  const result = await transcriber(pcmFloat32, options);
  let out = ((result && result.text) || '').trim();

  // Whisper has one "chinese" language token and is biased to Simplified.
  // For Traditional UI users, apply a compact offline S→T map on the result.
  if (out && requested === 'zh-Hant') {
    out = simplifiedToTraditional(out);
  }

  console.log('[AI Tree Voice][offscreen] transcription result:', JSON.stringify(out));
  return out;
}

// Compact offline Simplified → Traditional map for short dictation (not full OpenCC).
// Covers high-frequency everyday characters; unknown chars pass through unchanged.
function simplifiedToTraditional(input) {
  if (!input) return input;
  const S2T = {
    '国': '國', '语': '語', '这': '這', '个': '個', '们': '們', '来': '來', '时': '時',
    '会': '會', '说': '說', '对': '對', '开': '開', '关': '關', '门': '門', '问': '問',
    '题': '題', '学': '學', '习': '習', '书': '書', '长': '長', '东': '東', '西': '西',
    '南': '南', '北': '北', '中': '中', '华': '華', '为': '為', '义': '義', '发': '發',
    '现': '現', '点': '點', '电': '電', '话': '話', '网': '網', '页': '頁', '脑': '腦',
    '机': '機', '车': '車', '飞': '飛', '气': '氣', '爱': '愛', '乐': '樂', '听': '聽',
    '见': '見', '觉': '覺', '认': '認', '识': '識', '记': '記', '请': '請', '谢': '謝',
    '吗': '嗎', '呢': '呢', '吧': '吧', '着': '著', '过': '過', '还': '還', '没': '沒',
    '从': '從', '与': '與', '和': '和', '在': '在', '是': '是', '的': '的', '了': '了',
    '我': '我', '你': '你', '他': '他', '她': '她', '它': '它', '里': '裡', '后': '後',
    '前': '前', '面': '面', '体': '體', '医': '醫', '药': '藥', '买': '買', '卖': '賣',
    '钱': '錢', '银': '銀', '行': '行', '号': '號', '码': '碼', '数': '數', '据': '據',
    '库': '庫', '软': '軟', '件': '件', '应': '應', '用': '用', '程': '程', '序': '序',
    '设': '設', '计': '計', '备': '備', '选': '選', '择': '擇', '确': '確', '认': '認',
    '取': '取', '消': '消', '保': '保', '存': '存', '删': '刪', '除': '除', '传': '傳',
    '输': '輸', '导': '導', '入': '入', '出': '出', '开': '開', '始': '始', '结': '結',
    '束': '束', '完': '完', '成': '成', '功': '功', '败': '敗', '错': '錯', '误': '誤',
    '帮': '幫', '助': '助', '需': '需', '要': '要', '可': '可', '以': '以', '能': '能',
    '够': '夠', '让': '讓', '给': '給', '把': '把', '被': '被', '将': '將', '把': '把',
    '总': '總', '经': '經', '常': '常', '已': '已', '经': '經', '现': '現', '在': '在',
    '今': '今', '天': '天', '明': '明', '昨': '昨', '年': '年', '月': '月', '日': '日',
    '星': '星', '期': '期', '早': '早', '晚': '晚', '上': '上', '下': '下', '午': '午',
    '小': '小', '大': '大', '多': '多', '少': '少', '好': '好', '坏': '壞', '新': '新',
    '旧': '舊', '热': '熱', '冷': '冷', '快': '快', '慢': '慢', '高': '高', '低': '低',
    '远': '遠', '近': '近', '内': '內', '外': '外', '左': '左', '右': '右', '旁': '旁',
    '边': '邊', '处': '處', '所': '所', '地': '地', '区': '區', '城': '城', '市': '市',
    '乡': '鄉', '村': '村', '家': '家', '房': '房', '间': '間', '屋': '屋', '楼': '樓',
    '层': '層', '路': '路', '桥': '橋', '站': '站', '场': '場', '园': '園', '广': '廣',
    '厂': '廠', '公': '公', '司': '司', '机': '機', '构': '構', '组': '組', '织': '織',
    '团': '團', '队': '隊', '员': '員', '工': '工', '作': '作', '职': '職', '业': '業',
    '专': '專', '业': '業', '学': '學', '校': '校', '班': '班', '课': '課', '教': '教',
    '师': '師', '生': '生', '读': '讀', '写': '寫', '看': '看', '听': '聽', '说': '說',
    '讲': '講', '谈': '談', '话': '話', '言': '言', '语': '語', '文': '文', '字': '字',
    '词': '詞', '句': '句', '篇': '篇', '章': '章', '段': '段', '页': '頁', '张': '張',
    '份': '份', '条': '條', '项': '項', '种': '種', '类': '類', '样': '樣', '式': '式',
    '型': '型', '态': '態', '状': '狀', '况': '況', '情': '情', '报': '報', '告': '告',
    '信': '信', '息': '息', '消': '消', '息': '息', '消': '消', '息': '息'
  };
  let out = '';
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    out += Object.prototype.hasOwnProperty.call(S2T, ch) ? S2T[ch] : ch;
  }
  return out;
}
