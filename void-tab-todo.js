// Daily Todo dock for Void Tab — auto-shows tasks; collapsed by default.
(() => {
  'use strict';

  const dock = document.getElementById('ai-void-todo-dock');
  const handle = document.getElementById('ai-void-todo-handle');
  const list = document.getElementById('ai-void-todo-list');
  const count = document.getElementById('ai-void-todo-count');
  const sideButton = document.getElementById('ai-void-todo-side');
  if (!dock || !handle || !list || !count || !sideButton) return;

  document.body.appendChild(dock);

  let todos = [];
  let position = { side: 'right', top: 0.22 };
  let collapsed = true;

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
    render();
  }

  function render() {
    const now = Date.now();
    const shown = todos.filter(function (t) { return isToday(t, now); });
    const pending = shown.filter(function (t) { return !t.done; }).length;
    count.textContent = shown.length ? (pending + '/' + shown.length) : '';
    list.innerHTML = '';
    if (!shown.length) {
      const empty = document.createElement('div');
      empty.className = 'ai-void-todo-empty';
      empty.textContent = 'No daily tasks';
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
        render();
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

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if ((area === 'sync' || area === 'local') && changes.aiTreeTodos) {
        acceptTodos(Array.isArray(changes.aiTreeTodos.newValue) ? changes.aiTreeTodos.newValue : [], true);
      }
    });
  } catch (e) {}

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
