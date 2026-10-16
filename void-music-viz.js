/* ======================================================================
   Void Tab — Music Mode · ویژولایزر (فاز ۲)

   سه مرحله، با حداقلِ پردازش:
     Stage 0  (مکث/ورود)      هیچ حلقه‌ای نمی‌چرخد؛ بوم پاک است.
     Stage 1  (پخش، آرام)     شفقِ آبی روی یک بافتِ ¼-رزولوشن، ~۲۰fps، فقط آنالیزرِ انرژی.
     Stage 2  (اوج)           کهکشانِ زاویهٔ طلایی + سیاه‌چاله؛ ۳۰fps؛ آنالیزرِ طیف + کروما.

   اصل: «کهکشان را متحرک نمی‌کنیم، روشنش می‌کنیم.» هندسه یک بار ساخته می‌شود
   (typed array → GPU)، و هر فریم فقط ~۴۰ عدد uniform آپلود می‌شود.
   هر نقطه یک LED است: رنگش از «کلاسِ نت»ش (۱۲ کلاس، نمایشِ ۷ خانوادهٔ رنگی)،
   و روشن/خاموش‌شدنش یک hash قطعی از (نقطه، زمانِ گسسته) است. هیچ ذره‌ای ساخته/نابود نمی‌شود.

   تازگیِ بی‌تکرار: هر نشست هندسهٔ تازه (seed تصادفی)، هر آهنگ شیب/فازِ مارپیچ/شفقِ تازه.
   ====================================================================== */
(function () {
  'use strict';
  if (window.VoidMusicViz) return;
  const VM = window.VoidMusic;
  if (!VM) return;

  const TAU = Math.PI * 2;
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));            // ۱۳۷٫۵۰۷۷۶۴°
  const NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const CFG = {
    calmFps: 20, galaxyFps: 30, reducedFps: 12,
    dotsDesktop: 22000, dotsMobile: 8500,
    // حساسیت: انرژیِ نرمال‌شده (۰..۱) نسبت به بازهٔ پویاییِ همین آهنگ؛ sens بزرگ‌تر = زودتر و بیشتر. با HUD (Shift+D) تنظیم کن
    sens: 1.15, enterE: 0.46, enterFluxE: 0.34, enterFluxR: 1.45, exitE: 0.26,
    minGalaxyS: 1.2, exitHoldS: 1.4, enterHoldS: 0.18, cooldownS: 0.6, holeRest: 0.20, holeBase: 0.30,
    powderMinS: 8.0      // پودرِ عنوان: حداقل ۸ ثانیه، و هرگز کمتر از ۱/۲۰ طولِ آهنگ
  };
  const BREATH = {
    cyclesPerTrack: 3, minCycleS: 36, maxCycleS: 65, fallbackTrackS: 180, openPart: 0.60, rollFadeS: 18,
    startPitch: 10, endPitch: 68, startZoom: 0.86, endZoom: 1.0, startRoll: 0.35
  };
  const COSMIC_GROUPS = 24, COSMIC_STARS_PER_GROUP = 6;
  // راه شیری پس‌زمینه + دنباله‌دارها. همهٔ اعدادِ قابل‌تنظیم اینجاست.
  const MW = {
    base: 0.40,                       // نوردهیِ پایه: نوار همیشه کم‌نور حاضر است (هرگز صفر نمی‌شود)
    firstS: 2.0,                      // اولین «نمایان‌شدن» ۲ تا ۴ ثانیه بعد از شروع
    appearS: 8, holdS: 26, fadeS: 12, // مدت‌ها (هرکدام + بخشِ تصادفی کوچک)
    restMin: 48, restRand: 34,        // فاصلهٔ دو نمایان‌شدن (ثانیه)
    starsDesktop: 1500, starsMobile: 600,
    cometGapS: 10, cometGapRand: 12, // فاصلهٔ دو دنباله‌دار؛ بدونِ وابستگی به اوج
    cometStrength: 0.62
  };
  const RTL = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const expK = (dt, tau) => 1 - Math.exp(-dt / tau);
  const smoother5 = (t) => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  // پالت ثابت هفت‌رنگ؛ کلاس‌های نت بعد از رینگ هفتم سفید نگه داشته می‌شوند.
  const RAINBOW_HUES = [0, 30, 56, 125, 218, 248, 282];
  function hsl(h, s, l) {
    h /= 360; const a = s * Math.min(l, 1 - l);
    const f = function (n) { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return [f(0), f(8), f(4)];
  }
  const WARM = [1.0, 0.64, 0.30];   // نارنجیِ گرمِ پایهٔ هاله
  const PAL = new Float32Array(36);
  for (let i = 0; i < 12; i++) {
    const c = i < RAINBOW_HUES.length ? hsl(RAINBOW_HUES[i], 0.78, 0.62) : [0.88, 0.90, 0.96];
    PAL[i * 3] = c[0]; PAL[i * 3 + 1] = c[1]; PAL[i * 3 + 2] = c[2];
  }

  /* ------------------------------------------------------------------ */
  /* صدا: گراف + آنالیز                                                   */
  /* ------------------------------------------------------------------ */
  const A = {
    state: 'none', tries: 0, ctx: null, anE: null, anS: null, gain: null, sr: 48000,
    tBuf: null, fE: null, prevE: null, fS: null, kEHi: 0,
    kLo: 0, kHi: 0, pcIdx: null, pcW: null, bandIdx: null, kC0: 0, kC1: 0,
    raw: new Float32Array(12), band: new Float32Array(12), chroma: new Float32Array(12),
    bright: 0.2, db: -90, base: -60, warm: 4, snap: true, fluxBase: 1e-3, fluxR: 1, prevFluxR: 1, centroidR: 0.4, conf: 0, energy: 0,
    silent: true, lastOnset: -9, ok: false, pk: -30, fl: -50, en: 0, src: null,
    tapped: true, bassAvg: 0, bassPrev: 0, bassBeat: false, lastBass: -9, tAcc: 0, kBass: 1,
    kLowEnd: 4, kMidEnd: 42, low: 0, mid: 0, high: 0
  };

  /* ------------------------------------------------------------------ */
  /* تنظیمات صدا: اکولایزر ۱۰ باند + محدودکننده + حالتِ پس‌زمینه + کیفیتِ تصویر */
  /* ------------------------------------------------------------------ */
  const SND_KEY = 'voidMusic.sound';
  const EQ_HZ = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const EQ_PRESETS = {
    flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bass: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
    treble: [0, 0, 0, 0, 0, 0, 2, 4, 5, 6],
    vocal: [-2, -2, -1, 1, 3, 4, 3, 1, 0, -1],
    rock: [5, 4, 2, -1, -2, -1, 2, 4, 5, 5],
    pop: [-1, 1, 3, 4, 2, 0, -1, -1, 1, 2],
    jazz: [3, 2, 1, 2, -2, -2, 0, 1, 2, 3],
    classical: [3, 2, 1, 1, 0, 0, 0, -1, -2, -3],
    electronic: [5, 4, 1, 0, -2, 2, 1, 1, 4, 5],
    lounge: [-3, -1, 0, 1, 3, 2, 0, -1, 2, 1]
  };
  const SND = { on: true, preset: 'flat', bands: EQ_PRESETS.flat.slice(), pre: 0, auto: true, limiter: true, bg: 'audio', vq: 'auto' };
  function sndSanitize(o) {
    if (!o || typeof o !== 'object') return;
    const num = function (v, d) { v = Number(v); return isFinite(v) ? clamp(Math.round(v * 2) / 2, -12, 12) : d; };
    if ('on' in o) SND.on = !!o.on;
    if ('auto' in o) SND.auto = !!o.auto;
    if ('limiter' in o) SND.limiter = !!o.limiter;
    if ('pre' in o) SND.pre = num(o.pre, 0);
    if (Array.isArray(o.bands) && o.bands.length === 10) {
      SND.bands = o.bands.map(function (v) { return num(v, 0); });
      if (!('preset' in o)) SND.preset = 'custom';
    }
    if ('preset' in o) SND.preset = (o.preset === 'custom' || EQ_PRESETS[o.preset]) ? o.preset : 'custom';
    if (o.bg === 'audio' || o.bg === 'live') SND.bg = o.bg;
    if (o.vq === 'auto' || o.vq === 'low' || o.vq === 'high') SND.vq = o.vq;
  }
  try { const raw = localStorage.getItem(SND_KEY); if (raw) sndSanitize(JSON.parse(raw)); } catch (e) {}
  function sndSave() { try { localStorage.setItem(SND_KEY, JSON.stringify(SND)); } catch (e) {} }

  const SNDE = { nodes: null };
  function buildSoundChain(ctx, src, outGain) {
    const pre = ctx.createGain();
    const filters = EQ_HZ.map(function (hz, i) {
      const f = ctx.createBiquadFilter();
      f.type = i === 0 ? 'lowshelf' : (i === 9 ? 'highshelf' : 'peaking');
      f.frequency.value = hz; if (f.type === 'peaking') f.Q.value = 1.1; f.gain.value = 0;
      return f;
    });
    const comp = ctx.createDynamicsCompressor();
    pre.connect(filters[0]);
    for (let i = 0; i < 9; i++) filters[i].connect(filters[i + 1]);
    filters[9].connect(comp); comp.connect(outGain);
    SNDE.nodes = { ctx: ctx, src: src, pre: pre, filters: filters, comp: comp, out: outGain, mode: '', anV: null, anVon: false, tap: null, vbuf: null };
    applySound(true);
  }
  function retapSpectrum() {
    const N = SNDE.nodes; if (!N || !N.anV) return;
    if (N.tap) { try { N.tap.disconnect(N.anV); } catch (e) {} N.tap = null; }
    if (N.anVon) { N.tap = N.mode === 'fx' ? N.comp : N.src; try { N.tap.connect(N.anV); } catch (e) {} }
  }
  function applySound(immediate) {
    const N = SNDE.nodes; if (!N) return;
    const t = N.ctx.currentTime, tc = immediate ? 0.001 : 0.04;
    const maxUp = Math.max(0, Math.max.apply(null, SND.bands));
    const preDb = SND.on ? SND.pre - (SND.auto ? maxUp * 0.6 : 0) : 0;
    N.pre.gain.setTargetAtTime(Math.pow(10, preDb / 20), t, tc);
    N.filters.forEach(function (f, i) { f.gain.setTargetAtTime(SND.on ? SND.bands[i] : 0, t, tc); });
    const lim = SND.limiter;
    N.comp.threshold.setTargetAtTime(lim ? -3 : 0, t, tc); N.comp.knee.setTargetAtTime(lim ? 6 : 0, t, tc);
    N.comp.ratio.setTargetAtTime(lim ? 20 : 1, t, tc); N.comp.attack.setTargetAtTime(0.003, t, tc); N.comp.release.setTargetAtTime(0.12, t, tc);
    const mode = (SND.on || lim) ? 'fx' : 'bypass';       // هر دو خاموش ⇒ مسیرِ مستقیم (کمترین پردازش)
    if (mode !== N.mode) {
      try { N.src.disconnect(N.pre); } catch (e) {}
      try { N.src.disconnect(N.out); } catch (e) {}
      try { N.src.connect(mode === 'fx' ? N.pre : N.out); } catch (e) {}
      N.mode = mode; retapSpectrum();
    }
  }
  const SPEC_BARS = 32;
  const soundApi = {
    hz: EQ_HZ, presets: EQ_PRESETS,
    get: function () { return { on: SND.on, preset: SND.preset, bands: SND.bands.slice(), pre: SND.pre, auto: SND.auto, limiter: SND.limiter, bg: SND.bg, vq: SND.vq }; },
    set: function (patch) { sndSanitize(patch); sndSave(); applySound(false); try { refreshTaps(); if (document.hidden && SND.bg === 'live') bgKick(); } catch (e) {} },
    preset: function (name) { if (EQ_PRESETS[name]) soundApi.set({ preset: name, bands: EQ_PRESETS[name].slice() }); },
    reset: function () { soundApi.set({ on: true, preset: 'flat', bands: EQ_PRESETS.flat.slice(), pre: 0, auto: true, limiter: true }); },
    ready: function () { return !!SNDE.nodes; },
    // طیفِ زنده برای نمایشگرِ اکولایزر: فقط وقتی پنل باز است تحلیل‌گر وصل می‌شود
    watch: function (on) {
      const N = SNDE.nodes; if (!N) return;
      if (on) {
        if (!N.anV) { N.anV = N.ctx.createAnalyser(); N.anV.fftSize = 1024; N.anV.smoothingTimeConstant = 0.72; N.anV.minDecibels = -88; N.anV.maxDecibels = -20; N.vbuf = new Uint8Array(N.anV.frequencyBinCount); }
        N.anVon = true; retapSpectrum();
      } else if (N.anV) { N.anVon = false; retapSpectrum(); }
    },
    spectrum: function (out) {
      const N = SNDE.nodes; if (!N || !N.anV || !N.anVon) return false;
      N.anV.getByteFrequencyData(N.vbuf);
      const hzPerBin = N.ctx.sampleRate / N.anV.fftSize, M = out.length;
      for (let i = 0; i < M; i++) {
        const f0 = 40 * Math.pow(16000 / 40, i / M), f1 = 40 * Math.pow(16000 / 40, (i + 1) / M);
        const k0 = Math.max(1, Math.floor(f0 / hzPerBin)), k1 = Math.min(N.vbuf.length - 1, Math.max(k0, Math.ceil(f1 / hzPerBin)));
        let m = 0; for (let k = k0; k <= k1; k++) if (N.vbuf[k] > m) m = N.vbuf[k];
        out[i] = m / 255;
      }
      return true;
    }
  };

  async function ensureGraph() {
    if (A.ok) { if (A.ctx.state !== 'running') { try { await A.ctx.resume(); } catch (e) {} } return true; }
    if (A.tries >= 6) return false;
    const audio = VM.getAudio();
    if (!audio) return false;
    A.tries++;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      let ctx = A.ctxTry && A.ctxTry.state !== 'closed' ? A.ctxTry : new AC({ latencyHint: 'playback' });
      A.ctxTry = ctx;
      try { await ctx.resume(); } catch (e) {}
      // اگر context اجرا نشد، المنتِ صدا را «نمی‌دزدیم» تا پخش بی‌صدا نشود؛ دفعهٔ بعد (با یک کلیکِ دیگر) دوباره امتحان می‌شود
      if (ctx.state !== 'running') return false;
      const src = A.src || (A.src = ctx.createMediaElementSource(audio));      // نبایدِ دوبار ساخته شود
      const anE = ctx.createAnalyser(); anE.fftSize = 1024; anE.smoothingTimeConstant = 0;
      const anS = ctx.createAnalyser(); anS.fftSize = 4096; anS.smoothingTimeConstant = 0.3; anS.minDecibels = -110; anS.maxDecibels = -10;
      const gain = ctx.createGain();
      src.connect(anE); src.connect(anS);
      buildSoundChain(ctx, src, gain); gain.connect(ctx.destination);
      VM.setOutputGain(gain);
      // پایداری: اگر مرورگر context را وسطِ پخش معلق کرد (سیاست‌های خودکار/سیستم)، صدا قطع می‌شود؛ بلافاصله ادامه بده
      ctx.onstatechange = function () {
        const a = VM.getAudio();
        if (ctx.state !== 'running' && a && !a.paused) { try { ctx.resume(); } catch (e) {} }
      };
      A.tapped = true;
      A.ctx = ctx; A.anE = anE; A.anS = anS; A.gain = gain; A.sr = ctx.sampleRate;
      A.tBuf = new Float32Array(anE.fftSize);
      A.fE = new Float32Array(anE.frequencyBinCount); A.prevE = new Float32Array(anE.frequencyBinCount);
      A.fS = new Float32Array(anS.frequencyBinCount);
      A.kEHi = Math.min(A.fE.length - 1, Math.floor(9000 / (A.sr / anE.fftSize)));
      const eBinHz = A.sr / anE.fftSize;
      A.kLowEnd = clamp(Math.floor(180 / eBinHz), 1, A.kEHi);
      A.kMidEnd = clamp(Math.floor(2000 / eBinHz), A.kLowEnd + 1, A.kEHi);
      A.kBass = Math.max(1, Math.floor(150 / (A.sr / anE.fftSize)));              // باندِ باس ۲۰–۱۵۰Hz (۳ bin در ۴۸kHz)
      // جدولِ bin → کلاسِ نت (وزنِ مثلثی: ۱ روی نیم‌پردهٔ دقیق، ۰ در وسطِ دو نیم‌پرده)
      const binHz = A.sr / anS.fftSize;
      A.kLo = Math.ceil(130 / binHz); A.kHi = Math.min(A.fS.length - 2, Math.floor(4200 / binHz));
      A.kC0 = Math.ceil(110 / binHz); A.kC1 = Math.min(A.fS.length - 2, Math.floor(9000 / binHz));
      A.pcIdx = new Uint8Array(A.fS.length); A.pcW = new Float32Array(A.fS.length); A.bandIdx = new Uint8Array(A.fS.length);
      for (let k = 1; k < A.fS.length; k++) {
        const f = k * binHz;
        const midi = 69 + 12 * Math.log2(f / 440), n = Math.round(midi);
        A.pcIdx[k] = ((n % 12) + 12) % 12;
        A.pcW[k] = Math.max(0, 1 - Math.abs(midi - n) * 2);
        A.bandIdx[k] = clamp(Math.floor(Math.log(f / 110) / Math.log(9000 / 110) * 12), 0, 11);
      }
      A.ok = true; A.state = 'ok'; A.tries = 0;
      return true;
    } catch (e) { A.state = 'failed'; return false; }
  }

  function tapSet(on) {
    if (!A.ok || A.tapped === on) return;
    try { if (on) { A.src.connect(A.anE); A.src.connect(A.anS); } else { A.src.disconnect(A.anE); A.src.disconnect(A.anS); } A.tapped = on; } catch (e) {}
  }
  function tapsWanted() {
    const a = VM.getAudio();
    if (!(a && !a.paused)) return false;
    if (document.hidden && SND.bg !== 'live') return false;     // تبِ پنهان: فقط صدا (تحلیلگرها جدا می‌شوند)
    return VM.isOpen() || !!(VM.isMiniVisible && VM.isMiniVisible() && !document.hidden) || !!(VM.remoteWanted && VM.remoteWanted());
  }
  function refreshTaps() { tapSet(tapsWanted()); }
  setInterval(function () { if (A.ok) refreshTaps(); }, 3000);

  function spectralLevel(power, count, floorDb, ceilingDb) {
    const db = 10 * Math.log10(power / Math.max(1, count) + 1e-12);
    const x = clamp((db - floorDb) / (ceilingDb - floorDb), 0, 1);
    return x * x * (3 - 2 * x);
  }

  // یک بار در هر فریمِ رندر: انرژی/فلاکس (همیشه) + طیف/کروما (فقط وقتی کهکشان دیده می‌شود)
  function analyze(dt, needSpec) {
    const E = A.anE;
    E.getFloatTimeDomainData(A.tBuf);
    let ss = 0; const tb = A.tBuf, n = tb.length;
    for (let i = 0; i < n; i++) ss += tb[i] * tb[i];
    const db = 20 * Math.log10(Math.sqrt(ss / n) + 1e-7);
    if (A.snap && db > -80) { A.db = db; A.base = db; A.snap = false; A.fluxBase = 1e-3; A.warm = 1.5; A.pk = db + 3; A.fl = db - 3; }
    A.db += (db - A.db) * expK(dt, 0.12);

    E.getFloatFrequencyData(A.fE);
    let flux = 0, hi = 0, all = 0;
    let lowPower = 0, midPower = 0, highPower = 0, lowCount = 0, midCount = 0, highCount = 0;
    const k2k = Math.floor(2000 / (A.sr / A.anE.fftSize));
    for (let k = 1; k <= A.kEHi; k++) {
      const m = Math.exp(A.fE[k] * 0.11512925), p = Math.exp(A.prevE[k] * 0.11512925);
      if (k >= 2) {
        if (m > p) flux += m - p;
        all += m; if (k >= k2k) hi += m;
      }
      if (k <= A.kLowEnd) { lowPower += m * m; lowCount++; }
      else if (k <= A.kMidEnd) { midPower += m * m; midCount++; }
      else { highPower += m * m; highCount++; }
    }
    A.bright += ((all > 0 ? hi / all : 0) - A.bright) * expK(dt, 0.5);
    A.prevE.set(A.fE);
    // ضربانِ باس: انرژیِ باندِ ۲۰–۱۵۰Hz در برابرِ میانگینِ متحرکِ خودش (EMA)؛ برای کیک‌ها دقیق‌تر از فلاکسِ پهن‌باند
    A.tAcc += dt;
    let bs = 0; for (let k = 1; k <= A.kBass; k++) bs += Math.exp(A.fE[k] * 0.11512925);
    bs /= A.kBass;
    A.bassBeat = false;
    if (!A.snap && bs > A.bassAvg * 1.45 + 1e-5 && bs > A.bassPrev * 1.05 && A.tAcc - A.lastBass > 0.28) { A.bassBeat = true; A.lastBass = A.tAcc; }
    A.bassAvg += (bs - A.bassAvg) * expK(dt, 1.2); A.bassPrev = bs;
    A.fluxBase += (flux - A.fluxBase) * expK(dt, 4);
    A.prevFluxR = A.fluxR;
    A.fluxR += (flux / (A.fluxBase + 1e-5) - A.fluxR) * expK(dt, 0.1);

    A.silent = A.db < -66;
    // خطِ پایهٔ کندِ «بلندیِ همین آهنگ»: بالا رفتنش آهسته، پایین آمدنش سریع‌تر
    let tau = A.db > A.base ? 30 : 10;
    if (A.warm > 0) { A.warm -= dt; tau = 1.2; }
    if (!A.silent) A.base += (A.db - A.base) * expK(dt, tau);
    // پاکت‌های قله/کفِ «همین آهنگ» (حمله سریع، رها شدن بسیار کند) → انرژی نسبت به بازهٔ پویاییِ خودِ آهنگ؛
    // آهنگ‌های فشرده/ملایم هم دامنهٔ کامل را می‌بینند (حداقل بازهٔ ۶dB تا نویز بزرگ نشود)
    if (!A.silent) {
      A.pk += (A.db - A.pk) * expK(dt, A.db > A.pk ? 0.25 : 25);
      A.fl += (A.db - A.fl) * expK(dt, A.db < A.fl ? 0.25 : 25);
    }
    const dr = Math.max(6, A.pk - A.fl);
    // نسبت به «وسطِ بازهٔ پویاییِ همین آهنگ»: آهنگِ یکنواخت ≈۰٫۵؛ اوج‌ها بالاتر، بخش‌های آرام پایین‌تر
    A.en = A.silent ? 0 : clamp(0.5 + (A.db - (A.pk + A.fl) / 2) / dr, 0, 1);
    const abs = clamp((A.db + 42) / 24, 0, 1);                       // بلندیِ مطلق: ‑۴۲dBFS→۰ ، ‑۱۸dBFS→۱
    // صداهای ضعیف (abs کم) → شفق جلو؛ صداهای قوی → کهکشان. آهنگِ بلندِ یکنواخت هم همیشه به کهکشان می‌رسد
    A.energy = A.silent ? 0 : clamp(Math.max(A.en * (0.5 + 0.65 * abs), abs * 0.8) * CFG.sens, 0, 1);

    // Three smoothed spectral layers share the existing analyser pass: bass → core,
    // mids → disk density waves, highs → sparse stellar glints.
    const lowTarget = A.silent ? 0 : spectralLevel(lowPower, lowCount, -72, -30);
    const midTarget = A.silent ? 0 : spectralLevel(midPower, midCount, -68, -28);
    const highTarget = A.silent ? 0 : spectralLevel(highPower, highCount, -78, -38);
    A.low += (lowTarget - A.low) * expK(dt, lowTarget > A.low ? 0.18 : 0.72);
    A.mid += (midTarget - A.mid) * expK(dt, midTarget > A.mid ? 0.20 : 0.78);
    A.high += (highTarget - A.high) * expK(dt, highTarget > A.high ? 0.12 : 0.62);

    if (!needSpec) return;
    const S = A.fS; A.anS.getFloatFrequencyData(S);
    // قله‌یابیِ کروما
    let mx = -200;
    for (let k = A.kLo; k <= A.kHi; k++) if (S[k] > mx) mx = S[k];
    const raw = A.raw; raw.fill(0);
    const thr = mx - 38;
    for (let k = A.kLo; k <= A.kHi; k++) {
      const v = S[k];
      if (v < thr || !(v >= S[k - 1] && v > S[k + 1])) continue;
      raw[A.pcIdx[k]] += Math.exp(v * 0.11512925) * A.pcW[k];
    }
    let rmax = 0, rsum = 0;
    for (let i = 0; i < 12; i++) { if (raw[i] > rmax) rmax = raw[i]; rsum += raw[i]; }
    // اطمینانِ کروما: نویز/ضرب (تخت) → ۰ ؛ نتِ مشخص → ۱
    const share = rsum > 0 ? rmax / rsum : 0;
    const conf = A.silent ? 0 : clamp((share - 0.14) / 0.3, 0, 1);
    A.conf += (conf - A.conf) * expK(dt, 0.25);
    // سنتروید + باندهای لگاریتمی (جایگزینِ صادقانه وقتی کروما قابل‌اعتماد نیست)
    const band = A.band; band.fill(0);
    let cNum = 0, cDen = 0; const binHz = A.sr / A.anS.fftSize;
    for (let k = A.kC0; k <= A.kC1; k++) {
      const m = Math.exp(S[k] * 0.11512925);
      band[A.bandIdx[k]] += m; cNum += k * binHz * m; cDen += m;
    }
    let bmax = 0; for (let i = 0; i < 12; i++) if (band[i] > bmax) bmax = band[i];
    if (cDen > 0 && !A.silent) {
      const c = cNum / cDen, r = clamp(Math.log2(c / 150) / Math.log2(6000 / 150), 0, 1);
      A.centroidR += ((0.12 + 0.68 * r) - A.centroidR) * expK(dt, 0.4);
    }
    const gate = A.silent ? 0 : 1;
    for (let i = 0; i < 12; i++) {
      const cN = rmax > 0 ? raw[i] / rmax : 0;
      const bN = bmax > 0 ? band[i] / bmax : 0;
      const target = gate * Math.pow(A.conf * cN + (1 - A.conf) * bN * 0.8, 1.5);
      const cur = A.chroma[i];
      A.chroma[i] = cur + (target - cur) * expK(dt, target > cur ? 0.08 : 0.22);
    }
  }

  /* ------------------------------------------------------------------ */
  /* وضعیتِ ویژولایزر                                                     */
  /* ------------------------------------------------------------------ */
  const V = {
    canvas: null, gl: null, ok: false, dead: false, raf: 0, running: false, last: 0,
    playing: false, stage: 'calm', stageT: 0, hiT: 0, loT: 0, calmT: 0, cool: 0, tPlay: 0,
    L: { aurora: 0, galaxy: 0, lum: 0.4 },
    phase: 0, pulse: { t0: -9, amp: 0 }, tick: 0, tickAcc: 0, time: 0,
    tilt: 0, tiltT: 0, spiralPh: 0, spiralPhT: 0, structure: 0, seed3: [0.3, 0.6, 0.1], track: 0,
    bandIn: new Float32Array(12), bandOut: new Float32Array(12), auroraStart: 0, auroraN: 0, noteC: [0.6, 0.7, 1.0],
    cpuMs: 0, haloT: 0, flare: 0, tintC: [1.0, 0.86, 0.60], grace: 0, synE: 0.5,
    q: 1, slowN: 0, fastN: 0, rich: 0.8,
    rs: 1, W: 0, H: 0, vw: 0, vh: 0, cx: 0, cy: 0, scale: 1, incl: 24, N: 0,
    breath: { mix: 0, pitch: 50, zoom: 1, disk: 0, ready: false },
    opening: { started: false, elapsed: 0, progress: 0, cycleS: 60 },
    cosmic: {
      rng: null, nextCometAt: 0, lastPeakAt: -100, peakCandidateUntil: -100, prevEnergy: 0,
      wakeStart: -100, wakeUntil: -100, wakeTier: 0, wakeStrength: 0, glow: 0,
      infallTail: 0.22,
      slotStart: new Float32Array(3).fill(-100), slotDur: new Float32Array(3).fill(14),
      slotAngle: new Float32Array(3), slotRadius: new Float32Array(3), slotStrength: new Float32Array(3),
      infallUniforms: new Float32Array(12),
      reveal: new Float32Array(COSMIC_GROUPS),
      groupDelay: new Float32Array(COSMIC_GROUPS), sessionActive: false, sessionCount: 0, activeElapsed: 0,
      revelationStart: 0, revelationAppear: 8, revelationHold: 26, revelationFade: 12, revelationRest: 60,
      revelationAmount: 0, revelationSeed: 0, revelationEnergy: 0,
      bandAngle: 0.4, bandOffset: 0.25, bandBulge: 0.3, bandWidth: 0.19, bandDirty: true, nextBloomAt: 0
    },
    session: (crypto.getRandomValues(new Uint32Array(1))[0] || 1),
    powder: { on: false, appear: 0, prog: 0, key: '', n: 0, buf: null, vao: null, box: [0, 1] },
    entrance: { pending: false, active: false, elapsed: 0, duration: 1.02, handoff: 0.28, generation: 0, id: null },
    hud: null, hudOn: false, hudT: 0, frames: 0, fps: 0, fpsT: 0, tint: [1, 0.9, 0.7]
  };
  let G = null;   // منابعِ GL

  /* ---------- GL ---------- */
  const VS_TRI = `#version 300 es
void main(){ vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;

  const FS_AURORA = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uLevel; uniform vec3 uSeed; uniform vec3 uTint;
uniform vec2 uHole; uniform float uAsp, uBend; uniform vec4 uInfall[3]; uniform float uInfallTail, uHorizon;
uniform vec4 uBand; uniform vec4 uBandP; uniform float uBandLow; uniform vec4 uBloom[3];
out vec4 o;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++){ s += a * vn(p); p = p * 2.02 + 7.1; a *= 0.5; } return s; }
float fbm5(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * vn(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }
void main(){
  vec2 uv0 = gl_FragCoord.xy / uRes;
  // Keep a restrained lensing distortion, but leave visible ring structure to the 3D particles.
  vec2 q = (uv0 - uHole) * vec2(uAsp, 1.0);
  float r = length(q);
  float pull = uBend * 0.016 / (r * r + 0.020);
  float sw = uBend * 0.55 / (1.0 + 9.0 * r * r);
  float cs = cos(sw), sn = sin(sw);
  vec2 qd = q - (q / max(r, 0.001)) * pull;
  qd = vec2(cs * qd.x - sn * qd.y, sn * qd.x + cs * qd.y);
  float t = uTime * 0.012;
  float n0 = fbm(qd * 10.0 + uSeed.xy * 13.0 + vec2(t * 0.36, -t * 0.24));
  float n1 = fbm(qd * 5.0 + uSeed.yz * 7.0 - vec2(t * 0.15, t * 0.11));
  float cloud = exp(-r * 2.4) * smoothstep(0.045, 0.17, r) * smoothstep(0.24, 0.54, n0 * 0.65 + n1 * 0.35);
  cloud *= uLevel * uBend * 0.055;
  vec2 metric = vec2(uAsp, 1.0);
  float spiralLight = 0.0;
  float spiralR = length(q);
  float spiralAngle = atan(q.y, q.x);
  float horizonRadius = max(uHorizon, 0.001);
  for (int i = 0; i < 3; i++) {
    vec4 infall = uInfall[i];
    if (infall.x >= 0.0 && infall.w > 0.001) {
      float pathProgress = clamp((infall.z - spiralR) / max(infall.z - horizonRadius, 0.001), 0.0, 1.0);
      float pathAngle = infall.y + 6.28318 * 1.12 * pathProgress + 0.42 * sin(pathProgress * 3.14159);
      float angleDelta = abs(mod(spiralAngle - pathAngle + 3.14159, 6.28318) - 3.14159);
      float crossTrack = angleDelta * max(spiralR, 0.01);
      float width = max(0.0018 + 0.0012 * pathProgress, 1.1 / uRes.y);   // هرگز باریک‌تر از ~۱ پیکسلِ بافتِ ¼-رزولوشن (وگرنه کم‌رنگ و ناپایدار می‌شد)
      float tailAge = infall.x - pathProgress;
      float tailLength = uInfallTail * (1.0 - 0.58 * infall.x);
      float tail = smoothstep(0.0, 0.035, tailAge) * (1.0 - smoothstep(tailLength - 0.035, tailLength, tailAge));
      float headWidth = mix(0.018, 0.030, smoothstep(0.65, 0.92, infall.x));
      float head = exp(-pow(tailAge / headWidth, 2.0));
      float track = exp(-pow(crossTrack / width, 2.0)) * step(-0.03, tailAge);
      float approachFade = 1.0 - smoothstep(0.76, 1.0, infall.x);
      spiralLight += (0.20 * tail + 0.66 * head) * track * smoothstep(0.0, 0.10, infall.x) * approachFade * infall.w;
    }
  }
  vec3 infallColor = mix(vec3(0.76, 0.86, 1.0), uTint, 0.10);
  vec3 distantGalaxy = vec3(0.0);
  float bandDens = 0.0;
  if (uBandP.x > 0.001) {
    // راه شیری: نواری مورب با برآمدگی گرم، شیارِ تاریکِ غبار و ابرهای ستاره‌ای (نه مارپیچِ روبه‌رو)
    vec2 rel = uv0 * metric - 0.5 * metric;
    vec2 dir = vec2(cos(uBand.x), sin(uBand.x));
    vec2 nrm = vec2(-dir.y, dir.x);
    float s = dot(rel, dir);
    float d0 = dot(rel, nrm) - uBand.y;
    float w = uBand.w;
    float sd = uBandP.y * 41.0;
    float tb = uTime * 0.0016;
    float d = d0 + (fbm(vec2(s * 1.6 + sd, 3.7)) - 0.5) * 0.55 * w + (fbm5(vec2(s * 4.0 + sd, d0 * 3.0 + 5.0)) - 0.5) * 0.30 * w;
    float core = exp(-pow(d / w, 2.0));
    float halo = exp(-abs(d) / (w * 2.4)) * 0.22;
    float bulge = exp(-pow((s - uBand.z) / 0.34, 2.0));
    float bulgeW = exp(-pow(d / (w * 1.25), 2.0));
    float clouds = fbm5(vec2(s * 5.0 + tb, d * 10.0) + sd);
    float fine = fbm5(vec2(s * 17.0, d * 34.0) + sd * 1.7);
    float dens = (core * (0.50 + 0.95 * clouds) + halo * (0.60 + 0.80 * clouds)) * (0.62 + 0.55 * fine);
    dens += bulge * bulgeW * 0.85 * (0.70 + 0.50 * clouds);
    // شیارِ بزرگِ غبار (Great Rift): باریک، کمی خارج از مرکز، با لکه‌های غبارِ پراکنده
    float laneC = (fbm(vec2(s * 2.3, 1.9) + sd * 0.3) - 0.5) * 0.70 * w;
    float lane = exp(-pow((d - laneC - 0.10 * w) / (0.20 * w), 2.0));
    float dpatch = smoothstep(0.38, 0.70, fbm5(vec2(s * 6.0 + tb, d * 14.0) + sd * 2.3));
    float dust = clamp(lane * (0.55 + 0.75 * dpatch) + 0.40 * dpatch * core, 0.0, 1.0);
    dens *= 1.0 - 0.80 * dust * (1.0 - 0.35 * bulge);
    // کنتراستِ موضعی هم‌گام با اوج‌ها: ابرها روشن‌تر، غبار عمیق‌تر (تنها در بخشی از افق)
    float loc = 0.0;
    for (int bi = 0; bi < 3; bi++) loc += uBloom[bi].z * exp(-pow((s - uBloom[bi].x) / max(uBloom[bi].y, 0.05), 2.0));
    loc = clamp(loc, 0.0, 1.4);
    dens *= (1.0 + 1.5 * loc * smoothstep(0.25, 0.85, clouds)) * (1.0 - 0.45 * loc * dust);
    bandDens = clamp(dens * 0.6, 0.0, 1.0);
    // رنگ: مرکزِ کهربایی، حاشیهٔ آبی-سفید؛ موسیقیِ روشن‌تر کمی سردتر، گرم و کم‌فرکانس گرم‌تر
    float warmMix = clamp(0.10 + 0.85 * bulge * bulgeW + 0.30 * (1.0 - uBandP.w), 0.0, 1.0);
    vec3 col = mix(vec3(0.50, 0.66, 1.0), vec3(1.0, 0.76, 0.50), warmMix);
    col = mix(col, uTint, 0.08);
    float expo = uBandP.x * (0.86 + 0.26 * uBandP.z) * (1.0 + 0.22 * uBandLow * bulge) * (1.0 + 0.35 * loc);
    float dimNear = 1.0 - 0.50 * exp(-pow(r / 0.30, 2.0));          // کنتراستِ سیاه‌چالهٔ مرکزی حفظ می‌شود
    vec3 lum = col * dens * expo * 0.48 * dimNear;
    distantGalaxy = lum / (1.0 + 0.9 * lum);
  }
  vec3 ambient = mix(vec3(0.10, 0.62, 0.94), uTint, 0.14) * cloud + infallColor * spiralLight + distantGalaxy;
  ambient *= smoothstep(0.05, 0.22, uv0.y) * (1.0 - smoothstep(0.78, 0.95, uv0.y));   // لبهٔ بالا و پایینِ تصویر سیاه
  o = vec4(pow(max(ambient, 0.0), vec3(0.92)), bandDens);   // آلفا = چگالیِ نوار (فقط برای ستاره‌های نوار؛ blit آن را صفر می‌کند)
}`;

  /* ستاره‌هایی که از بازوها جدا می‌شوند: مارپیچِ طلاییِ کم‌عمر. همه‌چیز روی GPU از زمان محاسبه می‌شود (بدون به‌روزرسانیِ بافر) */
  const VS_EJECTA = `#version 300 es
precision highp float;
in vec4 aA; in vec4 aB;
uniform vec2 uView; uniform vec2 uCenter;
uniform float uScale, uSin, uTilt, uTime, uRate, uPx, uPhase, uTh0, uK, uArms;
out float vA; out float vW;
float h1(float x){ return fract(sin(x * 127.1 + 311.7) * 43758.5453); }
void main(){
  float t = uTime - aA.w;
  float cyc = floor(t / aA.z);
  float age = t - cyc * aA.z;
  float life = aA.z * 0.72;
  float hv = h1(cyc * 7.31 + aB.x * 91.7);
  float gate = smoothstep(hv, hv + 0.14, uRate);
  if (cyc < 0.0 || age > life || gate < 0.01) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; vW = 0.0; gl_PointSize = 1.0; return; }
  float u = age / life;
  float arm = floor(h1(cyc * 3.17 + aB.x * 17.0) * uArms);
  float r = aA.x * (0.94 + 0.12 * h1(cyc + aB.x * 5.0)) + aB.y * pow(u, 1.25);
  float scatter = (h1(cyc * 1.91 + aB.x * 29.0) - 0.5) * 0.30;
  float th = uTh0 + arm * 6.2831853 / uArms + uK * log(r / 0.19) + scatter;
  th -= uPhase * (0.10 * pow(r + 0.05, -1.5) + 1.53);
  float side = sin(th);
  vec2 p = vec2(r * cos(th), r * side * uSin);
  float c = cos(uTilt), s = sin(uTilt);
  p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  vec2 px = uCenter + p * uScale;
  gl_Position = vec4(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0, 0.0, 1.0);
  float env = pow(sin(3.14159265 * u), 1.3);
  vA = env * gate * 0.85; vW = u;
  gl_PointSize = clamp(aB.z * (0.8 + 0.5 * env) * uPx, 1.0, 7.0);
}`;
  const FS_EJECTA = `#version 300 es
precision mediump float;
in float vA; in float vW;
out vec4 o;
void main(){
  vec2 d = gl_PointCoord - 0.5; float q = dot(d, d) * 4.0;
  if (q > 1.0) discard;
  float a = exp(-q * 3.0) + 0.25 * exp(-q * 1.1);
  vec3 col = mix(vec3(1.0, 0.78, 0.40), vec3(1.0, 0.93, 0.78), vW);
  o = vec4(col * a * vA, 0.0);
}`;
  const EJ = { M: 180, data: null };
  function buildEjecta() {
    const rnd = mulberry32((V.session ^ 0xE1EC7A) >>> 0), d = new Float32Array(EJ.M * 8);
    for (let i = 0; i < EJ.M; i++) {
      const o = i * 8, per = 5.5 + rnd() * 4.5;
      d[o] = 0.20 + 0.52 * Math.pow(rnd(), 1.35); d[o + 1] = rnd(); d[o + 2] = per; d[o + 3] = rnd() * per;
      d[o + 4] = rnd(); d[o + 5] = 0.16 + 0.22 * rnd(); d[o + 6] = 1.4 + 1.8 * rnd(); d[o + 7] = 0;
    }
    return d;
  }
  V.ejRate = 0; V.ejBurst = 0;

  /* دنباله‌دارها: روبانِ نرم در فضای صفحه (نه رسمِ پیکسل‌به‌پیکسل در بافتِ ¼-رزولوشن) + سرِ درخشان/ستاره‌ای */
  const VS_COMET = `#version 300 es
precision highp float;
in vec2 aPos; in vec2 aUV; in vec2 aKA; in vec3 aCol;
uniform vec2 uView;
out vec2 vUV; out float vA; out float vK; out vec3 vC;
void main(){
  gl_Position = vec4(aPos.x / uView.x * 2.0 - 1.0, 1.0 - aPos.y / uView.y * 2.0, 0.0, 1.0);
  vUV = aUV; vA = aKA.y; vK = aKA.x; vC = aCol;
}`;
  const FS_COMET = `#version 300 es
precision mediump float;
in vec2 vUV; in float vA; in float vK; in vec3 vC;
out vec4 o;
void main(){
  float r2 = dot(vUV, vUV);
  float I;
  if (vK < 0.5) { I = exp(-vUV.x * vUV.x * 4.2); }
  else if (vK < 1.5) { I = exp(-r2 * 5.0) + 0.10 * exp(-r2 * 1.4); }
  else if (vK > 2.5) { I = 0.80 * exp(-r2 * 3.0) + 0.50 * exp(-r2 * 14.0); }   // هات‌اسپاتِ مرکزی
  else {
    float ax = abs(vUV.x), ay = abs(vUV.y);
    float core = exp(-r2 * 10.0);
    float spikes = exp(-ax * 20.0) * exp(-ay * 2.4) + exp(-ay * 20.0) * exp(-ax * 2.4);
    I = core + 0.45 * spikes + 0.08 * exp(-r2 * 1.8);
  }
  float edge = (vK < 0.5) ? 1.0 : (1.0 - smoothstep(0.72, 1.0, max(abs(vUV.x), abs(vUV.y))));
  vec3 col = mix(vC, vec3(1.0), clamp(0.35 * I * I, 0.0, 0.4));
  o = vec4(col * I * edge * vA, 0.0);
}`;

  const VS_COSMIC_DOTS = `#version 300 es
precision highp float;
in vec4 aCosmic; // normalized x/y, seed, cluster index (-1 = quiet baseline, -2 = Milky Way band star)
uniform vec2 uView; uniform float uPx, uTime, uLevel, uGlow, uAspect; uniform float uReveal[24]; uniform vec3 uPrimary;
uniform sampler2D uBandTex; uniform float uBandAmt, uBandHigh;
out vec3 vColor; out float vAlpha;
void main(){
  float group = floor(aCosmic.w + 0.5);
  bool bandStar = group < -1.5;
  float wake = 0.10;
  if (group >= -0.5) wake = uReveal[int(clamp(group, 0.0, 23.0))];
  float phase = aCosmic.z * 91.7;
  float twinkle = 0.94 + 0.06 * sin(uTime * 0.17 + phase);
  float tint = step(0.82, fract(aCosmic.z * 13.17));
  vColor = mix(vec3(0.74, 0.84, 1.0), vec3(1.0, 0.88, 0.70), tint * 0.22);
  vAlpha = wake * uLevel * (group < -0.5 ? 0.10 + 0.10 * uGlow : 0.40) * twinkle;
  float size = group < -0.5 ? 1.05 : 1.15 + fract(aCosmic.z * 7.31) * 1.25;
  vec2 p = aCosmic.xy * uView;
  vec2 screenMetric = vec2(aCosmic.x * uAspect, 1.0 - aCosmic.y);
  vec2 primaryMetric = vec2(uPrimary.x * uAspect, uPrimary.y);
  float pd = distance(screenMetric, primaryMetric) / max(uPrimary.z, 0.001);
  if (bandStar) {
    // ستاره‌های نوار: چگالی/شیارِ غبار از آلفای بافتِ شفق خوانده می‌شود، پس همیشه با ابرهای نوار هم‌خوان‌اند
    float mag = fract(aCosmic.z * 7.31);
    float dn = textureLod(uBandTex, vec2(aCosmic.x, 1.0 - aCosmic.y), 0.0).a;
    float tw = 0.82 + 0.18 * sin(uTime * (0.25 + mag * 0.9) + phase);
    float spark = 1.0 + uBandHigh * 0.9 * step(0.86, fract(aCosmic.z * 17.3));
    float warm = step(0.7, fract(aCosmic.z * 5.13));
    vColor = mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.84, 0.62), warm * 0.55);
    vAlpha = uBandAmt * smoothstep(0.05, 0.34, dn) * (0.14 + 0.86 * mag * mag) * tw * spark
           * smoothstep(0.10, 0.45, pd) * (0.55 + 0.45 * smoothstep(0.45, 1.0, pd));
    size = 1.0 + 1.7 * mag * mag * mag;
  } else if (pd < 1.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vAlpha = 0.0; gl_PointSize = 1.0; return; }
  gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
  float ym = 1.0 - aCosmic.y;
  vAlpha *= smoothstep(0.05, 0.22, ym) * (1.0 - smoothstep(0.78, 0.95, ym));   // ستاره‌ها هم در لبهٔ بالا/پایین محو می‌شوند
  gl_PointSize = clamp(size * uPx, 1.0, 3.0);
}`;

  const FS_COSMIC_DOTS = `#version 300 es
precision mediump float;
in vec3 vColor; in float vAlpha; out vec4 o;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  float core = exp(-r * 5.0);
  float edge = 1.0 - smoothstep(0.55, 1.0, r);
  float glow = core * edge;
  o = vec4(vColor * vAlpha * glow, 0.0);
}`;

  const FS_BLIT = `#version 300 es
precision mediump float;
uniform sampler2D uTex; uniform vec2 uRes; uniform float uMix;
out vec4 o;
void main(){ vec2 uv = gl_FragCoord.xy / uRes; o = vec4(texture(uTex, uv).rgb * uMix, 0.0); }`;

  const VS_DOTS = `#version 300 es
precision highp float;
in vec2 aPolar;   // r, theta0
in vec4 aMisc;    // seed, size, band (0..11 = pitch class, 12 = inner dust, 13 = outer dust), tier
in float aU;      // position inside its band, 0..1
uniform vec2 uView; uniform vec2 uCenter; uniform float uScale, uSin, uTilt, uPx, uHalf, uDiskBreath, uHoleR;
uniform float uPhase, uReveal, uLum, uTime, uPulseR, uPulseA, uConf, uDim, uMid, uHigh, uStructure;
uniform float uChroma[12]; uniform vec3 uPal[12]; uniform float uTint[12];   // uTint: «لمسِ رنگ» هر لایه (۰ = سفید، ۱ = رنگِ کاملِ نت)
uniform sampler2D uAur; uniform float uAurMix;
out vec4 vCol;
out vec3 vDiskView;
out float vPointDiameter;
out float vHalo;
void main(){
  float seed = aMisc.x, band = aMisc.z;
  bool ring = band < 11.5;
  float baseR = aPolar.x;
  float r = baseR * (ring ? 1.0 + uDiskBreath * (0.78 + 0.22 * aU) : 1.0);
  float omega = 0.10 * pow(baseR + 0.05, -1.5) + 1.53;   // تقریباً دورانِ الگو (بازوها نپیچند)، با کمی تفاضل
  float armWave = sin(aU * 6.28318 * 2.0 - uTime * 0.035 + uStructure * 2.0 + seed * 0.9);
  float th = aPolar.y - uPhase * omega + (ring ?     // پادساعت‌گرد روی صفحه: زاویه با زمان کم می‌شود
   armWave * (0.026 * uMid + 0.018 * uStructure) : 0.0);
  float side = sin(th);
  // نیمهٔ دورِ حلقه‌ها پشتِ کره، نیمهٔ نزدیک جلوی آن رسم می‌شود (دو پاس)
  if (band > 13.5 || ((uHalf < 0.5) != (side < 0.0))) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec4(0.0); vDiskView = vec3(0.0); vPointDiameter = 0.0; gl_PointSize = 1.0; return; }
  vec2 p = vec2(r * cos(th), r * side * uSin);
  float c = cos(uTilt), s = sin(uTilt);
  p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  // Orthographic view of the inclined disk: screen Y is compressed by sin(i),
  // while the omitted camera-depth coordinate is the complementary cos(i).
  float depth = r * side * sqrt(max(0.0, 1.0 - uSin * uSin));
  vDiskView = vec3(p, depth);
  int ib = int(clamp(band, 0.0, 11.0) + 0.5);
  float e = ring ? uChroma[ib] : 0.0;
  // رنگِ پیش‌فرض: خاکستری‌های روشن و تیره (هر ذره درخششِ خودش را دارد)؛ نزدیکِ افق کمی گرم، دورتر سردتر؛ پرنورها هاله دارند
  float gS = 0.40 + 0.26 * pow(seed, 2.2);                    // مرحلهٔ اول: خاکستریِ کم‌کنتراست و یکنواخت‌تر (دامنهٔ ۰٫۴۰…۰٫۶۶)
  float warmK = 1.0 - smoothstep(0.16, 0.62, baseR);
  vec3 neutral = gS * mix(vec3(0.84, 0.89, 1.0), vec3(1.0, 0.90, 0.76), 0.62 * warmK);
  // مرحلهٔ دوم: لایه‌ای که لمسِ رنگ می‌گیرد (tA) ارزشِ بصریِ بیشتری دارد: روشن‌تر، کمی درشت‌تر و با هالهٔ پررنگ‌تر؛ بقیه کم‌اهمیت می‌مانند
  int hueI = int(clamp(aMisc.w, 0.0, 6.0) + 0.5);
  float tA = ring ? (ib < 7 ? clamp(uTint[ib], 0.0, 1.0) : 0.0) : (band < 12.5 ? clamp(uTint[hueI], 0.0, 1.0) : 0.0);
  float halo = smoothstep(0.76, 0.98, seed) * (0.45 + 0.90 * tA);
  vHalo = halo;
  float sz = aMisc.y * 1.30 * (1.0 + 1.10 * e * uLum) * (0.92 + 0.22 * side) * (1.0 + 0.60 * halo) * (1.0 + 0.30 * tA);
  vec2 px = uCenter + p * uScale;
  gl_Position = vec4(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0, 0.0, 1.0);

  float edge = smoothstep(0.0, 0.14, aU) * (1.0 - smoothstep(0.86, 1.0, aU));     // لبه‌های نرمِ هر نوار
  float shimmer = 0.88 + 0.12 * sin(uTime * (0.7 + 1.8 * seed) + seed * 47.0);
  float dop = 1.0 + 0.30 * (-cos(th));
  float vis = 1.0 - smoothstep(uReveal - 0.28, uReveal, r);
  float pulse = uPulseA * exp(-pow((r - uPulseR) / 0.05, 2.0));
  float lum; vec3 col;
  if (ring) {
    // هفت رینگِ نخست طیفِ ثابت دارند؛ رینگ‌های بعدی سفیدند.
    lum = (0.88 + 1.55 * e * (0.40 + 0.60 * uLum)) * (0.52 + 0.48 * edge);
    col = ib < 7 ? mix(neutral, uPal[ib], clamp(uTint[ib], 0.0, 1.0)) : neutral;
  } else if (band < 12.5) {
    // رنگِ ذراتِ نزدیکِ افق از هندسهٔ ساخته‌شده می‌آید، نه از محاسبهٔ فریمی.
    int hue = int(clamp(aMisc.w, 0.0, 6.0) + 0.5);
    lum = 0.85; col = mix(neutral, uPal[hue], clamp(uTint[hue], 0.0, 1.0));
  } else {
    lum = 0.46 * (1.0 - smoothstep(0.80, 1.0, r)); col = neutral * 0.92;
  }
  lum *= mix(0.78, 1.9, tA);                                  // بی‌رنگ ۰٫۷۸×، رنگی تا ۱٫۹× ⇒ رنگ‌ها «ارزش» پیدا می‌کنند
  // نورِ مشترک: ذره‌ها از شفقِ پشتِ خودشان نور و رنگ می‌گیرند (هویتِ یکپارچه)
  vec3 ac = textureLod(uAur, vec2(px.x / uView.x, 1.0 - px.y / uView.y), 0.0).rgb;
  float al = dot(ac, vec3(0.30, 0.55, 0.15));
  if (!ring) {
    col = mix(col, normalize(ac + 0.02) * 0.95, clamp(al * 2.0, 0.0, 0.32) * uAurMix);
    lum *= 1.0 + 1.5 * al * uAurMix;
  }
  float highGlint = uHigh * smoothstep(0.91, 0.995, seed) * (0.5 + 0.5 * sin(uTime * (1.8 + seed * 1.3) + seed * 47.0));
  lum = (lum * shimmer * (1.0 + (ring ? 0.10 * uMid * armWave : 0.0) + 0.32 * highGlint) + pulse * 0.9) * dop * vis * uDim;
  vCol = vec4(col * lum, 0.0);
  gl_PointSize = clamp(sz * uPx, 1.0, 10.0);
  vPointDiameter = gl_PointSize / max(uPx * uScale, 0.001);
}`;

  const FS_DOTS = `#version 300 es
precision mediump float;
in vec4 vCol; out vec4 o;
void main(){ vec2 d = gl_PointCoord - 0.5; float q = dot(d, d) * 4.0; float a = (exp(-q * 3.0) + 0.30 * exp(-q * 1.1)) * (1.0 - smoothstep(0.75, 1.0, q)); o = vec4(vCol.rgb * a, 0.0); }`;

  const FS_OCCLUDED_DOTS = `#version 300 es
precision highp float;
in vec4 vCol;
in vec3 vDiskView;
in float vPointDiameter;
in float vHalo;
uniform float uHoleR;
out vec4 o;
void main(){
  // Test every covered fragment against the front surface of the spherical hole.
  // Foreground dots survive only where their view-space depth is in front of it.
  vec2 fragmentPos = vDiskView.xy + (gl_PointCoord - vec2(0.5)) * vPointDiameter;
  float rho2 = dot(fragmentPos, fragmentPos);
  float holeR2 = uHoleR * uHoleR;
  if (rho2 < holeR2) {
    float frontSurfaceZ = sqrt(max(holeR2 - rho2, 0.0));
    if (vDiskView.z <= frontSurfaceZ + 0.0002) discard;
  }
  vec2 d = gl_PointCoord - 0.5;
  float q = dot(d, d) * 4.0;
  float a = (exp(-q * 3.0) + (0.30 + 0.80 * vHalo) * exp(-q * 1.1)) * (1.0 - smoothstep(0.75, 1.0, q));   // هالهٔ نرمِ ستاره‌ای برای ذره‌های پرنور
  o = vec4(vCol.rgb * a, 0.0);
}`;

  const VS_AUR_DOTS = `#version 300 es
precision highp float;
in vec2 aPolar;
in vec4 aMisc;   // seed, size, aurora marker, source band
in float aU;     // precomputed offset through the disk thickness
uniform vec2 uView; uniform vec2 uCenter;
uniform float uScale, uSin, uTilt, uPx, uHalf, uDiskBreath, uPhase, uTime;
uniform float uLevel, uLum, uLow, uMid, uHigh, uDim;
uniform float uChroma[12]; uniform float uTint[12];
out vec4 vCol;
out vec3 vViewPos;
out vec2 vProjected;
out float vPointDiameter;
const float CAMERA_DISTANCE = 3.2;
const float TAU_AUR = 6.2831853;
void main(){
  float seed = aMisc.x;
  float sourceBand = clamp(aMisc.w, 0.0, 11.0);
  float baseR = aPolar.x;
  float r = baseR * (1.0 + uDiskBreath * (0.78 + 0.22 * aU));
  float omega = 0.10 * pow(baseR + 0.05, -1.5) + 1.53;
  float theta = aPolar.y - uPhase * omega
    + (0.006 + 0.006 * uMid) * sin(seed * TAU_AUR + uTime * 0.16);
  float x = r * cos(theta), y = r * sin(theta);
  float normalOffset = (aU - 0.5) * 0.070
    + 0.0025 * sin(theta * 3.0 + seed * TAU_AUR + uTime * 0.08);
  float si = clamp(uSin, 0.15, 0.999);
  float ci = sqrt(max(0.0, 1.0 - si * si));
  vec2 view = vec2(x, y * si - normalOffset * ci);
  float depth = y * ci + normalOffset * si;
  float cr = cos(uTilt), sr = sin(uTilt);
  view = vec2(cr * view.x - sr * view.y, sr * view.x + cr * view.y);
  if ((uHalf < 0.5) != (depth < 0.0)) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vCol = vec4(0.0); vViewPos = vec3(0.0); vProjected = vec2(0.0); vPointDiameter = 0.0;
    gl_PointSize = 1.0; return;
  }
  float perspective = CAMERA_DISTANCE / max(0.25, CAMERA_DISTANCE - depth);
  vViewPos = vec3(view, depth);
  vProjected = view * perspective;
  vec2 px = uCenter + vProjected * uScale;
  gl_Position = vec4(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0, 0.0, 1.0);

  float chroma = clamp(uChroma[int(sourceBand + 0.5)], 0.0, 1.0);
  vec3 cyan = vec3(0.08, 0.62, 0.94);
  vec3 violet = vec3(0.40, 0.38, 0.91);
  vec3 color = mix(vec3(0.80, 0.83, 0.90) * (0.30 + 0.22 * seed * seed), mix(cyan, violet, 0.18 + 0.52 * seed), clamp(uTint[int(sourceBand + 0.5)], 0.0, 1.0));
  float depthLight = clamp(0.88 + 0.22 * depth, 0.72, 1.08);
  float audioGlow = clamp(0.82 + 0.16 * uLow + 0.12 * uMid + 0.04 * uHigh, 0.72, 1.12);
  float slowActivity = 0.91 + 0.09 * sin(uTime * 0.23 + seed * 39.0 + theta * 0.35);
  float lum = (0.20 + 0.30 * uLevel) * (0.72 + 0.28 * chroma) * depthLight * audioGlow * slowActivity * uLum * uDim;
  vCol = vec4(color * lum, 0.0);
  gl_PointSize = clamp(aMisc.y * uPx * perspective * (0.92 + 0.10 * uMid), 1.0, 3.5);
  vPointDiameter = gl_PointSize / max(uPx * uScale, 0.001);
}`;

  const FS_AUR_DOTS = `#version 300 es
precision highp float;
in vec4 vCol;
in vec3 vViewPos;
in vec2 vProjected;
in float vPointDiameter;
uniform float uHoleR;
out vec4 o;
const float CAMERA_DISTANCE = 3.2;
void main(){
  // Perspective ray/sphere test: discard only when the black hole is before this particle.
  vec2 projected = vProjected + (gl_PointCoord - vec2(0.5)) * vPointDiameter;
  vec3 ray = vec3(projected / CAMERA_DISTANCE, -1.0);
  float qa = dot(ray, ray);
  float discriminant = CAMERA_DISTANCE * CAMERA_DISTANCE
    - qa * (CAMERA_DISTANCE * CAMERA_DISTANCE - uHoleR * uHoleR);
  if (discriminant >= 0.0) {
    float nearHit = (CAMERA_DISTANCE - sqrt(discriminant)) / qa;
    float particleT = CAMERA_DISTANCE - vViewPos.z;
    if (nearHit >= 0.0 && nearHit < particleT - 0.0002) discard;
  }
  vec2 d = gl_PointCoord - 0.5;
  float q = dot(d, d) * 4.0;
  float a = (exp(-q * 3.0) + 0.30 * exp(-q * 1.1)) * (1.0 - smoothstep(0.75, 1.0, q));
  o = vec4(vCol.rgb * a, 0.0);
}`;

  const FS_HORIZON = `#version 300 es
precision highp float;
uniform vec2 uCanvas; uniform float uPx; uniform vec2 uCenter; uniform float uScale, uHoleR, uLevel, uLum;
uniform float uTime, uEnergy, uBass, uFlare, uAxis; uniform vec3 uTint;
out vec4 o;
float haloHash(float x){ return fract(sin(x * 127.1 + 311.7) * 43758.5453); }
float haloNoise(float a){
  float x = fract(a / 6.2831853) * 12.0, i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(haloHash(mod(i, 12.0) + 1.0), haloHash(mod(i + 1.0, 12.0) + 1.0), f);
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y) / uPx - uCenter;
  float R = uHoleR * uScale;
  float d = length(p) / R;
  float a = atan(p.y, p.x);
  float body = (1.0 - smoothstep(0.985, 1.0, d)) * step(0.02, uLevel);   // سطحِ سیاهِ کره تا زمانِ محوشدنِ خودِ کهکشان کاملاً کدر می‌ماند
  float local = haloNoise(a);
  // نورِ لبه دیگر ثابت نیست: لکه‌های روشنِ هاله مثل مادهٔ در حالِ گردش دورِ سیاه‌چاله می‌چرخند،
  // درونِ هاله تندتر از بیرونش (برشِ کپلری ~ d^-1.5) و با موسیقی شتاب می‌گیرند
  float w = pow(max(d, 1.0), -1.5);
  float f1 = 0.5 + 0.5 * sin(2.0 * (a - uTime * 0.34 * w) + 1.3 * sin(a * 3.0 + uTime * 0.21));
  float f2 = 0.5 + 0.5 * sin(7.0 * (a + uTime * 0.16 * w) + 1.7 + 0.8 * sin(a * 4.0 - uTime * 0.17));
  float flow = 0.88 + 0.10 * (2.0 * local - 1.0) + 0.06 * (2.0 * f1 - 1.0) + 0.025 * (2.0 * f2 - 1.0);
  float dop = 1.0 + 0.38 * cos(a - uAxis);                             // سمتِ نزدیک‌شونده روشن‌تر؛ محور آهسته می‌چرخد
  float uneven = 0.55 * sin(2.0 * a + uTime * 0.08) + 0.30 * sin(5.0 * a - uTime * 0.053) + 0.15 * sin(9.0 * a + uTime * 0.027);
  float edge = 1.05 + 0.018 * uneven + 0.012 * (local - 0.5);
  float radial = d - edge;
  float width = (0.110 + 0.022 * uEnergy + 0.009 * uBass) * (0.84 + 0.32 * local);
  float innerGlow = exp(-pow(max(-radial, 0.0) / (width * 0.92), 1.50));
  float outerGlow = exp(-pow(max(radial, 0.0) / (width * (1.24 + 0.18 * local)), 1.38));
  float radialGlow = radial < 0.0 ? innerGlow : outerGlow;
  float brightnessVariation = clamp(0.78 + 0.20 * local + 0.035 * sin(3.0 * a + uTime * 0.06), 0.70, 1.0);
  float breathe = 0.97 + 0.03 * sin(uTime * 0.22 + 0.4 * uneven);
  float ring = radialGlow * brightnessVariation * (0.19 + 0.13 * uEnergy + 0.04 * uBass);   // نرم‌تر: هاله دیگر بر ذرات غلبه نمی‌کند
  float halo = exp(-max(d - 1.0, 0.0) * (4.8 - 2.0 * uEnergy)) * smoothstep(0.98, 1.035, d) * (0.17 + 0.22 * uEnergy) * (0.94 + 0.06 * brightnessVariation);
  float flare = uFlare * exp(-pow(radial / 0.25, 2.0)) * 0.68;          // ضربهٔ کوتاه، هم‌راستا با لبهٔ نامنظمِ هاله
  // پالتِ گرمِ هارمونیک: لبهٔ داخلی طلایی-کهربایی، بیرون نارنجیِ عمیق و در انتها کمی سرخ‌وش؛ موسیقی فقط رنگ را آرام جابه‌جا می‌کند
  float t = max(d - 1.0, 0.0);
  vec3 gold   = vec3(1.00, 0.80, 0.46);
  vec3 orange = vec3(1.00, 0.50, 0.16);
  vec3 ember  = vec3(0.86, 0.26, 0.20);
  vec3 warm = mix(gold, orange, smoothstep(0.0, 0.16, t));
  warm = mix(warm, ember, smoothstep(0.12, 0.55, t) * 0.55);
  vec3 rim = mix(warm, uTint, 0.30);                                   // uTint = گرمِ پایه + لمسِ ملایمِ نتِ غالب
  float I = (ring + halo) * flow * dop * breathe + flare * 0.7;
  vec3 col = rim * I * (0.35 + 0.65 * smoothstep(0.0, 0.5, uLevel)) * (0.65 + 0.35 * uLum);

  // دنبالهٔ کیهانی: رشتهٔ نرمِ خمیده در سمتِ دورشونده که مثل غبارِ در حالِ فرار به بیرون می‌خزد
  float da = a - (uAxis + 3.14159265 + 0.85 * pow(t, 0.8));            // با فاصله به یک سمت خم می‌شود
  da = atan(sin(da), cos(da));
  float spread = 0.20 + 0.34 * pow(t, 0.75);
  float lateral = exp(-(da * da) / (spread * spread));
  float reach = smoothstep(0.015, 0.20, t) * exp(-t * 0.95) * (1.0 - smoothstep(2.2, 3.3, t));
  float strands = 0.62 + 0.26 * sin(da * 15.0 / (0.6 + t) - t * 6.0 + uTime * 0.55)
                       + 0.12 * sin(da * 31.0 + t * 9.0 - uTime * 0.8);
  float tailI = lateral * reach * strands * (0.10 + 0.14 * uEnergy + 0.05 * uBass) * (0.7 + 0.3 * breathe);
  vec3 tailCol = mix(mix(orange, uTint, 0.25), mix(ember, vec3(0.55, 0.30, 0.65), 0.35), smoothstep(0.1, 1.6, t));
  col += tailCol * tailI * (0.35 + 0.65 * smoothstep(0.0, 0.5, uLevel));
  col *= 1.0 - body;
  o = vec4(col, body);
}`;

  const VS_POWDER = `#version 300 es
precision highp float;
in vec2 aS; in vec3 aR; in float aG;   // aG: ۰ = عنوان/هنرمند، ۱ = ستارهٔ امتیاز
uniform vec2 uView; uniform vec2 uCenter; uniform float uProg, uApp, uSin, uPx, uBoxX, uBoxW, uMode, uEnter, uCoreR, uFade, uHasStars;
out vec4 vCol;
void main(){
  if (uMode > 0.5) {
    float delay = clamp((aS.x - uBoxX) / max(uBoxW, 1.0), 0.0, 1.0) * 0.15 + aR.x * 0.10 + aG * 0.10;   // ستاره‌ها کمی بعد از عنوان
    float t = clamp((uEnter - delay) / max(0.01, 1.0 - delay), 0.0, 1.0);
    vec2 v = aS - uCenter;
    float dist = length(v);
    vec2 dir = dist > 0.001 ? v / dist : vec2(cos(aR.y * 6.28318), sin(aR.y * 6.28318));
    float turn = (aR.y - 0.5) * 0.30;
    dir = vec2(dir.x * cos(turn) - dir.y * sin(turn), dir.x * sin(turn) + dir.y * cos(turn));
    float coreR = max(3.0, uCoreR);
    vec2 p0 = uCenter + dir * coreR;
    float reach = min(max(coreR + 18.0, dist * 1.12), coreR + 180.0);
    vec2 p1 = uCenter + dir * mix(coreR + 8.0, reach, 0.72 + 0.28 * aR.z);
    vec2 pos = p0 * (1.0 - t) * (1.0 - t) + p1 * (2.0 * (1.0 - t) * t) + aS * t * t;
    float alpha = uApp * uFade * (0.72 + 0.28 * smoothstep(0.0, 0.32, t));
    vec3 warm = mix(vec3(1.0, 0.78, 0.48), vec3(1.0, 0.94, 0.80), smoothstep(0.05, 0.82, t));
    warm = mix(warm, vec3(1.0, 0.88, 0.60), aG * 0.6);
    vCol = vec4(warm * alpha, 0.0);
    gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
    gl_PointSize = max(1.0, (1.35 + 0.9 * aR.z) * uPx * (1.0 + 0.35 * (1.0 - t)));
    return;
  }
  // با ستاره: اول تمامِ عنوان/هنرمند (تا ۰٫۴۸) و بعد ستاره‌ها از چپ به راست (از ۰٫۵۰ تا ۰٫۹۲) به سیاه‌چاله می‌روند
  bool st = uHasStars > 0.5;
  float delay = clamp((aS.x - uBoxX) / max(uBoxW, 1.0), 0.0, 1.0) * (st ? 0.14 : 0.35) + aR.x * (st ? 0.08 : 0.25) + (st ? aG * 0.50 : 0.0);
  float p = clamp((uProg - delay) / (st ? 0.26 : 0.4), 0.0, 1.0);
  float e = p * p * (3.0 - 2.0 * p);
  vec2 v = aS - uCenter;
  float rad = length(v) * pow(1.0 - e, 1.4);
  float ang = atan(v.y, v.x) + (3.0 + 2.2 * aR.y) * e * e;
  vec2 pos = uCenter + vec2(cos(ang), sin(ang)) * rad;
  pos.y = uCenter.y + (pos.y - uCenter.y) * mix(1.0, uSin, e);
  pos += (aR.xy - 0.5) * 26.0 * sin(3.14159 * p);
  float alpha = uApp * (1.0 - smoothstep(0.55, 1.0, p)) * (0.75 + 0.25 * aR.z);
  vec3 warm = mix(vec3(1.0, 0.94, 0.80), vec3(1.0, 0.88, 0.60), aG * 0.6);
  vCol = vec4(warm * alpha, 0.0);
  gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
  gl_PointSize = max(1.0, (1.3 + 1.0 * aR.z) * uPx);
}`;

  function shader(gl, type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, vs, fs, names) {
    const p = gl.createProgram();
    gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
    const u = {}; names.forEach(function (n) { u[n] = gl.getUniformLocation(p, n); });
    return { p: p, u: u };
  }

  function buildCosmicPoints() {
    const rnd = mulberry32((V.session ^ 0x4C1A7E) >>> 0);
    const data = new Float32Array(COSMIC_GROUPS * (COSMIC_STARS_PER_GROUP + 1) * 4);
    let at = 0;
    for (let group = 0; group < COSMIC_GROUPS; group++) {
      const angle = (group / COSMIC_GROUPS) * TAU + (rnd() - 0.5) * 0.18;
      const radius = 0.34 + rnd() * 0.20;
      const cx = clamp(0.5 + Math.cos(angle) * radius, 0.035, 0.965);
      const cy = clamp(0.49 + Math.sin(angle) * radius * 0.78, 0.035, 0.965);
      V.cosmic.groupDelay[group] = rnd() * 3.6;
      // One dim, fixed star per region preserves a quiet sense of distance.
      data[at++] = clamp(cx + (rnd() - 0.5) * 0.05, 0.01, 0.99);
      data[at++] = clamp(cy + (rnd() - 0.5) * 0.05, 0.01, 0.99);
      data[at++] = rnd(); data[at++] = -1;
      for (let j = 0; j < COSMIC_STARS_PER_GROUP; j++) {
        const spread = 0.012 + rnd() * 0.035;
        data[at++] = clamp(cx + (rnd() - 0.5) * spread * 2.0, 0.01, 0.99);
        data[at++] = clamp(cy + (rnd() - 0.5) * spread * 1.4, 0.01, 0.99);
        data[at++] = rnd(); data[at++] = group;
      }
    }
    return data;
  }

  // ستاره‌های نوارِ راه شیری: موقعیت‌ها با seedِ نشست و هندسهٔ نوار ساخته می‌شوند (نه هر فریم)؛
  // فقط وقتی نشست عوض شود یا اندازهٔ پنجره تغییر کند دوباره آپلود می‌شوند.
  function uploadBandStars() {
    const c = V.cosmic;
    if (!G || !G.bandBuf || !V.vw || !V.vh) return;
    c.bandDirty = false;
    const gl = V.gl, aspect = V.vw / V.vh;
    const rnd = mulberry32((V.session ^ Math.imul(c.sessionCount + 3, 0x85EBCA6B) ^ 0xB4D5) >>> 0);
    const N = V.vw < 700 ? MW.starsMobile : MW.starsDesktop;
    const dx = Math.cos(c.bandAngle), dy = Math.sin(c.bandAngle), nx = -dy, ny = dx;
    const halfLen = Math.hypot(aspect, 1) * 0.55;
    const data = new Float32Array(N * 4);
    let n = 0, guard = 0;
    while (n < N && guard++ < N * 40) {
      const s = (rnd() * 2 - 1) * halfLen;
      const bulge = Math.exp(-Math.pow((s - c.bandBulge) / 0.34, 2));
      if (rnd() > 0.40 + 0.60 * bulge) continue;
      const d = (rnd() + rnd() + rnd() + rnd() - 2) * 1.56 * c.bandWidth + c.bandOffset;
      const mx = 0.5 * aspect + dx * s + nx * d, my = 0.5 + dy * s + ny * d;
      const x = mx / aspect, y = 1 - my;
      if (x < 0.005 || x > 0.995 || y < 0.005 || y > 0.995) continue;
      const o = n * 4; data[o] = x; data[o + 1] = y; data[o + 2] = rnd(); data[o + 3] = -2; n++;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, G.bandBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, n * 4), gl.STATIC_DRAW);
    G.bandCount = n;
  }

  const HOLE_R = 0.11;   // شعاعِ کره (واحدِ R)
  const AURORA_INNER_R = 0.125; // حدِ داخلیِ Aurora؛ در ۵۰° با انبساطِ حداکثر هنوز داخلِ سیلوئت می‌ماند
  function buildGeometry(N) {
    const rnd = mulberry32(V.session);
    const buf = new Float32Array(N * 7);
    const R0 = 0.19, R1 = 0.78, NB = 12;
    const wts = []; let wsum = 0;
    for (let b = 0; b < NB; b++) { const x = 1 + (rnd() - 0.5) * 0.36; wts.push(x); wsum += x; }
    const GAP = 0.05, CASSINI = 0.40;                 // شکافِ بزرگ بینِ نیمهٔ گرم (C…E) و سرد (F…B)
    const unit = (R1 - R0) / (wsum + 10 * GAP + CASSINI);
    const inner = [], outer = []; let cur = R0;
    for (let b = 0; b < NB; b++) {
      inner.push(cur); cur += wts[b] * unit; outer.push(cur);
      cur += (b === 5 ? CASSINI : GAP) * unit;
    }
    const nInner = Math.round(N * 0.04), nDustTotal = Math.round(N * 0.08);
    const nAurora = Math.floor(N * 0.04), nDust = nDustTotal - nAurora, nRing = N - nInner - nDustTotal;
    // سهم هر نوار ∝ مساحتِ تقریبی (چگالی ∝ r^-0.5 تا نوارهای درونی خالی نمانند)
    const area = outer.map(function (o, b) { return Math.pow(o, 1.5) - Math.pow(inner[b], 1.5); });
    const asum = area.reduce(function (a, c) { return a + c; }, 0);
    const auroraInner = inner.slice();
    auroraInner[0] = AURORA_INNER_R;
    const auroraArea = outer.map(function (o, b) { return Math.pow(o, 1.5) - Math.pow(auroraInner[b], 1.5); });
    const auroraAsum = auroraArea.reduce(function (a, c) { return a + c; }, 0);
    const counts = area.map(function (a) { return Math.round(nRing * a / asum); });
    counts[NB - 1] += nRing - counts.reduce(function (a, c) { return a + c; }, 0);
    const th0 = rnd() * TAU;
    // بازوهای مارپیچِ لگاریتمی (دنباله‌دار نسبت به چرخشِ پادساعت‌گرد)؛ ~۲۶٪ ذرات پس‌زمینهٔ بین‌بازوهاست
    const ARMS = 3, KPITCH = 1.8;
    V.armTh0 = th0; V.armK = KPITCH; V.armN = ARMS;
    const armAngle = function (r) {
      if (rnd() > 0.74) return rnd() * TAU;
      const k = Math.floor(rnd() * ARMS), sg = 0.26 + 0.34 * ((r - R0) / (R1 - R0)), g = (rnd() + rnd() + rnd() - 1.5) * 1.6;
      return th0 + k * TAU / ARMS + KPITCH * Math.log(r / R0) + g * sg;
    };
    let i = 0;
    const put = function (r, band, uu, tier, thA) {
      const o = i * 7, seed = rnd();
      buf[o] = r; buf[o + 1] = thA !== undefined ? thA : i * GOLDEN + th0; buf[o + 2] = seed; buf[o + 3] = 1.25 * (0.55 + 0.9 * seed);
      buf[o + 4] = band; buf[o + 5] = tier; buf[o + 6] = uu; i++;
    };
    for (let b = 0; b < NB; b++) {
      const a0 = Math.pow(inner[b], 1.5), a1 = Math.pow(outer[b], 1.5), ph = rnd(), rl = 3 + Math.floor(rnd() * 3);
      for (let k = 0; k < counts[b]; k++) {
        let r = 0, u = 0;
        for (let t = 0; t < 8; t++) {                                  // رینگلت‌های ریز (کم‌چگالی و پرچگالی) داخلِ هر نوار
          r = Math.pow(a0 + (a1 - a0) * rnd(), 1 / 1.5);
          u = (r - inner[b]) / (outer[b] - inner[b]);
          if (rnd() < 0.86 + 0.14 * (0.5 + 0.5 * Math.cos(TAU * (rl * u + ph)))) break;
        }
        put(r, b, u, 3, armAngle(r));
      }
    }
    for (let k = 0; k < nInner; k++) put(HOLE_R + 0.03 + 0.05 * Math.pow(rnd(), 0.8), 12, rnd(), k % 7);
    for (let k = 0; k < nDust; k++) put(0.82 + 0.18 * Math.pow(rnd(), 1.5), 13, rnd(), 4);
    V.auroraStart = i; V.auroraN = nAurora;
    for (let k = 0; k < nAurora; k++) {
      const pick = rnd() * auroraAsum; let b = 0, acc = auroraArea[0];
      while (b < NB - 1 && pick > acc) { b++; acc += auroraArea[b]; }
      const a0 = Math.pow(auroraInner[b], 1.5), a1 = Math.pow(outer[b], 1.5);
      const r = Math.pow(a0 + (a1 - a0) * rnd(), 1 / 1.5);
      const o = i * 7, seed = rnd();
      buf[o] = r; buf[o + 1] = rnd() * TAU;
      buf[o + 2] = seed; buf[o + 3] = 0.75 + 0.70 * rnd();
      buf[o + 4] = 14; buf[o + 5] = b; buf[o + 6] = rnd(); i++;
    }
    V.bandIn = new Float32Array(inner); V.bandOut = new Float32Array(outer);
    return buf;
  }

  function initGL() {
    if (V.ok) return true;
    if (V.dead) return false;
    try {
      const root = VM.getRoot();
      if (!root) return false;
      const cv = document.createElement('canvas');
      cv.className = 'vm-viz'; cv.setAttribute('aria-hidden', 'true');
      const gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
      if (!gl) throw new Error('webgl2 unavailable');
      root.insertBefore(cv, root.firstChild);
      V.canvas = cv; V.gl = gl;
      // GPU reset / از دست رفتنِ context: بوم را از نو می‌سازیم (هندسه از seedِ همان نشست دوباره ساخته می‌شود)
      cv.addEventListener('webglcontextlost', function (e) {
        e.preventDefault(); V.ok = false; stopLoop(false);
        setTimeout(function () {
          teardownGL(); V.dead = false;
          if (V.playing && VM.isOpen() && initGL()) startLoop();
        }, 400);
      });

      G = {};
      G.aurora = program(gl, VS_TRI, FS_AURORA, ['uRes', 'uTime', 'uLevel', 'uSeed', 'uTint', 'uHole', 'uAsp', 'uBend', 'uInfall[0]', 'uInfallTail', 'uHorizon', 'uBand', 'uBandP', 'uBandLow', 'uBloom[0]']);
      G.blit = program(gl, VS_TRI, FS_BLIT, ['uTex', 'uRes', 'uMix']);
      G.cosmic = program(gl, VS_COSMIC_DOTS, FS_COSMIC_DOTS, ['uView', 'uPx', 'uTime', 'uLevel', 'uGlow', 'uAspect', 'uPrimary', 'uReveal[0]', 'uBandTex', 'uBandAmt', 'uBandHigh']);
      G.dots = program(gl, VS_DOTS, FS_OCCLUDED_DOTS, ['uView', 'uCenter', 'uScale', 'uSin', 'uTilt', 'uPx', 'uHalf', 'uDiskBreath', 'uHoleR', 'uPhase', 'uReveal', 'uLum', 'uTime', 'uPulseR', 'uPulseA', 'uConf', 'uDim', 'uMid', 'uHigh', 'uStructure', 'uChroma', 'uPal', 'uAur', 'uAurMix', 'uTint']);
      G.aurDots = program(gl, VS_AUR_DOTS, FS_AUR_DOTS, ['uView', 'uCenter', 'uScale', 'uSin', 'uTilt', 'uPx', 'uHalf', 'uDiskBreath', 'uPhase', 'uTime', 'uLevel', 'uLum', 'uLow', 'uMid', 'uHigh', 'uDim', 'uChroma', 'uHoleR', 'uTint']);
      G.hor = program(gl, VS_TRI, FS_HORIZON, ['uCanvas', 'uPx', 'uCenter', 'uScale', 'uHoleR', 'uLevel', 'uLum', 'uTime', 'uEnergy', 'uBass', 'uFlare', 'uAxis', 'uTint']);
    } catch (e) { teardownGL(); V.dead = true; return false; }
    try {
      const gl = V.gl;
      G.pow = program(gl, VS_POWDER, FS_DOTS, ['uView', 'uCenter', 'uProg', 'uApp', 'uSin', 'uPx', 'uBoxX', 'uBoxW', 'uMode', 'uEnter', 'uCoreR', 'uFade', 'uHasStars']);
      G.emptyVao = gl.createVertexArray();
      G.ejecta = program(gl, VS_EJECTA, FS_EJECTA, ['uView', 'uCenter', 'uScale', 'uSin', 'uTilt', 'uTime', 'uRate', 'uPx', 'uPhase', 'uTh0', 'uK', 'uArms']);
      G.ejectaVao = gl.createVertexArray(); gl.bindVertexArray(G.ejectaVao);
      G.ejectaBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, G.ejectaBuf); gl.bufferData(gl.ARRAY_BUFFER, buildEjecta(), gl.STATIC_DRAW);
      [['aA', 4, 0], ['aB', 4, 16]].forEach(function (a) { const loc = gl.getAttribLocation(G.ejecta.p, a[0]); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, a[1], gl.FLOAT, false, 32, a[2]); });
      gl.bindVertexArray(null);
      G.comet = program(gl, VS_COMET, FS_COMET, ['uView']);
      G.cometVao = gl.createVertexArray(); gl.bindVertexArray(G.cometVao);
      G.cometBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, G.cometBuf); gl.bufferData(gl.ARRAY_BUFFER, CM.buf.byteLength, gl.DYNAMIC_DRAW);
      [['aPos', 2, 0], ['aUV', 2, 8], ['aKA', 2, 16], ['aCol', 3, 24]].forEach(function (a) {
        const loc = gl.getAttribLocation(G.comet.p, a[0]); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, a[1], gl.FLOAT, false, 36, a[2]);
      });
      gl.bindVertexArray(null);

      // Sparse distant-star groups are uploaded once; only their reveal weights change per frame.
      const cosmicData = buildCosmicPoints();
      G.cosmicVao = gl.createVertexArray(); gl.bindVertexArray(G.cosmicVao);
      G.cosmicBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, G.cosmicBuf); gl.bufferData(gl.ARRAY_BUFFER, cosmicData, gl.STATIC_DRAW);
      const cosmicAttr = gl.getAttribLocation(G.cosmic.p, 'aCosmic');
      gl.enableVertexAttribArray(cosmicAttr); gl.vertexAttribPointer(cosmicAttr, 4, gl.FLOAT, false, 16, 0);
      G.cosmicCount = cosmicData.length / 4;
      gl.bindVertexArray(null);
      G.bandVao = gl.createVertexArray(); gl.bindVertexArray(G.bandVao);
      G.bandBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, G.bandBuf); gl.bufferData(gl.ARRAY_BUFFER, 16, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(cosmicAttr); gl.vertexAttribPointer(cosmicAttr, 4, gl.FLOAT, false, 16, 0);
      G.bandCount = 0; V.cosmic.bandDirty = true;
      gl.bindVertexArray(null);

      // هندسهٔ کهکشان (یک بار)
      V.N = (window.innerWidth < 700) ? CFG.dotsMobile : CFG.dotsDesktop;
      const data = buildGeometry(V.N);
      G.dotVao = gl.createVertexArray(); gl.bindVertexArray(G.dotVao);
      G.dotBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, G.dotBuf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const l0 = gl.getAttribLocation(G.dots.p, 'aPolar'), l1 = gl.getAttribLocation(G.dots.p, 'aMisc'), l2 = gl.getAttribLocation(G.dots.p, 'aU');
      gl.enableVertexAttribArray(l0); gl.vertexAttribPointer(l0, 2, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(l1); gl.vertexAttribPointer(l1, 4, gl.FLOAT, false, 28, 8);
      gl.enableVertexAttribArray(l2); gl.vertexAttribPointer(l2, 1, gl.FLOAT, false, 28, 24);
      gl.bindVertexArray(null);

      G.aurVao = gl.createVertexArray(); gl.bindVertexArray(G.aurVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, G.dotBuf);
      const a0 = gl.getAttribLocation(G.aurDots.p, 'aPolar'), a1 = gl.getAttribLocation(G.aurDots.p, 'aMisc'), a2 = gl.getAttribLocation(G.aurDots.p, 'aU');
      gl.enableVertexAttribArray(a0); gl.vertexAttribPointer(a0, 2, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(a1); gl.vertexAttribPointer(a1, 4, gl.FLOAT, false, 28, 8);
      gl.enableVertexAttribArray(a2); gl.vertexAttribPointer(a2, 1, gl.FLOAT, false, 28, 24);
      gl.bindVertexArray(null);

      G.tex = gl.createTexture(); G.fbo = gl.createFramebuffer();
      V.ok = true;
      resizeGL();
      return true;
    } catch (e) { teardownGL(); V.dead = true; return false; }
  }

  function resizeGL() {
    if (!V.ok) return;
    if (V.entrance.pending || V.entrance.active) cancelTitleEntrance(true);
    const gl = V.gl;
    V.vw = window.innerWidth; V.vh = window.innerHeight;
    let rs = Math.min(window.devicePixelRatio || 1, 1.25);
    while (V.vw * V.vh * rs * rs > 2.3e6 && rs > 0.6) rs -= 0.1;
    V.rs = rs;
    V.W = Math.max(2, Math.floor(V.vw * rs)); V.H = Math.max(2, Math.floor(V.vh * rs));
    V.canvas.width = V.W; V.canvas.height = V.H;
    // شفق: بافتِ ¼-رزولوشن
    G.aw = Math.max(2, Math.ceil(V.W / 4)); G.ah = Math.max(2, Math.ceil(V.H / 4));
    gl.bindTexture(gl.TEXTURE_2D, G.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, G.aw, G.ah, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, G.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, G.tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // هندسهٔ صفحه: سیاه‌چاله کمی بالاتر از وسط؛ در پرتره دیسک «رو به‌تر» می‌شود
    const portrait = V.vw / V.vh < 0.8;
    V.incl = portrait ? 62 : 50;     // زاویهٔ ارتفاعِ دوربین نسبت به صفحهٔ دیسک؛ در step() آرام نوسان می‌کند
    if (!V.breath.ready) { V.breath.pitch = V.incl; V.breath.ready = true; }
    V.scale = portrait ? V.vw * 0.92 : Math.min(V.vw * 0.44, V.vh * 0.95);
    V.cx = V.vw / 2; V.cy = V.vh * (portrait ? 0.40 : 0.45);
    V.powder.key = '';    // پودر باید دوباره نمونه‌برداری شود
    V.cosmic.bandDirty = true;   // نسبتِ تصویر عوض شده؛ ستاره‌های نوار دوباره چیده شوند
  }

  function teardownGL() {
    try { if (V.gl) { const x = V.gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } } catch (e) {}
    try { if (V.canvas && V.canvas.parentNode) V.canvas.parentNode.removeChild(V.canvas); } catch (e) {}
    V.canvas = null; V.gl = null; V.ok = false; G = null;
    V.powder.buf = null; V.powder.vao = null; V.powder.n = 0; V.powder.key = '';
  }

  /* ---------- پودرِ عنوان ---------- */
  function buildPowder() {
    const gl = V.gl;
    const info = VM.getMetaInfo && VM.getMetaInfo();
    if (!info || !info.title) { V.powder.n = 0; return; }
    const items = [info.title, info.artist].filter(Boolean);
    const pts = [];
    const starPts = [];
    items.forEach(function (it) {
      const pad = 4, sc = 2, w = Math.ceil(it.w) + pad * 2, h = Math.ceil(it.h) + pad * 2;
      const c = document.createElement('canvas'); c.width = w * sc; c.height = h * sc;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.scale(sc, sc); g.font = it.font; g.textBaseline = 'middle'; g.fillStyle = '#fff';
      const rtl = RTL.test(it.text);
      try { g.direction = rtl ? 'rtl' : 'ltr'; } catch (e) {}
      g.textAlign = rtl ? 'right' : 'left';
      g.save(); g.beginPath(); g.rect(0, 0, w, h); g.clip(); g.fillText(it.text, rtl ? w - pad : pad, h / 2); g.restore();
      const d = g.getImageData(0, 0, c.width, c.height).data, W = c.width;
      for (let y = 0; y < c.height; y += 2) for (let x = 0; x < W; x += 2) {
        if (d[(y * W + x) * 4 + 3] > 110) pts.push(it.x - pad + x / sc, it.y - pad + y / sc);
      }
    });
    // ستاره‌های امتیاز: هر ستاره با همان قلم/اندازهٔ DOM نمونه‌برداری می‌شود تا پودر دقیقاً روی ستارهٔ واقعی بنشیند
    (info.stars || []).forEach(function (st) {
      const sz = st.size || 19, sc = 3, w = Math.ceil(sz * 1.7), h = Math.ceil(sz * 1.7);
      const c = document.createElement('canvas'); c.width = w * sc; c.height = h * sc;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.scale(sc, sc); g.font = (st.font || (sz + 'px sans-serif')); g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillStyle = '#fff';
      g.fillText('\u2605', w / 2, h / 2);
      const d = g.getImageData(0, 0, c.width, c.height).data, W = c.width;
      for (let y = 0; y < c.height; y += 3) for (let x = 0; x < W; x += 3) {
        if (d[(y * W + x) * 4 + 3] > 110) starPts.push(st.x - w / 2 + x / sc, st.y - h / 2 + y / sc);
      }
    });
    let n = pts.length / 2;
    const cap = V.N < 6000 ? 520 : 900;
    const rnd = mulberry32((V.session ^ V.track) >>> 0);
    const idx = []; for (let i = 0; i < n; i++) idx.push(i);
    if (n > cap) { for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; } idx.length = cap; n = cap; }
    const ns = starPts.length / 2, tot = n + ns;
    const data = new Float32Array(tot * 6);
    let minX = 1e9, maxX = -1e9;
    for (let i = 0; i < tot; i++) {
      const isStar = i >= n, s = isStar ? i - n : idx[i];
      const x = isStar ? starPts[s * 2] : pts[s * 2], y = isStar ? starPts[s * 2 + 1] : pts[s * 2 + 1];
      data[i * 6] = x; data[i * 6 + 1] = y; data[i * 6 + 2] = rnd(); data[i * 6 + 3] = rnd(); data[i * 6 + 4] = rnd(); data[i * 6 + 5] = isStar ? 1 : 0;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
    }
    V.powder.hasStars = ns > 0; n = tot;
    if (!V.powder.vao) V.powder.vao = gl.createVertexArray();
    if (!V.powder.buf) V.powder.buf = gl.createBuffer();
    gl.bindVertexArray(V.powder.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, V.powder.buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const a0 = gl.getAttribLocation(G.pow.p, 'aS'), a1 = gl.getAttribLocation(G.pow.p, 'aR'), a2 = gl.getAttribLocation(G.pow.p, 'aG');
    gl.enableVertexAttribArray(a0); gl.vertexAttribPointer(a0, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(a1); gl.vertexAttribPointer(a1, 3, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(a2); gl.vertexAttribPointer(a2, 1, gl.FLOAT, false, 24, 20);
    gl.bindVertexArray(null);
    V.powder.n = n; V.powder.box = [minX, Math.max(1, maxX - minX)];
  }

  function cancelTitleEntrance(reveal) {
    V.entrance.pending = false; V.entrance.active = false; V.entrance.elapsed = 0;
    if (reveal) VM.setPowder(V.powder.on && V.powder.n > 0);
  }

  function startTitleEntrance(detail) {
    if (!detail || !Number.isFinite(detail.generation) || detail.generation === V.entrance.generation) return;
    V.entrance.generation = detail.generation;
    V.entrance.id = detail.id;
    cancelTitleEntrance(true);
    if (!V.playing || !VM.isOpen() || document.hidden || reduced() || V.powder.on) return;
    const audio = VM.getAudio();
    if (!audio || audio.paused || (isFinite(audio.duration) && audio.duration - audio.currentTime <= V.entrance.duration + V.entrance.handoff)) return;
    if (!V.ok && !initGL()) return;
    V.powder.key = '';
    V.entrance.pending = true;
    VM.setPowder(true);
    if (!V.running && V.playing) startLoop();
  }

  function powderState(rem, dur) {
    if (!(V.playing && V.ok && dur > 0 && isFinite(rem)) || reduced()) return { on: false, appear: 0, prog: 0 };
    // کلِ نمایش T = max(۸ ثانیه، ۱/۲۰ طول × ۱٫۱) تا سقفِ نیمِ آهنگ — برای آهنگِ ۴ دقیقه‌ای ≈ ۱۳٫۲ ثانیه
    const T = Math.min(Math.max(CFG.powderMinS, dur / 20 * 1.1), dur * 0.5);
    const end = Math.min(0.9, T * 0.06), hold = clamp(T * 0.18, 2.2, 6);       // مکثِ خواندنِ عنوان قبل از پودر شدن
    if (!(rem < T && rem > end * 0.35)) return { on: false, appear: 0, prog: 0 };
    const e = T - rem;
    return { on: true, appear: clamp(e / 0.9, 0, 1), prog: clamp((e - hold) / Math.max(0.5, T - end - hold), 0, 1), T: T };
  }

  /* ---------- مراحل ---------- */
  function updateStage(dt, nowS) {
    V.stageT += dt; V.tPlay += dt;
    if (reduced()) { V.stage = 'calm'; return; }
    // اگر آنالیز در دسترس نباشد (context اجرا نشد)، انرژیِ ساختگیِ آرام جایگزین می‌شود تا نمایش هرگز «مرده» نماند
    const e = A.ok ? A.energy : clamp(0.52 + 0.30 * Math.sin(nowS * 0.33) + 0.12 * Math.sin(nowS * 1.1), 0, 1);
    const fr = A.ok ? A.fluxR : 1, silent = A.ok && A.silent;
    if (V.stage === 'calm') {
      V.calmT += dt;
      if (V.cool > 0) { V.cool -= dt; V.hiT = 0; return; }
      // اگر مدتی در حالتِ آرام ماند، آستانه آرام‌آرام پایین می‌آید؛ صداهای روشن (انرژی در >۲kHz) هم زودتر بیدارش می‌کنند
      const thr = CFG.enterE - 0.22 * clamp((V.calmT - 20) / 60, 0, 1) - 0.07 * clamp((A.bright - 0.22) / 0.30, 0, 1);
      // صداهای واقعاً ضعیف (≈ کمتر از ‑۳۳dBFS) به‌تنهایی کهکشان را بیدار نمی‌کنند؛ شفق جلوست (اگر آهنگ خیلی طولانی ضعیف ماند، بعد از ~۴۵ ثانیه باز هم می‌آید)
      const loudEnough = !A.ok || A.db > -33 || V.calmT > 45;
      const hot = !silent && loudEnough && A.warm <= 0 && (e > thr || (e > CFG.enterFluxE && fr > CFG.enterFluxR));
      V.hiT = hot ? V.hiT + dt : Math.max(0, V.hiT - dt * 2);
      if (V.hiT > CFG.enterHoldS) { V.stage = 'galaxy'; V.stageT = 0; V.hiT = 0; V.loT = 0; V.calmT = 0; }
    } else {
      const cold = silent || (e < CFG.exitE && fr < 1.15);
      V.loT = cold ? V.loT + dt : Math.max(0, V.loT - dt * 2);
      if (V.stageT > CFG.minGalaxyS && V.loT > CFG.exitHoldS) { V.stage = 'calm'; V.stageT = 0; V.cool = CFG.cooldownS; V.loT = 0; }
    }
  }

  function cosmicRand() {
    if (!V.cosmic.rng) V.cosmic.rng = mulberry32((V.session ^ 0x51A7C0) >>> 0);
    return V.cosmic.rng();
  }
  function cosmicPrimaryRadius() {
    if (!V.vh || !V.scale) return 0.12;
    // Covers the bright outer rings at maximum disk breathing and camera scale.
    return V.scale * 0.87 / V.vh + 0.018;
  }
  function cosmicPrimaryCenter() { return [V.cx / Math.max(1, V.vw), 1 - V.cy / Math.max(1, V.vh)]; }
  function cosmicHorizonRadius() { return HOLE_R * V.scale / Math.max(1, V.vh); }
  function beginCosmicSession() {
    const c = V.cosmic;
    if (c.sessionActive || !V.vw || !V.vh) return;
    c.sessionActive = true; c.sessionCount++; c.activeElapsed = 0;
    c.rng = mulberry32((V.session ^ Math.imul(c.sessionCount, 0x9E3779B9) ^ 0x51A7C0) >>> 0);
    c.slotStart.fill(-100); COMETS.length = 0; c.nextCometAt = 4 + cosmicRand() * 3; c.infallTail = 0.21 + cosmicRand() * 0.05;
    c.lastPeakAt = -100; c.peakCandidateUntil = -100;
    // نمایان‌شدنِ راه شیری: اولین چرخه کوتاه و تضمین‌شده؛ بعد از آن به‌صورت دوره‌ای تکرار می‌شود
    c.revelationStart = MW.firstS + cosmicRand() * 2;
    c.revelationAppear = MW.appearS + cosmicRand() * 2;
    c.revelationHold = MW.holdS + cosmicRand() * 8;
    c.revelationFade = MW.fadeS + cosmicRand() * 4;
    c.revelationRest = MW.restMin + cosmicRand() * MW.restRand;
    c.revelationSeed = cosmicRand(); c.revelationEnergy = 0; c.revelationAmount = 0;
    // هندسهٔ نوار (ثابت در کلِ نشست): زاویهٔ ۱۷–۳۵°، فاصله از مرکز تا سیاه‌چاله روی نوارِ روشن نیفتد، برآمدگی روی یک سمت
    c.bandAngle = (cosmicRand() < 0.5 ? -1 : 1) * (0.06 + cosmicRand() * 0.12);      // افقِ کهکشانی: تقریباً افقی
    c.bandOffset = (cosmicRand() < 0.5 ? -1 : 1) * (0.20 + cosmicRand() * 0.08);     // در ثلثِ بالا یا پایین؛ لبه‌ها سیاه‌اند
    c.bandBulge = (cosmicRand() < 0.5 ? -1 : 1) * (0.25 + cosmicRand() * 0.30);
    c.bandWidth = 0.15 + cosmicRand() * 0.04;
    BLOOMS.length = 0; c.nextBloomAt = 7 + cosmicRand() * 5;
    c.bandDirty = true;
  }
  /* ---------- دنباله‌دارها ---------- */
  // ring: دنباله‌دارِ رنگی از بیرونِ صحنه، مارپیچ‌وار به حلقهٔ هم‌رنگِ خود (۱۲ نتِ کهکشان) می‌رسد، کمی روی آن می‌لغزد و محو می‌شود.
  // star: ستارهٔ امتیازِ آهنگ که از زیرِ عنوان کنده می‌شود و در صفحهٔ کهکشان به سیاه‌چاله فرو می‌رود.
  const COMETS = [];
  const BLOOMS = [];
  function spawnBloom(t, amp) {
    if (BLOOMS.length && t - BLOOMS[BLOOMS.length - 1].born < 3) return;     // پشت‌سرهم نشود
    if (BLOOMS.length >= 3) BLOOMS.shift();
    BLOOMS.push({ s: (cosmicRand() * 2 - 1) * 0.75, w: 0.14 + cosmicRand() * 0.12, amp: amp, born: t, dur: 4.5 + cosmicRand() * 2.5 });
  }
  const BLU = new Float32Array(12);
  function bloomUniform(t) {
    BLU.fill(0);
    for (let i = 0; i < BLOOMS.length && i < 3; i++) {
      const b = BLOOMS[i], age = t - b.born; if (age < 0 || age > b.dur) continue;
      const env = smoother5(age / 1.4) * (1 - smoother5((age - (b.dur - 2.2)) / 2.2));
      BLU[i * 4] = b.s; BLU[i * 4 + 1] = b.w; BLU[i * 4 + 2] = b.amp * env;
    }
    return BLU;
  }

  const COMET_LOOK = { width: 0.72, alpha: 0.68, head: 0.5 };   // ضریب‌های ظاهر: ضخامتِ دم / شفافیت / اندازهٔ نقطهٔ سر (۱ = پیش‌فرضِ ظریف)
  V.colorLevel = 0; V.tint = new Float32Array(12);   // رنگ: پیش‌فرض سفید؛ فقط با پخشِ فعال لمسِ رنگ می‌گیرد
  const CM = { N: 34, MAXC: 12, buf: null, px: null, py: null, ds: [], dc: [], POL: [0, 0], xy: [0, 0] };
  CM.buf = new Float32Array(CM.MAXC * (2 * CM.N + 4) * 9); CM.px = new Float32Array(CM.N); CM.py = new Float32Array(CM.N);
  const STAR_RGB = [1.0, 0.92, 0.74];
  function cometPolar(m, q) {
    const P = CM.POL;
    if (m.kind === 'ring') {
      const qA = 0.76;
      // شعاع: شروعِ آرام ← شتابِ میانه ← فرودِ نرم روی حلقه (سرعتِ شعاعی در رسیدن صفر است، پس شکستگی نیست)
      if (q <= qA) { const u = q / qA, f = -1.5 * u * u * u + 2 * u * u + 0.5 * u; P[0] = m.rStart + (m.rRing - m.rStart) * f; P[1] = m.th0 + m.dir * m.turns * TAU * Math.pow(u, 1.2); return; }
      // روی حلقه: سرعتِ زاویه‌ای همان سرعتِ لحظهٔ رسیدن است و نرم کند می‌شود
      const t = (q - qA) / (1 - qA), arc = m.turns * TAU * 1.2 * (1 - qA) / (2 * qA);
      P[0] = m.rRing; P[1] = m.th0 + m.dir * m.turns * TAU + m.dir * arc * (1 - Math.pow(1 - t, 2));
      return;
    }
    const u = clamp(q, 0, 1);
    P[0] = m.r0 + (m.rEnd - m.r0) * Math.pow(u, 1.55) + m.bulge * Math.sin(Math.PI * Math.pow(u, 0.7));   // ابتدا کمی به بیرون می‌چرخد، بعد مارپیچِ رو به مرکز
    P[1] = m.th0 + m.dir * m.turns * TAU * Math.pow(u, 1.1);
  }
  function cometXY(m, q, sc, sI, cs, sn) {
    cometPolar(m, q);
    const r = CM.POL[0], th = CM.POL[1], x = r * Math.cos(th), y = r * Math.sin(th) * sI;
    CM.xy[0] = V.cx + (cs * x - sn * y) * sc; CM.xy[1] = V.cy + (sn * x + cs * y) * sc;
  }
  function cometAlpha(m, q) {
    if (m.kind === 'ring') return smoother5(q / 0.07) * (1 - smoother5((q - 0.88) / 0.12)) * (q > 0.74 ? 1.12 : 1);
    return smoother5(q / 0.06) * (1 - smoother5((q - 0.84) / 0.16));
  }
  function cometInitStar(m, sc, sI, cs, sn) {
    const dx = (m.sx - V.cx) / sc, dy = (m.sy - V.cy) / sc;
    const ux = cs * dx + sn * dy, uy = (-sn * dx + cs * dy) / sI;      // وارونِ تصویرِ صفحهٔ کهکشان
    m.th0 = Math.atan2(uy, ux); m.rEnd = HOLE_R * 0.85;
    m.r0 = Math.max(m.rEnd + 0.12, Math.hypot(ux, uy));
    m.dir = cosmicRand() < 0.5 ? -1 : 1; m.turns = 1.05 + cosmicRand() * 0.3; m.bulge = 0.2 + cosmicRand() * 0.12; m.ready = true;
  }
  function spawnComet(eventTime, boost) {                                // دنباله‌دارِ رنگیِ حلقه‌ای (ثابت در طولِ عمر، قطعی)
    const c = V.cosmic;
    let active = 0; for (let i = 0; i < COMETS.length; i++) if (COMETS[i].kind === 'ring' && eventTime < COMETS[i].born + COMETS[i].dur) active++;
    if (active >= 2 || COMETS.length >= CM.MAXC) return false;
    let idx = Math.floor(cosmicRand() * 12);
    if (A.ok) {                                                          // رنگ = نتِ غالبِ همین لحظه (اغلب)؛ حلقهٔ همان نت در کهکشان
      let top = 0; for (let i = 1; i < 12; i++) if (A.chroma[i] > A.chroma[top]) top = i;
      if (A.chroma[top] > 0.12 && cosmicRand() < 0.75) idx = top;
    }
    for (let k = 0; k < COMETS.length && k < 12; k++) if (COMETS[k].kind === 'ring' && COMETS[k].idx === idx && eventTime < COMETS[k].born + COMETS[k].dur) { idx = (idx + 5) % 12; break; }
    const rRing = V.bandIn && V.bandOut ? (V.bandIn[idx] + V.bandOut[idx]) * 0.5 : 0.2 + 0.05 * idx;
    COMETS.push({ kind: 'ring', idx: idx, born: eventTime, dur: 9 + cosmicRand() * 3, th0: cosmicRand() * TAU, dir: cosmicRand() < 0.5 ? -1 : 1,
      turns: 0.85 + cosmicRand() * 0.5, rStart: 2.05 + cosmicRand() * 0.45, rRing: rRing, tail: 0.17 + cosmicRand() * 0.05, str: clamp(0.55 + boost * 0.8, 0.5, 0.78) });
    return true;
  }
  function cancelStarFlight() { for (let i = COMETS.length - 1; i >= 0; i--) if (COMETS[i].kind === 'star') COMETS.splice(i, 1); }
  function startStarFlight() {
    if (reduced() || !VM.getStarRects) return;
    const rects = VM.getStarRects();
    if (!rects || !rects.length) return;
    const c = V.cosmic; if (!c.sessionActive) beginCosmicSession();
    cancelStarFlight();
    const t0 = c.activeElapsed;
    for (let k = 0; k < rects.length && COMETS.length < CM.MAXC; k++) {
      COMETS.push({ kind: 'star', k: k, idx: -1, born: t0 + 0.12 + k * 0.95, dur: 3.7 + cosmicRand() * 0.5, sx: rects[k].x, sy: rects[k].y, ready: false, gone: false,
        tail: 0.30, str: 0.8, th0: 0, dir: 1, turns: 1.1, r0: 0.4, rEnd: HOLE_R * 0.85, bulge: 0.25 });
    }
  }
  function tickComets(eventTime) {
    for (let i = COMETS.length - 1; i >= 0; i--) {
      const m = COMETS[i];
      if (m.kind === 'star' && !m.gone && eventTime >= m.born) { m.gone = true; try { VM.setStarState && VM.setStarState(m.k, 'gone'); } catch (e) {} }
      if (eventTime > m.born + m.dur) COMETS.splice(i, 1);
    }
  }
  function drawHotSpot(sc, Lg) {
    const gl = V.gl; if (!G.comet || !G.cometVao) return;
    const e = clamp(V.energy || 0, 0, 1), bass = V.playing ? clamp(A.low || 0, 0, 1) : 0;
    const a = Lg * (0.10 + 0.18 * V.colorLevel * (0.4 + e) + 0.16 * bass);
    if (a < 0.003) return;
    const hs = sc * HOLE_R * (4.6 + 1.2 * bass), buf = CM.buf; let o = 0;
    for (let k = 0; k < 4; k++) {
      const u = (k & 1) ? 1 : -1, v = (k & 2) ? 1 : -1;
      buf[o++] = V.cx + u * hs; buf[o++] = V.cy + v * hs; buf[o++] = u; buf[o++] = v; buf[o++] = 3; buf[o++] = a; buf[o++] = 1.0; buf[o++] = 0.76; buf[o++] = 0.42;
    }
    gl.useProgram(G.comet.p); gl.uniform2f(G.comet.u.uView, V.vw, V.vh);
    gl.bindVertexArray(G.cometVao); gl.bindBuffer(gl.ARRAY_BUFFER, G.cometBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, buf.subarray(0, o));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function drawEjecta(sc, sinI, roll, nowS, rm) {
    const gl = V.gl; if (!G.ejecta || !V.armN) return;
    const rate = clamp(V.ejRate + V.ejBurst, 0, 0.95); if (rate < 0.01) return;
    const u = G.ejecta.u;
    gl.useProgram(G.ejecta.p); gl.bindVertexArray(G.ejectaVao);
    gl.uniform2f(u.uView, V.vw, V.vh); gl.uniform2f(u.uCenter, V.cx, V.cy); gl.uniform1f(u.uScale, sc); gl.uniform1f(u.uSin, sinI); gl.uniform1f(u.uTilt, roll);
    gl.uniform1f(u.uTime, rm ? 0 : nowS % 6000); gl.uniform1f(u.uRate, rate); gl.uniform1f(u.uPx, V.rs || 1);
    gl.uniform1f(u.uPhase, V.phase + V.track * 3.1); gl.uniform1f(u.uTh0, V.armTh0); gl.uniform1f(u.uK, V.armK); gl.uniform1f(u.uArms, V.armN);
    gl.drawArrays(gl.POINTS, 0, EJ.M);
  }
  function drawComets(sc, sinI, roll, La) {
    const gl = V.gl; if (!G.comet || !G.cometVao || !COMETS.length) return;
    const c = V.cosmic, t = c.activeElapsed, N = CM.N, buf = CM.buf, px = CM.px, py = CM.py;
    const cs = Math.cos(roll), sn = Math.sin(roll), sI = Math.max(0.25, sinI), life = clamp(La * 2.5, 0, 1);
    let o = 0, nd = 0;
    for (let mi = 0; mi < COMETS.length; mi++) {
      const m = COMETS[mi], age = t - m.born;
      if (age < 0 || age > m.dur) continue;
      const q = age / m.dur;
      if (m.kind === 'star' && !m.ready) cometInitStar(m, sc, sI, cs, sn);
      const headA = cometAlpha(m, q) * m.str * life * COMET_LOOK.alpha;
      if (headA < 0.004) continue;
      let r, g, b;
      if (m.kind === 'ring') { r = PAL[m.idx * 3] * 0.62 + 0.38; g = PAL[m.idx * 3 + 1] * 0.62 + 0.38; b = PAL[m.idx * 3 + 2] * 0.62 + 0.38; }
      else { r = STAR_RGB[0]; g = STAR_RGB[1]; b = STAR_RGB[2]; }
      const tailQ = m.tail * (m.kind === 'ring' && q > 0.76 ? 1 - 0.7 * ((q - 0.76) / 0.24) : 1);
      for (let j = 0; j < N; j++) { cometXY(m, Math.max(0, q - tailQ * j / (N - 1)), sc, sI, cs, sn); px[j] = CM.xy[0]; py[j] = CM.xy[1]; }
      const hw = (m.kind === 'star' ? 2.4 : 2.0) * COMET_LOOK.width, start = o / 9;          // ظریف: روبانِ باریک
      for (let j = 0; j < N; j++) {
        const j0 = j > 0 ? j - 1 : 0, j1 = j < N - 1 ? j + 1 : N - 1;
        let tx = px[j0] - px[j1], ty = py[j0] - py[j1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        const nx = -ty, ny = tx, fr = j / (N - 1);
        const w = hw * (1 - 0.88 * fr) + 0.5;
        const a = headA * Math.pow(1 - fr, 2.0) * smoother5((q - tailQ * fr) / 0.03);   // دمِ شفاف‌تر (افتِ تندتر)
        for (let side = -1; side <= 1; side += 2) {
          buf[o++] = px[j] + nx * w * side; buf[o++] = py[j] + ny * w * side; buf[o++] = side; buf[o++] = 0;
          buf[o++] = 0; buf[o++] = a; buf[o++] = r; buf[o++] = g; buf[o++] = b;
        }
      }
      CM.ds[nd] = start; CM.dc[nd] = 2 * N; nd++;
      const hs = (m.kind === 'star' ? 11 : 6) * COMET_LOOK.head * (m.kind === 'star' ? (1 - 0.6 * smoother5((q - 0.7) / 0.3)) : 1), hk = m.kind === 'star' ? 2 : 1, hx = px[0], hy = py[0];
      const hStart = o / 9;
      for (let k = 0; k < 4; k++) {
        const u = (k & 1) ? 1 : -1, v = (k & 2) ? 1 : -1;
        buf[o++] = hx + u * hs; buf[o++] = hy + v * hs; buf[o++] = u; buf[o++] = v; buf[o++] = hk; buf[o++] = headA; buf[o++] = r; buf[o++] = g; buf[o++] = b;
      }
      CM.ds[nd] = hStart; CM.dc[nd] = 4; nd++;
    }
    if (!nd) return;
    gl.useProgram(G.comet.p); gl.uniform2f(G.comet.u.uView, V.vw, V.vh);
    gl.bindVertexArray(G.cometVao); gl.bindBuffer(gl.ARRAY_BUFFER, G.cometBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, buf.subarray(0, o));
    for (let i = 0; i < nd; i++) gl.drawArrays(gl.TRIANGLE_STRIP, CM.ds[i], CM.dc[i]);
  }

  function awakenDistantGroups(eventTime, tier, strength) {
    const c = V.cosmic;
    if (eventTime > c.wakeUntil + 6 || c.wakeTier === 0) c.wakeStart = eventTime;
    c.wakeTier = Math.max(c.wakeTier, tier);
    c.wakeStrength = Math.max(c.wakeStrength, strength);
    c.wakeUntil = Math.max(c.wakeUntil, eventTime + 5 + tier * 2);
  }
  function updateCosmic(dt, rm, titleAnimation) {
    const c = V.cosmic;
    const active = V.playing && VM.isOpen() && !document.hidden;
    if (!active) return;                       // مکث/پنهان‌بودن: زمانِ رویدادها منجمد می‌ماند و بعد از ازسرگیری همان وضعیت ادامه می‌یابد
    if (!c.sessionActive) beginCosmicSession();
    if (!rm) c.activeElapsed += Math.min(dt, 0.1);
    const eventTime = c.activeElapsed;
    tickComets(eventTime);
    for (let bi = BLOOMS.length - 1; bi >= 0; bi--) if (eventTime > BLOOMS[bi].born + BLOOMS[bi].dur) BLOOMS.splice(bi, 1);
    if (!rm && eventTime >= c.nextBloomAt) { spawnBloom(eventTime, 0.55 + 0.30 * (A.ok ? clamp(A.energy, 0, 1) : 0.4)); c.nextBloomAt = eventTime + 13 + cosmicRand() * 14; }
    const energyNow = A.ok ? clamp(A.energy, 0, 1) : 0.4;
    // دنباله‌دارها دیگر منتظر اوج نمی‌مانند: زمان‌بندِ پایه، موسیقی فقط فاصله را کمی کوتاه می‌کند
    if (!rm && eventTime >= c.nextCometAt) {
      if (spawnComet(eventTime, 0.10 * energyNow)) c.nextCometAt = eventTime + (MW.cometGapS + cosmicRand() * MW.cometGapRand) * (1.15 - 0.5 * energyNow);
      else c.nextCometAt = eventTime + 1.5;     // هر سه اسلات مشغول است؛ کمی بعد دوباره امتحان کن
    }
    if (!rm && !titleAnimation) {
      // اوج‌های واقعی (انرژیِ نرمال + شارِ طیفی) با هیسترزیس و دورهٔ بازیابی؛ حالا دنباله‌دارِ اضافه/درخشان‌تر و بیدارشدنِ ستاره‌ها
      const fluxCross = A.fluxR >= 1.7 && A.prevFluxR < 1.7;
      if (fluxCross) c.peakCandidateUntil = eventTime + 0.75;
      const energy = clamp(V.energy || 0, 0, 1);
      const rising = energy > c.prevEnergy + 0.006 || energy > 0.92;
      if (A.ok && eventTime <= c.peakCandidateUntil && energy >= 0.68 && rising && eventTime - c.lastPeakAt >= 18) {
        c.lastPeakAt = eventTime;
        c.peakCandidateUntil = -100;
        const exceptional = energy >= 0.90 && A.fluxR >= 2.1;
        const tier = exceptional ? 3 : (energy >= 0.78 ? 2 : 1);
        const probability = tier === 3 ? 0.72 : (tier === 2 ? 0.48 : 0.26);
        if (cosmicRand() < probability) {
          c.glow = Math.max(c.glow, 0.24 + 0.20 * energy);
          V.ejBurst = Math.min(0.5, V.ejBurst + (tier === 3 ? 0.40 : (tier === 2 ? 0.28 : 0.16)));
          spawnBloom(eventTime, tier === 3 ? 1.0 : (tier === 2 ? 0.8 : 0.6));
          if (tier >= 2) awakenDistantGroups(eventTime, tier, tier === 3 ? 0.62 : 0.36);
          if (tier === 1 || cosmicRand() < (tier === 3 ? 0.48 : 0.30)) spawnComet(eventTime, tier === 3 ? 0.22 : (tier === 2 ? 0.16 : 0.10));
        }
      }
    }
    c.prevEnergy = A.ok ? (V.energy || 0) : 0;
    c.glow *= Math.exp(-dt * (rm ? 1.2 : 0.22));
    const count = c.wakeTier === 3 ? COSMIC_GROUPS : (c.wakeTier === 2 ? 10 : 4);
    const fadeAt = c.wakeUntil + 6;
    const fade = 1 - smoother5((eventTime - c.wakeUntil) / 6);
    for (let i = 0; i < COSMIC_GROUPS; i++) {
      let target = 0;
      if (!rm && i < count && eventTime < fadeAt) {
        const rise = smoother5((eventTime - c.wakeStart - c.groupDelay[i]) / 2.8);
        target = c.wakeStrength * rise * fade;
      }
      c.reveal[i] += (target - c.reveal[i]) * expK(dt, target > c.reveal[i] ? 1.2 : 3.8);
    }
    if (eventTime >= fadeAt) { c.wakeTier = 0; c.wakeStrength = 0; }
    // راه شیری: نوردهیِ پایهٔ همیشگی + چرخه‌های دوره‌ایِ «نمایان‌شدن» (ظهور ← شکوه ← محو تا نوردهیِ پایه). به شدتِ موسیقی وابسته نیست.
    const cycleLen = c.revelationAppear + c.revelationHold + c.revelationFade;
    const age = eventTime - c.revelationStart;
    let env = 0;
    if (!rm && age >= 0) {
      const a = age % (cycleLen + c.revelationRest);
      if (a < cycleLen) env = smoother5(a / c.revelationAppear) * (1 - smoother5((a - c.revelationAppear - c.revelationHold) / c.revelationFade));
    }
    const target = rm ? MW.base * 0.8 : MW.base + (1 - MW.base) * env;
    c.revelationAmount += (target - c.revelationAmount) * expK(dt, 1.2);
    c.revelationEnergy += (clamp(V.energy || 0, 0, 1) - c.revelationEnergy) * expK(dt, 1.6);
  }
  function resetCosmicNarrative() {
    const c = V.cosmic;
    c.nextCometAt = 0; c.lastPeakAt = -100; c.peakCandidateUntil = -100; c.prevEnergy = 0;
    c.wakeStart = -100; c.wakeUntil = -100; c.wakeTier = 0; c.wakeStrength = 0; c.glow = 0;
    c.slotStart.fill(-100); c.infallUniforms.fill(0); c.reveal.fill(0); COMETS.length = 0; BLOOMS.length = 0;
    c.sessionActive = false; c.activeElapsed = 0; c.revelationStart = 0; c.revelationAmount = 0; c.revelationEnergy = 0; c.rng = null;
  }

  function step(dt, nowS) {
    const audio = VM.getAudio();
    const dur = audio && isFinite(audio.duration) ? audio.duration : 0;
    const rem = dur ? dur - audio.currentTime : Infinity;
    const pst = powderState(rem, dur);
    V.powder.on = pst.on; V.powder.appear = pst.appear; V.powder.prog = pst.prog; V.powder.T = pst.T || 0;
    if (V.entrance.active || V.entrance.pending) {
      if (pst.on || !V.playing || !VM.isOpen() || document.hidden || reduced()) cancelTitleEntrance(false);
      else if (V.entrance.active) V.entrance.elapsed += dt;
    }
    if (V.entrance.active && V.entrance.elapsed >= V.entrance.duration + V.entrance.handoff) { startStarFlight(); cancelTitleEntrance(false); }
    VM.setPowder((pst.on && V.powder.n > 0) || (V.entrance.active && V.entrance.elapsed < V.entrance.duration + V.entrance.handoff));

    const needSpec = V.L.galaxy > 0.02 || V.stage === 'galaxy' || pst.on;
    if (A.ok && V.playing && audio && !audio.paused) analyze(dt, needSpec);
    updateStage(dt, nowS);

    const rm = reduced();
    let energy = A.ok ? A.energy : clamp(0.52 + 0.30 * Math.sin(nowS * 0.33) + 0.12 * Math.sin(nowS * 1.1), 0, 1);
    energy = V.energy = (V.energy || 0) + (energy - (V.energy || 0)) * expK(dt, 0.25);
    updateCosmic(dt, rm, pst.on || V.entrance.pending || V.entrance.active);

    if (!V.playing) {
      const k = Math.exp(-dt / 0.55);
      A.low *= k; A.mid *= k; A.high *= k;
    }

    const soft = 1 - energy;
    const aT = !V.playing ? 0 : (V.stage === 'galaxy' ? 0.30 + 0.24 * soft : 0.46 + 0.50 * Math.pow(soft, 1.2) + 0.06 * energy) * (rm ? 0.6 : 1);
    V.rich += ((V.stage === 'galaxy' ? 0.30 : 0.45 + 0.55 * soft) - V.rich) * expK(dt, 1.2);
    // سیاه‌چاله همیشه (حتی کم‌رنگ و میانِ شفق) حاضر است: با آهنگ بارگذاری‌شده حتی در مکث یک ردِ ملایم می‌ماند
    const gT = !V.playing ? CFG.holeRest : (V.stage === 'galaxy' ? 1 : (pst.on ? 0.8 : CFG.holeBase + 0.25 * energy));
    V.L.aurora += (aT - V.L.aurora) * expK(dt, aT > V.L.aurora ? 0.9 : (V.playing ? 1.2 : 0.55));
    V.L.galaxy += (gT - V.L.galaxy) * expK(dt, gT > V.L.galaxy ? 0.45 : (V.playing ? 1.4 : 0.8));
    V.L.lum += ((0.35 + 0.65 * energy) - V.L.lum) * expK(dt, 0.3);

    // دورانِ دیفرانسیلیِ بسیار نرم (فازِ مشترک؛ سرعتِ هر نقطه از ω(r) در شیدر)
    V.phase += dt * 0.0065 * (1 + 1.0 * energy);
    // Multi-scale, deterministic drift changes disk density over long sessions without rebuilding geometry.
    const structureTarget = V.playing && !rm
      ? 0.56 * Math.sin(nowS * 0.0217 + V.seed3[0] * TAU) + 0.29 * Math.sin(nowS * 0.0081 + V.seed3[1] * TAU) + 0.15 * Math.sin(nowS * 0.0037 + V.seed3[2] * TAU)
      : 0;
    V.structure += (structureTarget - V.structure) * expK(dt, V.playing && !rm ? 7.0 : 1.8);
    // هالهٔ سیاه‌چاله: زمانِ جریان (با انرژی تندتر)، جرقهٔ ضربه و رنگِ ملایمِ نتِ غالب (حداکثر ۵۵٪ مخلوط)
    V.haloT += dt * (0.55 + 1.5 * energy);
    {
      let sr = 0, sg = 0, sb = 0, sw = 0.0001;
      for (let i = 0; i < 12; i++) { const c = A.chroma[i]; sr += PAL[i * 3] * c; sg += PAL[i * 3 + 1] * c; sb += PAL[i * 3 + 2] * c; sw += c; }
      const k = expK(dt, 0.5);
      V.noteC[0] += (sr / sw - V.noteC[0]) * k; V.noteC[1] += (sg / sw - V.noteC[1]) * k; V.noteC[2] += (sb / sw - V.noteC[2]) * k;
    }
    V.flare *= Math.exp(-dt * 2.2);
    {
      let top = 0; for (let i = 1; i < 12; i++) if (A.chroma[i] > A.chroma[top]) top = i;
      const mixW = A.ok ? clamp(A.conf * Math.min(1, A.chroma[top] * 1.2), 0, 1) * 0.22 : 0;   // حداکثر ۲۲٪ رنگ نت: هارمونی، نه وحشی
      const k = expK(dt, 0.25);
      for (let c = 0; c < 3; c++) V.tintC[c] += ((WARM[c] * (1 - mixW) + PAL[top * 3 + c] * mixW) - V.tintC[c]) * k;
    }
    if (!A.ok) {                                                  // جایگزینِ تزئینی وقتی آنالیز در دسترس نیست
      for (let i = 0; i < 12; i++) { const s = 0.5 + 0.5 * Math.sin(nowS * 0.9 - i * 0.62); A.chroma[i] = 0.62 * s * s; }
      A.conf = 0.5;
    }
    // رنگ: تصویرِ آغازین و لحظه‌های مکث/بی‌صدایی سفیدِ واقع‌گرایانه است؛ با پخش، هر لایه (نتِ خودش) به‌اندازهٔ انرژیِ همان لحظه لمسِ رنگ می‌گیرد
    {
      const e = clamp(V.energy || 0, 0, 1);
      const colTarget = V.playing ? clamp(0.30 + 1.4 * e, 0, 1) * smoother5((e - 0.012) / 0.05) : 0;
      V.colorLevel += (colTarget - V.colorLevel) * expK(dt, colTarget > V.colorLevel ? 2.0 : 1.3);
      for (let b = 0; b < 12; b++) {
        const want = V.colorLevel * (0.22 + 0.78 * smoother5((A.chroma[b] - 0.04) / 0.5));
        V.tint[b] += (want - V.tint[b]) * expK(dt, want > V.tint[b] ? 0.30 : 1.0);
      }
    }
    {   // نرخِ جداشدنِ ستاره‌ها از بازوها: با انرژیِ موسیقی؛ اوج‌ها فوران می‌دهند و سریع فرو می‌نشینند (صحنه شلوغ نمی‌شود)
      const e2 = clamp(V.energy || 0, 0, 1), rt = V.playing ? clamp(0.10 + 0.50 * e2, 0, 0.7) : 0;
      V.ejRate += (rt - V.ejRate) * expK(dt, rt > V.ejRate ? 1.6 : 1.2);
      V.ejBurst = Math.max(0, V.ejBurst - dt * 0.5);
    }
    // دوربین: شیبِ دیسک و رولِ بسیار کند — حسِ شناور بودن در فضا (دوره‌ها ≈ ۱۲۰ و ۹۰ ثانیه)
    V.inclNow = V.incl + 6 * Math.sin(nowS * 0.052);
    V.rollNow = V.tilt + 0.05 * Math.sin(nowS * 0.07 + 1.3);
    // حرکتِ دوربین مستقل از انرژی و ضربانِ صداست؛ reduced-motion آن را متوقف می‌کند.
    const openingActive = V.playing && VM.isOpen() && !document.hidden && !rm;
    if (openingActive && !V.opening.started) startCinematicOpening();
    if (openingActive && V.opening.started && !V.entrance.pending && !V.entrance.active && !pst.on) {
      V.opening.elapsed += dt;
    }
    const cycleS = Math.max(1, V.opening.cycleS || BREATH.maxCycleS);
    const cyclePhase = (V.opening.elapsed % cycleS) / cycleS;
    V.opening.progress = V.opening.started
      ? (cyclePhase < BREATH.openPart
        ? smoother5(cyclePhase / BREATH.openPart)
        : 1 - smoother5((cyclePhase - BREATH.openPart) / (1 - BREATH.openPart)))
      : 0;
    const openProgress = V.opening.progress;
    if (!Number.isFinite(V.breath.pitch)) V.breath.pitch = Number.isFinite(V.incl) ? V.incl : 50;
    if (!Number.isFinite(V.breath.zoom)) V.breath.zoom = 1;
    if (!Number.isFinite(V.breath.mix)) V.breath.mix = 0;
    if (!Number.isFinite(V.breath.disk)) V.breath.disk = 0;
    const pitchTarget = lerp(BREATH.startPitch, BREATH.endPitch, openProgress);
    const zoomTarget = lerp(BREATH.startZoom, BREATH.endZoom, openProgress);
    V.breath.pitch += (pitchTarget - V.breath.pitch) * expK(dt, 0.8);
    V.breath.zoom += (zoomTarget - V.breath.zoom) * expK(dt, 0.8);
    const breathActive = V.playing && VM.isOpen() && !document.hidden && !rm;
    const diskBreathTarget = breathActive ? openProgress * (0.07 + 0.03 * clamp(V.energy || 0, 0, 1)) : 0;
    V.breath.disk += (diskBreathTarget - V.breath.disk) * expK(dt, diskBreathTarget > V.breath.disk ? 1.6 : 2.2);
    if (rm) V.breath.mix = 0;
    else V.breath.mix += ((breathActive ? 1 : 0) - V.breath.mix) * expK(dt, 1.8);
    V.tilt += (V.tiltT - V.tilt) * expK(dt, 2.5);
    V.spiralPh += (V.spiralPhT - V.spiralPh) * expK(dt, 2.5);

    // ضربهٔ محدود: حداکثر ~۳ بار در ثانیه، فقط در کهکشان
    if (V.stage === 'galaxy' && !rm && A.ok && ((A.fluxR > 1.7 && A.prevFluxR <= 1.7) || A.bassBeat) && nowS - A.lastOnset > 0.34) {
      A.lastOnset = nowS; V.pulse.t0 = nowS; V.pulse.amp = clamp((A.fluxR - 1) * 0.35, 0.25, 0.75); V.flare = Math.max(V.flare, V.pulse.amp);
    }
  }

  /* ---------- رسم ---------- */
  function draw(nowS) {
    const gl = V.gl;
    const rm = reduced();
    const La = V.L.aurora, Lg = V.L.galaxy;
    const baseIncl = Number.isFinite(V.inclNow) ? V.inclNow : V.incl;
    const mix = Number.isFinite(V.breath.mix) ? clamp(V.breath.mix, 0, 1) : 0;
    const breathPitch = Number.isFinite(V.breath.pitch) ? clamp(V.breath.pitch, BREATH.startPitch, 70) : baseIncl;
    const breathZoom = Number.isFinite(V.breath.zoom) ? clamp(V.breath.zoom, BREATH.startZoom, 1.02) : 1;
    const diskBreath = !rm && Number.isFinite(V.breath.disk) ? clamp(V.breath.disk, 0, 0.10) : 0;
    const cameraPitch = lerp(baseIncl, breathPitch, mix);
    const sinI = Math.sin(cameraPitch * Math.PI / 180);
    const sceneScale = V.scale * lerp(1, breathZoom, mix);
    const rollFade = V.opening.started ? smoother5(V.opening.elapsed / BREATH.rollFadeS) : 0;
    const roll = (V.rollNow || V.tilt) + (rm ? 0 : (1 - rollFade) * BREATH.startRoll);
    gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND);
    if (V.cosmic.bandDirty && G.bandBuf) uploadBandStars();
    // نوار با سطحِ شفق محو می‌شود تا وقتی پخش متوقف می‌شود ناگهان نپرد
    const bandAmt = V.cosmic.revelationAmount * clamp(La * 3.0, 0, 1);

    if (La > 0.003) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, G.fbo); gl.viewport(0, 0, G.aw, G.ah);
      gl.disable(gl.BLEND);
      gl.useProgram(G.aurora.p);
      gl.uniform2f(G.aurora.u.uRes, G.aw, G.ah); gl.uniform1f(G.aurora.u.uTime, rm ? 0 : nowS + V.track * 17.0);
      gl.uniform1f(G.aurora.u.uLevel, La);
      gl.uniform3f(G.aurora.u.uSeed, V.seed3[0], V.seed3[1], V.seed3[2]);
      let top = 0; for (let i = 1; i < 12; i++) if (A.chroma[i] > A.chroma[top]) top = i;
      gl.uniform3f(G.aurora.u.uTint, PAL[top * 3], PAL[top * 3 + 1], PAL[top * 3 + 2]);
      gl.uniform2f(G.aurora.u.uHole, V.cx / V.vw, 1 - V.cy / V.vh); gl.uniform1f(G.aurora.u.uAsp, V.vw / V.vh);
      gl.uniform1f(G.aurora.u.uBend, clamp(0.45 + 0.55 * Lg, 0, 1));
      const c = V.cosmic, infall = c.infallUniforms;
      const bandTemp = clamp((A.centroidR - 0.2) / 0.5, 0, 1);
      gl.uniform4f(G.aurora.u.uBand, c.bandAngle, c.bandOffset, c.bandBulge, c.bandWidth);
      gl.uniform4f(G.aurora.u.uBandP, bandAmt, c.revelationSeed, c.revelationEnergy, bandTemp);
      gl.uniform1f(G.aurora.u.uBandLow, rm ? 0 : A.low);
      gl.uniform4fv(G.aurora.u['uBloom[0]'], bloomUniform(c.activeElapsed));
      infall.fill(0);                                                   // دنباله‌دارها حالا با روبانِ جدا رسم می‌شوند (drawComets)
      gl.uniform4fv(G.aurora.u['uInfall[0]'], infall);
      gl.uniform1f(G.aurora.u.uInfallTail, c.infallTail);
      gl.uniform1f(G.aurora.u.uHorizon, cosmicHorizonRadius());
      gl.bindVertexArray(G.emptyVao); gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.enable(gl.BLEND);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, V.W, V.H);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);

    gl.blendFunc(gl.ONE, gl.ONE);
    if (La > 0.003) {
      gl.useProgram(G.blit.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, G.tex);
      gl.uniform1i(G.blit.u.uTex, 0); gl.uniform2f(G.blit.u.uRes, V.W, V.H); gl.uniform1f(G.blit.u.uMix, 1);
      gl.bindVertexArray(G.emptyVao); gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    if (La > 0.003 && G.cosmicVao) {
      const cu = G.cosmic.u;
      gl.useProgram(G.cosmic.p);
      gl.uniform2f(cu.uView, V.vw, V.vh); gl.uniform1f(cu.uPx, V.rs);
      gl.uniform1f(cu.uTime, rm ? 0 : nowS); gl.uniform1f(cu.uLevel, La);
      gl.uniform1f(cu.uGlow, rm ? 0 : V.cosmic.glow);
      gl.uniform1f(cu.uAspect, V.vw / Math.max(1, V.vh));
      const primary = cosmicPrimaryCenter();
      gl.uniform3f(cu.uPrimary, primary[0], primary[1], cosmicPrimaryRadius());
      gl.uniform1fv(cu['uReveal[0]'], V.cosmic.reveal);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, G.tex); gl.uniform1i(cu.uBandTex, 0);
      gl.uniform1f(cu.uBandAmt, bandAmt); gl.uniform1f(cu.uBandHigh, rm ? 0 : A.high);
      gl.bindVertexArray(G.cosmicVao); gl.drawArrays(gl.POINTS, 0, G.cosmicCount);
      if (G.bandCount > 0 && bandAmt > 0.003) { gl.bindVertexArray(G.bandVao); gl.drawArrays(gl.POINTS, 0, G.bandCount); }
    }

    if (La > 0.003 && COMETS.length) drawComets(sceneScale, sinI, roll, La);
    if (Lg > 0.004) { drawHotSpot(sceneScale, Lg); drawEjecta(sceneScale, sinI, roll, nowS, rm); }

    if (Lg > 0.004) {
      const u = G.dots.u, n = Math.max(1500, Math.floor(V.N * V.q));
      const au = G.aurDots.u, aurN = Math.floor(V.auroraN * V.q);
      const pp = clamp((nowS - V.pulse.t0) / 1.7, 0, 1);
      const setAurDots = function (half) {
        if (La <= 0.003 || aurN <= 0) return;
        gl.useProgram(G.aurDots.p);
        gl.uniform2f(au.uView, V.vw, V.vh); gl.uniform2f(au.uCenter, V.cx, V.cy);
        gl.uniform1f(au.uScale, sceneScale); gl.uniform1f(au.uSin, sinI); gl.uniform1f(au.uTilt, roll); gl.uniform1f(au.uPx, V.rs); gl.uniform1f(au.uHalf, half);
        gl.uniform1f(au.uDiskBreath, diskBreath); gl.uniform1f(au.uPhase, rm ? 0 : V.phase + V.track * 3.1); gl.uniform1f(au.uTime, rm ? 0 : nowS % 6000);
        gl.uniform1f(au.uLevel, La); gl.uniform1f(au.uLum, V.L.lum);
        gl.uniform1f(au.uLow, rm ? 0 : A.low); gl.uniform1f(au.uMid, rm ? 0 : A.mid); gl.uniform1f(au.uHigh, rm ? 0 : A.high);
        gl.uniform1f(au.uDim, clamp(0.45 + 0.55 * V.scale / 700, 0.45, 1)); gl.uniform1fv(au.uChroma, A.chroma); gl.uniform1fv(au.uTint, V.tint); gl.uniform1f(au.uHoleR, HOLE_R);
        gl.bindVertexArray(G.aurVao); gl.drawArrays(gl.POINTS, V.auroraStart, aurN);
      };
      const setDots = function (half) {
        gl.useProgram(G.dots.p);
        gl.uniform2f(u.uView, V.vw, V.vh); gl.uniform2f(u.uCenter, V.cx, V.cy);
        gl.uniform1f(u.uScale, sceneScale); gl.uniform1f(u.uSin, sinI); gl.uniform1f(u.uTilt, roll); gl.uniform1f(u.uPx, V.rs); gl.uniform1f(u.uHalf, half);
        gl.uniform1f(u.uDiskBreath, diskBreath);
        gl.uniform1f(u.uHoleR, HOLE_R);
        gl.uniform1f(u.uPhase, V.phase + V.track * 3.1);
        gl.uniform1f(u.uReveal, Lg * 1.4 - 0.1);
        gl.uniform1f(u.uLum, V.L.lum); gl.uniform1f(u.uTime, nowS % 6000);
        gl.uniform1f(u.uPulseR, 0.12 + 0.95 * pp); gl.uniform1f(u.uPulseA, pp < 1 ? V.pulse.amp * Math.pow(1 - pp, 1.5) : 0);
        gl.uniform1f(u.uConf, A.ok ? A.conf : 0);
        gl.uniform1f(u.uDim, clamp(0.45 + 0.55 * V.scale / 700, 0.45, 1));
        gl.uniform1f(u.uMid, rm ? 0 : A.mid); gl.uniform1f(u.uHigh, rm ? 0 : A.high); gl.uniform1f(u.uStructure, rm ? 0 : V.structure);
        gl.uniform1fv(u.uChroma, A.chroma); gl.uniform1fv(u.uTint, V.tint); gl.uniform3fv(u.uPal, PAL);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, G.tex); gl.uniform1i(u.uAur, 0);
        gl.uniform1f(u.uAurMix, La > 0.003 ? clamp(La * 1.5, 0, 1) : 0);
        gl.bindVertexArray(G.dotVao); gl.drawArrays(gl.POINTS, 0, n);
      };
      setAurDots(0);
      setDots(0);                                             // نیمهٔ دورِ حلقه‌ها (پشتِ کره)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const h = G.hor.u;
      gl.useProgram(G.hor.p);
      gl.uniform2f(h.uCanvas, V.W, V.H); gl.uniform1f(h.uPx, V.rs); gl.uniform2f(h.uCenter, V.cx, V.cy);
      gl.uniform1f(h.uScale, sceneScale); gl.uniform1f(h.uHoleR, HOLE_R);
      gl.uniform1f(h.uLevel, Lg); gl.uniform1f(h.uLum, V.L.lum);
      gl.uniform1f(h.uTime, V.haloT); gl.uniform1f(h.uEnergy, V.energy || 0); gl.uniform1f(h.uBass, rm ? 0 : A.low); gl.uniform1f(h.uFlare, V.flare);
      gl.uniform1f(h.uAxis, roll + V.haloT * 0.05); gl.uniform3f(h.uTint, V.tintC[0], V.tintC[1], V.tintC[2]);
      gl.bindVertexArray(G.emptyVao); gl.drawArrays(gl.TRIANGLES, 0, 3);     // کرهٔ کامل
      gl.blendFunc(gl.ONE, gl.ONE);
      setAurDots(1);
      setDots(1);                                             // نیمهٔ نزدیکِ حلقه‌ها (جلوی کره)
    }

    if ((V.powder.on || V.entrance.active) && V.powder.n > 0) {
      const w = G.pow.u;
      const entering = V.entrance.active && !V.powder.on;
      const fade = entering ? clamp((V.entrance.duration + V.entrance.handoff - V.entrance.elapsed) / V.entrance.handoff, 0, 1) : 1;
      gl.useProgram(G.pow.p);
      gl.uniform2f(w.uView, V.vw, V.vh); gl.uniform2f(w.uCenter, V.cx, V.cy);
      gl.uniform1f(w.uProg, V.powder.prog); gl.uniform1f(w.uApp, entering ? clamp(V.entrance.elapsed / 0.10, 0, 1) : V.powder.appear);
      gl.uniform1f(w.uSin, sinI); gl.uniform1f(w.uPx, V.rs);
      gl.uniform1f(w.uBoxX, V.powder.box[0]); gl.uniform1f(w.uBoxW, V.powder.box[1]);
      gl.uniform1f(w.uMode, entering ? 1 : 0); gl.uniform1f(w.uEnter, entering ? clamp(V.entrance.elapsed / V.entrance.duration, 0, 1) : 0);
      gl.uniform1f(w.uCoreR, HOLE_R * sceneScale * 1.05); gl.uniform1f(w.uFade, fade); gl.uniform1f(w.uHasStars, V.powder.hasStars ? 1 : 0);
      gl.bindVertexArray(V.powder.vao); gl.drawArrays(gl.POINTS, 0, V.powder.n);
    }
    gl.bindVertexArray(null);
  }

  /* ---------- حلقه ---------- */
  function startLoop() {
    if (V.running || !V.ok) return;
    refreshTaps();
    V.running = true; V.last = performance.now();
    V.raf = requestAnimationFrame(frame);
  }
  function stopLoop(clear) {
    V.running = false;
    if (V.raf) { cancelAnimationFrame(V.raf); V.raf = 0; }
    if (clear && V.ok) { try { V.gl.bindFramebuffer(V.gl.FRAMEBUFFER, null); V.gl.clearColor(0, 0, 0, 0); V.gl.clear(V.gl.COLOR_BUFFER_BIT); } catch (e) {} }
    VM.setPowder(false);
    cancelTitleEntrance(false);
  }
  function frame(now) {
    V.raf = 0;
    if (!V.running) return;
    const rm = reduced();
    const fast = !rm && (V.stage === 'galaxy' || V.L.galaxy > 0.05 || V.powder.on || V.entrance.active);
    const minDt = 1000 / (rm ? CFG.reducedFps : (fast ? CFG.galaxyFps * (SND.vq === 'low' ? 0.8 : 1) : CFG.calmFps));
    const dtMs = now - V.last;
    if (dtMs < minDt - 3) { V.raf = requestAnimationFrame(frame); return; }
    V.last = now;
    const dt = Math.min(dtMs, 100) / 1000, nowS = now / 1000;
    V.time = nowS;
    // پودر: در صورت نیاز یک بار (برای همین آهنگ/اندازه) نمونه‌برداری کن
    if ((V.powder.on || V.entrance.pending) && V.powder.key === '') {
      V.powder.key = 'x'; buildPowder();
      if (V.entrance.pending) {
        if (V.powder.n > 0 && V.playing && VM.isOpen() && !document.hidden && !reduced() && !V.powder.on) { V.entrance.pending = false; V.entrance.active = true; V.entrance.elapsed = 0; VM.setPowder(true); }
        else cancelTitleEntrance(true);
      }
    }
    const c0 = performance.now();
    step(dt, nowS);
    if (V.powder.on && V.powder.key === '') { V.powder.key = 'x'; buildPowder(); }
    draw(nowS);
    V.cpuMs += ((performance.now() - c0) - V.cpuMs) * 0.1;
    if ((V.frames & 3) === 0) pushVizNow();

    V.frames++; V.fpsT += dt;
    if (V.fpsT >= 1) {
      V.fps = V.frames / V.fpsT; V.frames = 0; V.fpsT = 0;
      if (SND.vq === 'low' && V.q > 0.55) V.q = 0.55;
      if (V.L.galaxy > 0.6 && !document.hidden && now > V.grace) {
        const tgt = rm ? CFG.reducedFps : CFG.galaxyFps;
        if (V.fps < tgt * 0.7 || V.cpuMs > 12) { V.fastN = 0; if (++V.slowN >= 2) { V.q = Math.max(SND.vq === 'high' ? 0.8 : 0.3, V.q * 0.72); V.slowN = 0; } }
        else if (V.fps >= tgt * 0.93 && V.cpuMs < 8) { V.slowN = 0; if (++V.fastN >= 6 && V.q < 1) { V.q = Math.min(1, V.q * 1.15); V.fastN = 0; } }
        else { V.slowN = 0; V.fastN = 0; }
      }
    }
    if (V.hudOn) updateHud(now);

    if (!V.playing && V.L.aurora < 0.004 && Math.abs(V.L.galaxy - CFG.holeRest) < 0.008) {
      stopLoop(false);                                           // آخرین فریم (سیاه‌چاله‌ی کم‌نور) روی صفحه می‌ماند؛ دیگر هیچ پردازشی نیست
      try { const au = VM.getAudio(); if (A.ok && A.ctx.state === 'running' && au && au.paused) A.ctx.suspend(); } catch (e) {}
      if (V.hudOn) updateHud(now);
      return;
    }
    V.raf = requestAnimationFrame(frame);
  }

  /* ---------- HUD (Shift+D) ---------- */
  function updateHud(now) {
    if (!V.hud || now - V.hudT < 250) return;
    V.hudT = now;
    let top = 0; for (let i = 1; i < 12; i++) if (A.chroma[i] > A.chroma[top]) top = i;
    V.hud.textContent =
      'stage ' + V.stage + '  t ' + V.stageT.toFixed(1) + 's   fps ' + V.fps.toFixed(0) + '   dots ' + Math.floor(V.N * V.q) + '/' + V.N + '\n' +
      'db ' + A.db.toFixed(1) + '  pk/fl ' + A.pk.toFixed(0) + '/' + A.fl.toFixed(0) + '  en ' + A.en.toFixed(2) + '  E ' + A.energy.toFixed(2) + '  flux x' + A.fluxR.toFixed(2) + '  energy ' + (V.energy || 0).toFixed(2) + '\n' +
      'conf ' + A.conf.toFixed(2) + '  top ' + NOTE[top] + ' ' + A.chroma[top].toFixed(2) + '  centroid ' + A.centroidR.toFixed(2) + '  bright ' + A.bright.toFixed(2) + '\n' +
      'bands low/mid/high ' + A.low.toFixed(2) + '/' + A.mid.toFixed(2) + '/' + A.high.toFixed(2) + '  structure ' + V.structure.toFixed(2) + '\n' +
      'aurora ' + V.L.aurora.toFixed(2) + '  galaxy ' + V.L.galaxy.toFixed(2) + '  powder ' + (V.powder.on ? V.powder.prog.toFixed(2) + '/T' + V.powder.T.toFixed(1) : '-') + '  ctx ' + (A.ok ? A.ctx.state : A.state) + '  thr ' + CFG.enterDb.toFixed(1) + '/' + CFG.exitDb.toFixed(1);
  }
  function toggleHud() {
    V.hudOn = !V.hudOn;
    if (!V.hud) {
      V.hud = document.createElement('div'); V.hud.className = 'vm-hud';
      const root = VM.getRoot(); if (root) root.appendChild(V.hud);
    }
    V.hud.hidden = !V.hudOn;
    if (V.hudOn) { V.hudT = 0; updateHud(performance.now() + 1000); }
  }
  document.addEventListener('keydown', function (e) {
    if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'D' || e.key === 'd') && VM.isOpen()) { toggleHud(); }
  }, true);

  /* ---------- رویدادهای Music Mode ---------- */
  function newTrackLook(seed) {
    cancelTitleEntrance(true);
    const r = mulberry32((seed ^ V.session) >>> 0);
    V.track++;
    V.tiltT = (r() - 0.5) * 0.35;                // ±۱۰° شیبِ دیسک
    V.spiralPhT = r() * TAU;
    V.seed3 = [r(), r(), r()];
    A.warm = 1.5; A.snap = true;
    V.powder.key = '';
  }
  window.addEventListener('voidmusic:track', function (e) { cancelStarFlight(); newTrackLook((e.detail && e.detail.seed) || Math.random() * 4294967296); });
  window.addEventListener('voidmusic:title-ready', function (e) { startTitleEntrance(e.detail); });


  /* ------------------------------------------------------------------ */
  /* ویژولایزرِ کوچکِ orb شناور (بیرون از Music Mode)                       */
  /* ------------------------------------------------------------------ */
  // فقط وقتی کار می‌کند که: موزیک پخش شود + orb دیده شود + تب پیدا باشد. ~۱۵fps، یک canvasِ ۲Dِ کوچک.
  // همان ۱۲ حلقهٔ کلاسِ نت (هم‌زبان با کهکشانِ اصلی) با دیدِ از بالا؛ کره‌ی سیاه در مرکز.
  const RMV = { chroma: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], energy: 0 };
  function pushVizNow() {
    if (!VM.pushViz) return;
    for (let i = 0; i < 12; i++) RMV.chroma[i] = Math.round(A.chroma[i] * 1000) / 1000;
    RMV.energy = A.energy; VM.pushViz(RMV);
  }
  // وقتی تبِ Void Tab پنهان است rAF نمی‌چرخد؛ اگر تبِ دیگری orb را نشان می‌دهد، با یک setInterval ِسبک (~۶Hz) تحلیل را ادامه می‌دهیم
  let bgT = 0;
  function bgKick() {
    if (bgT) return;
    bgT = setInterval(function () {
      const a = VM.getAudio();
      if (SND.bg !== 'live' || !document.hidden || !(a && !a.paused)) { clearInterval(bgT); bgT = 0; return; }
      if (!(VM.remoteWanted && VM.remoteWanted())) return;
      if (!A.ok) return;
      try { analyze(0.17, true); pushVizNow(); } catch (e) {}
    }, 170);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (SND.bg === 'live') bgKick(); } else refreshTaps(); });
  const MINI = { raf: 0, last: 0, tick: 0, boot: false };
  function miniActive() {
    const a = VM.getAudio();
    return !!(a && !a.paused && !VM.isOpen() && VM.isMiniVisible && VM.isMiniVisible() && !document.hidden && VM.getMiniCanvas && VM.getMiniCanvas());
  }
  const PAL_CSS = [], PAL_CSS_L = [];
  for (let i = 0; i < 12; i++) {
    const r = Math.round(PAL[i * 3] * 255), g = Math.round(PAL[i * 3 + 1] * 255), b = Math.round(PAL[i * 3 + 2] * 255);
    PAL_CSS.push('rgb(' + r + ',' + g + ',' + b + ')'); PAL_CSS_L.push('rgb(' + Math.min(255, r + 60) + ',' + Math.min(255, g + 60) + ',' + Math.min(255, b + 60) + ')');
  }
  const MG = { W: 0, g: null, bg: null, sph: null, conic: null };
  function miniGrad(g, W, c, R) {
    // گرادیان‌ها فقط وقتی اندازه عوض شود ساخته می‌شوند (نه هر فریم)
    MG.W = W; MG.g = g;
    MG.bg = g.createRadialGradient(c, c, 0, c, c, R);
    MG.bg.addColorStop(0, 'rgba(0,0,0,1)'); MG.bg.addColorStop(0.35, 'rgba(2,3,9,0.94)'); MG.bg.addColorStop(1, 'rgba(9,14,28,0.88)');
    const sr = R * 0.22;
    MG.sph = g.createRadialGradient(0, 0, sr * 0.2, 0, 0, sr * 1.25);
    MG.sph.addColorStop(0, 'rgba(0,0,0,1)'); MG.sph.addColorStop(0.8, 'rgba(0,0,0,1)'); MG.sph.addColorStop(0.9, 'rgba(60,44,20,0.55)'); MG.sph.addColorStop(1, 'rgba(0,0,0,0)');
    MG.conic = g.createConicGradient ? g.createConicGradient(0, 0, 0) : null;
    if (MG.conic) {
      MG.conic.addColorStop(0, 'rgba(255,215,150,0.75)'); MG.conic.addColorStop(0.3, 'rgba(255,190,110,0.12)');
      MG.conic.addColorStop(0.62, 'rgba(255,170,100,0.04)'); MG.conic.addColorStop(0.86, 'rgba(255,200,130,0.30)'); MG.conic.addColorStop(1, 'rgba(255,215,150,0.75)');
    }
  }
  function miniDraw(t, live) {
    const cv = VM.getMiniCanvas(); if (!cv) return;
    const g = cv.getContext('2d'); const W = cv.width, c = W / 2, R = c * 0.97;
    if (MG.W !== W || MG.g !== g) miniGrad(g, W, c, R);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.clearRect(0, 0, W, W);
    g.save(); g.beginPath(); g.arc(c, c, R, 0, TAU); g.clip();
    g.fillStyle = MG.bg; g.fillRect(0, 0, W, W);
    const ratio = 0.74 + 0.05 * Math.sin(t * 0.09);                 // دیدِ از بالا که آرام تاب می‌خورد
    g.translate(c, c); g.rotate(Math.sin(t * 0.11) * 0.28 + V.tilt);
    const px = W / 64;
    for (let i = 0; i < 12; i++) {
      const e = live && A.ok ? A.chroma[i] : (live ? 0.14 + 0.12 * Math.sin(t * 1.4 + i * 0.9) : 0.08);
      const rx = R * (0.36 + 0.049 * i), ry = rx * ratio;
      g.strokeStyle = PAL_CSS[i]; g.globalAlpha = 0.17 + 0.83 * Math.min(1, e * 1.15);
      g.lineWidth = Math.max(1, px * (0.9 + 1.1 * e));
      g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, TAU); g.stroke();
      if (live && e > 0.32) {                                           // جرقه‌های LED روی حلقه‌های روشن
        g.fillStyle = PAL_CSS_L[i]; g.globalAlpha = 0.95;
        for (let k = 0; k < 3; k++) {
          const ang = (i * 2.399 + MINI.tick * 0.61 + k * 2.09) % TAU;
          g.beginPath(); g.arc(rx * Math.cos(ang), ry * Math.sin(ang), px * 0.95, 0, TAU); g.fill();
        }
      }
    }
    g.globalAlpha = 1;
    const sr = R * 0.22;                                                // کرهٔ سیاه (بدونِ خطِ سفید؛ فقط لبهٔ گرمِ کم‌رنگ)
    g.fillStyle = MG.sph; g.beginPath(); g.arc(0, 0, sr * 1.25, 0, TAU); g.fill();
    if (MG.conic) {                                                     // هالهٔ لبه: لکهٔ نورِ گرمی که آرام دورِ کره می‌چرخد
      g.save(); g.rotate(t * (live ? 0.55 : 0.12)); g.globalAlpha = live ? (0.35 + 0.5 * (V.energy || 0)) : 0.2;
      g.strokeStyle = MG.conic; g.lineWidth = Math.max(1, px * 1.7); g.beginPath(); g.arc(0, 0, sr * 1.04, 0, TAU); g.stroke(); g.restore();
    }
    g.restore();
  }
  function miniFrame(now) {
    MINI.raf = 0;
    if (!miniActive()) { miniDraw(now / 1000, false); return; }
    const dt = (now - MINI.last) / 1000;
    if (dt < 0.062) { MINI.raf = requestAnimationFrame(miniFrame); return; }     // ≈۱۵fps
    MINI.last = now; MINI.tick++;
    if (A.ok) { try { analyze(Math.min(dt, 0.12), true); } catch (e) {} }
    V.tilt += (V.tiltT - V.tilt) * expK(dt, 2.5);
    miniDraw(now / 1000, true);
    if ((MINI.tick & 3) === 0) pushVizNow();
    MINI.raf = requestAnimationFrame(miniFrame);
  }
  async function miniKick() {
    if (MINI.raf) return;
    if (!miniActive()) { if (VM.getMiniCanvas && VM.getMiniCanvas()) miniDraw(performance.now() / 1000, false); return; }
    if (!A.ok && !MINI.boot) { MINI.boot = true; await ensureGraph(); MINI.boot = false; }
    refreshTaps();
    if (A.ok && A.ctx.state !== 'running') { try { await A.ctx.resume(); } catch (e) {} }
    if (MINI.raf || !miniActive()) return;
    A.snap = true; MINI.last = performance.now();
    MINI.raf = requestAnimationFrame(miniFrame);
  }
  window.addEventListener('voidmusic:mini', function () { miniKick(); setTimeout(refreshTaps, 50); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) cancelTitleEntrance(true); else miniKick(); refreshTaps(); });

  function startCinematicOpening() {
    if (V.opening.started || reduced() || !V.playing || !VM.isOpen() || document.hidden) return;
    const audio = VM.getAudio();
    const duration = audio && Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    const currentTime = audio && Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const remaining = duration > 0 ? Math.max(0, duration - currentTime) : BREATH.fallbackTrackS;
    const titleTail = duration > 0
      ? Math.min(Math.max(CFG.powderMinS, duration / 20 * 1.1), duration * 0.5)
      : CFG.powderMinS;
    const reserved = V.entrance.duration + V.entrance.handoff + titleTail;
    V.opening.cycleS = clamp((remaining - reserved) / BREATH.cyclesPerTrack, BREATH.minCycleS, BREATH.maxCycleS);
    V.opening.started = true; V.opening.elapsed = 0; V.opening.progress = 0;
    V.breath.pitch = BREATH.startPitch; V.breath.zoom = BREATH.startZoom; V.breath.mix = 1;
  }
  function resetCinematicOpening() {
    V.opening.started = false; V.opening.elapsed = 0; V.opening.progress = 0; V.opening.cycleS = 60;
    V.breath.mix = 0; V.breath.pitch = Number.isFinite(V.incl) ? V.incl : 50; V.breath.zoom = 1;
  }

  window.addEventListener('voidmusic:playing', async function (e) {
    const playing = !!(e.detail && e.detail.playing);
    V.playing = playing;
    if (!playing) cancelTitleEntrance(true);
    if (playing && A.ok && A.ctx.state !== 'running') { try { A.ctx.resume(); } catch (er) {} }
    if (playing) {
      V.tPlay = 0; A.snap = true; if (!A.ok) A.tries = Math.min(A.tries, 3);   // هر بار پخش (با ژستِ کاربر) دوباره امتحان کن
      if (document.hidden) bgKick();
      // صدا از گرافِ Web Audio می‌گذرد؛ context هیچ‌وقت نباید وقتی موزیک پخش می‌شود معلق بماند
      if (A.ok && A.ctx.state !== 'running') { try { await A.ctx.resume(); } catch (er) {} }
      if (!VM.isOpen()) { miniKick(); return; }       // خارج از Music Mode: فقط صدا + ویژولایزرِ کوچکِ orb
      if (!V.ok && !initGL()) return;
      beginCosmicSession();
      startCinematicOpening();
      await ensureGraph();
      if (!V.playing) return;
      if (A.ok && A.ctx.state !== 'running') { try { await A.ctx.resume(); } catch (er) {} }
      startLoop();
    } else if (!VM.isOpen()) {
      miniKick();
      setTimeout(function () { const a = VM.getAudio(); try { if (A.ok && A.ctx.state === 'running' && a && a.paused && !VM.isOpen()) A.ctx.suspend(); } catch (er) {} }, 300);
    }
  });

  window.addEventListener('voidmusic:mode', function (e) {
    if (e.detail && e.detail.open) {
      clearTimeout(V.tdT);
      if (V.ok) { try { resizeGL(); } catch (er) {} }                 // اگر context هنوز زنده است، همان را به‌کار ببر (ورودِ فوری، بدونِ کامپایلِ دوبارهٔ شیدرها)
      // برگشت به Music Mode وقتی موزیک همچنان پخش می‌شود → نمایش دوباره شروع شود
      const a = VM.getAudio();
      if (a && !a.paused) {
        // خطِ پایهٔ بلندی را نگه می‌داریم (قبلاً دوباره «همین‌الان» را پایه می‌گرفت و در بخشِ پرصدا هیچ‌وقت اوجی دیده نمی‌شد)
        V.playing = true; V.tPlay = 0; A.warm = 0;
        if (V.lastStage === 'galaxy') { V.stage = 'galaxy'; V.stageT = 0; V.loT = 0; V.hiT = 0; }
        if (V.ok || initGL()) {
          beginCosmicSession();
          startCinematicOpening();
          ensureGraph().then(function () { if (V.playing && VM.isOpen()) startLoop(); });
        }
      } else if (VM.getState && VM.getState().current) {
        // آهنگ بارگذاری شده ولی در مکث: ردِ کم‌نورِ سیاه‌چاله همچنان در صحنه باشد
        if (V.ok || initGL()) { V.L.galaxy = CFG.holeRest; V.L.aurora = 0; try { draw(performance.now() / 1000); } catch (er) {} }
      }
      return;
    }
    cancelTitleEntrance(true);
    resetCosmicNarrative();
    V.lastStage = V.stage;
    V.playing = false; stopLoop(true);
    resetCinematicOpening();
    clearTimeout(V.tdT); V.tdT = setTimeout(function () { if (!VM.isOpen()) { teardownGL(); V.dead = false; } }, 30000);   // ۳۰ ثانیه نگه می‌داریم؛ بعد آزاد می‌شود
    V.dead = false; V.L.aurora = 0; V.L.galaxy = 0; V.stage = 'calm';
    // اگر موزیک هنوز پخش می‌شود، context را معلق نکن (صدا قطع می‌شود)
    try { const a = VM.getAudio(); if (A.ok && A.ctx.state === 'running' && a && a.paused) A.ctx.suspend(); } catch (er) {}
    if (V.hud) { V.hud.hidden = true; V.hudOn = false; }
    setTimeout(function () { miniKick(); refreshTaps(); }, 80);
  });

  V.tdT = 0;
  let rzT = 0;
  window.addEventListener('resize', function () {
    V.grace = performance.now() + 3500;                          // گذارِ تمام‌صفحه/تغییر اندازه فریم‌ها را موقتاً می‌اندازد؛ کیفیت را پایین نیاور
    clearTimeout(rzT); rzT = setTimeout(function () { if (V.ok) { resizeGL(); if (!V.running && V.playing) startLoop(); else if (!V.running) { try { draw(performance.now() / 1000); } catch (e) {} } } }, 120);
  });
  document.addEventListener('fullscreenchange', function () { V.grace = performance.now() + 3500; });

  window.VoidMusicViz = {
    debug: toggleHud,
    getStage: function () { return V.stage; },
    getMetrics: function () {
      return { stage: V.stage, db: A.db, base: A.base, delta: A.db - A.base, fluxR: A.fluxR, energy: V.energy || 0, audioBands: { low: A.low, mid: A.mid, high: A.high }, structure: V.structure,
        breath: { disk: V.breath.disk || 0, zoom: V.breath.zoom, pitch: V.breath.pitch, mix: V.breath.mix }, conf: A.conf, centroidR: A.centroidR,
        q: V.q, chroma: Array.prototype.slice.call(A.chroma), L: { aurora: V.L.aurora, galaxy: V.L.galaxy }, powder: { on: V.powder.on, prog: V.powder.prog, n: V.powder.n, T: V.powder.T || 0 },
        ctx: A.ok ? A.ctx.state : A.state, fps: V.fps, cpuMs: V.cpuMs, ok: V.ok, N: V.N };
    },
    config: CFG,
    sound: soundApi
  };
})();
