const AITreeMemoryEngine = (() => {
  'use strict';
  const MEMORY_RETENTION_MS = 365 * 24 * 60 * 60 * 1000;
  const MEMORY_WARM_LIMIT = 50;
  const DB_NAME = 'aiTreeMemory';
  const DB_VERSION = 1;
  const STORE_ARCHIVE = 'archive';
  const STORE_ROLLUP = 'monthlyRollup';
  const WARM_KEY = 'aiTreeMemoryWarm';
  let dbPromise = null, retentionTimer = null;
  function newMemId() { return 'mem_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = () => reject(req.error || new Error('idb_open_failed'));
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE_ARCHIVE)) {
            const store = db.createObjectStore(STORE_ARCHIVE, { keyPath: 'id' });
            store.createIndex('by_resolvedAt', 'resolvedAt', { unique: false });
            store.createIndex('by_sourceType', 'sourceType', { unique: false });
            store.createIndex('by_sourceId', 'sourceId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORE_ROLLUP)) db.createObjectStore(STORE_ROLLUP, { keyPath: 'id' });
        };
        req.onsuccess = () => resolve(req.result);
      } catch (err) { reject(err); }
    });
    dbPromise.catch(() => { dbPromise = null; });
    return dbPromise;
  }
  function idbPut(storeName, value) {
    return openDB().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    }));
  }
  function pushWarm(record) {
    try {
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;
      chrome.storage.local.get([WARM_KEY], (res) => {
        let list = Array.isArray(res[WARM_KEY]) ? res[WARM_KEY] : [];
        list = [record, ...list.filter((r) => r && r.id !== record.id)].slice(0, MEMORY_WARM_LIMIT);
        chrome.storage.local.set({ [WARM_KEY]: list });
      });
    } catch (e) {}
  }
  function archive(partial) {
    if (!partial || !partial.title) return Promise.resolve(null);
    const record = {
      id: partial.id || newMemId(), sourceType: partial.sourceType || 'todo', sourceId: partial.sourceId || null,
      title: String(partial.title).slice(0, 240),
      createdAt: typeof partial.createdAt === 'number' ? partial.createdAt : Date.now(),
      resolvedAt: typeof partial.resolvedAt === 'number' ? partial.resolvedAt : Date.now(),
      resolution: partial.resolution || 'deleted', type: partial.type || 'daily',
      tags: Array.isArray(partial.tags) ? partial.tags.slice(0, 12) : [],
      importance: partial.importance == null ? null : partial.importance,
      pinned: !!partial.pinned,
      occurrenceCount: typeof partial.occurrenceCount === 'number' ? partial.occurrenceCount : 1
    };
    pushWarm(record);
    return idbPut(STORE_ARCHIVE, record).then(() => record).catch(() => null);
  }
  function archiveTodo(todo, resolution) {
    if (!todo) return Promise.resolve(null);
    const text = String(todo.text || '').trim();
    if (!text) return Promise.resolve(null);
    const created = typeof todo.createdAt === 'number' ? todo.createdAt : (Date.parse(todo.createdAt) || Date.now());
    return archive({ sourceType: 'todo', sourceId: todo.id || null, title: text, createdAt: created, resolvedAt: Date.now(),
      resolution: resolution || (todo.done ? 'completed' : 'deleted'), type: (todo.type === 'goal') ? 'goal' : 'daily',
      tags: Array.isArray(todo.tags) ? todo.tags : [], pinned: !!todo.pinned, occurrenceCount: 1 });
  }
  function archiveEvent(evt, resolution) {
    if (!evt) return Promise.resolve(null);
    const title = String(evt.title || '').trim();
    if (!title) return Promise.resolve(null);
    return archive({ sourceType: 'event', sourceId: evt.id || null, title: title,
      createdAt: typeof evt.createdAt === 'number' ? evt.createdAt : Date.now(), resolvedAt: Date.now(),
      resolution: resolution || 'deleted', type: evt.recurring ? 'recurring' : 'daily',
      tags: Array.isArray(evt.tags) ? evt.tags : [], pinned: !!evt.recurring,
      occurrenceCount: typeof evt.occurrenceCount === 'number' ? evt.occurrenceCount : 1 });
  }
  function archiveMarkedDay(mark, resolution) {
    if (!mark) return Promise.resolve(null);
    const title = String(mark.label || mark.title || '').trim();
    if (!title) return Promise.resolve(null);
    return archive({ sourceType: 'markedDay', sourceId: mark.id || null, title: title,
      createdAt: typeof mark.createdAt === 'number' ? mark.createdAt : Date.now(), resolvedAt: Date.now(),
      resolution: resolution || 'deleted', type: mark.golden ? 'recurring' : 'daily', tags: [], pinned: !!mark.golden, occurrenceCount: 1 });
  }
  return { MEMORY_RETENTION_MS, archive, archiveTodo, archiveEvent, archiveMarkedDay,
    runRetention: () => Promise.resolve(), getWarmCache: () => Promise.resolve([]), getArchiveSince: () => Promise.resolve([]) };
})();
