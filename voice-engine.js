// ============================================================================
// AI Tree Launcher — Voice Engine (content-script side orchestrator)
// ----------------------------------------------------------------------------
// این فایل خودش میکروفون را ضبط نمی‌کند — آن کار داخل offscreen.js انجام
// می‌شود (چون آنجا origin افزونه است و فقط یک‌بار مجوز می‌خواهد، نه به‌ازای
// هر سایتی که این content script در آن اجرا می‌شود). این فایل فقط:
//   ۱) سیگنال شروع/توقف ضبط را می‌فرستد
//   ۲) broadcastهای وضعیت (idle/listening/processing/loading-model)، درصد
//      دانلود مدل، و متن نهایی را می‌شنود و به بقیهٔ افزونه (فاز بعدی UI) پاس می‌دهد
//
// الگوی این فایل دقیقاً مثل quote-engine.js است: یک آبجکت سراسری با closure
// خودش، بدون وابستگی به uiEls یا state داخلی content.js — content.js در فاز
// بعدی (طراحی بصری تولبار) فقط باید روی رویدادهای این آبجکت subscribe کند.
// ============================================================================

const AITreeVoiceEngine = (() => {
  const MAX_RECORD_MS = 60000; // سقف ایمنی سمت کلاینت هم (offscreen.js هم همین سقف را دارد)

  const SUPPORTED = typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.sendMessage) &&
    typeof navigator !== 'undefined' && !!(navigator.mediaDevices);

  let currentState = 'idle'; // idle | listening | processing | loading-model | error
  let stateEnteredAt = Date.now();
  let offscreenReady = false;
  let clientStopTimer = null;
  let permissionTabRequested = false; // فقط یک‌بار در هر جلسه تب مجوز را خودکار باز می‌کنیم

  const listeners = { state: [], progress: [], result: [], error: [] };

  // --------------------------------------------------------------------------
  // زبان تشخیص گفتار — عمداً از تنظیمی جدا در Settings (popup.html) خوانده
  // می‌شود، نه از زبان رابط کاربریِ افزونه (currentLang). این دو مفهوماً
  // متفاوتند: کاربری که رابط را روی انگلیسی گذاشته ممکن است هنوز بخواهد به
  // فارسی صحبت کند. مقدار 'auto' یعنی صریحاً از currentLang پیروی کن (رفتار
  // قبلی) — نه اینکه به تشخیص خودکار Whisper سپرده شود (که طبق تجربهٔ قبلی
  // دقتش برای فارسی پایین است).
  // --------------------------------------------------------------------------
  let voiceLangPref = 'detect'; // پیش‌فرضِ بدون‌نیاز-به-تنظیم: تشخیص خودکار واقعیِ Whisper
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['voiceRecognitionLang'], (data) => {
        if (data && data.voiceRecognitionLang) voiceLangPref = data.voiceRecognitionLang;
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.voiceRecognitionLang) {
          voiceLangPref = changes.voiceRecognitionLang.newValue || 'detect';
        }
      });
    }
  } catch (e) {}

  function emit(kind, payload) {
    listeners[kind].forEach((fn) => { try { fn(payload); } catch (e) {} });
  }

  function setState(next) {
    if (currentState === next) return;
    currentState = next;
    stateEnteredAt = Date.now();
    emit('state', next);
  }

  function on(kind, fn) {
    if (!listeners[kind]) return () => {};
    listeners[kind].push(fn);
    return () => { listeners[kind] = listeners[kind].filter((f) => f !== fn); };
  }

  function resolveLang() {
    // اولویت با تنظیمِ صریحِ کاربر در Settings است. 'fa'/'en' یعنی همیشه همون
    // زبان اجباری شود. 'detect' یعنی صراحتاً به تشخیصِ خودکارِ واقعیِ خودِ
    // Whisper سپرده شود (نه پیروی از زبان رابط کاربری) — برای گفتار ترکیبی.
    // 'auto' (پیش‌فرض) یعنی از زبان رابط کاربری (i18n.js → currentLang) پیروی
    // کن؛ اگر آن هم موجود نبود، به offscreen.js مقدار 'auto' فرستاده می‌شود تا
    // Whisper خودش تشخیص دهد.
    if (voiceLangPref === 'fa' || voiceLangPref === 'en') return voiceLangPref;
    if (voiceLangPref === 'detect') return 'auto';
    try {
      if (typeof currentLang !== 'undefined' && currentLang) return currentLang;
    } catch (e) {}
    return 'auto';
  }

  function sendMessage(payload) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(payload, (res) => {
          if (chrome.runtime.lastError) { reject(new Error(chrome.runtime.lastError.message)); return; }
          resolve(res);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async function ensureOffscreenDocument() {
    if (offscreenReady) return true;
    try {
      const res = await sendMessage({ action: 'ensureOffscreenDocument' });
      offscreenReady = !!(res && res.ok);
      return offscreenReady;
    } catch (e) {
      return false;
    }
  }

  // پیام‌های broadcast شده از offscreen.js (voiceState / voiceModelProgress / voiceResult / voiceError)
  // این‌ها را همه‌ی context های افزونه دریافت می‌کنند، از جمله این content script
  chrome.runtime.onMessage.addListener((message) => {
    if (!message || !message.action) return;
    if (message.action && message.action.indexOf('voice') === 0) {
      console.log('[AI Tree Voice][content] received broadcast:', message.action, message);
    }

    if (message.action === 'voiceState') {
      if (clientStopTimer && message.state !== 'listening') { clearTimeout(clientStopTimer); clientStopTimer = null; }
      setState(message.state);
      return;
    }
    if (message.action === 'voiceModelProgress') {
      emit('progress', typeof message.percent === 'number' ? message.percent : null);
      return;
    }
    if (message.action === 'voiceModelReady') {
      emit('progress', 100);
      return;
    }
    if (message.action === 'voiceResult') {
      emit('result', message.text || '');
      return;
    }
    if (message.action === 'voiceError') {
      emit('error', message.error || 'unknown_error');
      return;
    }
    if (message.action === 'micPermissionGranted') {
      // مجوز از تب نوت‌پد گرفته شد — اگر منتظر همین بودیم، خودکار دوباره امتحان می‌کنیم
      if (permissionTabRequested) {
        permissionTabRequested = false;
        setTimeout(() => { start(); }, 300);
      }
      return;
    }
  });

  function isSupported() { return SUPPORTED; }
  function getState() { return currentState; }

  async function start() {
    if (!SUPPORTED) { emit('error', 'unsupported'); return false; }
    if (currentState === 'listening') return true;
    if (currentState === 'processing' || currentState === 'loading-model') return false; // در حین کار قبلی، شروع جدید نادیده گرفته می‌شود

    const ready = await ensureOffscreenDocument();
    if (!ready) { emit('error', 'offscreen_unavailable'); return false; }

    try {
      const res = await sendMessage({ action: 'voiceStart', lang: resolveLang() });
      if (!res || !res.ok) {
        const errText = (res && res.error) || 'mic_permission_denied';
        if (isPermissionError(errText)) {
          handlePermissionNeeded();
        } else {
          emit('error', errText);
        }
        return false;
      }
      // مطمئن‌ترین لحظه برای اعلام «در حال شنیدن»: همین پاسخ مستقیم و
      // تضمین‌شدهٔ voiceStart — نه صرفاً منتظر یک broadcast جداگانه ماندن که
      // ممکن است (به هر دلیلی، مثلاً از دست رفتن پیام) هرگز نرسد. اگر بعداً
      // broadcast واقعی هم برسد، چون state از قبل یکسان است، setState آن را
      // نادیده می‌گیرد (بدون تکرار رویداد).
      setState('listening');
    } catch (err) {
      emit('error', String((err && err.message) || err));
      return false;
    }

    if (clientStopTimer) clearTimeout(clientStopTimer);
    clientStopTimer = setTimeout(() => { stop(); }, MAX_RECORD_MS);
    return true;
  }

  function isPermissionError(text) {
    return /NotAllowedError|Permission dismissed|Permission denied|NotFoundError/i.test(String(text || ''));
  }

  function handlePermissionNeeded() {
    emit('error', 'needs_permission_tab');
    if (permissionTabRequested) return; // این جلسه قبلاً یک‌بار تب مجوز باز شده
    permissionTabRequested = true;
    sendMessage({ action: 'openNotepadTab', grantMic: true }).catch(() => {
      permissionTabRequested = false;
    });
  }

  async function stop() {
    if (clientStopTimer) { clearTimeout(clientStopTimer); clientStopTimer = null; }
    // اجازهٔ توقف از 'loading-model' هم داده می‌شود، نه فقط 'listening': ضبط از
    // همان لحظهٔ mediaRecorder.start() شروع می‌شود (قبل از هر broadcast ای)، پس
    // حتی اگر به هر دلیلی این تب لحظاتی 'loading-model' را ببیند، همچنان باید
    // بتوان با یک کلیک ضبط را متوقف کرد.
    if (currentState !== 'listening' && currentState !== 'loading-model') return;
    try {
      await sendMessage({ action: 'voiceStop' });
      setState('processing'); // نتیجهٔ نهایی (idle + متن) از broadcast واقعی می‌آید؛ این فقط UI را فوراً به‌روز می‌کند
    } catch (e) {}
  }

  async function cancel() {
    if (clientStopTimer) { clearTimeout(clientStopTimer); clientStopTimer = null; }
    try { await sendMessage({ action: 'voiceCancel' }); } catch (e) {}
  }

  const STUCK_PROCESSING_MS = 15000; // اگر بیش از این در «در حال تبدیل» ماندیم، یعنی احتمالاً یک broadcast گم شده
  let toggleInFlight = false; // جلوگیری از مسابقهٔ دو کلیکِ پیاپی/هم‌پوشان روی هم

  async function toggle() {
    if (toggleInFlight) return currentState;
    toggleInFlight = true;
    try {
      if (currentState === 'listening' || currentState === 'loading-model') {
        await stop();
        return 'stopping';
      }
      if (currentState === 'idle' || currentState === 'error') {
        return (await start()) ? 'listening' : 'error';
      }
      // currentState === 'processing': اگر به‌طور طبیعی در حال رونویسی است، کلیک
      // نادیده گرفته می‌شود (چیزی برای متوقف کردن نیست). اما اگر بیش از حد معقول
      // در همین حالت گیر کرده باشیم — یعنی به‌احتمال زیاد یک broadcast (مثلاً
      // به‌خاطر چند تب هم‌زمان یا از دست رفتن پیام) هرگز نرسیده — کلیک دوبارهٔ
      // کاربر را به‌عنوان درخواست صریحِ «بازنشانی اضطراری» می‌پذیریم؛ در غیر این
      // صورت دکمه برای همیشه به کلیک بی‌اثر می‌ماند و کاربر حس می‌کند «قطع نمی‌شود»
      if (Date.now() - stateEnteredAt > STUCK_PROCESSING_MS) {
        await cancel();
        setState('idle');
        return 'idle';
      }
      return currentState;
    } finally {
      toggleInFlight = false;
    }
  }

  return { on, start, stop, cancel, toggle, isSupported, getState };
})();
