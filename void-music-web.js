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
  /* §1.5 پرچمِ آزمونِ H3 (مالک): با true، ناوبریِ تبِ منبع صدای تب را آزاد نمی‌کند و پس از
     complete با یک ping دوباره اعتبارسنجی می‌شود. پیش‌فرض false = رفتارِ همیشگی.
     هر آزادسازیِ capture با دلیلش در console ثبت می‌شود تا آزمونِ A/B شواهد داشته باشد. */
  var CAPTURE_KEEP_ON_NAV = false;
  /* §1.7 تلاشِ دوباره با backoffِ کردار (۸s → ۱۶s → ۳۲s → سقف ۶۰s) به‌جای «دو تلاش و تمام».
     شمارنده با اقدامِ کاربر (کلیکِ chip / شروعِ پخش / pingِ دستی) صفر می‌شود. */
  var CAP_BACKOFF_BASE = 8000, CAP_BACKOFF_MAX = 60000, CAP_TRIES_CEIL = 6;
  /* §IDLE-AUDIO «صدا هست ولی منبعِ موسیقیِ معتبر نیست» (اتاقِ صوتی/کالان). دو کار، هر دو کوچک:
     ۱) چنین منبعی «صاحبِ صوتی» می‌ماند: عنوانِ همان تب روی صفحه می‌ماند و proxy در مکث
        می‌نشیند، پس لایهٔ ویژولایزر idle است و موتورِ ویژولایزر به‌جای کهکشانِ فریزشده، هالهٔ
        آرام را نشان می‌دهد (او این را فقط از activeInfo.audioOnly می‌خواند؛ هیچ حدسی نمی‌زند).
        صدایِ تب مثلِ همیشه آزاد می‌شود: بدونِ نیازِ واقعی، capture نگه نمی‌داریم.
     ۲) وقتی صاحبِ منبع می‌رود (تب بسته / ناوبری / دیگر منبعِ موسیقی نیست) باقی‌مانده‌ها بی‌درنگ
        پرسیده می‌شوند — همان کاری که ری‌بارگذاریِ صفحه به‌صورتِ جانبی می‌کرد و دیگر لازم نیست.
     یک‌خط برگشت: IDLE_AUDIO = false ⇒ هیچ audioOnly، هیچ هاله، هیچ بازیابیِ خودکار (رفتارِ کاملاً قبلی). */
  var IDLE_AUDIO = true;
  var RECOVER_COOLDOWN_MS = 2000, lastRecoverAt = 0, recoverPending = false;
  /* §IDLE-AUDIO (پ): «تبِ بسته» در Chrome بازگشت‌ناپذیر است — شناسهٔ تب هرگز دوباره به تبِ تازه‌ای
     داده نمی‌شود. پیش از این، پاسخِ دیرهنگامِ capture (یا گزارشی که راهِ خودش را می‌پیمود) با
     ensureSource منبعِ مرده را از نو می‌ساخت، صاحبِ صندلی می‌شد و عنوانِ همان تبِ مُرده روی صفحه
     می‌ماند — دقیقاً «عنوانِ کهنه»‌ای که این قابلیت باید جمعش کند. این گورِ کوچک تنها جلوی
     زنده‌شدنِ تبِ رفته را می‌گیرد؛ تبی که فقط ناوبری کرده (vm-web-bye) در گور نمی‌آید و مثلِ
     همیشه با بارگذاریِ دوباره برمی‌گردد. با IDLE_AUDIO=false این خطوط هیچ اثری ندارند. */
  var droppedTabs = new Map();       // tabId -> زمانِ onRemoved (فقط برای تمیز نگه داشتنِ حافظه)
  var DROP_TOMB_S = 600;             // ده دقیقه بعد، هیچ پاسخِ دیرهنگامی وجود ندارد؛ آزاد می‌شود
  function markDropped(tabId) {
    if (!IDLE_AUDIO || !Number.isInteger(tabId)) return;
    var now = Date.now(); droppedTabs.set(tabId, now);
    if (droppedTabs.size > 200) droppedTabs.forEach(function (ts, id) { if (now - ts > DROP_TOMB_S * 1000) droppedTabs.delete(id); });
  }
  function isDropped(tabId) { return IDLE_AUDIO && droppedTabs.has(tabId); }
  var sources = new Map();           // tabId -> { tabId, host, st, at, proxy, contact, audio, tries, fail }
  var activeId = null, capture = null, tickTimer = 0, suppressed = new Set();   // suppressed: منبعی که کاربر دستی جدایش کرده؛ تا مکث/توقفِ بعدی خودکار وصل نمی‌شود
  var thisTabId = null;              // شناسهٔ همین صفحهٔ Void Tab؛ هرگز به خودش ping نمی‌زند
  try { chrome.tabs.getCurrent(function (tb) { thisTabId = tb && Number.isInteger(tb.id) ? tb.id : null; }); } catch (e) {}

  function L(key, fallback) { try { if (typeof t === 'function') { var v = t(key); if (v && v !== key) return v; } } catch (e) {} return fallback; }
  function cmd(tabId, name, value) { try { chrome.tabs.sendMessage(tabId, { type: 'vm-web-cmd', cmd: name, value: value }, function () { void chrome.runtime.lastError; }); } catch (e) {} }

  // ---------- صدای مجازی با رابطِ HTMLAudioElement ----------
  function makeProxy(tabId) {
    var p = new EventTarget();
    p.__web = true; p.tabId = tabId; p.paused = true; p.ended = false; p.readyState = 4; p.error = null; p.src = ''; p.currentSrc = 'web:' + tabId;
    p.muted = false; p._vol = 1; p.preload = 'none'; p.captured = false; p._cur = 0; p._dur = NaN; p._rate = 1; p._at = 0;
    // ولوم در منبعِ تب یعنی «ولومِ همان تب»: فرمان به پلِ تب می‌رود، نه به تقویت‌کنندهٔ Void Tab
    // (صدای این منبع در Void Tab پخش نمی‌شود که بخواهد کم/زیاد شود).
    Object.defineProperty(p, 'volume', {
      get: function () { return p._vol; },
      set: function (v) { v = +v; if (!isFinite(v)) return; v = Math.max(0, Math.min(1, v)); if (v === p._vol) return; p._vol = v; cmd(tabId, 'volume', v); }
    });
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

  // ---------- وضعیتِ منابع (چهار محورِ مستقل: contact / playing / audio / analysis) ----------
  // contact: 'unknown' = هنوز پلِ تب پاسخ نداده | 'live' = پل در دسترس | 'gone' = پل پاسخ نداد (تبِ بی‌پل)
  // audio:   'none' = بدونِ صدای واقعیِ تب | 'pending' = درخواستِ capture در جریان | 'live' | 'failed'
  // analysis: 'none' | 'nostream' | 'building' | 'suspended' | 'untapped' | 'silent' | 'live' (پرس‌وجوی موتورِ ویژولایزر)
  // contact و audio دربارهٔ «دسترسی» حرف می‌زنند، نه «پخش»؛ هیچ‌کدام false-playing گزارش نمی‌کنند.
  // audio هرگز ادعای «کهکشان داده می‌گیرد» نمی‌کند — آن فقط از analysis می‌آید.
  // §IDLE-AUDIO محورِ پنجم، audioOnly (bool): «تب صدا دارد ولی منبعِ موسیقیِ معتبرِ کهکشان نیست».
  // هرگز با audio یکی نمی‌شود: این فقط از نبودِ گزارشِ موسیقی (s.st) در تبی می‌آید که صدایش را
  // گرفته‌ایم؛ هیچ منبعِ موسیقیِ واقعی هرگز این برچسب را نمی‌گیرد.
  function ensureSource(tabId, host) {
    var s = sources.get(tabId);
    if (!s) { s = { tabId: tabId, host: host || '', st: null, at: 0, pingAt: 0, proxy: null, contact: 'unknown', music: false, wasPlaying: false, audio: 'none', an: 'none', tries: 0, fail: '', retryAt: 0, audioOnly: false, info: null }; sources.set(tabId, s); }
    else if (host) s.host = host;
    return s;
  }
  function isPlayingSource(s) { return !!(s && s.st && s.st.playing); }
  /* §IDLE-AUDIO (F-2): «صاحبِ صوتی» فقط با شاهدِ خودِ تب پذیرفته می‌شود: المنتِ HTML که می‌نوازد
     و شنیدنی است. کلیپِ کوتاه (همان آستانهٔ ۴۵ ثانیهٔ §1.2) صاحب نمی‌شود، و گزارشِ قدیمیِ
     hook که audible را نمی‌داد هرگز مثبت خوانده نمی‌شود (fail-safe: مثلِ دیروز). */
  function soundOwnerEvidence(st) {
    return !!(IDLE_AUDIO && st && st.playing === true && st.audible === true && st.hasMedia === true && !(st.dur > 0 && st.dur <= 45));
  }
  function best() {
    var pick = null;
    sources.forEach(function (s) { if (isPlayingSource(s) && (!pick || s.at > pick.at)) pick = s; });
    return pick;
  }
  // یک منبعِ عنوانِ واحد: یا گزارشِ واقعیِ تب، یا آنچه از آخرین گزارشِ واقعی به یاد مانده (§IDLE-AUDIO)
  function srcInfo(s) {
    var st = s.st;
    if (st) return { host: s.host, title: st.title || st.pageTitle || s.host, artist: st.artist || s.host, art: st.art || '' };
    return s.info || { host: s.host, title: s.host, artist: s.host, art: '' };
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
    s.info = srcInfo(s);
    VM.setWebMeta(s.info);
  }
  // ---------- محورِ چهارم: آیا دادهٔ صوتی واقعاً به تحلیلِ کهکشان می‌رسد؟ ----------
  // «audio:live» فقط یعنی stream گرفته شد. کهکشان تنها وقتی می‌رقصد که گرافِ Web Audio ساخته
  // شده، context در حالِ اجرا، تحلیلگرها وصل و stream بی‌صدا نباشد. این را از خودِ موتورِ
  // ویژولایزر می‌پرسیم؛ حدسِ لایهٔ اتصال جای شواهد را نمی‌گیرد.
  function vizDiagnostics() {
    var W = window.VoidMusicViz && window.VoidMusicViz.web;
    return W && W.diagnostics ? W.diagnostics() : null;
  }
  function analysisState(s, d) {
    if (!s || s.audio !== 'live') return 'none';
    if (!d) return 'noviz';
    if (d.stream !== 'connected') return 'nostream';
    if (d.ctx !== 'none' && d.ctx !== 'running') return 'suspended';   // سیاستِ autoplay: یک کلیک/کلید گراف را می‌سازد
    if (d.graph !== 'ready') return d.graph;                    // 'building' | 'failed'
    if (!d.tapped) return 'untapped';
    return d.silent ? 'silent' : 'live';
  }
  function refreshChip() {
    // n = منبعِ «شناسایی‌شده» (پلِ تب در دسترس است و یک منبعِ موسیقی گزارش کرده)؛ playable = واقعاً در حالِ پخش
    // §IDLE-AUDIO: منبعِ صوتیِ بی‌موسیقی (audioOnly) هم «شناسایی‌شده» است — آن را از شمارش بیرون نگه داشتن،
    // چیپ را وقتی هنوز به همان تب وصل هستیم ناپدید می‌کرد.
    var n = 0, playable = 0;
    sources.forEach(function (s) { if (s.contact !== 'gone' && (s.st || s.music || s.audioOnly)) { n++; if (isPlayingSource(s)) playable++; } });
    var a = activeId != null ? sources.get(activeId) : null;
    var d = vizDiagnostics();
    var an = analysisState(a, d); if (a) a.an = an;
    VM.setWebChip(n ? {
      label: a ? a.host : (best() ? best().host : ''),
      on: activeId != null, count: n, playing: playable,
      capture: !!capture, audio: a ? a.audio : 'none', fail: a ? a.fail : '',
      analysis: an, db: d ? Math.round(d.db) : null
    } : null);
  }
  function attach(s, handover) {
    // §IDLE-AUDIO: منبعِ صوتیِ بی‌موسیقی ممکن است st واقعی نداشته باشد (skeleton)؛ عنوان از s.info می‌آید.
    if (!s || s.contact === 'gone' || (!s.st && !(IDLE_AUDIO && s.audioOnly))) return;
    suppressed.delete(s.tabId);
    // تحویلِ صاحب: منبعِ کهنه فقط جدا می‌شود (پخشِ آن متوقف نمی‌شود — شاید هنوز صدا داشته باشد)
    if (activeId != null && activeId !== s.tabId) detachActive(handover ? { pauseSite: false, quiet: true } : {});
    if (!s.proxy) s.proxy = makeProxy(s.tabId);
    activeId = s.tabId;
    VM.attachWeb(s.proxy, srcInfo(s));
    if (s.st) applyState(s); else { s.info = srcInfo(s); VM.setWebMeta(s.info); }   // skeleton: proxy در مکث می‌ماند ⇒ لایهٔ idle
    startTick(); refreshChip();
    try { VM.toast && VM.toast((L('voidMusicWebPlaying', 'Playing from {site}')).replace('{site}', s.host)); } catch (e) {}
    // اتصالِ صوت: بی‌درنگ درخواست می‌شود؛ اگر مجاز نباشد وضعیتِ failed ثبت می‌شود (نه پخش فعال)
    // §IDLE-AUDIO: برای منبعِ بی‌موسیقی *بدونِ گزارشِ واقعی* هرگز capture نمی‌خواهیم — صدایِ تب
    // بدونِ نیازِ تحلیل نگه داشته نمی‌شود و یک درخواستِ بی‌اجازهٔ تازه هم ساخته نمی‌شود.
    if (s.st) requestCapture(s);
  }
  function detachActive(opts) { if (activeId != null) VM.detachWeb(opts || {}); }
  function onDetach(tabId, opts) {
    if (opts.pauseSite !== false) { var s = sources.get(tabId); if (s && isPlayingSource(s)) cmd(tabId, 'pause'); }
    if (capture && capture.tabId === tabId) releaseCapture(false, 'source_detached', tabId);
    if (activeId === tabId) activeId = null;
    stopTick(); refreshChip();
  }
  function startTick() { if (tickTimer) return; tickTimer = setInterval(function () { var s = activeId != null && sources.get(activeId); if (s && s.proxy && !s.proxy.paused && !document.hidden) s.proxy.dispatchEvent(new Event('timeupdate')); if (s && analysisState(s, vizDiagnostics()) !== s.an) refreshChip(); }, 250); }
  function stopTick() { if (tickTimer) { clearInterval(tickTimer); tickTimer = 0; } }
  function sweep() {
    // هر منبع می‌ماند تا «پلِ تب واقعاً از بین رفته باشد»؛ سکوت/مکث دیگر منبع را از فهرست حذف نمی‌کند،
    // چون «تبِ پخش‌متوقف» یک وضعیتِ معتبر است نه نبودِ منبع.
    var now = Date.now();
    sources.forEach(function (s, id) {
      if (id === activeId) return;
      if (s.contact === 'gone' && !isPlayingSource(s)) { sources.delete(id); return; }
      if (s.contact === 'unknown' && !s.st && !s.music && !s.audioOnly && now - s.pingAt > STALE_MS) sources.delete(id);
    });
    /* §1.7 رانندهٔ backoff: تایمرِ تازه نمی‌سازیم. پنجرهٔ انتظار که باز شد، برای منبعِ فعالی
       که واقعاً پخش می‌کند یک تلاشِ تازه می‌شود؛ سقفِ تلاش‌ها تنها با اقدامِ کاربر باز می‌شود. */
    var act = activeId != null ? sources.get(activeId) : null;
    if (act && act.audio === 'failed' && act.contact === 'live' && isPlayingSource(act) && now >= (act.retryAt || 0)) requestCapture(act);
    if (recoverPending) tryRecover('sweep');   // پشت‌بندِ یک‌بارمصرف: از دست رفتنِ صاحب را فقط یک بار تلاش می‌کنیم
    refreshChip();
  }
  setInterval(sweep, 5000);

  /* §IDLE-AUDIO (ب) بازیابیِ صاحب: تا پیش از این، رفتنِ منبعِ فعال هیچ‌کس را دوباره نمی‌پرسید —
     «عنوانِ کهنه تا ری‌فرشِ صفحه». اینجا همان کاری می‌شود که reload به‌صورتِ جانبی درست می‌کرد:
     یا یک منبعِ پخش‌کنندهٔ دیگر بی‌درنگ وصل می‌شود، یا pingِ اجباری (report(true) → بدونِ dedupe
     خاهِ void-media-hook.js) از پل‌های زنده گزارشِ تازه می‌گیرد و onState خودش صاحب را انتخاب می‌کند.
     اقدامِ دستیِ کاربر (suppressed) هرگز دور زده نمی‌شود؛ پخشِ محلی رقابت نمی‌کند؛ و اگر چیزی
     برای وصل‌شدن نبود، یک تلاشِ دیگر نمی‌کنیم (recoverPending مصرف می‌شود → طوفانِ ping نداریم). */
  function tryRecover(reason) {
    recoverPending = false;
    if (!IDLE_AUDIO || activeId != null) return;                    // هنوز صاحب دارد: چیزی برای بازیابی نیست
    if (!(VM.isOpen && VM.isOpen()) || localPlaying()) return;      // بیرون از Music Mode یا پخشِ محلی: دخالت نمی‌کنیم
    var now = Date.now();
    if (now - lastRecoverAt < RECOVER_COOLDOWN_MS) { recoverPending = true; return; }
    lastRecoverAt = now;
    var pick = best();
    if (pick && !suppressed.has(pick.tabId)) {
      try { console.info('[VoidMusicWeb] recover', reason, 'attach-music', pick.tabId, pick.host); } catch (e) {}
      attach(pick, true); return;
    }
    // منبعِ پخش‌کننده‌ای نیست: حداقل «صاحبِ صوتی» (اتاقِ صوتی) عنوانش را پس می‌گیرد؛ هاله را
    // موتورِ ویژولایزر از activeInfo.audioOnly می‌خواند، نه از حدسِ اینجا.
    var aud = null;
    sources.forEach(function (s) {
      if (!s.audioOnly || s.contact !== 'live' || suppressed.has(s.tabId)) return;
      if (!aud || s.at > aud.at) aud = s;
    });
    try { console.info('[VoidMusicWeb] recover', reason, 'forced-ping', aud ? ('audioOnly=' + aud.tabId) : 'none'); } catch (e) {}
    pingAll(true);
    if (aud && activeId == null) attach(aud, true);
  }
  function markLoss(reason) {
    // فقط وقتی بیدار می‌شود که صاحبی نمانده باشد: رفتنِ یک تبِ پس‌زمینه (نه فعال) بازیابی نمی‌خواهد
    if (!IDLE_AUDIO || activeId != null) return;
    recoverPending = true;
    try { console.info('[VoidMusicWeb] source-lost', reason); } catch (e) {}
    tryRecover(reason);
  }

  function onState(m, tabId) {
    var st = m.state; if (!st) return;
    if (isDropped(tabId)) return;                     // §IDLE-AUDIO (پ): گزارشِ در راه از تبی که بسته شده مالک نمی‌شود
    var s = ensureSource(tabId, m.host);
    s.contact = 'live'; s.at = Date.now();
    var soundOwner = soundOwnerEvidence(st);
    if (!st.eligible) {
      // پل زنده است ولی این لحظه منبعِ موسیقی/پخشِ اصلی ندارد: «شناسایی‌شدهٔ ساکت»، نه حذفِ منبع
      s.music = false; s.st = null; s.wasPlaying = false; capReset(s);   // منبعِ ساکت: شمارندهٔ تلاش و backoff را نمی‌سوزاند
      /* §IDLE-AUDIO (F-2): صدایِ یک صاحبِ صوتیِ واقعی آزاد نمی‌شود. بی‌این شرط، گزارشِ ۱ هرتزِ
         تازه در هر ثانیه یک‌بار streamِ معتبرِ همان تب را می‌کشت (release → stop track → دوباره
         درخواست). رفتنِ واقعیِ پخش (playing:false) مثلِ قبل release می‌کند. با IDLE_AUDIO=false
         soundOwner همیشه false است ⇒ رفتارِ کلم‌به‌کلم همان دیروز. */
      if (s.audio === 'live' && !soundOwner) releaseCapture(false, 'source_not_eligible', tabId);
      /* §IDLE-AUDIO (الف): «صدا هست، منبعِ موسیقی نیست» را از خودِ گزارشِ همین تب می‌خوانیم، نه از
         حدس: «عنصرِ پخش در حالِ اجراست، ولی تب منبعِ موسیقیِ معتبر ندارد (metadata/eligibility
         نمی‌دهد)» ⇒ audioOnly + عنوان از pageTitleِ همان گزارش (اتاقِ صوتی ری‌فرشِ صفحه نمی‌خواهد).
         گزارشِ eligibleِ بعدی (پایینِ همین تابع) آن را پاک می‌کند، پس هیچ منبعِ موسیقی‌ای هرگز
         audioOnly نمی‌ماند. اگر همین تب صاحبِ فعال است و هنوز صدا دارد، جدا نمی‌شود: proxy بی‌فرمانِ
         pause در مکث می‌نشیند (cmd('pause') اتاق را سکوت می‌داد — این‌جا هیچ فرمانی به تب نمی‌رود)
         ⇒ لایهٔ idle ⇒ هاله. صدایِ تب اگر capture باشد هم نگه داشته می‌شود (§F-2 بالا). */
      if (soundOwner) {
        s.audioOnly = true;
        s.info = { host: s.host, title: st.pageTitle || (s.info && s.info.title) || s.host,
          artist: (s.info && s.info.artist) || s.host, art: (s.info && s.info.art) || '' };
      } else if (IDLE_AUDIO) {
        /* «دیگر صدا ندارد» یعنی دیگر صاحبِ صوتی نیست: چسبندگیِ audioOnly فقط تا وقتی معتبر است که
           همان تب هنوز صدایی گزارش می‌کند. بی‌این خط، اتاقِ ساکت در tryRecover دوباره صاحب می‌شد
           (هاله روی صفحهٔ بی‌صدا) — جایی که رفتارِ همیشگی «inactive» درست است. */
        s.audioOnly = false;
      }
      if (IDLE_AUDIO && s.audioOnly && st.playing && activeId === tabId && s.proxy) {
        var pk = s.proxy;
        if (!pk.paused) { pk._cur = pk.currentTime; pk.paused = true; pk._at = 0; pk.dispatchEvent(new Event('pause')); }
        VM.setWebMeta(s.info);                    // عنوانِ تب/اتاق همان‌طور که هست می‌ماند و تازه می‌شود
        refreshChip(); return;
      }
      if (activeId === tabId) { VM.detachWeb({ pauseSite: false }); markLoss('not-eligible'); }
      /* §IDLE-AUDIO (ب): اتاقِ صوتی وقتی صاحبِ تصویر می‌شود که *هیچِ منبعِ موسیقیِ در حالِ پخش*
         نباشد (best() تهی است)، نه وقتی موسیقیِ دیگری پخش می‌شود — و همان مسیر، صاحبِ رفته را هم
         بعدِ pingِ اجباریِ tryRecover برمی‌گرداند، پس زنجیره‌ای از ping ساخته نمی‌شود. */
      else if (IDLE_AUDIO && s.audioOnly && st.playing && activeId == null && !best() && !suppressed.has(tabId) &&
               VM.isOpen && VM.isOpen() && !localPlaying()) { recoverPending = false; attach(s, true); }
      refreshChip(); return;
    }
    s.music = true; s.st = st; s.audioOnly = false; s.info = srcInfo(s);
    const resume = !!st.playing && !s.wasPlaying;                     // شروع/ازسرگرفتنِ پخش = فرصتِ تازه برای اتصالِ صوت
    s.wasPlaying = !!st.playing;
    if (resume) capReset(s);                                              // شروع/ازسرگرفتنِ پخش = بودجهٔ تلاشِ تازه
    if (!st.playing && s.audio === 'live') releaseCapture(false, 'site_paused_or_ended', tabId);   // stop/finish: صدایِ تب آزاد می‌شود
    if (!st.playing) { if (activeId === tabId) applyState(s); refreshChip(); return; }
    if (activeId === tabId) { applyState(s); if (resume && s.audio !== 'live' && s.audio !== 'pending') requestCapture(s); }
    else if (VM.isOpen && VM.isOpen() && !localPlaying() && !suppressed.has(tabId)) {
      if (activeId == null) attach(s);
      else handoverTo(s);             // صاحبِ منبع ساکت/بایگانی شده و این تب می‌نوازد: تحویل بده
    }
    refreshChip();
  }
  // تحویلِ صاحبِ منبع: تبِ متصل یا مکث شده یا خبری از آن نیست (stateِ تازه ندارد) درحالی‌که
  // این تب واقعاً پخش می‌کند. بدونِ این، chip به منبعِ قدیمی «متصل» می‌ماند و کهکشان از تبی
  // که صدا دارد بی‌خبر می‌ماند — همان «صدای تبِ تازه، کهکشانِ بی‌حرکت».
  var HANDOVER_MS = 6000;
  function handoverTo(s) {
    var cur = sources.get(activeId);
    /* §IDLE-AUDIO: «صاحبِ صوتی» (اتاقِ بی‌موسیقی) هیچ‌وقت تحویلِ صندلی را از موسیقیِ واقعی نگه
       نمی‌دارد: state آن از خودِ تب نیست (سkeletonِ capture) و تا HANDOVER_MS موسیقی تازه را
       پشتِ در می‌گذاشت. هاله باید بی‌درنگ خاموش شود، نه شش ثانیه بعد. */
    if (cur && isPlayingSource(cur) && !(IDLE_AUDIO && cur.audioOnly) && Date.now() - cur.at < HANDOVER_MS) return;
    attach(s, true);
  }
  function drop(tabId) {
    var s = sources.get(tabId);
    if (s && s.audio === 'live' && capture && capture.tabId === tabId) releaseCapture(false, 'source_dropped', tabId);
    if (activeId === tabId) VM.detachWeb({ pauseSite: false });
    suppressed.delete(tabId); sources.delete(tabId); refreshChip();
    markLoss('tab-closed');        // §IDLE-AUDIO: تبِ صاحب رفت — باقی‌مانده‌ها باید خودشان را برگردانند، نه با ری‌فرشِ صفحه
  }
  // شمارشِ تب‌ها یک‌بار در هر فراخوان؛ پاسخِ ping شناسهٔ contact را تعیین می‌کند (نه pollingِ بی‌پایان)
  function pingAll(force) {
    try {
      chrome.tabs.query({}, function (tabs) {
        if (chrome.runtime.lastError) return;
        (tabs || []).forEach(function (tb) {
          if (!tb || tb.id == null || tb.id === thisTabId) return;
          var s = sources.get(tb.id);
          if (!force && s && (s.contact === 'live' || s.st)) return;              // تب‌های سالم دوباره ping نمی‌شوند
          if (!s) { s = ensureSource(tb.id, ''); s.pingAt = Date.now(); } else s.pingAt = Date.now();
          if (!s.host) { try { s.host = new URL(tb.url || tb.pendingUrl || '').hostname.replace(/^www\./, ''); } catch (e) {} }
          try {
            chrome.tabs.sendMessage(tb.id, { type: 'vm-web-ping' }, function (res) {
              if (chrome.runtime.lastError) { markNoBridge(tb.id); return; }        // پل در این تب هرگز بارگذاری نشده
              markBridge(tb.id, !!(res && res.live));
            });
          } catch (e) { markNoBridge(tb.id); }
        });
        refreshChip();
      });
    } catch (e) {}
  }
  function markNoBridge(tabId) {
    var s = sources.get(tabId); if (!s) return;
    if (s.contact !== 'live') { s.contact = 'gone'; s.audio = 'none'; }
  }
  function markBridge(tabId, live) {
    var s = sources.get(tabId); if (!s) return;
    s.contact = 'live';
    if (live && !s.st) s.music = true;   // پل می‌گوید منبعِ موسیقی دارد؛ گزارشِ وضعیت لحظاتی دیگر می‌رسد
    // پینگ، خودِ hook را به گزارشِ تازه وادار می‌کند؛ اتصالِ صوت فقط برای منبعِ فعال درخواست می‌شود
    // (وگرنه یک تبِ ساکتِ پس‌زمینه می‌تواند منبعِ فعال را جابه‌جا کند).
    /* §IDLE-AUDIO (F-2): صاحبِ صوتی (اتاقِ صوتی) هرگز با ping به درخواستِ capture نرسانده می‌شود —
       آن پنجرهٔ «this tab is sharing audio» یک اقدامِ کاربر نیست. پاسخِ زنده‌ی پل فقط برای گزارشِ
       eligible درست است؛ گزارشِ audioOnly (eligible:false) خودش live را false نگه می‌دارد، پس این
       شرط دفاعِ پایدار است، نه تنها راهِ نجات. با IDLE_AUDIO=false عینِ دیروز. */
    if (live && activeId === tabId && s.audio === 'none' && !(IDLE_AUDIO && s.audioOnly)) requestCapture(s);
  }

  // ---------- لایهٔ اتصالِ صوت: درخواستِ stream برای تبِ منبع ----------
  function capReset(s) { s.tries = 0; s.fail = ''; s.retryAt = 0; }        // اقدامِ کاربر / شروعِ پخش: پنجرهٔ backoff بسته می‌شود
  function capFail(s, reason) {
    s.audio = 'failed'; s.fail = reason || 'unavailable'; s.tries++;
    var d = Math.min(CAP_BACKOFF_MAX, CAP_BACKOFF_BASE * Math.pow(2, Math.max(0, s.tries - 1)));
    s.retryAt = Date.now() + d;
    try { console.info('[VoidMusicWeb] capture-failed', s.tabId, s.fail, 'retry_in_ms=' + d, 'tries=' + s.tries); } catch (e) {}
    refreshChip();
  }
  function requestCapture(s) {
    if (!s || s.contact === 'gone') return;
    if (s.audio === 'live' || s.audio === 'pending') return;
    if (s.tries >= CAP_TRIES_CEIL) return;                                 // سقف: تا اقدامِ کاربر دوباره تلاش نمی‌کنیم
    if (s.tries > 0 && Date.now() < s.retryAt) return;                      // پنجرهٔ backoff باز نشده
    s.tries++; s.audio = 'pending'; s.fail = ''; refreshChip();
    try {
      chrome.runtime.sendMessage({ type: 'vm-capture-request', tabId: s.tabId, consumerTabId: thisTabId }, function (res) {
        var err = chrome.runtime.lastError;
        var cur = sources.get(s.tabId); if (!cur) return;
        if (err || !res || !res.ok || !res.streamId) {
          capFail(cur, (res && res.reason) || (err ? 'no_worker' : 'unavailable')); return;
        }
        startCapture({ streamId: res.streamId, tabId: cur.tabId, host: res.host || cur.host, title: res.title || '' })
          .then(function (ok) {
            /* §IDLE-AUDIO (پ): اگر تب در همین فاصله رفت، شیءِ ردیفِ دیگر در sources نیست؛
               ثبتِ «شکست» روی منبعِ مُرده فقط لاگِ گمراه‌کننده می‌سازد. */
            if (!sources.has(cur.tabId)) return;
            if (ok) { cur.audio = 'live'; cur.fail = ''; cur.retryAt = 0; cur.tries = 0; refreshChip(); } else capFail(cur, 'stream_denied');
          });
      });
    } catch (e) { capFail(s, 'unavailable'); }
  }

  // ---------- لایهٔ ۲: صدای واقعی تب (Alt+Shift+V یا درخواستِ خودکارِ chip) ----------
  async function startCapture(m) {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
      if (isDropped(m.tabId)) { relLog('dropped_tab', m.tabId, 'refused_before_gum'); return false; }   // §IDLE-AUDIO (پ)
      releaseCapture(true, 'new_capture_replaces_old', m.tabId);
      var stream = await navigator.mediaDevices.getUserMedia({ audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: m.streamId } }, video: false });
      /* §IDLE-AUDIO (پ): تب ممکن است وسطِ همین await بسته باشد؛ آن‌وقت پاسخِ دیرهنگام نباید
         منبعِ مُرده را از نو بسازد و صاحبِ صندلی شود (عنوانِ کهنه + هالهٔ اشتباه). streamِ تازه
         بی‌درنگ خاموش می‌شود تا صدایی از تبِ رفته در حافظه نماند. */
      if (isDropped(m.tabId)) {
        relLog('dropped_tab', m.tabId, 'late_reply_stream_stopped');
        try { stream.getTracks().forEach(function (tr) { tr.stop(); }); } catch (e) {}
        return false;
      }
      var s = ensureSource(m.tabId, m.host || '');
      /* §IDLE-AUDIO: اگر تب هیچ‌گاه منبعِ موسیقیِ معتبر گزارش نکرده باشد (اتاقِ صوتی: نه mediaSession،
         نه المنتِ پخشِ قابلِ اتکا) همین‌جا «صدا + بی‌موسیقی» ثبت می‌شود؛ عنوان از خودِ تب می‌آید و
         بهِ موتورِ ویژولایزر فقط از activeInfo.audioOnly می‌رسد. گزارشِ واقعیِ موسیقی (s.st) این را
         پاک می‌کند، پس هیچ منبعِ موسیقی‌ای هرگز audioOnly نمی‌شود. */
      if (!s.st) { s.st = { eligible: true, playing: true, title: m.title || m.host || '', artist: m.host || '', pos: 0, dur: 0, rate: 1 }; if (IDLE_AUDIO) s.audioOnly = true; }
      else s.audioOnly = false;
      s.at = Date.now(); s.contact = 'live'; s.audio = 'live'; s.fail = '';
      try { if (VM.enter && !VM.isOpen()) VM.enter(); } catch (e) {}
      if (activeId === m.tabId && s.proxy) applyState(s);   // از قبل متصل است: فقط وضعیت را هم‌گام کن (بدونِ attach/tostِ دوباره)
      else attach(s);
      capture = { tabId: m.tabId, stream: stream };
      if (s.proxy) s.proxy.captured = true;
      if (window.VoidMusicViz && window.VoidMusicViz.web) window.VoidMusicViz.web.useStream(stream);
      stream.getAudioTracks().forEach(function (tr) { tr.addEventListener('ended', function () { if (capture && capture.stream === stream) releaseCapture(false, 'track_ended', m.tabId); }); });
      try { VM.toast && VM.toast(L('voidMusicWebCaptureOn', 'Live audio linked')); } catch (e) {}
      refreshChip(); return true;
    } catch (e) { return false; }
  }
  /* §1.5 (ب): هر آزادسازیِ capture با caller/reason ثبت می‌شود. دلیل‌هاcallerهای مختلف را
     از هم جدا می‌کند (reload، پایانِ پخش، دستورِ کاربر، مُردنِ track، SW) تا حدس‌ها با
     شواهد جایگزین شود. */
  function relLog(reason, tabId, extra) {
    try { console.info('[VoidMusicWeb] releaseCapture', 'reason=' + reason, 'tab=' + tabId, extra || ''); } catch (e) {}
  }
  function releaseCapture(silent, reason, tabId) {
    if (!capture) return;
    var c = capture;
    relLog(reason || 'unspecified', tabId != null ? tabId : c.tabId, 'silent=' + !!silent);
    capture = null;
    try { c.stream.getTracks().forEach(function (tr) { tr.stop(); }); } catch (e) {}
    try { if (window.VoidMusicViz && window.VoidMusicViz.web) window.VoidMusicViz.web.releaseStream(); } catch (e) {}
    var s = sources.get(c.tabId);
    if (s) { s.proxy && (s.proxy.captured = false); if (s.audio === 'live') s.audio = 'none'; }
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
    else if (m.type === 'vm-capture-stop') { releaseCapture(false, 'cmd_capture_stop', m && m.tabId != null ? m.tabId : (capture && capture.tabId)); try { reply && reply({ ok: true }); } catch (e) {} }
  });
  try {
    chrome.tabs.onRemoved.addListener(function (id) { markDropped(id); if (sources.has(id)) drop(id); });   // §IDLE-AUDIO (پ): نشانه‌گذاری حتی وقتی ردیفی نداریم
    // reload: پلِ تب از نو بارگذاری می‌شود؛ contact نامطمئن می‌شود و صدای قبلی دیگر معتبر نیست
    chrome.tabs.onUpdated.addListener(function (id, change) {
      if (!change || !('status' in change) || sources.get(id) === undefined) return;
      var s = sources.get(id); if (!s) return;
      if (change.status === 'loading') {
        /* §1.5 با پرچمِ keep، ناوبری صدای تب را آزاد نمی‌کند: stream نگه داشته می‌شود و
           پس از complete همان مسیرِ ping اعتبارسنجی می‌کند (آزمونِ H3). */
        var keep = CAPTURE_KEEP_ON_NAV && capture && capture.tabId === id;
        s.contact = 'unknown'; s.st = null; s.pingAt = Date.now(); capReset(s); s.wasPlaying = false; s.music = false;
        if (keep) { relLog('loading_kept', id); refreshChip(); return; }
        if (capture && capture.tabId === id) releaseCapture(true, 'source_tab_loading', id);
        s.audio = 'none';
        if (activeId === id) { VM.detachWeb({ pauseSite: false }); markLoss('tab-navigated'); }   // §IDLE-AUDIO: صاحبِ فعال آدرس عوض کرد
        refreshChip();
      } else if (change.status === 'complete' && s.contact === 'unknown') {
        try { chrome.tabs.sendMessage(id, { type: 'vm-web-ping' }, function (res) {
          if (chrome.runtime.lastError) { markNoBridge(id); } else { markBridge(id, !!(res && res.live)); }
          refreshChip();
        }); } catch (e) { markNoBridge(id); refreshChip(); }
      }
    });
  } catch (e) {}

  // چیپِ منبع: روشن/خاموش‌کردنِ منبعِ وب؛ در وضعیتِ شکست، کلیکِ بعدی تلاشِ مجدد است
  window.addEventListener('voidmusic:web-chip', function () {
    if (activeId != null) {
      var a = sources.get(activeId);
      if (a && a.audio === 'failed') { capReset(a); requestCapture(a); return; }   // تلاشِ مجددِ کاربر: backoff را دور می‌زند
      suppressed.add(activeId); VM.detachWeb({ pauseSite: false }); return;
    }
    var s = best(), pick = s;
    if (!pick) sources.forEach(function (x) { if (!pick && x.contact !== 'gone' && (x.st || x.music)) pick = x; });
    if (pick) { if (pick.audio === 'failed') capReset(pick); attach(pick); }
    else pingAll(true);
  });
  window.addEventListener('voidmusic:mode', function (e) { try { if (e && e.detail && e.detail.open) pingAll(true); } catch (x) {} });
  window.addEventListener('voidmusic:local-play', function () { if (activeId != null) VM.detachWeb({ pauseSite: true }); });
  pingAll();
  window.VoidMusicWeb = {
    sources: sources, pingAll: pingAll, getActive: function () { return activeId; }, isCapturing: function () { return !!capture; },
    /* §1.5 پرچمِ آزمونِ H3 بدونِ ری‌بارگذاریِ افزونه (پایدار نیست: با بارگذاریِ دوبارهٔ صفحه به false برمی‌گردد). */
    setKeepOnNav: function (v) { CAPTURE_KEEP_ON_NAV = !!v; return CAPTURE_KEEP_ON_NAV; },
    /* §1.6 تشخیصِ صادقانه: شمارش‌ها + منبعِ فعال + دلیل/زمانِ تلاشِ بعد + المنتِ انتخاب‌شده + موتورِ تحلیل.
       «connected» یعنی stream گرفته شد؛ اینکه کهکشان داده می‌گیرد فقط از out.viz (fpsRaf/fpsBg/tapsWhy) خوانده می‌شود. */
    getState: function () {
      var now = Date.now();
      var out = {
        detected: 0, playing: 0, connected: 0, unreachable: 0, active: activeId,
        /* §IDLE-AUDIO (پ): چند تبِ بسته هنوز در گور هستند (شاهدِ اینکه پاسخِ دیرهنگام رد می‌شود). */
        dropped: droppedTabs.size,
        consumerTabId: thisTabId, captureTab: capture ? capture.tabId : null,
        hidden: !!document.hidden, keepOnNav: CAPTURE_KEEP_ON_NAV
      };
      var rows = [];
      sources.forEach(function (s) {
        if (s.contact === 'gone') out.unreachable++;
        /* §IDLE-AUDIO: صاحبِ صوتی (اتاقِ بی‌موسیقی) هم «شناسایی‌شده» است؛ همان قاعدهٔ چیپ.
           با IDLE_AUDIO=false هرگز audioOnly نمی‌شود، پس این شرط بی‌اثر است. */
        else if (s.contact === 'live' && (s.st || s.music || s.audioOnly)) out.detected++;
        if (isPlayingSource(s)) out.playing++;
        if (s.audio === 'live') out.connected++;
        rows.push({ tabId: s.tabId, host: s.host, contact: s.contact, audio: s.audio, an: s.an, tries: s.tries, fail: s.fail, retryInMs: Math.max(0, (s.retryAt || 0) - now), playing: isPlayingSource(s), audioOnly: !!s.audioOnly, ageMs: now - s.at });
      });
      out.sources = rows;
      var a = activeId != null ? sources.get(activeId) : null;
      out.activeInfo = a ? {
        tabId: a.tabId, host: a.host, contact: a.contact, audio: a.audio, analysis: a.an, tries: a.tries, fail: a.fail,
        retryInMs: Math.max(0, (a.retryAt || 0) - now), music: !!a.music,
        /* §IDLE-AUDIO: تنها راهِ خواندنِ «صدا هست ولی منبعِ موسیقیِ معتبر نیست» برای موتورِ ویژولایزر.
           اینجا فقط حقیقتِ منبع نوشته می‌شود؛ تصمیمِ بصری در void-music-viz.js گرفته می‌شود. */
        audioOnly: !!a.audioOnly, title: (a.info && a.info.title) || (a.st && a.st.title) || a.host || '',
        el: a.st ? { kind: a.st.elKind, why: a.st.pickWhy, advancing: a.st.pickAdv, count: a.st.elCount, paused: a.st.elPaused, muted: a.st.elMuted, volume: a.st.elVol } : 'no_state_report'
      } : null;
      var d = vizDiagnostics();
      out.viz = d;
      out.analysis = analysisState(a, d);
      return out;
    }
  };
})();
