(function () {
  'use strict';
  const menu = document.getElementById('ai-ntp-menu');
  const menuBtn = document.getElementById('ai-ntp-menu-btn');
  const topsitesEl = document.getElementById('ai-ntp-topsites');
  const itemTopsites = document.getElementById('ai-ntp-menu-topsites');
  const itemFocus = document.getElementById('ai-ntp-menu-focus');
  const itemSettings = document.getElementById('ai-ntp-menu-settings');
  const itemStdTab = document.getElementById('ai-ntp-menu-stdtab');
  if (!menu || !menuBtn) return;

  function applyDir() {
    try {
      if (typeof isRTL === 'function' && typeof currentLang !== 'undefined') {
        document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
      }
      const panel = document.getElementById('ai-ntp-menu-panel');
      if (panel && typeof isRTL === 'function' && typeof currentLang !== 'undefined' && isRTL(currentLang)) {
        panel.style.direction = 'rtl';
        panel.style.textAlign = 'right';
      } else if (panel) {
        panel.style.direction = '';
        panel.style.textAlign = '';
      }
    } catch (e) {}
  }

  function applyLabels() {
    try {
      if (typeof t !== 'function') return;
      const set = (id, key, fallback) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key) || fallback;
      };
      set('ai-ntp-menu-focus-label', 'ntpMenuFocus', 'Focus Mode');
      set('ai-ntp-menu-topsites-label', 'ntpMenuTopsites', 'Frequent Links');
      set('ai-ntp-menu-echo-label', 'voidEchoTitle', "Today's Echo");
      set('ai-ntp-menu-todo-label', 'ntpMenuTodo', 'Today Task');
      set('ai-ntp-menu-settings-label', 'ntpMenuSettings', 'Settings');
      set('ai-ntp-menu-stdtab-label', 'ntpMenuStdTab', 'Use Standard New Tab');
      applyDir();
      try { if (window.AIVoidEngineMarks && AIVoidEngineMarks.applyTitles) AIVoidEngineMarks.applyTitles(); } catch (e) {}
    } catch (e) {}
  }

  function loadLanguageThenLabel() {
    applyLabels();
    try {
      chrome.storage.sync.get(['appLanguage'], (syncRes) => {
        const fromSync = syncRes && syncRes.appLanguage;
        chrome.storage.local.get(['appLanguage'], (localRes) => {
          const lang = fromSync || (localRes && localRes.appLanguage) || null;
          if (lang) { try { currentLang = lang; } catch (e) {} }
          applyLabels();
        });
      });
    } catch (e) { applyLabels(); }
  }
  loadLanguageThenLabel();

  try {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.appLanguage) {
        try { currentLang = changes.appLanguage.newValue || 'en'; } catch (e) {}
        applyLabels();
      }
    });
  } catch (e) {}

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    try { menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); } catch (err) {}
    const appsWrap = document.getElementById('ai-ntp-apps-wrap');
    const appsBtn = document.getElementById('ai-ntp-apps-btn');
    if (appsWrap) appsWrap.classList.remove('open');
    if (appsBtn) appsBtn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove('open');
      try { menuBtn.setAttribute('aria-expanded', 'false'); } catch (err) {}
    }
  });

  if (itemFocus) {
    itemFocus.addEventListener('click', () => {
      const on = document.body.classList.toggle('ai-focus-mode');
      itemFocus.setAttribute('data-on', on ? '1' : '0');
    });
  }

  function applyTopsitesVisibility(show) {
    if (topsitesEl) topsitesEl.classList.toggle('hidden', !show);
    if (itemTopsites) itemTopsites.setAttribute('data-on', show ? '1' : '0');
  }
  try {
    chrome.storage.local.get(['showTopSites'], (res) => {
      applyTopsitesVisibility(res.showTopSites !== false);
    });
  } catch (e) {}
  if (itemTopsites) {
    itemTopsites.addEventListener('click', () => {
      const nowOn = itemTopsites.getAttribute('data-on') !== '1';
      applyTopsitesVisibility(nowOn);
      try { chrome.storage.local.set({ showTopSites: nowOn }); } catch (e) {}
    });
  }

  // تنظیمات: همان «کرکره»ی نوار ابزار (popup.html).
  //  - اگر کرکره همین الان باز است، کلیک دوباره آن را می‌بندد (قبلاً openPopup رد می‌شد و مسیر جایگزین اجرا می‌شد).
  //  - اگر Chrome اجازهٔ بازکردنش را ندهد، یک پنجرهٔ کوچکِ جدا (نه تب) باز می‌شود؛ و اگر همان پنجره از قبل باز است فقط فوکوس می‌گیرد.
  let settingsWinId = null, lastSettingsClick = 0;
  try { chrome.windows.onRemoved.addListener((id) => { if (id === settingsWinId) settingsWinId = null; }); } catch (e) {}
  function openPopupViews() {
    try { return (chrome.extension && chrome.extension.getViews) ? chrome.extension.getViews({ type: 'popup' }) : []; } catch (e) { return []; }
  }
  function openSettingsFallback() {
    const url = chrome.runtime.getURL('popup.html');
    try {
      if (settingsWinId != null) {
        const id = settingsWinId;
        chrome.windows.update(id, { focused: true }, () => {
          if (chrome.runtime.lastError) { settingsWinId = null; setTimeout(openSettingsFallback, 0); }
        });
        return;
      }
      chrome.windows.create({ url, type: 'popup', width: 400, height: 660, focused: true }, (w) => {
        if (chrome.runtime.lastError || !w) { window.open(url, '_blank'); return; }
        settingsWinId = w.id;
      });
    } catch (e) {
      window.open(url, '_blank');
    }
  }
  if (itemSettings) {
    itemSettings.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastSettingsClick < 400) return;       // دابل‌کلیک
      lastSettingsClick = now;
      menu.classList.remove('open');
      try { menuBtn.setAttribute('aria-expanded', 'false'); } catch (err) {}
      const open = openPopupViews();
      if (open.length) { open.forEach((v) => { try { v.close(); } catch (e) {} }); return; }   // کرکره باز است ← ببند
      let p = null;
      try { p = chrome.action && chrome.action.openPopup ? chrome.action.openPopup() : null; } catch (e) { p = null; }
      if (p && typeof p.then === 'function') p.then(null, openSettingsFallback);
      else if (!p) openSettingsFallback();
    });
  }

  if (itemStdTab) {
    itemStdTab.addEventListener('click', () => {
      chrome.storage.local.set({ useDefaultNtp: true }, () => {
        window.location.replace('https://www.google.com');
      });
    });
  }
})();
