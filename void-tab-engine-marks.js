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

  /**
   * host = .ai-void-search-brand-mark (anchor with stacked .mark imgs)
   * engine = { id, label, template, custom? }
   */
  function mount(host, engine) {
    if (!host) return;
    const id = engine && engine.id ? String(engine.id) : 'generic';
    const key = BUILTIN.has(id) && !(engine && engine.custom) ? id : 'generic';
    host.dataset.engine = key;

    const name = (engine && engine.label) || key;
    host.setAttribute('aria-label', 'Open ' + name);

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

    try { localStorage.setItem('aiv:lastEngine', key); } catch (_) {}
  }

  window.AIVoidEngineMarks = { mount: mount, preloadAll: preloadAll };
})();
