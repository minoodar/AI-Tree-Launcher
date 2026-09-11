// Multi-engine web search for Void Tab — same engines as the extension
// search panel (Google / Bing / DuckDuckGo / Brave + custom).
(() => {
  'use strict';

  const BUILTIN = [
    { id: 'google', label: 'Google', template: 'https://www.google.com/search?q={q}', accent: '#8ab4f8' },
    { id: 'bing', label: 'Bing', template: 'https://www.bing.com/search?q={q}', accent: '#4ec3f7' },
    { id: 'duckduckgo', label: 'DuckDuckGo', template: 'https://duckduckgo.com/?q={q}', accent: '#de5833' },
    { id: 'brave', label: 'Brave', template: 'https://search.brave.com/search?q={q}', accent: '#fb542b' }
  ];

  const root = document.getElementById('ai-void-search');
  const brand = document.getElementById('ai-void-search-brand');
  const brandName = document.getElementById('ai-void-search-brand-name');
  const input = document.getElementById('ai-void-search-input');
  const goBtn = document.getElementById('ai-void-search-go');
  const dots = document.getElementById('ai-void-search-dots');
  const prevBtn = document.getElementById('ai-void-search-prev');
  const nextBtn = document.getElementById('ai-void-search-next');
  if (!root || !brand || !brandName || !input || !goBtn || !dots) return;

  let engines = BUILTIN.map((e) => Object.assign({}, e));
  let activeId = 'google';
  let index = 0;

  function current() { return engines[index] || engines[0]; }

  function findIndex(id) {
    const i = engines.findIndex((e) => e.id === id);
    return i >= 0 ? i : 0;
  }

  function buildUrl(engine, query) {
    const q = encodeURIComponent(query);
    const tpl = (engine && engine.template) || 'https://www.google.com/search?q={q}';
    if (tpl.indexOf('{q}') >= 0) return tpl.split('{q}').join(q);
    return tpl + q;
  }

  function doSearch() {
    const q = (input.value || '').trim();
    if (!q) { input.focus(); return; }
    window.location.href = buildUrl(current(), q);
  }

  function renderDots() {
    dots.innerHTML = '';
    engines.forEach((eng, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'ai-void-search-dot' + (i === index ? ' is-active' : '');
      d.title = eng.label;
      d.setAttribute('aria-label', eng.label);
      d.addEventListener('click', (e) => { e.stopPropagation(); setIndex(i); });
      dots.appendChild(d);
    });
  }

  function applyEngineUI() {
    const eng = current();
    activeId = eng.id;
    brandName.textContent = eng.label;
    brand.dataset.engine = eng.id;
    brand.style.setProperty('--engine-accent', eng.accent || '#a5b4fc');
    root.style.setProperty('--engine-accent', eng.accent || '#a5b4fc');
    input.placeholder = 'Search with ' + eng.label + '\u2026';
    input.setAttribute('aria-label', 'Search with ' + eng.label);
    renderDots();
    brand.classList.remove('ai-void-search-brand-pulse');
    void brand.offsetWidth;
    brand.classList.add('ai-void-search-brand-pulse');
  }

  function setIndex(i, persist) {
    if (!engines.length) return;
    const n = engines.length;
    index = ((i % n) + n) % n;
    applyEngineUI();
    if (persist !== false) {
      try { chrome.storage.local.set({ webSearchEngine: current().id }); } catch (e) {}
    }
  }

  function next() { setIndex(index + 1); }
  function prev() { setIndex(index - 1); }

  function loadEngines() {
    try {
      chrome.storage.local.get(
        ['webSearchEngine', 'webSearchEngineOverrides', 'webSearchCustomEngines'],
        (data) => {
          const overrides = (data && data.webSearchEngineOverrides && typeof data.webSearchEngineOverrides === 'object')
            ? data.webSearchEngineOverrides : {};
          engines = BUILTIN.map((e) => {
            const o = overrides[e.id];
            if (o && typeof o === 'object') {
              return { id: e.id, label: o.label || e.label, template: o.template || e.template, accent: e.accent };
            }
            return Object.assign({}, e);
          });
          if (Array.isArray(data && data.webSearchCustomEngines)) {
            data.webSearchCustomEngines.forEach((c) => {
              if (!c || !c.id || !c.template) return;
              engines.push({
                id: String(c.id),
                label: String(c.label || c.id).slice(0, 24),
                template: String(c.template),
                accent: '#c4b5fd'
              });
            });
          }
          if (data && data.webSearchEngine) activeId = data.webSearchEngine;
          index = findIndex(activeId);
          applyEngineUI();
        }
      );
    } catch (e) { applyEngineUI(); }
  }

  goBtn.addEventListener('click', (e) => { e.preventDefault(); doSearch(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    else if (e.key === 'ArrowLeft' && (e.altKey || e.metaKey || input.selectionStart === 0)) { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowRight' && (e.altKey || e.metaKey || input.selectionStart === input.value.length)) { e.preventDefault(); next(); }
  });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); next(); });

  let touchStartX = 0, touchStartY = 0, touching = false;
  root.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    touching = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (!touching) return;
    touching = false;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });

  let ptrStartX = 0, ptrActive = false;
  brand.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    ptrActive = true;
    ptrStartX = e.clientX;
    brand.setPointerCapture(e.pointerId);
  });
  brand.addEventListener('pointerup', (e) => {
    if (!ptrActive) return;
    ptrActive = false;
    const dx = e.clientX - ptrStartX;
    if (Math.abs(dx) < 36) return;
    if (dx < 0) next(); else prev();
  });
  brand.addEventListener('click', () => next());

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.webSearchEngine || changes.webSearchCustomEngines || changes.webSearchEngineOverrides) loadEngines();
    });
  } catch (e) {}

  loadEngines();
  setTimeout(() => {
    try {
      if (document.activeElement === document.body || document.activeElement === document.documentElement) {
        input.focus({ preventScroll: true });
      }
    } catch (e) {}
  }, 280);
})();
