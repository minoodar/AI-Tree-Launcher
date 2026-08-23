// AI Tree Launcher — background service worker (MV3)
// 1) Open standalone notepad tab (with return-to-widget context)
// 2) Refocus parent tab and close notepad tab
// 3) Inline translation (CSP-safe for content scripts + notepad)
// 4) Official public holidays (Iran: fully offline curated list; other countries: Nager.Date)

// فهرست کامل و آفلاینِ تعطیلات رسمی ایران — هم شمسی (j) هم قمری (h). عمداً «شب
// یلدا» در این لیست نیست چون جشن است نه تعطیل رسمی. تبدیل تاریخ قمری به سالِ
// جاری با Intl + تقویم islamic-umalqura در content.js انجام می‌شود (ممکن است
// در برخی سال‌ها ±۱ روز با رؤیت هلال رسمی مؤسسهٔ ژئوفیزیک تهران فرق داشته باشد).
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

// فاز جهانی — برای کشورهای غیر ایران. پوشش Nager.Date همه‌جا یکسان نیست و
// تعطیلات قمری/رؤیت‌هلالی را اصلاً شامل نمی‌شود.
const NAGER_BASE_URL = 'https://date.nager.at/api/v3/PublicHolidays';

function holidaysCacheKeyFor(countryCode, year) {
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) return;

  if (message.action === 'openNotepadTab') {
    const fromTabId = sender.tab && typeof sender.tab.id === 'number' ? sender.tab.id : null;
    const fromWindowId = sender.tab && typeof sender.tab.windowId === 'number' ? sender.tab.windowId : null;
    let url = chrome.runtime.getURL('notepad.html');
    if (fromTabId != null) {
      const qp = new URLSearchParams();
      qp.set('fromTab', String(fromTabId));
      if (fromWindowId != null) qp.set('fromWindow', String(fromWindowId));
      url += '?' + qp.toString();
    }
    chrome.tabs.create({ url })
      .then((tab) => sendResponse({ ok: true, tabId: tab && tab.id }))
      .catch((err) => sendResponse({ ok: false, error: String(err && err.message || err) }));
    return true;
  }

  if (message.action === 'returnToParentTab') {
    const targetTabId = Number(message.tabId);
    const targetWindowId = message.windowId != null ? Number(message.windowId) : null;
    const notepadTabId = sender.tab && typeof sender.tab.id === 'number' ? sender.tab.id : null;

    (async () => {
      let focused = false;
      try {
        if (!Number.isNaN(targetTabId)) {
          if (targetWindowId != null && !Number.isNaN(targetWindowId)) {
            await chrome.windows.update(targetWindowId, { focused: true });
          }
          await chrome.tabs.update(targetTabId, { active: true });
          focused = true;
        }
      } catch (e) {}
      if (notepadTabId != null) {
        try { await chrome.tabs.remove(notepadTabId); } catch (e) {}
      }
      sendResponse({ ok: true, focused });
    })();
    return true;
  }

  if (message.action === 'translateText') {
    const targetLang = String(message.targetLang || 'en').slice(0, 8);
    const text = String(message.text || '').trim();
    if (!text) {
      sendResponse({ success: false, error: 'empty' });
      return;
    }
    if (text.length > 4500) {
      sendResponse({ success: false, error: 'too_long' });
      return;
    }

    // dt=t: ترجمه اصلی — dt=bd: دیکشنری/مترادف‌ها (فقط برای کلمات/عبارات کوتاه پر می‌شود)
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
      encodeURIComponent(targetLang) +
      '&dt=t&dt=bd&q=' +
      encodeURIComponent(text);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        let translatedText = '';
        if (Array.isArray(data) && Array.isArray(data[0])) {
          data[0].forEach((item) => {
            if (item && item[0]) translatedText += item[0];
          });
        }
        if (!translatedText) throw new Error('empty_translation');

        // استخراج مترادف‌ها و نقش‌های دستوری از دیکشنری گوگل (data[1])
        const synonyms = [];
        if (Array.isArray(data[1])) {
          data[1].forEach((partOfSpeech) => {
            if (partOfSpeech && partOfSpeech[0] && Array.isArray(partOfSpeech[1]) && partOfSpeech[1].length > 0) {
              // دفاعی: بسته به فرمت واقعیِ پاسخ گوگل، هر عنصر ممکن است خودش
              // رشته باشد یا یک آرایه که عنصر اولش رشته است. اگر همیشه w[0]
              // فرض شود ولی w در واقع رشته باشد، فقط حرف اول کلمه گرفته
              // می‌شود (باگ) — این نسخه هر دو حالت را پوشش می‌دهد.
              const words = partOfSpeech[1]
                .slice(0, 6)
                .map((w) => (typeof w === 'string' ? w : (w && w[0])))
                .filter(Boolean);
              if (words.length > 0) synonyms.push({ type: partOfSpeech[0], words: words });
            }
          });
        }

        sendResponse({ success: true, text: translatedText, synonyms: synonyms });
      })
      .catch((error) => {
        sendResponse({ success: false, error: String((error && error.message) || error) });
      });

    return true;
  }

  if (message.action === 'checkSpelling') {
    const text = String(message.text || '');
    if (!text) {
      sendResponse({ success: false, error: 'empty' });
      return;
    }
    // LanguageTool public API soft limit; keep payload modest
    if (text.length > 20000) {
      sendResponse({ success: false, error: 'too_long' });
      return;
    }
    const lang = String(message.lang || 'auto').slice(0, 16);

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('language', lang);

    fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        const matches = (data && Array.isArray(data.matches)) ? data.matches : [];
        sendResponse({ success: true, matches: matches });
      })
      .catch((error) => {
        sendResponse({ success: false, error: String((error && error.message) || error) });
      });

    return true;
  }

  if (message.action === 'fetchGlobalHolidays') {
    const countryCode = String(message.countryCode || '').toUpperCase();
    const year = message.year;

    if (countryCode === 'IR') {
      // آفلاین و همزمان — بدون فچ، بدون تأخیر
      sendResponse({ success: true, data: IRAN_HOLIDAYS, source: 'iran-static' });
      return;
    }

    const cacheKey = holidaysCacheKeyFor(countryCode, year);
    chrome.storage.local.get([cacheKey], (res) => {
      if (res[cacheKey]) {
        sendResponse({ success: true, data: res[cacheKey], source: 'cache' });
        return;
      }
      fetch(`${NAGER_BASE_URL}/${year}/${countryCode}`)
        .then((r) => { if (!r.ok) throw new Error('Nager API request failed'); return r.json(); })
        .then((data) => {
          const holidays = mapNagerHolidays(data, countryCode);
          chrome.storage.local.set({ [cacheKey]: holidays });
          sendResponse({ success: true, data: holidays, source: 'nager' });
        })
        .catch((error) => sendResponse({ success: false, error: String((error && error.message) || error) }));
    });

    return true;
  }
});
