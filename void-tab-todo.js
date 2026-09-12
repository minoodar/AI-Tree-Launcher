// ============================================================================
// AI Tree Launcher — Void Tab "Today" panel
// ----------------------------------------------------------------------------
// قبلاً این داک فقط کارهای روزانه (TODO) را نشان می‌داد. حالا یک پنلِ کاملِ
// «امروز»ه، بخش‌بندی‌شده:
//   ۱) سرِ تاریخ/سن — همان منطقِ تاریخ/سنِ ویجتِ اصلی (updateClockAge در
//      content.js)، اما مستقل محاسبه می‌شود؛ چون آن تابع فقط وقتی پنلِ ساعتِ
//      اصلی باز است اجرا می‌شود و برای این داک که همیشه باید درست باشد کافی
//      نیست. فرمول و منابعِ داده (userBirthYear در storage.sync) دقیقاً همان‌هایی
//      است که content.js استفاده می‌کند — نه حدسی، مستقیماً از رویِ همان کد.
//   ۲) رویدادهای ساعتیِ امروز (از aiTreeTimeEvents در storage.local) + یک
//      کادرِ فشردهٔ پیش‌نمایشِ «فردا» — همان دادهٔ داشبوردِ زمانِ ویجتِ اصلی،
//      چون رندرِ زندهٔ #ai-timeline-content به رویدادن/بازشدنِ پنلِ اصلی وابسته
//      است و روی این صفحه همیشه در دسترس نیست، این بخش مستقیماً از storage
//      می‌خواند و evaluateEventStatus را (با همان قوانین) دوباره پیاده می‌کند.
//   ۳) کارهای روزانه (TODO) — همان منطقِ قبلی، بدون تغییر.
// ============================================================================
(() => {
  'use strict';

  const dock = document.getElementById('ai-void-todo-dock');
  const handle = document.getElementById('ai-void-todo-handle');
  const panelTitleEl = document.getElementById('ai-void-todo-title');
  const list = document.getElementById('ai-void-todo-list');
  const count = document.getElementById('ai-void-todo-count');
  const sideButton = document.getElementById('ai-void-todo-side');
  const dateHead = document.getElementById('ai-void-agenda-datehead');
  const eventsTitleEl = document.getElementById('ai-void-agenda-events-title');
  const eventsList = document.getElementById('ai-void-agenda-events');
  const tasksTitleEl = document.getElementById('ai-void-agenda-tasks-title');
  if (!dock || !handle || !list || !count || !sideButton || !dateHead || !eventsList) return;

  document.body.appendChild(dock);

  function label(key, fallback) {
    try { if (typeof t === 'function') { const v = t(key); if (v) return v; } } catch (e) {}
    return fallback;
  }

  let todos = [];
  let timeEvents = [];
  let userBirthYear = null;
  let position = { side: 'right', top: 0.22 };
  let collapsed = true;

  // ---------------------------------------------------------------- عمومی —
  function pad2(n) { return String(n).padStart(2, '0'); }
  function isoFromDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  function todayIso() { return isoFromDate(new Date()); }
  function tomorrowIso() { const d = new Date(); d.setDate(d.getDate() + 1); return isoFromDate(d); }

  function isToday(todo, now) {
    now = now || Date.now();
    if (!todo) return false;
    if ((todo.type || 'daily') !== 'daily') return false;
    const raw = todo.createdAt;
    const parsed = typeof raw === 'number' ? raw : Date.parse(raw);
    const created = Number.isFinite(parsed) ? parsed : now;
    return created <= now;
  }

  function applyCollapsed() {
    dock.classList.toggle('is-collapsed', collapsed);
    handle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }
  function setCollapsed(next) {
    collapsed = !!next;
    applyCollapsed();
    try { chrome.storage.local.set({ voidTodoCollapsed: collapsed }); } catch (e) {}
  }

  // -------------------------------------------------------- سرِ تاریخ/سن —
  function renderDateHead() {
    const now = new Date();
    dateHead.innerHTML = '';
    const primary = document.createElement('div'); primary.className = 'ai-void-agenda-date-primary';
    primary.textContent = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    dateHead.appendChild(primary);
    try {
      const secondary = document.createElement('div'); secondary.className = 'ai-void-agenda-date-secondary';
      secondary.textContent = now.toLocaleDateString('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' });
      secondary.dir = 'rtl';
      dateHead.appendChild(secondary);
    } catch (e) {}
    if (userBirthYear && !isNaN(userBirthYear)) {
      let currentYear = now.getFullYear();
      if (userBirthYear < 1500) {
        try {
          const jYearStr = new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(now);
          currentYear = parseInt(jYearStr.replace(/\D/g, ''), 10);
        } catch (e) {}
      }
      const age = currentYear - userBirthYear;
      const ageEl = document.createElement('div'); ageEl.className = 'ai-void-agenda-age';
      ageEl.textContent = label('ageLabel', '{age} years').replace('{age}', age);
      dateHead.appendChild(ageEl);
    }
  }

  // ------------------------------------------------- رویدادهای ساعتی —
  // دقیقاً همان قوانینِ evaluateEventStatus در content.js (از جمله وضعیتِ
  // «recurring-elapsed» برای رویدادهای ستاره‌دارِ گذشته که دیگر «missed»
  // قرمز/خط‌خورده نشان داده نمی‌شوند، چون فردا خودشان تازه می‌شوند).
  function evaluateStatus(evt) {
    if (evt.status === 'done') return 'done';
    const eventTime = new Date(`${evt.date}T${evt.startTime}:00`);
    if (isNaN(eventTime.getTime())) return 'future';
    const diffMinutes = (eventTime - new Date()) / 60000;
    if (diffMinutes < 0) return evt.recurring ? 'recurring-elapsed' : 'missed';
    if (diffMinutes <= 30) return 'near';
    return 'future';
  }

  function buildEventRow(evt, status) {
    const row = document.createElement('div');
    row.className = 'ai-void-event-row' + (status === 'near' ? ' is-near' : status === 'missed' ? ' is-missed' : status === 'done' ? ' is-done' : status === 'recurring-elapsed' ? ' is-recurring-elapsed' : '');
    const time = document.createElement('span'); time.className = 'ai-void-event-time'; time.textContent = evt.startTime;
    const title = document.createElement('span'); title.className = 'ai-void-event-title'; title.textContent = evt.title; title.title = evt.title;
    row.append(time, title);
    if (status === 'recurring-elapsed') {
      const chip = document.createElement('span'); chip.className = 'ai-void-event-badge';
      chip.textContent = '\u21bb ' + label('scrubberTomorrowBadge', 'Tomorrow');
      row.appendChild(chip);
    } else if (evt.recurring) {
      const star = document.createElement('span'); star.className = 'ai-void-event-badge'; star.textContent = '\u2605';
      row.appendChild(star);
    }
    return row;
  }

  function renderEvents() {
    if (eventsTitleEl) eventsTitleEl.textContent = label('voidAgendaEventsLabel', "Today's schedule");
    eventsList.innerHTML = '';
    const iso = todayIso();
    const todays = timeEvents.filter(e => e && e.date === iso).slice().sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (!todays.length) {
      const empty = document.createElement('div'); empty.className = 'ai-void-event-empty';
      empty.textContent = label('dashNoEvents', 'No events');
      eventsList.appendChild(empty);
    } else {
      todays.forEach(evt => eventsList.appendChild(buildEventRow(evt, evaluateStatus(evt))));
    }

    const tIso = tomorrowIso();
    const tomorrows = timeEvents.filter(e => e && e.date === tIso).slice().sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (tomorrows.length) {
      const box = document.createElement('div'); box.className = 'ai-void-tomorrow-box'; box.tabIndex = 0; box.setAttribute('role', 'button');
      const head = document.createElement('div'); head.className = 'ai-void-tomorrow-head';
      head.textContent = `${label('scrubberTomorrowBadge', 'Tomorrow')} \u00b7 ${tomorrows.length}`;
      box.appendChild(head);
      tomorrows.slice(0, 3).forEach(evt => {
        const row = document.createElement('div'); row.className = 'ai-void-tomorrow-row';
        const time = document.createElement('span'); time.className = 'ai-void-event-time'; time.textContent = evt.startTime;
        const title = document.createElement('span'); title.textContent = evt.title;
        row.append(time, title);
        box.appendChild(row);
      });
      eventsList.appendChild(box);
    }
  }

  function loadTimeEvents() {
    try {
      chrome.storage.local.get(['aiTreeTimeEvents'], (res) => {
        timeEvents = Array.isArray(res.aiTreeTimeEvents) ? res.aiTreeTimeEvents : [];
        renderEvents();
      });
    } catch (e) { renderEvents(); }
  }

  function loadBirthYear() {
    try {
      chrome.storage.sync.get(['userBirthYear'], (res) => {
        userBirthYear = res.userBirthYear ? parseInt(res.userBirthYear, 10) : null;
        renderDateHead();
      });
    } catch (e) { renderDateHead(); }
  }

  // ---------------------------------------------------------------- تودو —
  function acceptTodos(next, allowEmpty) {
    if (!Array.isArray(next)) return;
    if (!allowEmpty && next.length === 0 && todos.length > 0) return;
    if (next.length === todos.length) {
      let same = true;
      for (let i = 0; i < next.length; i++) {
        const a = next[i], b = todos[i];
        if (!b || a.text !== b.text || !!a.done !== !!b.done) { same = false; break; }
      }
      if (same) return;
    }
    todos = next;
    renderTodos();
  }

  function renderTodos() {
    if (tasksTitleEl) tasksTitleEl.textContent = label('voidAgendaTasksLabel', 'Tasks');
    const now = Date.now();
    const shown = todos.filter(function (t) { return isToday(t, now); });
    const pending = shown.filter(function (t) { return !t.done; }).length;
    count.textContent = shown.length ? (pending + '/' + shown.length) : '';
    list.innerHTML = '';
    if (!shown.length) {
      const empty = document.createElement('div');
      empty.className = 'ai-void-todo-empty';
      empty.textContent = label('todoNoDaily', 'No daily tasks');
      list.appendChild(empty);
      return;
    }
    shown.forEach(function (todo) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'ai-void-todo-row' + (todo.done ? ' done' : '');
      row.title = todo.text || '';
      const check = document.createElement('span');
      check.className = 'ai-void-todo-check';
      check.textContent = todo.done ? '\u2713' : '';
      const text = document.createElement('span');
      text.className = 'ai-void-todo-text';
      text.textContent = todo.text || '';
      row.append(check, text);
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        if (todo.sourceCheck && typeof todo.sourceCheck.click === 'function') {
          todo.sourceCheck.click();
          return;
        }
        todo.done = !todo.done;
        try {
          chrome.storage.sync.set({ aiTreeTodos: todos });
          chrome.storage.local.set({ aiTreeTodos: todos });
        } catch (err) {}
        try {
          window.__aiTreeTodosForVoid = todos;
          window.dispatchEvent(new CustomEvent('ai-tree-todos-updated', { detail: todos }));
        } catch (err) {}
        renderTodos();
      });
      list.appendChild(row);
    });
  }

  function applyPosition() {
    dock.dataset.side = position.side === 'left' ? 'left' : 'right';
    dock.style.top = (Math.max(0.04, Math.min(0.78, Number(position.top) || 0.22)) * 100) + 'vh';
  }
  function savePosition() {
    try { chrome.storage.local.set({ voidTodoDock: position }); } catch (e) {}
  }

  let dragMoved = false;
  handle.addEventListener('click', function (event) {
    if (event.target === sideButton || sideButton.contains(event.target)) return;
    if (dragMoved) { dragMoved = false; return; }
    setCollapsed(!collapsed);
  });
  handle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setCollapsed(!collapsed);
    }
  });

  window.addEventListener('ai-tree-todos-updated', function (event) {
    acceptTodos(event.detail, false);
  });
  if (Array.isArray(window.__aiTreeTodosForVoid) && window.__aiTreeTodosForVoid.length) {
    acceptTodos(window.__aiTreeTodosForVoid, false);
  }

  function loadFromStorage() {
    try {
      chrome.storage.local.get(['aiTreeTodos', 'voidTodoDock', 'voidTodoCollapsed'], function (localData) {
        if (localData.voidTodoDock && typeof localData.voidTodoDock === 'object') {
          position = Object.assign({}, position, localData.voidTodoDock);
        }
        if (typeof localData.voidTodoCollapsed === 'boolean') collapsed = localData.voidTodoCollapsed;
        applyPosition();
        applyCollapsed();
        chrome.storage.sync.get(['aiTreeTodos'], function (syncData) {
          const localTodos = Array.isArray(localData.aiTreeTodos) ? localData.aiTreeTodos : [];
          const syncTodos = Array.isArray(syncData.aiTreeTodos) ? syncData.aiTreeTodos : [];
          const preferred = localTodos.length ? localTodos : syncTodos;
          if (preferred.length) acceptTodos(preferred, false);
        });
      });
    } catch (e) {
      applyPosition();
      applyCollapsed();
    }
  }
  loadFromStorage();
  loadTimeEvents();
  loadBirthYear();
  renderDateHead();
  renderEvents();

  if (panelTitleEl) panelTitleEl.textContent = label('voidTodayPanelTitle', 'Today');

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if ((area === 'sync' || area === 'local') && changes.aiTreeTodos) {
        acceptTodos(Array.isArray(changes.aiTreeTodos.newValue) ? changes.aiTreeTodos.newValue : [], true);
      }
      if (area === 'local' && changes.aiTreeTimeEvents) {
        timeEvents = Array.isArray(changes.aiTreeTimeEvents.newValue) ? changes.aiTreeTimeEvents.newValue : [];
        renderEvents();
      }
      if (area === 'sync' && changes.userBirthYear) {
        userBirthYear = changes.userBirthYear.newValue ? parseInt(changes.userBirthYear.newValue, 10) : null;
        renderDateHead();
      }
    });
  } catch (e) {}

  // رفرشِ خفیفِ دوره‌ای: چون evaluateStatus (near/missed) وابسته به «الان» است،
  // بدون تغییرِ داده هم باید هر دقیقه یک‌بار خودش را به‌روز کند — درست مثل
  // رفتارِ ویجتِ اصلی (renderTimeline هر دقیقه).
  setInterval(() => { renderEvents(); renderDateHead(); }, 60 * 1000);

  function poll() {
    if (Array.isArray(window.__aiTreeTodosForVoid) && window.__aiTreeTodosForVoid.length) {
      acceptTodos(window.__aiTreeTodosForVoid, false);
    }
    const sources = [
      { el: document.getElementById('ai-todo-list'), row: '.ai-todo-item', text: '.ai-todo-text', check: '.ai-todo-check' },
      { el: document.getElementById('ai-dash-todo-list'), row: '.ai-dash-todo-row', text: '.ai-dash-todo-text', check: '.ai-dash-todo-check' }
    ];
    for (let s = 0; s < sources.length; s++) {
      const src = sources[s];
      if (!src.el) continue;
      const rows = src.el.querySelectorAll(src.row);
      if (!rows.length) continue;
      const mapped = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const textEl = row.querySelector(src.text);
        const checkEl = row.querySelector(src.check);
        const text = textEl ? textEl.textContent.trim() : '';
        if (!text) continue;
        mapped.push({
          text: text,
          done: row.classList.contains('done'),
          sourceCheck: checkEl,
          type: 'daily',
          createdAt: Date.now() - 1000
        });
      }
      if (mapped.length && !todos.filter(isToday).length) {
        acceptTodos(mapped, false);
        break;
      }
    }
  }
  poll();
  setInterval(poll, 400);

  sideButton.addEventListener('click', function (event) {
    event.stopPropagation();
    position.side = position.side === 'left' ? 'right' : 'left';
    applyPosition();
    savePosition();
  });

  let dragging = null;
  handle.addEventListener('pointerdown', function (event) {
    if (event.target === sideButton || sideButton.contains(event.target)) return;
    dragMoved = false;
    dragging = { y: event.clientY, top: dock.getBoundingClientRect().top };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    if (Math.abs(event.clientY - dragging.y) > 4) dragMoved = true;
    const maxTop = Math.max(16, window.innerHeight - dock.offsetHeight - 16);
    const top = Math.max(16, Math.min(maxTop, dragging.top + event.clientY - dragging.y));
    position.top = top / window.innerHeight;
    position.side = event.clientX < window.innerWidth / 2 ? 'left' : 'right';
    applyPosition();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = null;
    if (dragMoved) savePosition();
  }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);

  applyCollapsed();
})();
