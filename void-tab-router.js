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
// دیدنِ رابطِ afzoone/void-tab قبل از ریدایرکت جلوگیری می‌کند (کارِ اصلی این
// فایل، مخفی‌کردنِ کل صفحه پیش از هر رندریست، نه بعدش).
// ============================================================================
(function () {
  // مخفی‌کردنِ فوری و همزمان (synchronous) — قبل از این‌که مرورگر حتی یک
  // فریمِ از canvas/ویجت را رسم کند. chrome.storage.local.get خودش async است،
  // پس این خط تنها تضمینِ واقعیِ نبودِ فلاش است.
  document.documentElement.style.display = 'none';

  function reveal() {
    document.documentElement.style.display = '';
  }

  try {
    if (!chrome || !chrome.storage || !chrome.storage.local) { reveal(); return; }

    // اگر این باز شدن، درخواستِ صریحِ کاربر از دکمهٔ «تب وید» در popup بوده
    // (نه بازشدنِ خودکار به‌عنوان تب‌جدید)، هیچ‌وقت نباید ریدایرکت شود — کاربر
    // دقیقاً همین صفحه را می‌خواسته، صرف‌نظر از تنظیمِ useDefaultNtp.
    const params = new URLSearchParams(location.search);
    if (params.get('explicit') === '1') { reveal(); return; }

    chrome.storage.local.get(['useDefaultNtp'], (res) => {
      if (chrome.runtime && chrome.runtime.lastError) { reveal(); return; }

      if (res && res.useDefaultNtp) {
        // صفحهٔ خودمان اصلاً نمایان نمی‌شود؛ مستقیم به موتور جستجوی استاندارد
        // می‌رویم. replace (نه href=) عمداً استفاده شده تا این صفحهٔ واسط در
        // تاریخچهٔ مرورگر ثبت نشود — دکمهٔ Back کاربر را به یک تبِ خالیِ
        // نامرئی برنمی‌گرداند.
        window.location.replace('https://www.google.com');
        return;
      }

      reveal();
    });
  } catch (e) {
    // در هر حالتِ غیرمنتظره، امن‌ترین رفتار نشان‌دادنِ صفحهٔ خودمان است — نه
    // رهاکردنِ کاربر روی یک تبِ کاملاً خالی/سیاه که هیچ توضیحی ندارد.
    reveal();
  }
})();
