// void-tab-engine-marks.js — bundled engine marks for Void Tab search brand.
// Kill switch BRAND_MARKS_ENABLED = false restores pure accent-dot behaviour.
(() => {
  'use strict';

  const BRAND_MARKS_ENABLED = true;

  const BRAND_MARKS = {
    google: 'assets/engines/google.svg',
    bing: 'assets/engines/bing.svg',
    duckduckgo: 'assets/engines/duckduckgo.svg',
    brave: 'assets/engines/brave.svg'
  };

  function mount(host, engine) {
    if (!host) return;
    try {
      const prev = host.querySelector('img[data-engine-mark]');
      if (prev) prev.remove();
    } catch (_) {}
    host.classList.remove('has-brand-mark');

    if (!BRAND_MARKS_ENABLED || !engine || engine.custom) return;
    const src = BRAND_MARKS[engine.id];
    if (!src) return;

    const img = document.createElement('img');
    img.dataset.engineMark = engine.id;
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    // Fixed box BEFORE src resolves — prevents full-viewport SVG flash
    img.width = 24;
    img.height = 24;
    img.style.cssText = 'width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;pointer-events:none;display:block;';
    host.classList.add('has-brand-mark');
    img.addEventListener('error', function () {
      try { img.remove(); } catch (_) {}
      host.classList.remove('has-brand-mark');
    }, { once: true });
    img.src = src;
    host.appendChild(img);
  }

  window.AIVoidEngineMarks = { mount: mount };
})();
