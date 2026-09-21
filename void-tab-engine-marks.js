// void-tab-engine-marks.js — stacked asset SVG layers; zero-jump via data-engine.
(() => {
  'use strict';

  const BUILTIN = new Set(['google', 'bing', 'duckduckgo', 'brave']);
  const ASSETS = {
    google: 'assets/engines/google.svg',
    bing: 'assets/engines/bing.svg',
    duckduckgo: 'assets/engines/duckduckgo.svg',
    brave: 'assets/engines/brave.svg'
  };

  function preloadAll() {
    Object.keys(ASSETS).forEach(function (id) {
      try {
        var im = new Image();
        im.decoding = 'async';
        im.src = ASSETS[id];
      } catch (_) {}
    });
  }
  try { preloadAll(); } catch (_) {}

  function tr(key, fallback, name) {
    let v = '';
    try { if (typeof t === 'function') v = t(key) || ''; } catch (_) {}
    v = v || fallback;
    return name != null ? v.split('{name}').join(name) : v;
  }

  let lastHost = null;
  let lastEngine = null;

  // Re-applies every localized tooltip of the engine switcher. Called on mount
  // and again from void-tab-menu.js whenever the UI language is (re)loaded.
  function applyTitles() {
    try {
      const brand = document.getElementById('ai-void-search-brand');
      const prev = document.getElementById('ai-void-search-prev');
      const next = document.getElementById('ai-void-search-next');
      const hint = tr('voidEngineSwitchHint', 'Swipe or click to switch engine');
      if (brand) brand.title = hint;
      if (prev) {
        prev.title = tr('voidEnginePrev', 'Previous engine');
        prev.setAttribute('aria-label', prev.title);
      }
      if (next) {
        next.title = tr('voidEngineNext', 'Next engine');
        next.setAttribute('aria-label', next.title);
      }
      if (lastHost) {
        const name = (lastEngine && lastEngine.label) || lastHost.dataset.engine || '';
        const label = tr('voidEngineOpenSite', 'Open {name} website', name);
        lastHost.setAttribute('aria-label', label);
        // The logo is a link to the engine's website, NOT a switch control.
        // Its own title overrides the parent's "click to switch" tooltip; when
        // there is no link (custom engine w/o valid URL) an empty title
        // suppresses the parent's misleading tooltip too.
        lastHost.title = lastHost.hasAttribute('href') ? label : '';
      }
    } catch (_) {}
  }

  /**
   * host = .ai-void-search-brand-mark (anchor with stacked .mark imgs)
   * engine = { id, label, template, custom? }
   */
  function mount(host, engine) {
    if (!host) return;
    const id = engine && engine.id ? String(engine.id) : 'generic';
    const key = BUILTIN.has(id) && !(engine && engine.custom) ? id : 'generic';
    host.dataset.engine = key;

    lastHost = host;
    lastEngine = engine || null;

    let href = null;
    try {
      if (engine && typeof engine.template === 'string') {
        const u = new URL(engine.template.split('{q}').join('x'));
        if (u.protocol === 'https:' || u.protocol === 'http:') href = u.origin + '/';
      }
    } catch (_) {}
    if (href) {
      host.href = href;
      host.target = '_blank';
      host.rel = 'noopener noreferrer';
    } else {
      host.removeAttribute('href');
      host.removeAttribute('target');
    }

    applyTitles();

    try { localStorage.setItem('aiv:lastEngine', key); } catch (_) {}
  }

  window.AIVoidEngineMarks = { mount: mount, preloadAll: preloadAll, applyTitles: applyTitles };
})();
