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
  if (typeof first === 'string' && first.indexOf('Unable to determine content-length') !== -1) return;
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

function mapLangCode(code) {
  const map = { fa: 'persian', en: 'english' };
  return map[code] || code;
}

async function runTranscription(pcmFloat32) {
  const transcriber = await getTranscriber();

  // طبق تصمیم قفل‌شده: به‌جای تکیه بر auto-detect ویسپر (که دقتش در این مدل آفلاین
  // پایین است)، همیشه از زبان فعلیِ افزونه استفاده می‌شود مگر صراحتاً 'auto' درخواست
  // شده باشد. مقادیر معتبر برای پارامتر language در transformers.js نام کامل زبان با
  // حروف کوچک است (persian/english) — نه کد دو-حرفی خام و قطعاً نه توکن‌های ویژه
  // مثل <|fa|>/<|en|>؛ mapLangCode همین را برمی‌گرداند.
  const langCode = lastRequestedLang && lastRequestedLang !== 'auto' ? mapLangCode(lastRequestedLang) : null;

  const durationSec = pcmFloat32.length / 16000;
  console.log(`[AI Tree Voice][offscreen] audio ready: ${durationSec.toFixed(2)}s (${pcmFloat32.length} samples), lang=${langCode || 'auto'}`);

  if (durationSec < 0.35) {
    // خیلی کوتاه‌تر از آن که ویسپر بتواند چیزی تشخیص دهد — به‌جای برگرداندن رشتهٔ
    // خالیِ گنگ (که کاربر آن را یک باگ می‌دید)، خطای مشخص می‌دهیم تا در UI پیام روشنی نشان داده شود
    throw new Error('audio_too_short');
  }

  const options = {
    task: 'transcribe',
    // temperature: 0 = رمزگشاییِ حریصانه (greedy) — قطعی‌ترین حالت، به‌طور کلی
    // احتمال هذیان‌گویی/تکرار را کمتر می‌کند و مکملِ no_repeat_ngram_size است
    temperature: 0.0,
    // جلوگیری از یکی از شناخته‌شده‌ترین حالت‌های خرابیِ Whisper: افتادن در یک
    // حلقهٔ توهمیِ تکرار (مثلاً یک کلمه ده‌ها بار پشت سر هم). این پدیده در
    // مدل‌های کوچک (tiny) و برای زبان‌های کم‌داده مثل فارسی بیشتر رخ می‌دهد و
    // ربطی به اینکه کدام زبان انتخاب شده ندارد — یک محدودیت سطح تولید متن است.
    no_repeat_ngram_size: 3,
    ...(langCode ? { language: langCode } : {})
  };

  // نکتهٔ کلیدیِ رفعِ باگِ خروجیِ خالی: chunk_length_s/stride_length_s فقط برای
  // کلیپ‌های واقعاً طولانی معنا دارد. اعمال آن روی ضبط‌های کوتاه دفترچه (چند
  // ثانیه تا چند ده‌ثانیه — دقیقاً حالت رایج استفاده) پایپ‌لاین را وارد مسیر
  // long-form + merge-chunks می‌کند که برای این طول‌ها به‌طور شناخته‌شده خروجی
  // خالی یا ناقص می‌دهد (رجوع: huggingface/transformers.js issue #1358). برای
  // کلیپ کوتاه اصلاً chunking نمی‌فرستیم؛ پایپ‌لاین خودش short-form را درست هندل می‌کند.
  const CHUNKING_THRESHOLD_SEC = 25;
  if (durationSec > CHUNKING_THRESHOLD_SEC) {
    options.chunk_length_s = 30;
    options.stride_length_s = 5;
  }

  const result = await transcriber(pcmFloat32, options);
  const text = ((result && result.text) || '').trim();
  console.log('[AI Tree Voice][offscreen] transcription result:', JSON.stringify(text));
  return text;
}
