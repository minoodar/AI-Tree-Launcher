const AI_QUOTE_RELIGIONS = {
  islam: { icon: '☪️', file: 'quran.json', label: 'Islam', labelFa: 'اسلام' },
  judaism: { icon: '✡️', file: 'judaism.json', label: 'Judaism', labelFa: 'یهودیت' },
  christianity: { icon: '✝️', file: 'christianity-luke.json', label: 'Christianity', labelFa: 'مسیحیت' },
  eastern: { icon: '☸️', file: 'eastern-wisdom.json', label: 'Eastern Wisdom', labelFa: 'حکمت شرقی' }
};

const AI_QUOTE_POETRY = {
  rumi: { icon: '🌙', file: 'rumi.json', label: 'Rumi', labelFa: 'مولانا' },
  western: { icon: '🖋️', file: 'western-literature.json', label: 'Western Literature', labelFa: 'ادبیات غرب' }
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
  return AI_QUOTE_RELIGIONS[cfg.quoteReligionSource] ? cfg.quoteReligionSource : 'islam';
}

async function aiResolveActivePoetryKey() {
  const cfg = await chrome.storage.local.get(['quotePoetrySource']);
  return AI_QUOTE_POETRY[cfg.quotePoetrySource] ? cfg.quotePoetrySource : 'rumi';
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
