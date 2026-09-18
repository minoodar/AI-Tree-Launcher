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

  // Minimum center-to-center gap so stacked singularities never overlap
  const SINGULARITY_GAP = 36;
  const STACK_ORDER = { echo: 0, goals: 1, todo: 2 };

  function applyOrbPosition(entry) {
    if (!entry || !entry.singularity || !entry.anchor) return;
    const x = Math.max(12, Math.min(window.innerWidth - 44, entry.anchor.x - 18));
    const y = Math.max(12, Math.min(window.innerHeight - 44, entry.anchor.y - 18));
    entry.singularity.style.left = x + 'px';
    entry.singularity.style.top = y + 'px';
  }

  /**
   * Singularity stays frozen at each menu's own center of gravity.
   * No shifting to dodge siblings — only separate two orbs if both are
   * dissolved and would occupy the exact same point.
   */
  function reflowSingularities() {
    const active = Object.keys(registry)
      .map((id) => registry[id])
      .filter((e) => e && e.singularity && e.anchor);
    if (!active.length) return;

    // Restore frozen preferred position first (no drift)
    active.forEach((e) => {
      if (e.anchor.preferredY != null) e.anchor.y = e.anchor.preferredY;
      if (e.anchor.preferredX != null) e.anchor.x = e.anchor.preferredX;
    });

    // If two dissolved orbs share nearly the same point, nudge the lower one
    // by a small gap only — never chase visible panels around the page.
    const sorted = active.slice().sort((a, b) => {
      const oa = STACK_ORDER[a.id] != null ? STACK_ORDER[a.id] : 50;
      const ob = STACK_ORDER[b.id] != null ? STACK_ORDER[b.id] : 50;
      if (oa !== ob) return oa - ob;
      return (a.anchor.y || 0) - (b.anchor.y || 0);
    });
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      const dx = (cur.anchor.x || 0) - (prev.anchor.x || 0);
      const dy = (cur.anchor.y || 0) - (prev.anchor.y || 0);
      if (Math.hypot(dx, dy) < SINGULARITY_GAP) {
        cur.anchor.y = (prev.anchor.y || 0) + SINGULARITY_GAP;
        // preferredY stays original center-of-gravity for when the other is restored
      }
    }

    active.forEach((e) => {
      if (savedState[e.id] && savedState[e.id].dissolved) {
        savedState[e.id].x = e.anchor.x;
        savedState[e.id].y = e.anchor.y;
      }
      applyOrbPosition(e);
    });
    persist();
  }

  function reflowAfterLayout() {
    // Positions are frozen at dissolve time — only a light pass for dual-orb gap
    requestAnimationFrame(reflowSingularities);
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

    if (!entry.anchor) {
      entry.anchor = { x: x, y: y, preferredX: x, preferredY: y };
    } else {
      entry.anchor.x = x;
      entry.anchor.y = y;
      if (entry.anchor.preferredX == null) entry.anchor.preferredX = x;
      if (entry.anchor.preferredY == null) entry.anchor.preferredY = y;
    }

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
    orb.addEventListener('pointerenter', () => orb.classList.add('is-awake'));
    orb.addEventListener('pointerleave', () => orb.classList.remove('is-awake'));

    document.body.appendChild(orb);
    entry.singularity = orb;
    applyOrbPosition(entry);
    reflowSingularities();
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
    if (entry.singularity || entry.el.classList.contains('ai-void-is-dissolved')) return;

    entry.dissolving = true;
    const rect = entry.el.getBoundingClientRect();
    // Frozen center of gravity of THIS menu at the moment of dissolve — no later shift
    const ax = rect.left + rect.width / 2;
    const ay = rect.top + rect.height / 2;
    entry.anchor = { x: ax, y: ay, preferredX: ax, preferredY: ay };

    entry.el.classList.add('ai-void-is-dissolving');
    particleBurst(rect, false);

    const finish = () => {
      entry.el.classList.remove('ai-void-is-dissolving');
      // Keep layout space so siblings (e.g. Goals under Echo) do not jump up
      entry.el.hidden = false;
      entry.el.classList.add('ai-void-is-dissolved');
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
      reflowAfterLayout();
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
      entry.el.classList.remove('ai-void-is-dissolved');
      entry.el.setAttribute('aria-hidden', 'false');
      entry.el.classList.add('ai-void-is-reforming');
      entry.dissolving = false;
      delete savedState[id];
      persist();
      reflowSingularities();
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
        const sx = savedState[id].x || 40;
        const sy = savedState[id].y || 80;
        entry.anchor = { x: sx, y: sy, preferredX: sx, preferredY: sy };
        entry.el.hidden = false;
        entry.el.classList.add('ai-void-is-dissolved');
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

  // Reposition singularities on resize (and keep stack gaps)
  window.addEventListener('resize', () => {
    reflowSingularities();
  }, { passive: true });

  loadState();

  window.VoidDissolve = {
    register: register,
    dissolve: dissolve,
    restore: restore,
    isDissolved: isDissolved
  };
})();
