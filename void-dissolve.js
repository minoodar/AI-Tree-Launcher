/*!
 * Void Dissolve — panels scatter into stars; a singularity remains as toggle.
 * Privacy-local, CSS+DOM particles (no extra canvas dependency).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'voidDissolveState';
  const PARTICLE_COUNT = 28;
  const DISSOLVE_MS = 720;
  const RESTORE_MS = 560;
  const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /** @type {Record<string, {
   *   id: string,
   *   el: HTMLElement,
   *   label: string,
   *   storageKey?: string,
   *   onHide?: function,
   *   onShow?: function,
   *   singularity?: HTMLElement|null,
   *   anchor?: {x:number,y:number}|null,
   *   dissolving?: boolean
   * }>} */
  const registry = Object.create(null);
  let savedState = Object.create(null);
  let stateLoaded = false;
  const layer = document.createElement('div');
  layer.id = 'ai-void-dissolve-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.documentElement.appendChild(layer);

  function loadState(cb) {
    try {
      chrome.storage.local.get([STORAGE_KEY], (res) => {
        savedState = (res && res[STORAGE_KEY] && typeof res[STORAGE_KEY] === 'object')
          ? res[STORAGE_KEY]
          : {};
        stateLoaded = true;
        if (typeof cb === 'function') cb();
      });
    } catch (e) {
      savedState = {};
      stateLoaded = true;
      if (typeof cb === 'function') cb();
    }
  }

  function persist() {
    try { chrome.storage.local.set({ [STORAGE_KEY]: savedState }); } catch (e) {}
  }

  function labelText(entry) {
    try {
      if (typeof t === 'function') return t('voidDissolveRestore', 'Restore {name}').replace('{name}', entry.label);
    } catch (e) {}
    return 'Restore ' + entry.label;
  }

  function particleBurst(rect, inward) {
    if (reducedMotion) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const n = PARTICLE_COUNT;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'ai-void-dust' + (inward ? ' is-inward' : '');
      const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
      const dist = 40 + Math.random() * Math.max(rect.width, rect.height) * 0.55;
      const size = 2 + Math.random() * 3.5;
      const hue = 200 + Math.random() * 80;
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      p.style.setProperty('--sz', size + 'px');
      p.style.setProperty('--hue', String(hue));
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      layer.appendChild(p);
      setTimeout(() => { try { p.remove(); } catch (e) {} }, DISSOLVE_MS + 80);
    }
  }

  function placeSingularity(entry, rect) {
    removeSingularity(entry);
    const orb = document.createElement('button');
    orb.type = 'button';
    orb.className = 'ai-void-singularity';
    orb.dataset.voidId = entry.id;
    orb.setAttribute('aria-label', labelText(entry));
    orb.title = labelText(entry);

    const x = entry.anchor && typeof entry.anchor.x === 'number'
      ? entry.anchor.x
      : (rect.left + rect.width / 2);
    const y = entry.anchor && typeof entry.anchor.y === 'number'
      ? entry.anchor.y
      : (rect.top + Math.min(28, rect.height / 2));

    orb.style.left = Math.max(12, Math.min(window.innerWidth - 44, x - 18)) + 'px';
    orb.style.top = Math.max(12, Math.min(window.innerHeight - 44, y - 18)) + 'px';

    const core = document.createElement('span');
    core.className = 'ai-void-singularity-core';
    const ring = document.createElement('span');
    ring.className = 'ai-void-singularity-ring';
    const glow = document.createElement('span');
    glow.className = 'ai-void-singularity-glow';
    const glyph = document.createElement('span');
    glyph.className = 'ai-void-singularity-glyph';
    glyph.textContent = '◉';
    orb.append(glow, ring, core, glyph);

    orb.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      restore(entry.id);
    });
    // playful hover drift bubbles
    orb.addEventListener('pointerenter', () => orb.classList.add('is-awake'));
    orb.addEventListener('pointerleave', () => orb.classList.remove('is-awake'));

    document.body.appendChild(orb);
    entry.singularity = orb;
    // stagger-in
    requestAnimationFrame(() => orb.classList.add('is-visible'));
  }

  function removeSingularity(entry) {
    if (entry.singularity) {
      try { entry.singularity.remove(); } catch (e) {}
      entry.singularity = null;
    }
  }

  function dissolve(id, opts) {
    opts = opts || {};
    const entry = registry[id];
    if (!entry || !entry.el || entry.dissolving) return;
    if (entry.el.hidden && entry.singularity) return;

    entry.dissolving = true;
    const rect = entry.el.getBoundingClientRect();
    entry.anchor = {
      x: rect.left + rect.width / 2,
      y: rect.top + Math.min(32, rect.height * 0.2)
    };

    entry.el.classList.add('ai-void-is-dissolving');
    particleBurst(rect, false);

    const finish = () => {
      entry.el.classList.remove('ai-void-is-dissolving');
      entry.el.hidden = true;
      entry.el.setAttribute('aria-hidden', 'true');
      entry.dissolving = false;
      placeSingularity(entry, rect);
      savedState[id] = {
        dissolved: true,
        x: entry.anchor.x,
        y: entry.anchor.y
      };
      persist();
      if (typeof entry.onHide === 'function') {
        try { entry.onHide(); } catch (e) {}
      }
    };

    if (reducedMotion) finish();
    else setTimeout(finish, DISSOLVE_MS);
  }

  function restore(id) {
    const entry = registry[id];
    if (!entry || !entry.el || entry.dissolving) return;

    entry.dissolving = true;
    const orb = entry.singularity;
    let rect = {
      left: entry.anchor ? entry.anchor.x - 40 : window.innerWidth / 2,
      top: entry.anchor ? entry.anchor.y - 20 : 80,
      width: 80,
      height: 40
    };
    if (orb) {
      const r = orb.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      orb.classList.add('is-collapsing');
    }

    particleBurst(rect, true);

    const finish = () => {
      removeSingularity(entry);
      entry.el.hidden = false;
      entry.el.setAttribute('aria-hidden', 'false');
      entry.el.classList.add('ai-void-is-reforming');
      entry.dissolving = false;
      delete savedState[id];
      persist();
      if (typeof entry.onShow === 'function') {
        try { entry.onShow(); } catch (e) {}
      }
      setTimeout(() => {
        try { entry.el.classList.remove('ai-void-is-reforming'); } catch (e) {}
      }, RESTORE_MS);
    };

    if (reducedMotion) finish();
    else setTimeout(finish, Math.min(RESTORE_MS, 420));
  }

  function isDissolved(id) {
    return !!(savedState[id] && savedState[id].dissolved);
  }

  /**
   * Register a panel that can dissolve into a singularity.
   * @param {string} id
   * @param {object} opts
   * @param {HTMLElement} opts.el
   * @param {string} opts.label
   * @param {function} [opts.onHide] — sync external visibility flags / menu
   * @param {function} [opts.onShow]
   * @param {HTMLElement} [opts.trigger] — optional dissolve button
   */
  function register(id, opts) {
    if (!opts || !opts.el) return;
    const entry = {
      id: id,
      el: opts.el,
      label: opts.label || id,
      onHide: opts.onHide,
      onShow: opts.onShow,
      singularity: null,
      anchor: null,
      dissolving: false
    };
    registry[id] = entry;

    if (opts.trigger) {
      opts.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dissolve(id);
      });
    }

    // Apply persisted dissolve after state loads
    const applySaved = () => {
      if (savedState[id] && savedState[id].dissolved) {
        entry.anchor = {
          x: savedState[id].x || 40,
          y: savedState[id].y || 80
        };
        entry.el.hidden = true;
        entry.el.setAttribute('aria-hidden', 'true');
        placeSingularity(entry, {
          left: entry.anchor.x - 20,
          top: entry.anchor.y - 20,
          width: 40,
          height: 40
        });
        if (typeof entry.onHide === 'function') {
          try { entry.onHide({ fromStorage: true }); } catch (e) {}
        }
      }
    };
    if (stateLoaded) applySaved();
    else loadState(applySaved);
  }

  // Reposition singularities on resize
  window.addEventListener('resize', () => {
    Object.keys(registry).forEach((id) => {
      const entry = registry[id];
      if (!entry.singularity || !entry.anchor) return;
      const x = Math.max(12, Math.min(window.innerWidth - 44, entry.anchor.x - 18));
      const y = Math.max(12, Math.min(window.innerHeight - 44, entry.anchor.y - 18));
      entry.singularity.style.left = x + 'px';
      entry.singularity.style.top = y + 'px';
    });
  }, { passive: true });

  loadState();

  window.VoidDissolve = {
    register: register,
    dissolve: dissolve,
    restore: restore,
    isDissolved: isDissolved
  };
})();
