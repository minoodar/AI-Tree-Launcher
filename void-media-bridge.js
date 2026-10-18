/* ======================================================================
   Void Music — Media Bridge (content script ایزوله، document_start)
   پلِ میانِ «دنیای MAIN صفحه» (void-media-hook.js) و «صفحهٔ افزونه (Void Tab)».
     hook  → این اسکریپت → chrome.runtime.sendMessage  {type:'vm-web-state' | 'vm-web-bye'}
     Void Tab → chrome.tabs.sendMessage → این اسکریپت → hook  {type:'vm-web-cmd', cmd, value} | {type:'vm-web-ping'}
   فقط متنِ عنوان/هنرمند/نشانیِ کاور و زمان‌بندی ردوبدل می‌شود؛ هیچ صدایی ضبط یا ارسال نمی‌شود.
   ====================================================================== */
(function () {
  'use strict';
  if (window.top !== window) return;
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) return;
  if (window.__vmMediaBridge) return;
  window.__vmMediaBridge = true;
  var ORIGIN = (location.origin && location.origin !== 'null') ? location.origin : '*';
  var live = false;       // آخرین وضعیتِ گزارش‌شده eligible بود؟

  function send(msg) {
    try { chrome.runtime.sendMessage(msg, function () { void chrome.runtime.lastError; }); } catch (e) { /* context invalidated */ }
  }
  window.addEventListener('message', function (e) {
    if (e.source !== window) return;
    var d = e.data;
    if (!d || d.__vmHook !== 1 || d.type !== 'state' || !d.state) return;
    live = !!d.state.eligible;
    send({ type: 'vm-web-state', host: location.hostname.replace(/^www\./, ''), state: d.state });
  }, false);

  try {
    chrome.runtime.onMessage.addListener(function (m, sender, reply) {
      if (!m || typeof m.type !== 'string') return;
      if (m.type === 'vm-web-cmd') {
        window.postMessage({ __vmBridge: 1, cmd: String(m.cmd || ''), value: m.value }, ORIGIN);
        if (reply) reply({ ok: true });
      } else if (m.type === 'vm-web-ping') {
        window.postMessage({ __vmBridge: 1, cmd: 'ping' }, ORIGIN);
        if (reply) reply({ ok: true, live: live });
      }
    });
  } catch (e) {}
  window.addEventListener('pagehide', function () { if (live) send({ type: 'vm-web-bye' }); });
})();
