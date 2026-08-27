// اتصال سیستم آیکون/دوک/میکروفون به تولبار این صفحه — بعد از notepad.js چون
// notepad.js خودش رفتار دکمه‌ها (translate/spellcheck/speak و...) را وایر
// می‌کند؛ اینجا فقط لایهٔ بصری و میکروفون اضافه می‌شود، چیزی را جایگزین
// نمی‌کند. این فایل به‌صورت جدا نگه داشته شده (نه inline در notepad.html)
// چون Manifest V3 به‌طور پیش‌فرض اجرای اسکریپت inline را مسدود می‌کند.
document.addEventListener('DOMContentLoaded', () => {
  const toolbar = document.querySelector('.toolbar');
  if (toolbar) {
    mountZenIcons(toolbar);
    AITreeZenDock.initDock(toolbar);
    const micBtn = toolbar.querySelector('#mic-btn');
    const noteText = document.querySelector('#note-text');
    // این صفحه (دفترچهٔ مستقل تمام‌صفحه) تنها جایی است که فرایند تبدیل صدا به
    // متن واقعاً اجرا می‌شود (رجوع به توضیح داخل content.js: نسخهٔ ویجت شناور
    // دیگر خودش ضبط نمی‌کند، فقط به همین صفحه با ?autoVoice=1 وصل می‌شود).
    // چون این صفحه فضای کافی دارد، به‌جای HUD شناور از یک نوار وضعیت
    // درون‌صفحه‌ای دائمی (شفاف‌تر و مستقیم‌تر) استفاده می‌کنیم؛ hud:false یعنی
    // آن کپسول شناور اینجا اصلاً ساخته نمی‌شود تا دو نشانگر روی هم نیفتند.
    AITreeZenDock.wireMicButton(micBtn, noteText, {
      hud: false,
      statusEl: document.getElementById('voice-status'),
      progressFillEl: document.getElementById('voice-progress-fill')
    });

    maybeAutoStartVoice(micBtn);
  }

  maybeRunMicPermissionBootstrap();
});

// ---------------------------------------------------------------------------
// شروع خودکار ضبط وقتی از دکمهٔ میکروفونِ ویجت شناور به اینجا هدایت شده‌ایم
// (?autoVoice=1) — تا کاربر همان تجربهٔ یک‌کلیکیِ سابق را حس کند، بدون این‌که
// خودِ ضبط داخل ویجتِ ناپایدار اجرا شود.
//
// عمداً به‌جای صدا زدن مستقیمِ AITreeVoiceEngine.start()، خودِ دکمهٔ میکروفون
// را click() می‌کنیم — دقیقاً همان مسیر کدی که کلیک دستی طی می‌کند (تنها مسیر
// آزمایش‌شده و مطمئن)، نه یک مسیر موازیِ جداگانه.
//
// چون هیچ منبعی (نه ما، نه Chrome) تضمین نمی‌کند این شروعِ خودکار همیشه در
// همان چند صد میلی‌ثانیهٔ اول موفق شود (Service Worker می‌تواند خواب باشد،
// Offscreen Document تازه ساخته شود و غیره)، به‌جای سکوتِ کامل در صورت شکست:
//   ۱) بلافاصله یک پیام «در حال اتصال…» در نوار وضعیت نشان می‌دهیم — تا کاربر
//      بداند درخواستش دیده شده، نه این‌که فکر کند هیچ اتفاقی نیفتاده.
//   ۲) اگر بعد از چند ثانیه هنوز به حالت «شنیدن» نرسیده باشیم، به‌جای ماندن در
//      سکوتِ مبهم، یک راهنمای صریح («برای شروع روی میکروفون بزنید») نشان
//      می‌دهیم — شفافیت به‌جای حدس‌زدن.
// ---------------------------------------------------------------------------
function maybeAutoStartVoice(micBtn) {
  const params = new URLSearchParams(location.search);
  if (params.get('autoVoice') !== '1') return;
  if (typeof AITreeVoiceEngine === 'undefined' || !AITreeVoiceEngine.isSupported()) return;
  if (!micBtn || micBtn.style.display === 'none') return; // یعنی خودِ wireMicButton قبلاً مخفی‌اش کرده (پشتیبانی نشده)

  const statusEl = document.getElementById('voice-status');
  if (statusEl) {
    statusEl.dataset.state = 'loading-model';
    statusEl.textContent = 'در حال اتصال به میکروفون… / Connecting to microphone…';
  }
  console.log('[AI Tree Voice][notepad] autoVoice requested — will auto-click mic shortly');

  setTimeout(() => {
    // اگر کاربر خودش قبل از رسیدن این تایمر روی میکروفون کلیک کرده (state دیگر
    // 'idle' نیست)، اصلاً کلیک خودکار نمی‌زنیم — وگرنه یک مسابقهٔ start/stop
    // ایجاد می‌شود: کلیک دستی ضبط را شروع می‌کند، و همین کلیکِ خودکارِ ما (که
    // toggle را صدا می‌زند) بلافاصله دوباره متوقفش می‌کند، دقیقاً همان رفتار
    // گیج‌کننده‌ای که گزارش شده بود.
    if (AITreeVoiceEngine.getState() !== 'idle') {
      console.log('[AI Tree Voice][notepad] skipping auto-click — user already interacted, state:', AITreeVoiceEngine.getState());
      return;
    }
    console.log('[AI Tree Voice][notepad] auto-clicking mic button now, current state:', AITreeVoiceEngine.getState());
    micBtn.click();

    setTimeout(() => {
      const state = AITreeVoiceEngine.getState();
      console.log('[AI Tree Voice][notepad] state 3s after auto-click:', state);
      if (state === 'idle') {
        if (statusEl) { statusEl.dataset.state = ''; statusEl.textContent = ''; }
        AITreeZenDock.showActionToast(
          micBtn.closest('[data-zen-toolbar]') || micBtn.parentElement,
          'برای شروع، روی میکروفون بزنید / Tap the mic to start'
        );
      }
    }, 3000);
  }, 500);
}

// ---------------------------------------------------------------------------
// درخواست مجوز میکروفون از یک تب واقعی و قابل‌مشاهده
// ----------------------------------------------------------------------------
// وقتی voice-engine.js از Offscreen Document خطای مجوز (NotAllowedError /
// Permission dismissed) بگیرد، همین صفحه را با ?grantMic=1 باز می‌کند. اینجا
// getUserMedia واقعاً از یک تب قابل‌مشاهده و با تمرکز کاربر صدا زده می‌شود —
// مجوز برای origin افزونه (chrome-extension://...) ذخیره می‌شود، پس بعد از
// این، همان Offscreen Document هم بدون پرسیدن دوباره کار می‌کند. جریان صدا را
// بلافاصله بعد از گرفتن مجوز متوقف می‌کنیم؛ فقط خودِ مجوز لازم بود، نه ضبط.
// ---------------------------------------------------------------------------
function maybeRunMicPermissionBootstrap() {
  const params = new URLSearchParams(location.search);
  if (params.get('grantMic') !== '1') return;

  showMicPermissionBanner('در حال درخواست مجوز میکروفون…', 'در حال درخواست مجوز میکروفون…');

  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
    showMicPermissionBanner(
      'مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.',
      'Your browser does not support audio recording.',
      'error'
    );
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      stream.getTracks().forEach((t) => t.stop()); // فقط مجوز لازم بود، نیازی به ضبط واقعی نیست
      showMicPermissionBanner(
        '✅ مجوز میکروفون فعال شد. می‌توانید این تب را ببندید و دوباره روی دکمهٔ میکروفون بزنید.',
        '✅ Microphone permission granted. You can close this tab and try the mic button again.',
        'success'
      );
      try { chrome.runtime.sendMessage({ action: 'micPermissionGranted' }); } catch (e) {}
    })
    .catch((err) => {
      const denied = err && err.name === 'NotAllowedError';
      showMicPermissionBanner(
        denied
          ? '❌ مجوز میکروفون رد شد. برای فعال‌سازی، از تنظیمات مرورگر (آیکون قفل کنار آدرس‌بار) دسترسی میکروفون را برای این افزونه باز کنید.'
          : '❌ خطا در دسترسی به میکروفون: ' + String((err && err.message) || err),
        denied
          ? '❌ Microphone permission was denied. Enable it from the site settings (padlock icon next to the address bar) for this extension.'
          : '❌ Microphone error: ' + String((err && err.message) || err),
        'error'
      );
    });
}

function showMicPermissionBanner(textFa, textEn, kind) {
  let el = document.getElementById('mic-permission-banner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mic-permission-banner';
    el.style.cssText =
      'flex:none;width:100%;box-sizing:border-box;padding:10px 16px;margin-bottom:8px;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Vazirmatn","Segoe UI",sans-serif;' +
      'font-size:12.5px;line-height:1.6;text-align:center;border-radius:10px;' +
      'border:1px solid rgba(255,255,255,0.12);' +
      'background:rgba(20,22,30,0.96);color:#F3F4F6;';
    // داخل .page اضافه می‌شود (نه body) — چون .page یک ستون فلکس با ارتفاع ثابت
    // 100vh و overflow:hidden است؛ اضافه‌کردن به‌عنوان یک آیتم فلکس دیگر باعث
    // می‌شود بقیهٔ آیتم‌ها (مثل textarea که flex:1 دارد) کمی جمع شوند، نه اینکه
    // چیزی (مثل هدر و دکمهٔ برگشت) از دید خارج شود.
    const page = document.querySelector('.page') || document.body;
    page.insertBefore(el, page.firstChild);
  }
  el.style.borderColor = kind === 'error' ? 'rgba(239,68,68,0.45)' : kind === 'success' ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.12)';
  el.innerHTML = `<div>${textFa}</div><div style="direction:ltr;color:#9CA3AF;margin-top:4px;font-size:11px;">${textEn}</div>`;
}
