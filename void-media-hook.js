/* ======================================================================
   Void Music — Media Hook (دنیای MAIN، document_start)
   هدف: هر سایتِ موسیقی (SoundCloud، YouTube Music، Spotify Web، …) را بدونِ API اختصاصی بخوانیم و کنترل کنیم.
   ۱) setActionHandler را بسته‌بندی می‌کند تا callbackهایی را که خودِ سایت برای play/pause/next/prev/seek ثبت می‌کند
      نگه داریم؛ فرمانِ Void Tab همان callback را صدا می‌زند (بدونِ سلکتورِ CSS).
   ۲) metadata (عنوان/هنرمند/کاور)، playbackState و setPositionState را می‌خوانَد.
   رفتارِ اصلیِ صفحه عوض نمی‌شود: همهٔ فراخوانی‌ها به نسخهٔ اصلی هم می‌روند و هر خطا بلعیده می‌شود.
   ارتباط با دنیای ISOLATED (void-media-bridge.js) فقط با window.postMessage انجام می‌شود.
   ====================================================================== */
(function () {
  'use strict';
  var KEY = Symbol.for('voidMusic.mediaHook');
  if (window[KEY]) return;
  try { Object.defineProperty(window, KEY, { value: 1 }); } catch (e) { window[KEY] = 1; }
  var ORIGIN = (location.origin && location.origin !== 'null') ? location.origin : '*';
  var MSP = window.MediaSession && window.MediaSession.prototype;
  var handlers = Object.create(null), posState = { duration: 0, position: 0, rate: 1, at: 0 };
  var timer = 0, ticker = 0, lastKey = '', wasEligible = false;

  // سلکتورهای پشتیبان فقط وقتی سایت handler ثبت نکرده باشد (راستی‌آزمایی‌نشده؛ ممکن است با تغییر سایت از کار بیفتند)
  var SITE = {
    'soundcloud.com': { nexttrack: '.skipControl__next', previoustrack: '.skipControl__previous', play: '.playControl', pause: '.playControl' },
    'music.youtube.com': { nexttrack: 'ytmusic-player-bar .next-button', previoustrack: 'ytmusic-player-bar .previous-button', play: 'ytmusic-player-bar .play-pause-button', pause: 'ytmusic-player-bar .play-pause-button' },
    'open.spotify.com': { nexttrack: '[data-testid="control-button-skip-forward"]', previoustrack: '[data-testid="control-button-skip-back"]', play: '[data-testid="control-button-playpause"]', pause: '[data-testid="control-button-playpause"]' }
  };

  function post(type, state) { try { window.postMessage({ __vmHook: 1, type: type, state: state }, ORIGIN); } catch (e) {} }

  function findMedia() {
    var list = document.querySelectorAll('audio,video'), best = null, bestScore = -1;
    for (var i = 0; i < list.length; i++) {
      var el = list[i], s = 0;
      if (!el.paused && !el.ended) s += 4;
      if (!el.muted && el.volume > 0) s += 1;
      if (isFinite(el.duration) && el.duration > 0) s += 1;
      if (el.currentSrc || el.srcObject) s += 1;
      if (s > bestScore) { bestScore = s; best = el; }
    }
    return best;
  }
  function bestArt(md) {
    try {
      var a = md && md.artwork; if (!a || !a.length) return '';
      var pick = a[0], area = 0;
      for (var i = 0; i < a.length; i++) {
        var m = /(\d+)x(\d+)/.exec(a[i].sizes || ''), ar = m ? (+m[1]) * (+m[2]) : 1;
        if (ar >= area) { area = ar; pick = a[i]; }
      }
      return pick && pick.src ? String(pick.src) : '';
    } catch (e) { return ''; }
  }
  function snapshot() {
    var md = null, ps = 'none';
    try { md = navigator.mediaSession && navigator.mediaSession.metadata; ps = (navigator.mediaSession && navigator.mediaSession.playbackState) || 'none'; } catch (e) {}
    var el = findMedia();
    var playing = el ? (!el.paused && !el.ended) : ps === 'playing';
    var pos = 0, dur = 0, rate = 1;
    if (el && isFinite(el.duration) && el.duration > 0) { pos = el.currentTime || 0; dur = el.duration; rate = el.playbackRate || 1; }
    else if (posState.duration > 0) { pos = posState.position + (playing ? (Date.now() - posState.at) / 1000 * posState.rate : 0); dur = posState.duration; rate = posState.rate; }
    var title = md && md.title ? String(md.title) : '';
    // فقط وقتی واقعاً «موسیقی/پخشِ اصلیِ صفحه» به نظر برسد گزارش می‌شود (ویدیوی بی‌صدا/تبلیغ گزارش نمی‌شود)
    var real = !!el && !el.paused && !el.muted && el.volume > 0 && (!isFinite(el.duration) || el.duration > 45);
    var eligible = !!title || real;
    return {
      eligible: eligible, playing: !!playing, title: title, artist: md && md.artist ? String(md.artist) : '', album: md && md.album ? String(md.album) : '',
      art: bestArt(md), pos: Math.max(0, pos), dur: dur, rate: rate, actions: Object.keys(handlers), hasMedia: !!el, pageTitle: document.title || ''
    };
  }
  function report(force) {
    var s; try { s = snapshot(); } catch (e) { return; }
    if (!s.eligible) { if (wasEligible) { wasEligible = false; lastKey = ''; post('state', { eligible: false, playing: false }); } stopTicker(); return; }
    wasEligible = true;
    var key = [s.playing ? 1 : 0, s.title, s.artist, s.art, Math.floor(s.pos / 5), Math.round(s.dur)].join('\u0001');   // موقعیت هر ~۵ ثانیه (Void Tab بینِ دو گزارش خودش جلو می‌برد) تا Service Worker را مدام بیدار نکنیم
    if (!force && key === lastKey) return;
    lastKey = key; post('state', s);
    if (s.playing) startTicker(); else stopTicker();
  }
  function schedule() { if (timer) return; timer = setTimeout(function () { timer = 0; report(false); }, 120); }
  function startTicker() { if (!ticker) ticker = setInterval(function () { report(false); }, 1000); }
  function stopTicker() { if (ticker) { clearInterval(ticker); ticker = 0; } }

  // ---------- بسته‌بندیِ Media Session (رفتار اصلی حفظ می‌شود) ----------
  if (MSP) {
    try {
      var origSet = MSP.setActionHandler;
      if (typeof origSet === 'function') {
        MSP.setActionHandler = function (action, handler) {
          try { if (typeof handler === 'function') handlers[action] = handler; else delete handlers[action]; schedule(); } catch (e) {}
          return origSet.apply(this, arguments);
        };
      }
      var origPos = MSP.setPositionState;
      if (typeof origPos === 'function') {
        MSP.setPositionState = function (st) {
          try { if (st) posState = { duration: +st.duration || 0, position: +st.position || 0, rate: +st.playbackRate || 1, at: Date.now() }; schedule(); } catch (e) {}
          return origPos.apply(this, arguments);
        };
      }
      ['metadata', 'playbackState'].forEach(function (prop) {
        var d = Object.getOwnPropertyDescriptor(MSP, prop);
        if (d && d.set && d.get && d.configurable) {
          Object.defineProperty(MSP, prop, { configurable: true, enumerable: d.enumerable, get: d.get, set: function (v) { d.set.call(this, v); schedule(); } });
        }
      });
    } catch (e) {}
  }
  ['play', 'pause', 'ended', 'loadedmetadata', 'durationchange', 'volumechange'].forEach(function (ev) { document.addEventListener(ev, schedule, true); });
  document.addEventListener('seeked', function () { setTimeout(function () { report(true); }, 60); }, true);   // پرش در زمان فوراً گزارش می‌شود

  // ---------- فرمان‌ها از Void Tab ----------
  function safeClick(el) {
    if (!el) return false;
    try {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup'].forEach(function (t) { el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window })); });
      el.click(); return true;
    } catch (e) { return false; }
  }
  function siteSelector(action) {
    var host = location.hostname.replace(/^www\./, '');
    var map = SITE[host]; return map ? map[action] : null;
  }
  function run(cmd, value) {
    var el = findMedia();
    if (cmd === 'ping') { report(true); return 'ping'; }
    if (cmd === 'volume') { if (el && isFinite(value)) { try { el.volume = Math.max(0, Math.min(1, +value)); } catch (e) {} } return 'volume'; }
    var h = handlers[cmd];
    if (cmd === 'seekto') {
      if (h) { try { h({ action: 'seekto', seekTime: +value, fastSeek: false }); return 'handler'; } catch (e) {} }
      if (el && isFinite(value)) { try { el.currentTime = +value; return 'element'; } catch (e) {} }
      return 'none';
    }
    if (h) { try { h({ action: cmd }); return 'handler'; } catch (e) {} }
    if (cmd === 'play' && el) { try { el.play(); return 'element'; } catch (e) {} }
    if (cmd === 'pause' && el) { try { el.pause(); return 'element'; } catch (e) {} }
    var sel = siteSelector(cmd);
    if (sel && safeClick(document.querySelector(sel))) return 'selector';
    return 'none';
  }
  window.addEventListener('message', function (e) {
    if (e.source !== window) return;
    var d = e.data; if (!d || d.__vmBridge !== 1 || typeof d.cmd !== 'string') return;
    var how = 'none'; try { how = run(d.cmd, d.value); } catch (x) {}
    post('ack', { cmd: d.cmd, how: how });
    schedule();
  }, false);
})();
