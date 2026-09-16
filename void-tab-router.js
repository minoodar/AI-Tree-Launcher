// ============================================================================
// AI Tree Launcher — void-tab.html pre-render router
// ----------------------------------------------------------------------------
// چون chrome_url_overrides.newtab در manifest.json ثابت است و هیچ Chrome API
// ای برای روشن/خاموش‌کردنِ آن در زمانِ اجرا وجود ندارد، این اسکریپت راهِ دور
// زدنِ آن محدودیت است: به‌جای تلاش برای لغوِ خودِ override، همین صفحه (که
// override به آن اشاره می‌کند) در همان لحظهٔ اول تصمیم می‌گیرد که خودش را
// نشان بدهد یا کاربر را به تجربهٔ استانداردِ تب‌جدید هدایت کند.
//
// این فایل باید همیشه اولین <script> در <head>ی void-tab.html باشد — قبل از
// استایل‌ها، canvas و بقیهٔ اسکریپت‌ها — چون همین ترتیب است که از فلاشِ کوتاهِ
// دیدنِ رابطِ افزونه قبل از ریدایرکت جلوگیری می‌کند.
//
// جهت (rtl/ltr) و سمتِ کوییک‌بار/داکِ Today هم دقیقاً به همین دلیل اینجا
// محاسبه می‌شوند، نه در void-tab-menu.js/void-tab-todo.js — تا از همون
// فریمِ اول با چیدمانِ نهایی نمایش داده بشه و کاربر یک جابه‌جاییِ لحظه‌ای
// نبینه. عمداً فقط از chrome.storage.LOCAL استفاده می‌شود (نه sync) — چون
// storage.sync معمولاً کندتر است و طولانی‌ترشدنِ این زنجیرهٔ async دقیقاً
// همون «یه لحظه صفحهٔ سفید/خالی قبل از رندر نهایی» را بدتر می‌کرد. فقط یک
// فراخوانیِ ساده به local، دقیقاً هم‌سرعتِ نسخهٔ قبلی. اگر appLanguage در
// sync ذخیره شده و هنوز به local نرسیده باشد (بسیار نادر)، void-tab-menu.js
// خودش بعداً با storage.sync دوباره چک و اصلاح می‌کند — بدون فلیکرِ محسوس،
// چون این حالت فقط وقتی رخ می‌دهد که این دو مقدار واقعاً فرق کنند.
// ============================================================================
(function () {
  // مخفی‌کردنِ فوری و همزمان (synchronous) — قبل از این‌که مرورگر حتی یک
  // فریمِ از canvas/ویجت را رسم کند.
  document.documentElement.style.display = 'none';

  function reveal() {
    document.documentElement.style.display = '';
  }

  // فهرستِ کمینهٔ زبان‌های راست‌به‌چپ — فقط برای همین تصمیمِ خیلی زودهنگام.
  // منطقِ رسمیِ isRTL در اسکریپت‌های دیگر بعداً همین نتیجه را دوباره
  // تأیید می‌کند، پس نگه‌داشتنِ یک کپیِ کوچکِ اینجا بی‌خطر است.
  var RTL_LANGS = ['fa', 'ar', 'he', 'ur', 'ps', 'sd', 'ckb', 'yi', 'dv'];
  function isRtlLang(lang) {
    if (!lang) return false;
    var base = String(lang).split('-')[0].toLowerCase();
    return RTL_LANGS.indexOf(base) !== -1;
  }

  function isMobileLayout() {
    try { return window.matchMedia('(max-width: 700px)').matches; } catch (e) { return window.innerWidth <= 700; }
  }

  // اعمالِ همزمانِ dir و سمتِ داک/کوییک‌بار — اگر بدنهٔ سند هنوز پارس
  // نشده (عناصر پیدا نمی‌شوند)، تا DOMContentLoaded صبر می‌کند؛ چون صفحه
  // همچنان display:none است، این کاملاً نامرئی می‌ماند. برای یک فایلِ
  // محلیِ کوچک این عملاً بلافاصله اتفاق می‌افتد.
  function applyStableLayout(dir, dockSide, quickbarSide) {
    document.documentElement.dir = dir;
    function apply() {
      var qb = document.getElementById('ai-ntp-quickbar');
      var dock = document.getElementById('ai-void-todo-dock');
      if (qb) qb.dataset.side = quickbarSide;
      if (dock) dock.dataset.side = dockSide;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
      apply();
    }
  }

  function finalizeAndReveal(dir, dockSide) {
    // کوییک‌بار همیشه سمتِ مخالفِ داکِ Today می‌نشیند تا هیچ‌وقت زیرِ هم
    // نباشند. سمتِ پیش‌فرض (وقتی هنوز چیزی ذخیره نشده): داک=left،
    // کوییک‌بار=right — هم‌راستا با پیش‌فرضِ خودِ void-tab-todo.js.
    var quickbarSide = isMobileLayout() ? 'right' : (dockSide === 'left' ? 'right' : 'left');
    applyStableLayout(dir, dockSide, quickbarSide);
    reveal();
  }

  try {
    if (!chrome || !chrome.storage || !chrome.storage.local) { finalizeAndReveal('ltr', 'left'); return; }

    var params = new URLSearchParams(location.search);
    var explicitOpen = params.get('explicit') === '1';

    // یک فراخوانیِ واحد به local برای هر سه مقدار — نه یک زنجیرهٔ چندتایی.
    chrome.storage.local.get(['useDefaultNtp', 'voidTodoDock', 'appLanguage'], (res) => {
      if (chrome.runtime && chrome.runtime.lastError) { finalizeAndReveal('ltr', 'left'); return; }

      if (!explicitOpen && res && res.useDefaultNtp) {
        // صفحهٔ خودمان اصلاً نمایان نمی‌شود؛ مستقیم به موتور جستجوی استاندارد
        // می‌رویم. replace (نه href=) عمداً استفاده شده تا این صفحهٔ واسط در
        // تاریخچهٔ مرورگر ثبت نشود.
        window.location.replace('https://www.google.com');
        return;
      }

      var dockSide = (res && res.voidTodoDock && res.voidTodoDock.side === 'right') ? 'right' : 'left';
      var dir = isRtlLang(res && res.appLanguage) ? 'rtl' : 'ltr';
      finalizeAndReveal(dir, dockSide);
    });
  } catch (e) {
    // در هر حالتِ غیرمنتظره، امن‌ترین رفتار نشان‌دادنِ صفحهٔ خودمان است — با
    // مقادیرِ پیش‌فرض — نه رهاکردنِ کاربر روی یک تبِ کاملاً خالی/سیاه.
    finalizeAndReveal('ltr', 'left');
  }
})();
