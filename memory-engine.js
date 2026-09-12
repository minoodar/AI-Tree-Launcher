(function (global) {
  'use strict';
  if (global.AITreeMemoryEngine) return;
  const MEMORY_RETENTION_MS = 365 * 24 * 60 * 60 * 1000;
  const MEMORY_WARM_LIMIT = 50;
  const DB_NAME = 'aiTreeMemory';
  const DB_VERSION = 1;
  const STORE_ARCHIVE = 'archive';
  const STORE_ROLLUP = 'monthlyRollup';
  const WARM_KEY = 'aiTreeMemoryWarm';
  let dbPromise = null;
  function newMemId() { return 'mem_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      try {
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = function () { reject(req.error || new Error('idb_open_failed')); };
        req.onupgradeneeded = function () {
          var db = req.result;
          if (!db.objectStoreNames.contains(STORE_ARCHIVE)) {
            var store = db.createObjectStore(STORE_ARCHIVE, { keyPath: 'id' });
            store.createIndex('by_resolvedAt', 'resolvedAt', { unique: false });
            store.createIndex('by_sourceType', 'sourceType', { unique: false });
            store.createIndex('by_sourceId', 'sourceId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORE_ROLLUP)) db.createObjectStore(STORE_ROLLUP, { keyPath: 'id' });
        };
        req.onsuccess = function () { resolve(req.result); };
      } catch (err) { reject(err); }
    });
    dbPromise.catch(function () { dbPromise = null; });
    return dbPromise;
  }
  function idbPut(storeName, value) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(value);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }
  function pushWarm(record) {
    try {
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;
      chrome.storage.local.get([WARM_KEY], function (res) {
        var list = Array.isArray(res[WARM_KEY]) ? res[WARM_KEY] : [];
        list = [record].concat(list.filter(function (r) { return r && r.id !== record.id; })).slice(0, MEMORY_WARM_LIMIT);
        chrome.storage.local.set({ aiTreeMemoryWarm: list });
      });
    } catch (e) {}
  }
  function archive(partial) {
    if (!partial || !partial.title) return Promise.resolve(null);
    var record = {
      id: partial.id || newMemId(),
      sourceType: partial.sourceType || 'todo',
      sourceId: partial.sourceId || null,
      title: String(partial.title).slice(0, 240),
      createdAt: typeof partial.createdAt === 'number' ? partial.createdAt : Date.now(),
      resolvedAt: typeof partial.resolvedAt === 'number' ? partial.resolvedAt : Date.now(),
      resolution: partial.resolution || 'deleted',
      type: partial.type || 'daily',
      tags: Array.isArray(partial.tags) ? partial.tags.slice(0, 12) : [],
      importance: partial.importance == null ? null : partial.importance,
      pinned: !!partial.pinned,
      occurrenceCount: typeof partial.occurrenceCount === 'number' ? partial.occurrenceCount : 1
    };
    pushWarm(record);
    return idbPut(STORE_ARCHIVE, record).then(function () { return record; }).catch(function () { return null; });
  }
  function archiveTodo(todo, resolution) {
    if (!todo) return Promise.resolve(null);
    var text = String(todo.text || '').trim();
    if (!text) return Promise.resolve(null);
    var created = typeof todo.createdAt === 'number' ? todo.createdAt : (Date.parse(todo.createdAt) || Date.now());
    return archive({
      sourceType: 'todo', sourceId: todo.id || null, title: text, createdAt: created,
      resolvedAt: Date.now(), resolution: resolution || (todo.done ? 'completed' : 'deleted'),
      type: (todo.type === 'goal') ? 'goal' : 'daily',
      tags: Array.isArray(todo.tags) ? todo.tags : [], pinned: !!todo.pinned, occurrenceCount: 1
    });
  }
  function archiveEvent(evt, resolution) {
    if (!evt) return Promise.resolve(null);
    var title = String(evt.title || '').trim();
    if (!title) return Promise.resolve(null);
    return archive({
      sourceType: 'event', sourceId: evt.id || null, title: title,
      createdAt: typeof evt.createdAt === 'number' ? evt.createdAt : Date.now(),
      resolvedAt: Date.now(), resolution: resolution || 'deleted',
      type: evt.recurring ? 'recurring' : 'daily',
      tags: Array.isArray(evt.tags) ? evt.tags : [], pinned: !!evt.recurring,
      occurrenceCount: typeof evt.occurrenceCount === 'number' ? evt.occurrenceCount : 1
    });
  }
  function archiveMarkedDay(mark, resolution) {
    if (!mark) return Promise.resolve(null);
    var title = String(mark.label || mark.title || '').trim();
    if (!title) return Promise.resolve(null);
    return archive({
      sourceType: 'markedDay', sourceId: mark.id || null, title: title,
      createdAt: typeof mark.createdAt === 'number' ? mark.createdAt : Date.now(),
      resolvedAt: Date.now(), resolution: resolution || 'deleted',
      type: mark.golden ? 'recurring' : 'daily', tags: [], pinned: !!mark.golden, occurrenceCount: 1
    });
  }
  global.AITreeMemoryEngine = {
    MEMORY_RETENTION_MS: MEMORY_RETENTION_MS,
    archive: archive,
    archiveTodo: archiveTodo,
    archiveEvent: archiveEvent,
    archiveMarkedDay: archiveMarkedDay,
    runRetention: function () { return Promise.resolve(); },
    getWarmCache: function () {
      return new Promise(function (resolve) {
        try {
          chrome.storage.local.get([WARM_KEY], function (res) {
            resolve(Array.isArray(res[WARM_KEY]) ? res[WARM_KEY] : []);
          });
        } catch (e) { resolve([]); }
      });
    },
    getArchiveSince: function () { return Promise.resolve([]); }
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
