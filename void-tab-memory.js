// ============================================================================
// AI Tree Launcher — Void Tab Memory (Echo)
// Collapsible zen card — same interaction model as the Today todo dock.
// ============================================================================
(() => {
  'use strict';

  const WARM_KEY = 'aiTreeMemoryWarm';
  const VISIBLE_KEY = 'voidMemoryEchoVisible';
  const COLLAPSED_KEY = 'voidEchoCollapsed';

  const root = document.getElementById('ai-void-echo');
  if (!root) return;

  const handle = document.getElementById('ai-void-echo-handle');
  const bodyEl = document.getElementById('ai-void-echo-body');
  const patternEl = document.getElementById('ai-void-echo-pattern');
  const titleEl = document.getElementById('ai-void-echo-title');
  const countEl = document.getElementById('ai-void-echo-count');
  const chevronEl = document.getElementById('ai-void-echo-chevron');

  let visiblePref = true;
  let collapsed = true; // zen default: compact until user expands
  let lastHasData = false;
  let lastTodayTotal = 0;

  function label(key, fallback) {
    try {
      if (typeof t === 'function') {
        const v = t(key);
        if (v) return v;
      }
    } catch (e) {}
    return fallback;
  }

  function applyDir() {
    try {
      if ((typeof isRTL === 'function' && typeof currentLang !== 'undefined' && isRTL(currentLang)) ||
          (typeof currentLang !== 'undefined' && (currentLang === 'fa' || currentLang === 'ar'))) {
        root.setAttribute('dir', 'rtl');
      } else {
        root.setAttribute('dir', 'ltr');
      }
    } catch (e) {
      root.setAttribute('dir', 'auto');
    }
  }

  function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  function startOfMonth() {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function summarizeToday(rows) {
    const start = startOfToday();
    const now = Date.now();
    const counts = {
      completed: 0, deleted: 0, eventsDeleted: 0, eventsCompleted: 0, total: 0
    };
    (rows || []).forEach((r) => {
      if (!r || typeof r.resolvedAt !== 'number') return;
      if (r.resolvedAt < start || r.resolvedAt > now) return;
      counts.total += 1;
      if (r.resolution === 'completed') counts.completed += 1;
      if (r.resolution === 'deleted' || r.resolution === 'expired') counts.deleted += 1;
      if (r.sourceType === 'event') {
        if (r.resolution === 'completed') counts.eventsCompleted += 1;
        else counts.eventsDeleted += 1;
      }
    });
    return counts;
  }

  function summarizeMonth(rows) {
    const start = startOfMonth();
    const now = Date.now();
    const s = { total: 0, completed: 0, bySource: { todo: 0, event: 0, markedDay: 0 } };
    (rows || []).forEach((r) => {
      if (!r || typeof r.resolvedAt !== 'number') return;
      if (r.resolvedAt < start || r.resolvedAt > now) return;
      s.total += 1;
      if (r.resolution === 'completed') s.completed += 1;
      if (r.sourceType && s.bySource[r.sourceType] != null) s.bySource[r.sourceType] += 1;
    });
    return s;
  }

  function dominantKey(map) {
    let best = null, n = 0;
    Object.keys(map).forEach((k) => {
      if (map[k] > n) { n = map[k]; best = k; }
    });
    return n > 0 ? { key: best, count: n } : null;
  }

  function applyCollapsed() {
    root.classList.toggle('is-collapsed', collapsed);
    if (handle) handle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }

  function setCollapsed(next) {
    collapsed = !!next;
    applyCollapsed();
    try { chrome.storage.local.set({ [COLLAPSED_KEY]: collapsed }); } catch (e) {}
  }

  function applyVisibility(hasData) {
    lastHasData = hasData;
    const show = visiblePref && hasData;
    root.hidden = !show;
    root.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  function chip(cls, text) {
    const span = document.createElement('span');
    span.className = 'ai-void-echo-chip ai-void-echo-chip--' + cls;
    span.textContent = text;
    return span;
  }

  function render(today, month) {
    applyDir();
    lastTodayTotal = today.total;

    if (titleEl) titleEl.textContent = label('voidEchoTitle', "Today's Echo");
    if (countEl) {
      countEl.textContent = today.total > 0 ? String(today.total) : '';
      countEl.hidden = today.total <= 0;
    }

    if (bodyEl) {
      bodyEl.innerHTML = '';
      const eventsN = today.eventsCompleted + today.eventsDeleted;
      if (today.completed > 0) {
        bodyEl.appendChild(chip('done', label('voidEchoCompleted', '{n} completed').replace('{n}', String(today.completed))));
      }
      if (eventsN > 0) {
        bodyEl.appendChild(chip('event', label('voidEchoEvents', '{n} events').replace('{n}', String(eventsN))));
      }
      if (today.deleted > 0 && today.completed === 0 && eventsN === 0) {
        bodyEl.appendChild(chip('cleared', label('voidEchoCleared', '{n} cleared').replace('{n}', String(today.deleted))));
      }
      if (!bodyEl.childNodes.length && today.total > 0) {
        bodyEl.appendChild(chip('done', label('voidEchoActivity', '{n} moments').replace('{n}', String(today.total))));
      }
    }

    if (patternEl) {
      let patternText = '';
      if (month.total >= 3) {
        const domSource = dominantKey(month.bySource);
        const parts = [];
        if (month.completed > 0) {
          parts.push(label('voidPatternCompleted', '{n} completed this month').replace('{n}', String(month.completed)));
        }
        if (domSource && domSource.count >= 2) {
          const sourceLabel =
            domSource.key === 'event' ? label('voidPatternSourceEvent', 'events') :
            domSource.key === 'markedDay' ? label('voidPatternSourceMark', 'special days') :
            label('voidPatternSourceTodo', 'tasks');
          parts.push(label('voidPatternMostly', 'mostly {what}').replace('{what}', sourceLabel));
        }
        if (parts.length) patternText = parts.join(' · ');
      }
      patternEl.textContent = patternText;
      patternEl.hidden = !patternText;
    }

    applyCollapsed();
    applyVisibility(today.total > 0 || month.total >= 3);
  }

  function loadAndRender() {
    try {
      chrome.storage.local.get([WARM_KEY, VISIBLE_KEY, COLLAPSED_KEY], (res) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          applyVisibility(false);
          return;
        }
        if (typeof res[VISIBLE_KEY] === 'boolean') visiblePref = res[VISIBLE_KEY];
        if (typeof res[COLLAPSED_KEY] === 'boolean') collapsed = res[COLLAPSED_KEY];
        const rows = Array.isArray(res[WARM_KEY]) ? res[WARM_KEY] : [];
        render(summarizeToday(rows), summarizeMonth(rows));
      });
    } catch (e) {
      applyVisibility(false);
    }
  }

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes[WARM_KEY] || changes[VISIBLE_KEY] || changes[COLLAPSED_KEY]) loadAndRender();
    });
  } catch (e) {}

  // Head toggle — same feel as todo dock
  if (handle) {
    handle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCollapsed(!collapsed);
    });
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCollapsed(!collapsed);
      }
    });
  }

  function wireMenu() {
    const btn = document.getElementById('ai-ntp-menu-echo');
    if (!btn) return;
    const sync = () => {
      btn.setAttribute('data-on', visiblePref ? '1' : '0');
      const labelEl = document.getElementById('ai-ntp-menu-echo-label');
      if (labelEl) labelEl.textContent = label('voidEchoTitle', "Today's Echo");
    };
    sync();
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      visiblePref = !visiblePref;
      try { chrome.storage.local.set({ [VISIBLE_KEY]: visiblePref }); } catch (err) {}
      sync();
      applyVisibility(lastHasData);
    });
  }

  requestAnimationFrame(() => {
    wireMenu();
    loadAndRender();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadAndRender();
  });
})();
