/* ======================================================================
   Void Music — Web Source (صفحهٔ Void Tab)
   سایت‌های موسیقی (SoundCloud، YouTube Music، Spotify Web، …) را به‌عنوان «منبع» به پخش‌کننده وصل می‌کند:
   - وضعیتِ تب‌ها را از void-media-bridge.js می‌گیرد (عنوان، هنرمند، کاور، زمان، پخش/مکث).
   - یک «صدای مجازی» (facade) با همان رابطِ HTMLAudioElement می‌سازد تا همهٔ رابطِ پخش‌کننده (دکمه‌ها، نوار پیشرفت،
     عنوان، رویدادهای کهکشان) بدونِ بازنویسی کار کند؛ فرمان‌ها (play/pause/next/prev/seek) به همان تب برمی‌گردند.
   - اختیاری: با Alt+Shift+V روی تبِ موسیقی، صدای آن تب (chrome.tabCapture) به Void Tab می‌آید تا کهکشان واقعاً با
     صدا واکنش نشان دهد و اکولایزر روی آن هم کار کند.
   ====================================================================== */
(function () {
  'use strict';
  var VM = window.VoidMusic;
  if (!VM || !VM.attachWeb || typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) return;
  var STALE_MS = 20000;
  var sources = new Map();           // tabId -> { tabId, host, st, at, proxy }
  var activeId = null, capture = null, hinted = false, tickTimer = 0, suppressed = new Set();   // suppressed: منبعی که کاربر دستی جدایش کرده؛ تا مکث/توقفِ بعدی خودکار وصل نمی‌شود

  function L(key, fallback) { try { if (typeof t === 'function') { var v = t(key); if (v && v !== key) return v; } } catch (e) {} return fallback; }
  function cmd(tabId, name, value) { try { chrome.tabs.sendMessage(tabId, { type: 'vm-web-cmd', cmd: name, value: value }, function () { void chrome.runtime.lastError; }); } catch (e) {} }

  // ---------- صدای مجازی با رابطِ HTMLAudioElement ----------
  function makeProxy(tabId) {
    var p = new EventTarget();
    p.__web = true; p.tabId = tabId; p.paused = true; p.ended = false; p.readyState = 4; p.error = null; p.src = ''; p.currentSrc = 'web:' + tabId;
    p.muted = false; p.volume = 1; p.preload = 'none'; p.captured = false; p._cur = 0; p._dur = NaN; p._rate = 1; p._at = 0;
    Object.defineProperty(p, 'duration', { get: function () { return p._dur; } });
    Object.defineProperty(p, 'currentTime', {
      get: function () { return p._cur + (!p.paused && p._at ? (performance.now() - p._at) / 1000 * p._rate : 0); },
      set: function (v) { v = +v; if (!isFinite(v)) return; p._cur = v; p._at = performance.now(); cmd(tabId, 'seekto', v); p.dispatchEvent(new Event('timeupdate')); }
    });
    p.play = function () { cmd(tabId, 'play'); if (p.paused) { p.paused = false; p._at = performance.now(); p.dispatchEvent(new Event('play')); } return Promise.resolve(); };
    p.pause = function () { cmd(tabId, 'pause'); if (!p.paused) { p._cur = p.currentTime; p.paused = true; p.dispatchEvent(new Event('pause')); } };
    p.cmd = function (name, value) { cmd(tabId, name, value); };
    p.load = function () {}; p.removeAttribute = function () {};
    p.onDetach = function (opts) { onDetach(tabId, opts || {}); };
    return p;
  }

  // ---------- وضعیتِ منابع ----------
  function best() {
    var pick = null;
    sources.forEach(function (s) { if (s.st && s.st.playing && (!pick || s.at > pick.at)) pick = s; });
    return pick;
  }
  function localPlaying() { var a = VM.getLocalAudio && VM.getLocalAudio(); return !!(a && !a.paused); }
  function applyState(s) {
    var p = s.proxy; if (!p) return;
    var st = s.st, wasPaused = p.paused, dur = st.dur > 0 && isFinite(st.dur) ? st.dur : NaN;
    var durChanged = !(isNaN(dur) && isNaN(p._dur)) && dur !== p._dur;
    p.paused = !st.playing; p._cur = st.pos || 0; p._rate = st.rate || 1; p._at = performance.now(); p._dur = dur;
    if (durChanged) p.dispatchEvent(new Event('durationchange'));
    p.dispatchEvent(new Event('timeupdate'));
    if (wasPaused !== p.paused) p.dispatchEvent(new Event(p.paused ? 'pause' : 'play'));
    var info = { host: s.host, title: st.title || st.pageTitle || s.host, artist: st.artist || s.host, art: st.art || '' };
    VM.setWebMeta(info);
  }
  function refreshChip() {
    var n = sources.size, a = activeId != null ? sources.get(activeId) : null, b = a || best() || (n ? sources.values().next().value : null);
    VM.setWebChip(n ? { label: b ? b.host : '', on: activeId != null, count: n, capture: !!capture } : null);
  }
  function attach(s) {
    if (!s) return;
    suppressed.delete(s.tabId);
    if (activeId != null && activeId !== s.tabId) detachActive();
    if (!s.proxy) s.proxy = makeProxy(s.tabId);
    activeId = s.tabId;
    VM.attachWeb(s.proxy, { host: s.host, title: s.st.title || s.st.pageTitle || s.host, artist: s.st.artist || s.host, art: s.st.art || '' });
    applyState(s); startTick(); refreshChip();
    try { VM.toast && VM.toast((L('voidMusicWebPlaying', 'Playing from {site}')).replace('{site}', s.host)); } catch (e) {}
    if (!hinted && !capture) { hinted = true; try { setTimeout(function () { VM.toast && VM.toast(L('voidMusicWebHint', 'For live reactive visuals press Alt+Shift+V on that tab')); }, 3200); } catch (e) {} }
  }
  function detachActive(opts) { if (activeId != null) VM.detachWeb(opts || {}); }
  function onDetach(tabId, opts) {
    if (opts.pauseSite !== false) { var s = sources.get(tabId); if (s && s.st && s.st.playing) cmd(tabId, 'pause'); }
    if (capture && capture.tabId === tabId) releaseCapture();
    if (activeId === tabId) activeId = null;
    stopTick(); refreshChip();
  }
  function startTick() { if (tickTimer) return; tickTimer = setInterval(function () { var s = activeId != null && sources.get(activeId); if (s && s.proxy && !s.proxy.paused && !document.hidden) s.proxy.dispatchEvent(new Event('timeupdate')); }, 250); }
  function stopTick() { if (tickTimer) { clearInterval(tickTimer); tickTimer = 0; } }
  function sweep() {
    var now = Date.now();
    sources.forEach(function (s, id) { if (now - s.at > STALE_MS && !(s.st && s.st.playing)) { if (id === activeId) VM.detachWeb({ pauseSite: false }); sources.delete(id); } });
    refreshChip();
  }
  setInterval(sweep, 5000);

  function onState(m, tabId) {
    var st = m.state; if (!st) return;
    if (!st.eligible) { drop(tabId); return; }
    if (!st.playing) suppressed.delete(tabId);
    var s = sources.get(tabId) || { tabId: tabId, host: m.host || '', proxy: null };
    s.host = m.host || s.host; s.st = st; s.at = Date.now(); sources.set(tabId, s);
    if (activeId === tabId) applyState(s);
    else if (activeId == null && VM.isOpen && VM.isOpen() && st.playing && !localPlaying() && !suppressed.has(tabId)) attach(s);   // خودکار فقط وقتی صفحهٔ موسیقی باز است و پخشِ محلی نیست
    refreshChip();
  }
  function drop(tabId) {
    if (activeId === tabId) VM.detachWeb({ pauseSite: false });
    suppressed.delete(tabId); sources.delete(tabId); refreshChip();
  }
  function pingAll() {
    try {
      chrome.tabs.query({}, function (tabs) {
        (tabs || []).forEach(function (tb) { if (tb && tb.id != null) { try { chrome.tabs.sendMessage(tb.id, { type: 'vm-web-ping' }, function () { void chrome.runtime.lastError; }); } catch (e) {} } });
      });
    } catch (e) {}
  }

  // ---------- Layer 2: صدای واقعی تب (Alt+Shift+V) ----------
  async function startCapture(m) {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
      releaseCapture(true);
      var stream = await navigator.mediaDevices.getUserMedia({ audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: m.streamId } }, video: false });
      var s = sources.get(m.tabId);
      if (!s) { s = { tabId: m.tabId, host: m.host || 'tab', st: { eligible: true, playing: true, title: m.title || m.host || '', artist: m.host || '', pos: 0, dur: 0, rate: 1 }, at: Date.now(), proxy: null }; sources.set(m.tabId, s); }
      try { if (VM.enter && !VM.isOpen()) VM.enter(); } catch (e) {}
      attach(s);
      capture = { tabId: m.tabId, stream: stream };
      if (s.proxy) s.proxy.captured = true;
      if (window.VoidMusicViz && window.VoidMusicViz.web) window.VoidMusicViz.web.useStream(stream);
      stream.getAudioTracks().forEach(function (tr) { tr.addEventListener('ended', function () { if (capture && capture.stream === stream) releaseCapture(); }); });
      try { VM.toast && VM.toast(L('voidMusicWebCaptureOn', 'Live audio linked')); } catch (e) {}
      refreshChip(); return true;
    } catch (e) { return false; }
  }
  function releaseCapture(silent) {
    if (!capture) return;
    var c = capture; capture = null;
    try { c.stream.getTracks().forEach(function (tr) { tr.stop(); }); } catch (e) {}
    try { if (window.VoidMusicViz && window.VoidMusicViz.web) window.VoidMusicViz.web.releaseStream(); } catch (e) {}
    var s = sources.get(c.tabId); if (s && s.proxy) s.proxy.captured = false;
    if (!silent) {
      try { chrome.runtime.sendMessage({ type: 'vm-capture-ended' }, function () { void chrome.runtime.lastError; }); } catch (e) {}
      try { VM.toast && VM.toast(L('voidMusicWebCaptureOff', 'Live audio stopped')); } catch (e) {}
    }
    refreshChip();
  }

  chrome.runtime.onMessage.addListener(function (m, sender, reply) {
    if (!m || typeof m.type !== 'string') return;
    if (m.type === 'vm-web-state' && sender && sender.tab) onState(m, sender.tab.id);
    else if (m.type === 'vm-web-bye' && sender && sender.tab) drop(sender.tab.id);
    else if (m.type === 'vm-capture-start') { startCapture(m).then(function (ok) { try { reply && reply({ ok: ok }); } catch (e) {} }); return true; }
    else if (m.type === 'vm-capture-stop') { releaseCapture(); try { reply && reply({ ok: true }); } catch (e) {} }
  });
  try { chrome.tabs.onRemoved.addListener(function (id) { if (sources.has(id)) drop(id); }); } catch (e) {}

  // چیپِ منبع: روشن/خاموش‌کردنِ منبعِ وب
  window.addEventListener('voidmusic:web-chip', function () {
    if (activeId != null) { suppressed.add(activeId); VM.detachWeb({ pauseSite: false }); return; }
    var s = best() || (sources.size ? sources.values().next().value : null);
    if (s) attach(s); else pingAll();
  });
  window.addEventListener('voidmusic:mode', function (e) { try { if (e && e.detail && e.detail.open) pingAll(); } catch (x) {} });
  window.addEventListener('voidmusic:local-play', function () { if (activeId != null) VM.detachWeb({ pauseSite: true }); });
  pingAll();
  window.VoidMusicWeb = { sources: sources, pingAll: pingAll, getActive: function () { return activeId; }, isCapturing: function () { return !!capture; } };
})();
