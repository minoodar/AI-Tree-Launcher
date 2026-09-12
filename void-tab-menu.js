// ============================================================================
// AI Tree Launcher — void-tab.html NTP menu
// ============================================================================
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
      set('ai-ntp-menu-settings-label', 'ntpMenuSettings', 'Settings');
      set('ai-ntp-menu-stdtab-label', 'ntpMenuStdTab', 'Use Standard New Tab');
      applyDir();
    } catch (e) {}
  }

  // Language may still be default 'en' until storage resolves — load then re-label
  function loadLanguageThenLabel() {
    applyLabels(); // immediate fallback
    try {
      chrome.storage.sync.get(['appLanguage'], (syncRes) => {
        const fromSync = syncRes && syncRes.appLanguage;
        chrome.storage.local.get(['appLanguage'], (localRes) => {
          const lang = fromSync || (localRes && localRes.appLanguage) || null;
          if (lang && typeof currentLang !== 'undefined') {
            try { currentLang = lang; } catch (e) {}
          }
          applyLabels();
        });
      });
    } catch (e) {
      applyLabels();
    }
  }

  loadLanguageThenLabel();

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
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

  if (itemSettings) {
    itemSettings.addEventListener('click', () => {
      try {
        if (chrome.action && chrome.action.openPopup) {
          chrome.action.openPopup().catch(() => {
            window.open(chrome.runtime.getURL('popup.html'), '_blank');
          });
        } else {
          window.open(chrome.runtime.getURL('popup.html'), '_blank');
        }
      } catch (e) {
        window.open(chrome.runtime.getURL('popup.html'), '_blank');
      }
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
