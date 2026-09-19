// launcher-sound.js — restrained sound layer for the floating orbital hub.
// Self-contained: own AudioContext, own bus. Does not touch void-starfield.js audio.
//
// Layers:
//   open()   — awakening rising fifth when the quantum seed expands / orbit opens
//   hover(i) — soft tactile whisper on the 8 toggle dots (i = 0..7)
//   click(i) — soft confirmation on toggle press
//
(() => {
  'use strict';

  const CFG = {
    busGain: 0.10,
    hpf: 220,
    lpf: 3800,
    echoSec: 0.007,
    echoGain: 0.2,
    maxVoices: 4,
    hoverGlobalMs: 60,
    hoverPerToggleMs: 250,
    hoverAfterClickMs: 120,
    hoverAfterOpenMs: 300,
    hoverBase: 1046.5,
    toggleCents: [-60, -40, -20, 0, 20, 40, 60, 80],
  };

  let ctx = null, input = null, noiseBuf = null;
  let enabled = true;
  let reduced = false;
  let voices = 0;
  let lastHover = 0, lastClick = 0, lastOpen = 0;
  const lastToggle = new Map();
  const activeHover = new Set();

  try {
    reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (window.matchMedia) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        reduced = !!e.matches;
      });
    }
  } catch (_) {}

  try {
    chrome.storage.local.get(['launcherSound', 'voidTabSound'], (r) => {
      if (r && typeof r.launcherSound === 'boolean') {
        enabled = r.launcherSound !== false;
      } else if (r && r.voidTabSound === false) {
        enabled = false;
      }
    });
    chrome.storage.onChanged.addListener((c) => {
      if (c.launcherSound) {
        enabled = c.launcherSound.newValue !== false;
      } else if (c.voidTabSound && typeof c.launcherSound === 'undefined') {
        chrome.storage.local.get(['launcherSound'], (r2) => {
          if (r2 && typeof r2.launcherSound === 'boolean') return;
          enabled = c.voidTabSound.newValue !== false;
        });
      }
    });
  } catch (_) {}

  const jitter = (v, pct) => v * (1 + (Math.random() * 2 - 1) * pct);
  const centsToRatio = (c) => Math.pow(2, c / 1200);

  function ensure(fromGesture) {
    if (!ctx) {
      if (!fromGesture) return false;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        ctx = new AC({ latencyHint: 'interactive' });
      } catch (_) {
        try { ctx = new AC(); } catch (e2) { return false; }
      }

      input = ctx.createGain();
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = CFG.hpf;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = CFG.lpf;
      const bus = ctx.createGain(); bus.gain.value = CFG.busGain;
      const echo = ctx.createDelay(0.05); echo.delayTime.value = CFG.echoSec;
      const echoG = ctx.createGain(); echoG.gain.value = CFG.echoGain;

      input.connect(hp); hp.connect(lp); lp.connect(bus);
      lp.connect(echo); echo.connect(echoG); echoG.connect(bus);
      bus.connect(ctx.destination);

      noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') {
      if (!fromGesture) return false;
      try { ctx.resume(); } catch (_) {}
    }
    return ctx.state !== 'closed';
  }

  function tone(freq, opts) {
    opts = opts || {};
    if (!ctx || voices >= CFG.maxVoices) return null;
    const t = opts.t || 0;
    const peak = opts.peak;
    const attack = opts.attack;
    const decay = opts.decay;
    const detune = opts.detune != null ? opts.detune : 3;
    const partial = opts.partial || 0;
    const track = opts.track;

    const t0 = ctx.currentTime + t;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    g.connect(input);

    const oscs = [];
    [-detune, detune].forEach((c) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq * centsToRatio(c);
      const og = ctx.createGain(); og.gain.value = 0.5;
      o.connect(og); og.connect(g);
      oscs.push(o);
    });
    if (partial) {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = freq * 2;
      const og = ctx.createGain(); og.gain.value = partial;
      o.connect(og); og.connect(g);
      oscs.push(o);
    }

    const voice = { g };
    const end = t0 + attack + decay + 0.02;
    voices++;
    oscs.forEach((o) => { o.start(t0); o.stop(end); });
    oscs[0].onended = () => {
      voices = Math.max(0, voices - 1);
      try { g.disconnect(); } catch (_) {}
      if (track) track.delete(voice);
    };
    if (track) track.add(voice);
    return voice;
  }

  function noiseTick(opts) {
    if (!ctx || !noiseBuf) return;
    opts = opts || {};
    const t = opts.t || 0;
    const t0 = ctx.currentTime + t;
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = opts.freq; bp.Q.value = opts.q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, opts.peak), t0 + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    src.connect(bp); bp.connect(g); g.connect(input);
    src.start(t0); src.stop(t0 + opts.dur + 0.02);
    src.onended = () => { try { g.disconnect(); } catch (_) {} };
  }

  const level = () => (reduced ? 0.7 : 1);

  function open() {
    if (!enabled || !ensure(true)) return;
    lastOpen = performance.now();
    const k = level();
    tone(jitter(523.25, 0.003), {
      peak: 0.8 * k * jitter(1, 0.1),
      attack: 0.008,
      decay: jitter(0.15, 0.1)
    });
    tone(jitter(783.99, 0.003), {
      t: 0.07,
      peak: 0.7 * k * jitter(1, 0.1),
      attack: 0.008,
      decay: jitter(0.22, 0.1)
    });
    noiseTick({ freq: 2400, q: 1.2, peak: 0.12 * k, dur: 0.05 });
  }

  function hover(i) {
    if (!enabled || reduced) return;
    if (!ensure(false)) return;
    const now = performance.now();
    if (now - lastHover < CFG.hoverGlobalMs) return;
    if (now - lastClick < CFG.hoverAfterClickMs) return;
    if (now - lastOpen < CFG.hoverAfterOpenMs) return;
    if (now - (lastToggle.get(i) || 0) < CFG.hoverPerToggleMs) return;
    lastHover = now;
    lastToggle.set(i, now);

    const cents = (CFG.toggleCents[i] || 0) + (Math.random() * 12 - 6);
    tone(CFG.hoverBase * centsToRatio(cents), {
      peak: 0.35 * jitter(1, 0.1),
      attack: 0.003,
      decay: jitter(0.055, 0.1),
      track: activeHover
    });
  }

  function click(i) {
    if (!enabled || !ensure(true)) return;
    lastClick = performance.now();
    activeHover.forEach((v) => {
      try {
        v.g.gain.cancelScheduledValues(ctx.currentTime);
        v.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.004);
      } catch (_) {}
    });
    activeHover.clear();

    const k = level();
    const cents = (CFG.toggleCents[i] || 0) + (Math.random() * 12 - 6);

    if (i === 3) {
      tone(jitter(783.99, 0.003), {
        peak: 0.55 * k * jitter(1, 0.1),
        attack: 0.006,
        decay: jitter(0.10, 0.1)
      });
      tone(jitter(523.25, 0.003), {
        t: 0.055,
        peak: 0.45 * k * jitter(1, 0.1),
        attack: 0.006,
        decay: jitter(0.14, 0.1)
      });
      noiseTick({ freq: 2200, q: 1.1, peak: 0.08 * k, dur: 0.03 });
      return;
    }

    const f = CFG.hoverBase * 1.5 * centsToRatio(cents);
    tone(f, {
      peak: 0.6 * k * jitter(1, 0.1),
      attack: 0.004,
      decay: jitter(0.115, 0.1),
      partial: 0.25
    });
    noiseTick({ freq: 3000, q: 1, peak: 0.10 * k, dur: 0.015 });
  }

  window.LauncherSound = {
    open,
    hover,
    click,
    setEnabled(v) {
      enabled = !!v;
      try { chrome.storage.local.set({ launcherSound: enabled }); } catch (_) {}
    },
    isEnabled() { return !!enabled; }
  };
})();
