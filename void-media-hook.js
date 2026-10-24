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
  var lastAudioKey = '', audioActive = false;       // §IDLE-AUDIO (F-1): dedupe و چرخهٔ گزارشِ «صدا، بی‌موسیقی»

  // سلکتورهای پشتیبان فقط وقتی سایت handler ثبت نکرده باشد (راستی‌آزمایی‌نشده؛ ممکن است با تغییر سایت از کار بیفتند)
  var SITE = {
    'soundcloud.com': { nexttrack: '.skipControl__next', previoustrack: '.skipControl__previous', play: '.playControl', pause: '.playControl' },
    'music.youtube.com': { nexttrack: 'ytmusic-player-bar .next-button', previoustrack: 'ytmusic-player-bar .previous-button', play: 'ytmusic-player-bar .play-pause-button', pause: 'ytmusic-player-bar .play-pause-button' },
    'open.spotify.com': { nexttrack: '[data-testid="control-button-skip-forward"]', previoustrack: '[data-testid="control-button-skip-back"]', play: '[data-testid="control-button-playpause"]', pause: '[data-testid="control-button-playpause"]' }
  };

  function post(type, state) { try { window.postMessage({ __vmHook: 1, type: type, state: state }, ORIGIN); } catch (e) {} }

  /* ---------- انتخابِ المنتِ موسیقی (§1.2) ----------
     «پخشِ موسیقی» المنتی است که زمانش واقعاً جلو می‌رود، بی‌صدا نیست و ولومش صفر نیست.
     امتیازِ قدیمی (صرفِ !paused و …) دست‌نخورده به‌عنوانِ fallback می‌ماند: اگر قاعدهٔ
     تازه هیچ المنتِ «شنیدنی و در حالِ حرکت» پیدا نکرد، همان انتخابِ قبلی برگردانده
     می‌شود تا هیچ سایتِ سالمی عقب ننشیند. نتیجهٔ انتخاب (kind/why) در گزارش می‌آید تا
     Void Tab بتواند بگوید کدام المنت را و چرا انتخاب کرده‌ایم. */
  var ADV = (typeof WeakMap === 'function') ? new WeakMap() : null;
  var PICK = { kind: 'none', why: 'no_element', advancing: false, score: 0, n: 0 };
  function num(v) { return typeof v === 'number' && isFinite(v) ? v : NaN; }
  /* دو نمونهٔ نزدیک از currentTime: جلو رفتن را فقط با گذرِ زمانِ واقعی می‌پذیریم.
     نمونهٔ خیلی کهنه (ticker خاموش بوده) یا خیلی نزدیک (کمتر از ۸۰ms) قضاوت نمی‌کند.
     نمونهٔ تازه جایگزین نمی‌شود: اگر یک گزارش دو بار findMedia صدا بزند، وگرنه فراخوانیِ
     دوم شواهدِ فراخوانیِ اول را پاک می‌کند و قاعدهٔ strict هیچ‌وقت برنده نمی‌شود. */
  function advancing(el) {
    if (!ADV) return false;
    var t = num(el.currentTime); if (isNaN(t)) return false;
    var now = Date.now(), p = null;
    try { p = ADV.get(el) || null; } catch (e) { return false; }
    if (p && now - p.at < 80) return false;
    try { ADV.set(el, { t: t, at: now }); } catch (e) { return false; }
    if (!p) return false;
    var dtS = (now - p.at) / 1000;
    if (dtS > 6) return false;
    return t > p.t + Math.min(0.5, dtS * 0.5);
  }
  function elKind(el) { try { return el && el.tagName ? String(el.tagName).toLowerCase() : 'none'; } catch (e) { return 'unknown'; } }
  function findMedia() {
    var list = [], best = null;
    try { list = Array.prototype.slice.call(document.querySelectorAll('audio,video')); } catch (e) { list = []; }
    PICK.n = list.length;
    var oldEl = null, oldScore = -1, newEl = null, newScore = -1, newTag = '', newAdv = false;
    for (var i = 0; i < list.length; i++) {
      var el = list[i], live = false, audible = false, dur = NaN;
      try { live = !el.paused && !el.ended; audible = !el.muted && el.volume > 0; dur = num(el.duration); } catch (e) { continue; }
      var hasSrc = false; try { hasSrc = !!(el.currentSrc || el.srcObject); } catch (e) {}
      var so = 0;                                                    // امتیازِ قدیمی، بدونِ هیچ تغییری
      if (live) so += 4;
      if (audible) so += 1;
      if (!isNaN(dur) && dur > 0) so += 1;
      if (hasSrc) so += 1;
      if (so > oldScore) { oldScore = so; oldEl = el; }
      var adv = live && audible && advancing(el);
      if (!adv) continue;                                            // شواهدِ کامل: در حالِ حرکت + شنیدنی
      var sn = 6, tag = ['advancing'];
      if (!isNaN(dur) && dur > 0) {
        sn += 1; tag.push('dur');
        if (dur <= 45) { sn -= 3; tag.push('short'); }               // پیش‌نمایش/تبلیغِ کوتاه
      }
      if (hasSrc) { sn += 1; tag.push('src'); }
      var w = el.videoWidth || 0, h = el.videoHeight || 0;
      if (w && h && w * h < 10000) { sn -= 2; tag.push('tiny'); }    // ویدیوی پنهان/بنری کوچک
      if (sn > newScore) { newScore = sn; newEl = el; newTag = tag.join(','); newAdv = true; }
    }
    var pick = newEl || oldEl;
    PICK.advancing = !!newAdv;
    PICK.score = newEl ? newScore : oldScore;
    PICK.why = newEl ? ('strict:' + newTag) : (oldEl ? ('fallback:' + oldScore + '/' + list.length) : 'no_element');
    PICK.kind = pick ? elKind(pick) : 'none';
    return pick;
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
    // §IDLE-AUDIO (F-1): «شنیدنی» بدونِ قاعدهٔ طولِ موسیقی — شاهدِ خامِ پخشِ واقعیِ یک المنت
    var audible = !!el && !el.paused && !el.ended && !el.muted && el.volume > 0;
    var eligible = !!title || real;
    return {
      eligible: eligible, audible: audible, playing: !!playing, title: title, artist: md && md.artist ? String(md.artist) : '', album: md && md.album ? String(md.album) : '',
      art: bestArt(md), pos: Math.max(0, pos), dur: dur, rate: rate, actions: Object.keys(handlers), hasMedia: !!el, pageTitle: document.title || '',
      /* §1.6 چه المنتی و چرا انتخاب شد (برای تشخیصِ «صدا هست ولی المنتِ اشتباه است») */
      elKind: PICK.kind, pickWhy: PICK.why, pickAdv: PICK.advancing, elCount: PICK.n,
      elPaused: el ? !!el.paused : null, elMuted: el ? !!el.muted : null, elVol: el ? num(el.volume) : null, elCur: el ? num(el.currentTime) : null
    };
  }
  /* §IDLE-AUDIO (F-1): «صدا هست ولی منبعِ موسیقی نیست» با همان چیزی که دیده می‌شود گزارش می‌شود:
     المنتِ HTMLِ در حالِ پخش و شنیدنی. اتاقِ بی‌المنتِ HTML (WebRTCِ خالص) سیگنالِ مثبتِ تازه
     نمی‌گیرد: بی‌المنت همان playing:falseِ همیشگی می‌ماند، پس چیزی نمی‌سازیم. */
  function audioOnlyState(s) {
    return {
      eligible: false, playing: true, hasMedia: true, audible: true,
      dur: s.dur, rate: s.rate, actions: s.actions, pageTitle: s.pageTitle,
      elKind: s.elKind, pickWhy: s.pickWhy, pickAdv: s.pickAdv, elCount: s.elCount,
      elPaused: s.elPaused, elMuted: s.elMuted, elVol: s.elVol
    };
  }
  function report(force) {
    var s; try { s = snapshot(); } catch (e) { return; }
    if (!s.eligible) {
      if (s.playing && s.audible && s.hasMedia) {
        // dedupe: المنتِ شنیدنیِ بی‌تغییر دوباره پست نمی‌شود؛ ticker هم فقط تا وقتی روشن می‌ماند
        // که این شاهدِ مثبت پابرجاست (همان هزینهٔ یک تبِ موسیقی، نه بیشتر).
        var ak = 'A|' + (Math.round(s.dur * 10) / 10) + '|' + s.elKind + '|' + s.pageTitle + '|' + (s.elVol || 0);
        if (force || ak !== lastAudioKey || wasEligible) { lastAudioKey = ak; wasEligible = false; lastKey = ''; post('state', audioOnlyState(s)); }
        audioActive = true; startTicker(); return;
      }
      if (wasEligible || audioActive) { wasEligible = false; audioActive = false; lastAudioKey = ''; lastKey = ''; post('state', { eligible: false, playing: false }); }
      stopTicker(); return;
    }
    wasEligible = true; audioActive = false; lastAudioKey = '';
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
    if (cmd === 'ping') { report(true); return 'ping'; }   // بی‌مصرف findMedia صدا نزن: نمونهٔ advancing را دو بار در یک گزارش مصرف نکند
    var el = findMedia();
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
