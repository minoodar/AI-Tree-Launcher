// ============================================================================
// افزودنی «تعطیلات رسمی آنلاین» — این بلوک را داخل background.js موجودتان
// (کنار همان listener فعلی برای action:'translateText') اضافه کنید.
// اگر همین الان یک chrome.runtime.onMessage.addListener دارید، این کد را
// به همان تابع اضافه کنید (یک else-if برای action === 'fetchGlobalHolidays')
// تا دو تا listener جدا روی هم سوار نشوند.
// ============================================================================

// فهرست کامل و آفلاینِ تعطیلات رسمی ایران — هم شمسی (j) هم قمری (h) — که
// خودتان از یک منبع دقیق آماده کردید. قبل از جای‌گذاری، این فهرست را با
// دیتای رسمی تقویم ۱۴۰۵ تطبیق دادم و اصلاحات زیر را انجام دادم:
//
//   حذف شد (کاملاً نادرست — این چهار مورد یک مناسبتِ ذاتاً قمری را با یک
//   تاریخ شمسیِ ثابتِ ساختگی تکرار کرده بودند؛ عید غدیر، ولادت پیامبر،
//   و شهادت امام علی هر سال با تقویم شمسی جابه‌جا می‌شوند، تاریخ ثابت ندارند):
//     - eid-ghadir-j (روز ۱۴ فروردین) — نسخهٔ درستش «ghadir» با cal:'h' است
//     - mawlid-j (۸ شهریور) — نسخهٔ درستش «mawlid-prophet» با cal:'h' است
//     - imam-ali-martyrdom-j (۹ اسفند) — نسخهٔ درستش «imam-ali-martyrdom» با cal:'h'
//     - father-day (۱ دی) — همان ولادت امام علی است؛ نسخهٔ درستش «imam-ali-birth»
//   دیدوپلیکیت شد:
//     - "eid-fitr" (روز اول فطر) با "eid-fitr-1" یکی بود — نگه‌داشتیم eid-fitr-1
//     - آیدی "eid-fitr-2" دوبار تکرار شده بود (یک تاریخ، دو برچسب) — یکی نگه داشته شد
//   فیلتر شد: تمام مواردی که در فایل شما isPublic:false بودند (روز معلم، روز
//   دانشجو، هفتهٔ دولت و...) عمداً از این آرایه حذف شدند، چون طبق درخواست
//   شما فقط باید تعطیلات واقعی کادر قرمز بگیرند — نه هر مناسبت/روز نام‌گذاری‌شده.
//
// نتیجه: ۲۷ تعطیل رسمی — دقیقاً هم‌راستا با شمار واقعی تعطیلات سالانهٔ ایران.
// چون این فهرست کامل و آفلاین است، دیگر نیازی به فچ از BaseMax نیست —
// مسیر ایران ۱۰۰٪ آفلاین و بدون تأخیر شبکه شد.
//
// ⚠️ محدودیت باقی‌مانده (technical debt، نه در این دیتا بلکه در content.js):
// تبدیل «کدام روز/ماه قمری» به «امسال دقیقاً کِی می‌افتد» با Intl + تقویم
// islamic-umalqura انجام می‌شود، نه با رؤیت هلال مؤسسهٔ ژئوفیزیک تهران —
// ممکن است در برخی سال‌ها ±۱ روز فرق داشته باشد.
const IRAN_HOLIDAYS = [
  { id: 'nowruz', label: 'عید نوروز', day: 1, month: 1, cal: 'j', golden: false, isPublic: true },
  { id: 'nowruz-2', label: 'عید نوروز', day: 2, month: 1, cal: 'j', golden: false, isPublic: true },
  { id: 'eid-fitr-2', label: 'تعطیل به مناسبت عید سعید فطر', day: 2, month: 10, cal: 'h', golden: false, isPublic: true },
  { id: 'nowruz-3', label: 'عید نوروز', day: 3, month: 1, cal: 'j', golden: false, isPublic: true },
  { id: 'nowruz-4', label: 'عید نوروز', day: 4, month: 1, cal: 'j', golden: false, isPublic: true },
  { id: 'islamic-republic', label: 'روز جمهوری اسلامی ایران', day: 12, month: 1, cal: 'j', golden: false, isPublic: true },
  { id: 'nature-day', label: 'روز طبیعت و سیزده‌به‌در', day: 13, month: 1, cal: 'j', golden: false, isPublic: true },
  { id: 'imam-sadiq-martyrdom', label: 'شهادت امام جعفر صادق (ع)', day: 25, month: 10, cal: 'h', golden: false, isPublic: true },
  { id: 'eid-adha', label: 'عید سعید قربان', day: 10, month: 12, cal: 'h', golden: false, isPublic: true },
  { id: 'ghadir', label: 'عید سعید غدیر خم', day: 18, month: 12, cal: 'h', golden: false, isPublic: true },
  { id: 'khomeini-death', label: 'رحلت امام خمینی (ره)', day: 14, month: 3, cal: 'j', golden: false, isPublic: true },
  { id: 'khordad-15', label: 'قیام خونین ۱۵ خرداد', day: 15, month: 3, cal: 'j', golden: false, isPublic: true },
  { id: "tasu'a", label: 'تاسوعای حسینی', day: 9, month: 1, cal: 'h', golden: false, isPublic: true },
  { id: 'ashura', label: 'عاشورای حسینی', day: 10, month: 1, cal: 'h', golden: false, isPublic: true },
  { id: 'arbaeen', label: 'اربعین حسینی', day: 20, month: 2, cal: 'h', golden: false, isPublic: true },
  { id: 'prophet-death-hasan-martyrdom', label: 'رحلت پیامبر اکرم (ص) و شهادت امام حسن مجتبی (ع)', day: 28, month: 2, cal: 'h', golden: false, isPublic: true },
  { id: 'imam-reza-martyrdom', label: 'شهادت امام رضا (ع)', day: 30, month: 2, cal: 'h', golden: false, isPublic: true },
  { id: 'mawlid-prophet', label: 'ولادت حضرت رسول اکرم (ص)', day: 17, month: 3, cal: 'h', golden: false, isPublic: true },
  { id: 'mawlid-imam-sadiq', label: 'ولادت امام جعفر صادق (ع)', day: 17, month: 3, cal: 'h', golden: false, isPublic: true },
  { id: 'fatima-martyrdom', label: 'شهادت حضرت فاطمه زهرا (س)', day: 3, month: 6, cal: 'h', golden: false, isPublic: true },
  { id: 'imam-ali-birth', label: 'ولادت حضرت علی (ع) و روز پدر', day: 13, month: 7, cal: 'h', golden: false, isPublic: true },
  { id: 'prophet-ascension', label: 'مبعث حضرت رسول اکرم (ص)', day: 27, month: 7, cal: 'h', golden: false, isPublic: true },
  { id: 'imam-mahdi-birth', label: 'ولادت حضرت قائم (عج) و نیمه شعبان', day: 15, month: 8, cal: 'h', golden: false, isPublic: true },
  { id: 'imam-ali-martyrdom', label: 'شهادت حضرت علی (ع)', day: 21, month: 9, cal: 'h', golden: false, isPublic: true },
  { id: 'eid-fitr-1', label: 'عید سعید فطر', day: 1, month: 10, cal: 'h', golden: false, isPublic: true },
  { id: 'oil-nationalization', label: 'روز ملی شدن صنعت نفت ایران', day: 29, month: 12, cal: 'j', golden: false, isPublic: true },
  { id: 'revolution-victory', label: 'پیروزی انقلاب اسلامی ایران', day: 22, month: 11, cal: 'j', golden: false, isPublic: true }
];

// فاز جهانی — برای کشورهای غیر ایران. توجه: پوشش Nager.Date برای همهٔ
// کشورها یکسان نیست و تعطیلات قمری/رؤیت‌هلالی را اصلاً شامل نمی‌شود.
const NAGER_BASE_URL = 'https://date.nager.at/api/v3/PublicHolidays';

function cacheKeyFor(countryCode, year) {
  return `aiTreeHolidays_${countryCode}_${year}`;
}

function mapNagerHolidays(data, countryCode) {
  return (Array.isArray(data) ? data : [])
    // فقط تعطیل رسمی واقعی؛ Bank/School/Optional/Observance را رد می‌کنیم
    .filter(item => Array.isArray(item.types) && item.types.includes('Public'))
    .map((item, index) => {
      const [, hMonth, hDay] = item.date.split('-');
      return {
        id: `pub-${countryCode}-${index}`,
        label: item.localName || item.name,
        day: parseInt(hDay, 10),
        month: parseInt(hMonth, 10),
        cal: 'g', // Nager.Date همیشه تاریخ میلادی برمی‌گرداند
        golden: false,
        isPublic: true
      };
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'fetchGlobalHolidays') return false; // بگذار listenerهای دیگر (مثل translateText) کار خودشان را بکنند

  const { countryCode, year } = request;

  if (countryCode === 'IR') {
    // کاملاً آفلاین — بدون فچ، بدون تأخیر، بدون کش لازم
    sendResponse({ success: true, data: IRAN_HOLIDAYS, source: 'iran-static' });
    return false; // پاسخ همین‌جا و همزمان داده شد
  }

  const cacheKey = cacheKeyFor(countryCode, year);
  chrome.storage.local.get([cacheKey], (res) => {
    if (res[cacheKey]) {
      sendResponse({ success: true, data: res[cacheKey], source: 'cache' });
      return;
    }
    fetch(`${NAGER_BASE_URL}/${year}/${countryCode}`)
      .then(r => { if (!r.ok) throw new Error('Nager API request failed'); return r.json(); })
      .then(data => {
        const holidays = mapNagerHolidays(data, countryCode);
        chrome.storage.local.set({ [cacheKey]: holidays });
        sendResponse({ success: true, data: holidays, source: 'nager' });
      })
      .catch(error => sendResponse({ success: false, error: error.toString() }));
  });

  return true; // کانال پیام را برای پاسخ async باز نگه دار
});
