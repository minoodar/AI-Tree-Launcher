/* firework-sky.js — Canvas 2D firework bursts (spherical + shaped) for Void Tab goals.
 *
 * Standalone overlay canvas (pointer-events:none), zero cost while idle.
 * API:
 *   FireworkSky.init({ container, zIndex, onEvent })
 *   FireworkSky.play(tier (1..5), { originX (0..1) })
 *   FireworkSky.stop()
 *   FireworkSky.createSynth(audioCtx, destinationNode)  -> handler for onEvent
 *
 * Tiers: 1 (>=30%) one small burst ... 5 (100%) full finale (~9s).
 * Caller owns cooldown / hysteresis / "celebrated" flag (see void-tab-todo.js side).
 */
(function (global) {
  'use strict';

  const TAU = Math.PI * 2;
  const rnd = Math.random;
  const MAX_P = 1600;

  /* ---------- palettes: [main, secondary, hot-core] ---------- */
  const PAL = {
    gold:    [[255, 200, 90],  [255, 160, 50],  [255, 244, 214]],
    rose:    [[255, 110, 150], [255, 170, 190], [255, 232, 238]],
    ice:     [[140, 200, 255], [200, 228, 255], [255, 255, 255]],
    violet:  [[180, 130, 255], [225, 195, 255], [255, 255, 255]],
    emerald: [[100, 240, 185], [190, 255, 228], [255, 255, 255]],
    coral:   [[255, 125, 85],  [255, 190, 140], [255, 240, 220]],
  };
  const PAL_KEYS = Object.keys(PAL);

  /* colour registry + cached rgba strings (no per-particle string building) */
  const colors = [], colorKey = new Map(), styleCache = [];
  function colorId(c) {
    const k = c.join(',');
    let i = colorKey.get(k);
    if (i === undefined) { i = colors.length; colors.push(c); colorKey.set(k, i); }
    return i;
  }
  function style(ci, a) {
    const b = Math.max(0, Math.min(7, (a * 8) | 0));
    const k = ci * 8 + b;
    return styleCache[k] || (styleCache[k] =
      'rgba(' + colors[ci][0] + ',' + colors[ci][1] + ',' + colors[ci][2] + ',' + ((b + 1) / 8) + ')');
  }

  /* ---------- particle pool (typed arrays, no GC) ---------- */
  const P = {
    x: new Float32Array(MAX_P), y: new Float32Array(MAX_P),
    vx: new Float32Array(MAX_P), vy: new Float32Array(MAX_P),
    life: new Float32Array(MAX_P), max: new Float32Array(MAX_P),
    size: new Float32Array(MAX_P), drag: new Float32Array(MAX_P),
    grav: new Float32Array(MAX_P), depth: new Float32Array(MAX_P),
    col: new Uint16Array(MAX_P), glit: new Uint8Array(MAX_P),
  };
  let cursor = 0;
  function spawn(x, y, vx, vy, life, size, ci, drag, grav, glit, depth) {
    for (let n = 0; n < MAX_P; n++) {
      const i = (cursor + n) % MAX_P;
      if (P.life[i] <= 0) {
        cursor = i + 1;
        P.x[i] = x; P.y[i] = y; P.vx[i] = vx; P.vy[i] = vy;
        P.life[i] = life; P.max[i] = life; P.size[i] = size;
        P.col[i] = ci; P.drag[i] = drag; P.grav[i] = grav;
        P.glit[i] = glit; P.depth[i] = depth;
        return true;
      }
    }
    return false; // pool full: silently skip
  }

  /* ---------- shape generators: unit-radius points [x, y, z, colorIdx?] ---------- */
  function orient(x, y, z, ax, ay, az) {
    let c = Math.cos(ax), s = Math.sin(ax);
    let y1 = y * c - z * s, z1 = y * s + z * c;
    c = Math.cos(ay); s = Math.sin(ay);
    const x2 = x * c + z1 * s, z2 = -x * s + z1 * c;
    c = Math.cos(az); s = Math.sin(az);
    return [x2 * c - y1 * s, x2 * s + y1 * c, z2];
  }

  function fibSphere(n, r, ax, ay, ci) {
    const out = [], g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i + 0.5) / n * 2, rr = Math.sqrt(1 - y * y), t = g * i;
      const p = orient(Math.cos(t) * rr * r, y * r, Math.sin(t) * rr * r, ax, ay, 0);
      if (ci !== undefined) p.push(ci);
      out.push(p);
    }
    return out;
  }

  const SHAPES = {
    // true 3D shell projected to 2D: reads as a glowing sphere
    sphere(n) { return fibSphere(n, 1, rnd() * TAU, rnd() * TAU); },

    // shell inside shell, two colours
    double(n) {
      const a = rnd() * TAU, b = rnd() * TAU;
      return fibSphere(Math.round(n * 0.62), 1, a, b, 0)
        .concat(fibSphere(Math.round(n * 0.38), 0.52, b, a, 1));
    },

    // tilted ring
    ring(n) {
      const out = [], ax = 0.5 + rnd() * 0.7, az = rnd() * TAU;
      for (let i = 0; i < n; i++) {
        const t = i / n * TAU;
        out.push(orient(Math.cos(t), 0, Math.sin(t), ax, 0, az));
      }
      return out;
    },

    // sphere + tilted ring
    saturn(n) {
      const az = -0.4, out = [];
      const core = Math.round(n * 0.55), ring = n - core;
      const s = fibSphere(core, 0.6, rnd() * TAU, rnd() * TAU);
      s.forEach(function (p) { const q = orient(p[0], p[1], p[2], 0, 0, az); q.push(0); out.push(q); });
      for (let i = 0; i < ring; i++) {
        const t = i / ring * TAU;
        const q = orient(Math.cos(t), 0, Math.sin(t), 0.35, 0, az);
        q.push(1); out.push(q);
      }
      return out;
    },

    // flat heart (outline + inner outline for body)
    heart(n) {
      const out = [];
      for (let i = 0; i < n; i++) {
        const t = i / n * TAU, k = (i % 3 === 0) ? 0.55 : 1;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        out.push([x / 17 * k, -y / 17 * k + 0.05, 0]);
      }
      return out;
    },

    // 5-point star outline
    star(n) {
      const out = [];
      function v(j) {
        const r = (j % 2 === 0) ? 1 : 0.42, a = j * Math.PI / 5 - Math.PI / 2;
        return [Math.cos(a) * r, Math.sin(a) * r];
      }
      for (let i = 0; i < n; i++) {
        const u = i / n * 10, j = Math.floor(u), f = u - j;
        const a = v(j), b = v(j + 1);
        out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 0]);
      }
      return out;
    },

    // 3-arm spiral
    spiral(n) {
      const out = [], arms = 3;
      for (let i = 0; i < n; i++) {
        const t = (i / n), arm = i % arms;
        const a = t * TAU * 1.7 + arm * TAU / arms;
        out.push([Math.cos(a) * t, Math.sin(a) * t, 0]);
      }
      return out;
    },
  };

  /* ---------- state ---------- */
  let canvas, ctx, W = 0, H = 0, dpr = 1, zIndex = 5, onEvent = null;
  let raf = 0, last = 0, clock = 0, Q = 1, slow = 0;
  const queue = [], rockets = [], flashes = [];
  let calm = null; // reduced-motion static glow
  const glowCache = {};

  function reduced() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function emit(type, e) { try { onEvent && onEvent(type, e); } catch (_) { /* never break goals */ } }

  function glowSprite(ci) {
    if (glowCache[ci]) return glowCache[ci];
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), col = colors[ci];
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(' + col.join(',') + ',0.9)');
    grd.addColorStop(0.35, 'rgba(' + col.join(',') + ',0.25)');
    grd.addColorStop(1, 'rgba(' + col.join(',') + ',0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    return (glowCache[ci] = c);
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(global.devicePixelRatio || 1, 2);
    W = global.innerWidth; H = global.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init(opts) {
    opts = opts || {};
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'ai-void-fireworks';
    canvas.setAttribute('aria-hidden', 'true');
    zIndex = opts.zIndex == null ? 5 : opts.zIndex;
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;display:none;z-index:' + zIndex;
    (opts.container || document.body).appendChild(canvas);
    ctx = canvas.getContext('2d');
    onEvent = opts.onEvent || null;
    resize();
    global.addEventListener('resize', resize);
  }

  /* ---------- burst + rocket ---------- */
  function burst(x, y, o) {
    const pts = SHAPES[o.shape](Math.max(20, Math.round(o.count * Q)));
    const cids = PAL[o.pal].map(colorId);
    const drag = o.drag || 2.0;
    const R = o.r * Math.min(W, H);
    const spd = R * drag;                         // final radius ≈ v0 / drag
    const grav = o.grav == null ? 40 : o.grav;
    const life = o.life || 1.9;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], k = 1 + (rnd() - 0.5) * 0.05; // small jitter keeps shapes crisp
      const ci = p[3] !== undefined ? cids[p[3]] : cids[rnd() < 0.7 ? 0 : 1];
      spawn(x, y, p[0] * spd * k, p[1] * spd * k,
        life * (0.85 + rnd() * 0.3), o.size || 2.2, ci, drag, grav, o.glit ? 1 : 0, p[2]);
    }
    flashes.push({ x: x, y: y, t: 0, ci: cids[2], r: R * 1.25 });
    emit('burst', { x: x, y: y, power: Math.min(1, R / (Math.min(W, H) * 0.3)) });
    if (o.glit) emit('crackle', { x: x, y: y });
  }

  function launch(o, originX) {
    const tx = o.x * W, ty = o.y * H;
    const sx = (originX == null ? o.x : originX * 0.5 + o.x * 0.5) * W;
    rockets.push({ sx: sx, sy: H + 8, tx: tx, ty: ty, t: 0, dur: 0.35 + 0.7 * (H - ty) / H, o: o });
    emit('launch', { x: sx, y: H });
  }

  /* ---------- shows (fractions of viewport; r = fraction of min(W,H)) ---------- */
  function S(t, shape, pal, x, y, r, extra) {
    return Object.assign({ t: t, shape: shape, pal: pal, x: x, y: y, r: r, count: 130 }, extra);
  }
  function finale() {
    const a = [
      S(0.0, 'sphere', 'gold', 0.5, 0.36, 0.30, { count: 230, life: 2.2 }),
      S(0.6, 'ring', 'ice', 0.24, 0.42, 0.20),
      S(0.6, 'ring', 'rose', 0.76, 0.42, 0.20),
      S(1.2, 'heart', 'rose', 0.5, 0.40, 0.26, { count: 170 }),
      S(1.8, 'star', 'gold', 0.22, 0.32, 0.17, { count: 100 }),
      S(1.8, 'star', 'violet', 0.78, 0.32, 0.17, { count: 100 }),
      S(2.5, 'saturn', 'coral', 0.5, 0.34, 0.28, { count: 210 }),
      S(3.2, 'spiral', 'emerald', 0.27, 0.40, 0.20, { count: 120 }),
      S(3.2, 'spiral', 'ice', 0.73, 0.40, 0.20, { count: 120 }),
      S(3.9, 'double', 'violet', 0.5, 0.38, 0.30, { count: 230 }),
    ];
    [0.15, 0.32, 0.5, 0.68, 0.85].forEach(function (x, i) { // willow curtain
      a.push(S(4.6 + i * 0.22, 'sphere', 'gold', x, 0.28, 0.16,
        { count: 110, grav: 130, life: 3.2, glit: true, drag: 1.5 }));
    });
    for (let i = 0; i < 7; i++) {                             // grand finale pops
      a.push(S(6.4 + rnd() * 0.5, i % 2 ? 'sphere' : 'double', PAL_KEYS[i % PAL_KEYS.length],
        0.12 + i * 0.125, 0.22 + rnd() * 0.22, 0.17, { count: 120 }));
    }
    return a;
  }
  const SHOWS = {
    1: function () { return [S(0, 'sphere', 'gold', 0.5, 0.42, 0.16, { count: 70 })]; },
    2: function () { return [S(0, 'ring', 'ice', 0.35, 0.40, 0.17, { count: 80 }),
                             S(0.55, 'sphere', 'gold', 0.65, 0.36, 0.19, { count: 110 })]; },
    3: function () { return [S(0, 'sphere', 'gold', 0.30, 0.40, 0.18),
                             S(0.45, 'star', 'violet', 0.70, 0.38, 0.17, { count: 90 }),
                             S(0.9, 'ring', 'rose', 0.50, 0.30, 0.20)]; },
    4: function () { return [S(0, 'sphere', 'gold', 0.25, 0.42, 0.18),
                             S(0.35, 'ring', 'ice', 0.75, 0.40, 0.18),
                             S(0.8, 'heart', 'rose', 0.5, 0.36, 0.22, { count: 150 }),
                             S(1.3, 'sphere', 'coral', 0.35, 0.30, 0.20),
                             S(1.5, 'sphere', 'emerald', 0.65, 0.30, 0.20)]; },
    5: finale,
  };

  function play(tier, opts) {
    opts = opts || {};
    if (!canvas) init();
    if (document.hidden) return;
    tier = Math.max(1, Math.min(5, tier | 0));
    canvas.style.display = 'block';

    if (reduced()) {                       // static soft glow only: no particles, no motion
      calm = { t: 0, dur: tier === 5 ? 3.6 : 1.8, a: 0.05 + tier * 0.03 };
      start(); return;
    }
    const show = SHOWS[tier]();
    show.forEach(function (o) {
      queue.push({ at: clock + o.t, fn: function () { launch(o, opts.originX); } });
    });
    start();
  }

  function stop() {
    queue.length = rockets.length = flashes.length = 0;
    P.life.fill(0); calm = null;
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (canvas) { ctx.clearRect(0, 0, W, H); canvas.style.display = 'none'; }
  }

  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  /* ---------- main loop (self-stops when nothing is alive) ---------- */
  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;

    // auto quality: sustained slow frames → fewer particles per burst
    if (dt > 0.024) { if (++slow > 30) { Q = Math.max(0.5, Q - 0.25); slow = 0; } } else slow = Math.max(0, slow - 1);

    // scheduler
    for (let i = queue.length - 1; i >= 0; i--) if (clock >= queue[i].at) { queue[i].fn(); queue.splice(i, 1); }

    // trail fade on our own overlay canvas (does not touch the starfield)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,' + (1 - Math.exp(-dt * 6)) + ')';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    // rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]; r.t += dt;
      const f = Math.min(1, r.t / r.dur), e = 1 - Math.pow(1 - f, 2.2);
      const x = r.sx + (r.tx - r.sx) * e, y = r.sy + (r.ty - r.sy) * e;
      const warm = colorId(PAL.gold[2]);
      for (let k = 0; k < 2; k++) spawn(x, y, (rnd() - 0.5) * 28, 30 + rnd() * 40, 0.45, 1.5, warm, 1.5, 60, 0, 0);
      ctx.fillStyle = style(warm, 1); ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      if (f >= 1) { burst(r.tx, r.ty, r.o); rockets.splice(i, 1); }
    }

    // particles
    let alive = 0;
    for (let i = 0; i < MAX_P; i++) {
      if (P.life[i] <= 0) continue;
      P.life[i] -= dt;
      if (P.life[i] <= 0) continue;
      alive++;
      const d = Math.exp(-P.drag[i] * dt);
      P.vx[i] *= d; P.vy[i] = P.vy[i] * d + P.grav[i] * dt;
      P.x[i] += P.vx[i] * dt; P.y[i] += P.vy[i] * dt;
      const u = P.life[i] / P.max[i];
      let a = u < 0.4 ? u / 0.4 : 1;
      a *= 0.55 + 0.45 * (P.depth[i] + 1) * 0.5;               // back of the sphere is dimmer → 3D feel
      if (P.glit[i] && u < 0.6) a *= 0.35 + 0.65 * Math.abs(Math.sin(clock * 38 + i * 7.3));
      const s = P.size[i] * (0.6 + 0.4 * u) * (0.85 + 0.15 * (P.depth[i] + 1) * 0.5);
      ctx.fillStyle = style(P.col[i], a);
      ctx.fillRect(P.x[i] - s / 2, P.y[i] - s / 2, s, s);
    }

    // burst flashes
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i]; f.t += dt;
      const u = f.t / 0.4;
      if (u >= 1) { flashes.splice(i, 1); continue; }
      ctx.globalAlpha = (1 - u) * 0.55;
      const r = f.r * (0.6 + 0.6 * u);
      ctx.drawImage(glowSprite(f.ci), f.x - r, f.y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
    }

    // reduced-motion: single static soft edge glow
    let calmBusy = false;
    if (calm) {
      calm.t += dt;
      const env = Math.min(1, calm.t / 0.6) * Math.min(1, (calm.dur - calm.t) / 0.8);
      if (env > 0) {
        calmBusy = true;
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, W, H);
        const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
        g.addColorStop(0, 'rgba(255,190,90,0)');
        g.addColorStop(1, 'rgba(255,190,90,' + (calm.a * env) + ')');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      } else calm = null;
    }

    if (queue.length || rockets.length || flashes.length || alive || calmBusy) {
      raf = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, W, H); canvas.style.display = 'none';
    }
  }

  /* ---------- optional tiny synth (quiet, no samples) ---------- */
  function createSynth(ac, dest) {
    const buf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = rnd() * 2 - 1;
    function bus(pan) {
      const g = ac.createGain();
      if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(dest); }
      else g.connect(dest);
      return g;
    }
    function noise(t, dur, type, f0, f1, vol, pan) {
      const s = ac.createBufferSource(); s.buffer = buf;
      const f = ac.createBiquadFilter(); f.type = type;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const g = bus(pan); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); s.start(t); s.stop(t + dur + 0.05);
    }
    return function (type, e) {
      const t = ac.currentTime, pan = Math.max(-1, Math.min(1, (e.x / global.innerWidth) * 2 - 1));
      if (type === 'launch') noise(t, 0.5, 'bandpass', 400, 2400, 0.04, pan);
      else if (type === 'burst') {
        noise(t, 0.45, 'lowpass', 1800, 120, 0.12 * (0.5 + e.power), pan);
        const o = ac.createOscillator(), g = bus(pan);
        o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.3);
        g.gain.setValueAtTime(0.1 * e.power, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(g); o.start(t); o.stop(t + 0.4);
      } else if (type === 'crackle') {
        for (let k = 0; k < 6; k++) noise(t + 0.25 + rnd() * 0.8, 0.03, 'highpass', 5000, 7000, 0.02, pan);
      }
    };
  }

  global.FireworkSky = { init: init, play: play, stop: stop, createSynth: createSynth };
})(typeof window !== 'undefined' ? window : this);
