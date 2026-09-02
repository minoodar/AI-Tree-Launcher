// هر دسته (دین/شاعر) اکنون برچسب هر ۸ زبانِ افزونه رو داره (en/fa/ar/es/de/fr/ja/ru)
// — قبلاً فقط label/labelFa داشت. انتخاب برچسب با quoteCategoryLabel() در content.js
// انجام می‌شود که مستقیم بر اساس currentLang جستجو می‌کند (با fallback به en).
const AI_QUOTE_RELIGIONS = {
  islam:        { icon: '☪️', file: 'quran.json',              en: 'Islam',           fa: 'اسلام',        ar: 'الإسلام',           es: 'Islam',              de: 'Islam',            fr: 'Islam',              ja: 'イスラム教', ru: 'Ислам' },
  judaism:      { icon: '✡️', file: 'judaism.json',             en: 'Judaism',         fa: 'یهودیت',       ar: 'اليهودية',          es: 'Judaísmo',           de: 'Judentum',         fr: 'Judaïsme',           ja: 'ユダヤ教',   ru: 'Иудаизм' },
  christianity: { icon: '✝️', file: 'christianity-luke.json',   en: 'Christianity',    fa: 'مسیحیت',       ar: 'المسيحية',          es: 'Cristianismo',       de: 'Christentum',      fr: 'Christianisme',      ja: 'キリスト教', ru: 'Христианство' },
  eastern:      { icon: '☸️', file: 'eastern-wisdom.json',      en: 'Eastern Wisdom',  fa: 'حکمت شرقی',    ar: 'الحكمة الشرقية',    es: 'Sabiduría oriental', de: 'Östliche Weisheit', fr: 'Sagesse orientale',  ja: '東洋の知恵', ru: 'Восточная мудрость' }
};

const AI_QUOTE_POETRY = {
  rumi:    { icon: '🌙', file: 'rumi.json',               en: 'Rumi',               fa: 'مولانا',      ar: 'جلال الدين الرومي', es: 'Rumi',                    de: 'Rumi',                  fr: 'Rumi',                    ja: 'ルーミー', ru: 'Руми' },
  western: { icon: '🖋️', file: 'western-literature.json', en: 'Western Literature', fa: 'ادبیات غرب',  ar: 'الأدب الغربي',      es: 'Literatura occidental',   de: 'Westliche Literatur',   fr: 'Littérature occidentale', ja: '西洋文学', ru: 'Западная литература' }
};

const aiQuoteFileCache = {};

async function aiLoadQuoteFile(fileName) {
  if (aiQuoteFileCache[fileName]) return aiQuoteFileCache[fileName];
  const url = chrome.runtime.getURL(`data/quotes/${fileName}`);
  const res = await fetch(url);
  const data = await res.json();
  aiQuoteFileCache[fileName] = data;
  return data;
}

function aiDailyQuoteIndex(seed, length) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${seed}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) { hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0; }
  return hash % length;
}

function aiCreateQuoteFeature(seed) {
  let items = [];
  let manualIndex = null;

  const feature = {
    async load(fileName) {
      items = await aiLoadQuoteFile(fileName);
      manualIndex = null;
      return items;
    },
    getItems() { return items; },
    currentIndex() {
      if (!items.length) return 0;
      return manualIndex !== null ? manualIndex : aiDailyQuoteIndex(seed, items.length);
    },
    current() { return items[feature.currentIndex()] || null; },
    cycleRandom() {
      if (items.length <= 1) return feature.current();
      const cur = feature.currentIndex();
      let next;
      do { next = Math.floor(Math.random() * items.length); } while (next === cur);
      manualIndex = next;
      return feature.current();
    },
    reset() { manualIndex = null; }
  };

  return feature;
}

async function aiResolveActiveReligionKey() {
  const cfg = await chrome.storage.local.get(['quoteReligionSource']);
  if (AI_QUOTE_RELIGIONS[cfg.quoteReligionSource]) return cfg.quoteReligionSource;
  // پیش‌فرض (وقتی کاربر هنوز خودش انتخاب نکرده): برای فارسی اسلام/قرآن، برای
  // بقیهٔ زبان‌ها مسیحیت/انجیل لوقا. توجه: این تمایز در ابتدا به این دلیل بود
  // که فقط مسیحیت/انجیل لوقا منبعی اصالتاً انگلیسی/غیرفارسی بود؛ اکنون که همهٔ
  // ۶ منبع به هر ۸ زبان ترجمه شده‌اند، این محدودیتِ فنی دیگر برقرار نیست — این
  // فقط یک پیش‌فرضِ فرهنگی/سلیقه‌ای باقی‌مانده که عمداً دست‌نخورده نگه داشته شده.
  return currentLang === 'fa' ? 'islam' : 'christianity';
}

async function aiResolveActivePoetryKey() {
  const cfg = await chrome.storage.local.get(['quotePoetrySource']);
  if (AI_QUOTE_POETRY[cfg.quotePoetrySource]) return cfg.quotePoetrySource;
  // همان منطق و همان نکته: فارسی → مولانا، بقیهٔ زبان‌ها → ادبیات غرب — دیگر یک
  // محدودیتِ فنی نیست، صرفاً پیش‌فرضِ فعلی که دست‌نخورده نگه داشته شده است.
  return currentLang === 'fa' ? 'rumi' : 'western';
}

const AITreeQuoteEngine = {
  religions: AI_QUOTE_RELIGIONS,
  poetry: AI_QUOTE_POETRY,
  religionFeature: aiCreateQuoteFeature('religion'),
  poetryFeature: aiCreateQuoteFeature('poetry'),
  activeReligionKey: 'islam',
  activePoetryKey: 'rumi',

  async initReligion() {
    this.activeReligionKey = await aiResolveActiveReligionKey();
    await this.religionFeature.load(AI_QUOTE_RELIGIONS[this.activeReligionKey].file);
    return this.religionFeature;
  },

  async initPoetry() {
    this.activePoetryKey = await aiResolveActivePoetryKey();
    await this.poetryFeature.load(AI_QUOTE_POETRY[this.activePoetryKey].file);
    return this.poetryFeature;
  }
};
