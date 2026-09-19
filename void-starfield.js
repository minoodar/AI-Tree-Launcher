(() => {
    "use strict";
    const CONFIG = {
        starDensity: 0.00009, maxStars: 520, minStars: 180, brightness: 0.92,
        speed: 0.02, parallax: 0.32, twinkle: 0.16, coloredStars: 0.07,
        glowStarMinZ: 0.72, sparkStarMinZ: 0.88, shootingStars: true,
        shootingStarChance: 0.00055, doubleShootingStarChance: 0.28,
        maxConcurrentMeteors: 3, shootingStarSpeedScale: 0.34, maxPixelRatio: 1.5
    };
    const prefersReducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const canvas = document.getElementById("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    let width = 0, height = 0, dpr = 1;
    let stars = [], shootingStars = [];
    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0, lastTime = performance.now();
    const STAR_PALETTE = [
        { weight: 0.80, color: "255, 255, 255" }, { weight: 0.10, color: "210, 230, 255" },
        { weight: 0.05, color: "186, 230, 253" }, { weight: 0.03, color: "255, 236, 200" },
        { weight: 0.02, color: "253, 224, 138" }
    ];
    const METEOR_COLORS = [
        { head: "240,245,255", trail: "200,220,255", name: "ice" },
        { head: "224,242,254", trail: "56,189,248", name: "cyan" },
        { head: "254,243,199", trail: "251,191,36", name: "amber" },
        { head: "237,233,254", trail: "167,139,250", name: "violet" },
        { head: "220,252,231", trail: "52,211,153", name: "emerald" },
        { head: "255,228,230", trail: "251,113,133", name: "rose" }
    ];
    function pickStarColor() {
        if (Math.random() > CONFIG.coloredStars) return "255, 255, 255";
        const r = Math.random(); let acc = 0;
        const colored = STAR_PALETTE.slice(1);
        const total = colored.reduce((s, p) => s + p.weight, 0);
        for (let i = 0; i < colored.length; i++) { acc += colored[i].weight / total; if (r <= acc) return colored[i].color; }
        return colored[colored.length - 1].color;
    }
    function pickMeteorPalette() {
        if (Math.random() < 0.58) return METEOR_COLORS[0];
        return METEOR_COLORS[1 + Math.floor(Math.random() * (METEOR_COLORS.length - 1))];
    }
    class Star {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x = Math.random() * width; this.y = Math.random() * height; this.z = Math.random();
            this.size = 0.2 + Math.pow(this.z, 2.4) * 1.45;
            this.baseAlpha = 0.12 + Math.pow(this.z, 1.55) * 0.72;
            this.speed = CONFIG.speed * (0.2 + this.z * 1.05);
            this.phase = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.2 + Math.random() * 0.9;
            this.parallaxDepth = 0.06 + this.z * CONFIG.parallax;
            this.color = pickStarColor();
            this.sharpness = 0.4 + Math.random() * 0.55;
            this.useGlow = this.z >= CONFIG.glowStarMinZ;
            this.hasSpark = this.z >= CONFIG.sparkStarMinZ && Math.random() < 0.45;
            if (initial) { this.x += (Math.random() - 0.5) * width * 0.08; this.y += (Math.random() - 0.5) * height * 0.08; }
        }
        update(delta) {
            if (prefersReducedMotion) return;
            this.x -= this.speed * delta * (0.08 + this.z * 0.2);
            this.y -= this.speed * delta * (0.03 + this.z * 0.07);
            if (this.x < -8) this.x = width + 8; if (this.y < -8) this.y = height + 8;
            if (this.x > width + 8) this.x = -8; if (this.y > height + 8) this.y = -8;
        }
        draw(time) {
            const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(time * 0.001 * this.twinkleSpeed + this.phase) * CONFIG.twinkle * this.sharpness;
            let alpha = Math.max(0.05, Math.min(1, this.baseAlpha * pulse * CONFIG.brightness));
            const x = this.x + (mouseX - width / 2) * this.parallaxDepth * 0.01;
            const y = this.y + (mouseY - height / 2) * this.parallaxDepth * 0.01;
            if (!this.useGlow) {
                ctx.fillStyle = "rgba(" + this.color + "," + alpha + ")";
                const s = this.size < 0.7 ? this.size : this.size * 0.85;
                ctx.fillRect(x, y, s, s); return;
            }
            const glow = this.size * 3.2;
            const g = ctx.createRadialGradient(x, y, 0, x, y, glow);
            g.addColorStop(0, "rgba(" + this.color + "," + (alpha * 0.9) + ")");
            g.addColorStop(0.35, "rgba(" + this.color + "," + (alpha * 0.16) + ")");
            g.addColorStop(1, "rgba(" + this.color + ",0)");
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, glow, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "rgba(" + this.color + "," + alpha + ")";
            ctx.beginPath(); ctx.arc(x, y, this.size * 0.45, 0, Math.PI * 2); ctx.fill();
            if (this.hasSpark && !prefersReducedMotion) {
                const sparkAlpha = alpha * 0.5 * (0.75 + 0.25 * Math.sin(time * 0.0011 * this.twinkleSpeed + this.phase));
                const arm = this.size * 2.5;
                ctx.strokeStyle = "rgba(" + this.color + "," + sparkAlpha + ")";
                ctx.lineWidth = Math.max(0.35, this.size * 0.16); ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(x - arm, y); ctx.lineTo(x + arm, y);
                ctx.moveTo(x, y - arm * 0.8); ctx.lineTo(x, y + arm * 0.8); ctx.stroke();
            }
        }
    }
    function createStars() {
        const count = Math.max(CONFIG.minStars, Math.min(CONFIG.maxStars, Math.floor(width * height * CONFIG.starDensity)));
        stars.length = 0; for (let i = 0; i < count; i++) stars.push(new Star());
    }
    function makeShootingStar(faint) {
        const sizeScale = faint ? 0.75 : 1;
        const palette = pickMeteorPalette();
        const isColored = palette.name !== "ice";
        return {
            x: Math.random() * width * 0.88, y: Math.random() * height * 0.45,
            length: (55 + Math.random() * 90) * sizeScale * (isColored ? 1.12 + Math.random() * 0.2 : 1),
            speed: (0.22 + Math.random() * 0.28) * CONFIG.shootingStarSpeedScale,
            progress: 0, angle: Math.PI * (0.08 + Math.random() * 0.16),
            opacity: (0.28 + Math.random() * 0.26) * (faint ? 0.7 : 1),
            headColor: palette.head, trailColor: palette.trail, colored: isColored,
            width: (0.65 + Math.random() * 0.45) * sizeScale * (isColored ? 1.1 : 1)
        };
    }
    function createShootingStar() {
        if (!CONFIG.shootingStars || prefersReducedMotion) return;
        if (shootingStars.length >= CONFIG.maxConcurrentMeteors) return;
        shootingStars.push(makeShootingStar(false));
        if (Math.random() < CONFIG.doubleShootingStarChance) {
            setTimeout(() => {
                if (!CONFIG.shootingStars || prefersReducedMotion) return;
                if (shootingStars.length < CONFIG.maxConcurrentMeteors) shootingStars.push(makeShootingStar(true));
            }, 200 + Math.random() * 260);
        }
    }
    function drawShootingStar(star) {
        const life = star.progress / 100;
        const fade = life < 0.15 ? life / 0.15 : life > 0.75 ? (1 - life) / 0.25 : 1;
        const opacity = star.opacity * Math.max(0, fade);
        const distance = star.progress * 2.15;
        const x = star.x + Math.cos(star.angle) * distance;
        const y = star.y + Math.sin(star.angle) * distance;
        const tail = star.length * (1 - star.progress / 130);
        const endX = x - Math.cos(star.angle) * tail, endY = y - Math.sin(star.angle) * tail;
        const trailRgb = star.trailColor || star.headColor, headRgb = star.headColor || "240,245,255";
        const gradient = ctx.createLinearGradient(endX, endY, x, y);
        gradient.addColorStop(0, "rgba(" + trailRgb + ",0)");
        if (star.colored) {
            gradient.addColorStop(0.4, "rgba(" + trailRgb + "," + (opacity * 0.14) + ")");
            gradient.addColorStop(0.75, "rgba(" + trailRgb + "," + (opacity * 0.36) + ")");
            gradient.addColorStop(1, "rgba(" + headRgb + "," + opacity + ")");
        } else {
            gradient.addColorStop(0.55, "rgba(" + trailRgb + "," + (opacity * 0.14) + ")");
            gradient.addColorStop(1, "rgba(" + headRgb + "," + opacity + ")");
        }
        ctx.strokeStyle = gradient; ctx.lineWidth = star.width; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(endX, endY); ctx.lineTo(x, y); ctx.stroke();
        if (star.colored && opacity > 0.1) {
            ctx.strokeStyle = "rgba(" + trailRgb + "," + (opacity * 0.1) + ")";
            ctx.lineWidth = star.width * 2.2;
            ctx.beginPath(); ctx.moveTo(endX, endY); ctx.lineTo(x, y); ctx.stroke();
        }
        const headR = star.colored ? 4.8 : 4.2;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, headR);
        glow.addColorStop(0, "rgba(255,255,255," + opacity + ")");
        glow.addColorStop(0.4, "rgba(" + headRgb + "," + (opacity * 0.4) + ")");
        glow.addColorStop(1, "rgba(" + trailRgb + ",0)");
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, headR, 0, Math.PI * 2); ctx.fill();
    }
    function updateShootingStar(delta) {
        if (!CONFIG.shootingStars || prefersReducedMotion) return;
        if (Math.random() < CONFIG.shootingStarChance * delta) createShootingStar();
        if (!shootingStars.length) return;
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];
            star.progress += star.speed * delta;
            if (star.progress > 100) { shootingStars.splice(i, 1); continue; }
            drawShootingStar(star);
        }
    }
    let bgCanvas = null, bgCtx = null, bgW = 0, bgH = 0;
    function rebuildBackground() {
        if (!bgCanvas) { bgCanvas = document.createElement("canvas"); bgCtx = bgCanvas.getContext("2d"); }
        bgW = width; bgH = height;
        bgCanvas.width = Math.max(1, Math.floor(width * dpr));
        bgCanvas.height = Math.max(1, Math.floor(height * dpr));
        bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const g = bgCtx.createRadialGradient(width * 0.5, height * 0.42, 0, width * 0.5, height * 0.42, Math.max(width, height) * 0.72);
        g.addColorStop(0, "#060b18"); g.addColorStop(0.45, "#04060f"); g.addColorStop(1, "#010208");
        bgCtx.fillStyle = g; bgCtx.fillRect(0, 0, width, height);
        bgCtx.globalAlpha = 0.04;
        const n1 = bgCtx.createRadialGradient(width * 0.28, height * 0.3, 0, width * 0.28, height * 0.3, width * 0.35);
        n1.addColorStop(0, "rgba(56, 189, 248, 0.35)"); n1.addColorStop(1, "rgba(56, 189, 248, 0)");
        bgCtx.fillStyle = n1; bgCtx.fillRect(0, 0, width, height);
        const n2 = bgCtx.createRadialGradient(width * 0.72, height * 0.65, 0, width * 0.72, height * 0.65, width * 0.3);
        n2.addColorStop(0, "rgba(129, 140, 248, 0.28)"); n2.addColorStop(1, "rgba(129, 140, 248, 0)");
        bgCtx.fillStyle = n2; bgCtx.fillRect(0, 0, width, height); bgCtx.globalAlpha = 1;
    }
    function drawBackground() {
        if (!bgCanvas || bgW !== width || bgH !== height) rebuildBackground();
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bgCanvas, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function resize() {
        width = window.innerWidth; height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio);
        canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px"; canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); rebuildBackground(); createStars(); shootingStars = [];
    }
    window.addEventListener("mousemove", function (e) { targetMouseX = e.clientX; targetMouseY = e.clientY; }, { passive: true });
    window.addEventListener("mouseleave", function () { targetMouseX = width / 2; targetMouseY = height / 2; });
    let animationRunning = true;
    document.addEventListener("visibilitychange", function () {
        animationRunning = !document.hidden;
        if (animationRunning) { lastTime = performance.now(); requestAnimationFrame(render); }
    });
    function render(time) {
        if (!animationRunning) return;
        let delta = Math.min(time - lastTime, 40); lastTime = time;
        mouseX += (targetMouseX - mouseX) * 0.025; mouseY += (targetMouseY - mouseY) * 0.025;
        drawBackground();
        for (let i = 0; i < stars.length; i++) { stars[i].update(delta); stars[i].draw(time); }
        updateShootingStar(delta); requestAnimationFrame(render);
    }
    function init() {
        targetMouseX = width / 2; targetMouseY = height / 2; mouseX = width / 2; mouseY = height / 2;
        resize(); window.addEventListener("resize", resize, { passive: true }); requestAnimationFrame(render);
    }
    // ------------------------------------------------------------------
    // Meteor sonic accent v2 — UI ONLY (dissolve / restore)
    // Dual detuned sine + two-band noise (body/air) + short early space
    // Mood-driven variation (see "Variation system"); no continuous bed, no sub-bass
    // ------------------------------------------------------------------
    var audioCtx = null;
    var meteorBus = null;
    var soundEnabled = true;
    var SOUND_KEY = "voidTabSound";

    function loadSoundPref() {
        try {
            chrome.storage.local.get([SOUND_KEY], function (res) {
                if (res && typeof res[SOUND_KEY] === "boolean") soundEnabled = res[SOUND_KEY];
            });
        } catch (e) {}
        try {
            chrome.storage.onChanged.addListener(function (changes, area) {
                if (area === "local" && changes[SOUND_KEY]) {
                    soundEnabled = changes[SOUND_KEY].newValue !== false;
                }
            });
        } catch (e) {}
    }

    function ensureAudioSync() {
        if (!soundEnabled) return null;
        try {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            if (!audioCtx) {
                audioCtx = new AC();
                meteorBus = audioCtx.createGain();
                meteorBus.gain.value = 0.28;
                var hp = audioCtx.createBiquadFilter();
                hp.type = "highpass";
                hp.frequency.value = 180;
                var lp = audioCtx.createBiquadFilter();
                lp.type = "lowpass";
                lp.frequency.value = 4500;
                meteorBus.connect(hp);
                hp.connect(lp);
                lp.connect(audioCtx.destination);
            }
            return audioCtx;
        } catch (e) {
            return null;
        }
    }

    function unlockAudioSync() {
        var ctx = ensureAudioSync();
        if (!ctx) return null;
        if (ctx.state === "suspended") {
            try {
                var p = ctx.resume();
                if (p && typeof p.then === "function") p.catch(function () {});
            } catch (e) {}
        }
        return ctx;
    }

    // ------------------------------------------------------------------
    // Variation system — "fresh every time, same identity"
    // One per-event MOOD (warmth, energy) drives several parameters together;
    // small independent jitter sits on top. DNA (intervals, contour, band,
    // structure, level ceiling) never changes. VAR scales ALL variation:
    // 0 = fully deterministic, 1 = designed range, tune by ear via
    // VoidStarfield.setVariation(x).
    // ------------------------------------------------------------------
    var VAR = 1;
    var ROOT_BASE = 329.63;          // E4
    var keyOffset = 1;               // semitones from E4, pool -1..+3 (D#4..G4)
    var lastRoot = null;             // root of the most recent formation (return reuses it)
    var moodHist = { meteor: [], form: [], ret: [] };

    function rand(a, b) { return a + Math.random() * (b - a); }
    function jit(pct) { return 1 + rand(-pct, pct) * VAR; }      // multiplicative jitter
    function dB(x) { return Math.pow(10, x / 20); }
    function cents(c) { return Math.pow(2, c / 1200); }
    function clampPan(p) { return Math.max(-0.9, Math.min(0.9, p)); }

    /** Two correlated latent variables in [-VAR, VAR]; rejects near-repeats of the last 2 (per event type). */
    function drawMood(kind) {
        var hist = moodHist[kind] || (moodHist[kind] = []);
        var m = null;
        for (var i = 0; i < 5; i++) {
            var c = { warmth: rand(-1, 1), energy: rand(-1, 1) };
            var ok = true;
            for (var j = 0; j < hist.length; j++) {
                if (Math.sqrt(Math.pow(hist[j].warmth - c.warmth, 2) + Math.pow(hist[j].energy - c.energy, 2)) <= 0.5) { ok = false; break; }
            }
            m = c;
            if (ok) break;
        }
        hist.push(m);
        if (hist.length > 2) hist.shift();
        return { warmth: m.warmth * VAR, energy: m.energy * VAR };
    }

    /** Slow key walk: never the same root twice in a row, never a big leap. */
    function nextRoot() {
        if (VAR <= 0) { lastRoot = ROOT_BASE; return lastRoot; }
        var steps = [-2, -1, 1, 2];
        var n = keyOffset, guard = 0;
        while (n === keyOffset && guard++ < 16) {
            n = Math.max(-1, Math.min(3, keyOffset + steps[(Math.random() * 4) | 0]));
        }
        keyOffset = n;
        lastRoot = ROOT_BASE * Math.pow(2, n / 12);
        return lastRoot;
    }

    function makeNoiseBuffer(ctx, seconds) {
        var len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
        var buf = ctx.createBuffer(1, len, ctx.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
        return buf;
    }

    /** Tiny early-space: delay + low wet (not a long reverb). */
    function createShortSpace(ctx) {
        var dry = ctx.createGain();
        var wet = ctx.createGain();
        dry.gain.value = 0.94;
        wet.gain.value = 0.055; // ~5.5% wet
        var delay = ctx.createDelay(0.05);
        delay.delayTime.value = 0.006 + Math.random() * 0.002; // 6–8 ms
        var feedback = ctx.createGain();
        feedback.gain.value = 0.18; // short tail feel
        var damp = ctx.createBiquadFilter();
        damp.type = "lowpass";
        damp.frequency.value = 2800;
        var merger = ctx.createGain();

        dry.connect(merger);
        wet.connect(delay);
        delay.connect(damp);
        damp.connect(feedback);
        feedback.connect(delay);
        damp.connect(merger);

        return {
            input: function (node) {
                node.connect(dry);
                node.connect(wet);
            },
            output: merger
        };
    }

    function playMeteorVoiceNow(opts) {
        opts = opts || {};
        if (!soundEnabled) return;
        var ctx = unlockAudioSync();
        if (!ctx || !meteorBus) return;

        function run() {
            try {
                var now = ctx.currentTime + 0.008;
                // --- Controlled micro-randomization (DNA stays fixed) ---
                var mood = drawMood("meteor"); // warmth: dark<->bright, energy: calm<->lively
                var pitchScale = typeof opts.pitchScale === "number"
                    ? opts.pitchScale * jit(0.02)          // burst-supplied scale + tiny drift
                    : 1 + rand(-0.04, 0.04) * VAR;         // ±4%
                var detunePct = 0.008 + Math.random() * 0.004; // 0.8–1.2%
                var dur = 0.165 * (1 - 0.09 * mood.energy) * jit(0.03); // ≈ ±12%, lively = shorter
                var atkScale = (1 - 0.15 * mood.energy) * jit(0.05);   // attack ±20%, stays soft
                var lpfCut = 1800 * (1 + 0.12 * mood.warmth) * jit(0.03); // tone brightness
                var noiseDb = mood.warmth * 1.0 + rand(-0.4, 0.4) * VAR; // noise level ≈ ±1.5 dB
                var bodyCenter = 650 * (1 + 0.05 * mood.warmth) * jit(0.03);  // ≈ ±8%
                var airCenter = 1750 * (1 + 0.05 * mood.warmth) * jit(0.03);
                var bodyGain = 0.016 * dB(noiseDb) * (0.95 + Math.random() * 0.1);
                var airGain = 0.009 * dB(noiseDb) * (0.95 + Math.random() * 0.1);
                var toneAGain = 0.015 * (0.9 + Math.random() * 0.2);
                var toneBGain = 0.011 * (0.9 + Math.random() * 0.2);
                var noiseOnset = Math.random() * 0.008; // 0–8 ms
                var toneOnset = Math.random() * 0.004; // 0–4 ms
                // Sometimes noise leads, sometimes tone leads
                if (Math.random() < 0.5) {
                    toneOnset += 0.004;
                } else {
                    noiseOnset += 0.003;
                }

                var startHz = Math.max(420, Math.min(680, 580 * pitchScale));
                var endHz = Math.max(300, Math.min(440, 370 * pitchScale));
                var startB = startHz * (1 + detunePct);
                var endB = endHz * (1 + detunePct);

                var panVal = typeof opts.pan === "number" ? opts.pan : (Math.random() * 0.36 - 0.18);
                panVal = Math.max(-0.22, Math.min(0.22, panVal));

                var space = createShortSpace(ctx);
                space.output.connect(meteorBus);

                // Helper: soft envelope on a gain node
                function env(g, t0, peak, peakAt, mid, midAt, endAt) {
                    g.gain.setValueAtTime(0, t0);
                    g.gain.linearRampToValueAtTime(peak, t0 + peakAt);
                    g.gain.linearRampToValueAtTime(mid, t0 + midAt);
                    g.gain.linearRampToValueAtTime(0, t0 + endAt);
                }

                // ---- Tone A (main) ----
                var oscA = ctx.createOscillator();
                oscA.type = "sine";
                var tA0 = now + toneOnset;
                oscA.frequency.setValueAtTime(startHz, tA0);
                try {
                    oscA.frequency.exponentialRampToValueAtTime(Math.max(40, endHz), tA0 + dur * 0.92);
                } catch (e1) {
                    oscA.frequency.linearRampToValueAtTime(endHz, tA0 + dur * 0.92);
                }
                // Subtle pitch instability (~1–2 Hz, not musical vibrato)
                try {
                    var lfo = ctx.createOscillator();
                    lfo.frequency.value = 9 + Math.random() * 4;
                    var lfoGain = ctx.createGain();
                    lfoGain.gain.value = 1.2 + Math.random() * 0.8; // Hz depth
                    lfo.connect(lfoGain);
                    lfoGain.connect(oscA.frequency);
                    lfo.start(tA0);
                    lfo.stop(tA0 + dur + 0.05);
                } catch (eLfo) {}

                var lpfA = ctx.createBiquadFilter();
                lpfA.type = "lowpass";
                lpfA.frequency.value = lpfCut;
                var gA = ctx.createGain();
                env(gA, tA0, toneAGain, 0.010 * atkScale, toneAGain * 0.22, 0.070, dur);
                oscA.connect(lpfA);
                lpfA.connect(gA);
                if (typeof ctx.createStereoPanner === "function") {
                    var pA = ctx.createStereoPanner();
                    pA.pan.setValueAtTime(panVal - 0.10, tA0);
                    gA.connect(pA);
                    space.input(pA);
                } else {
                    space.input(gA);
                }
                oscA.start(tA0);
                oscA.stop(tA0 + dur + 0.04);

                // ---- Tone B (detuned, slightly later/softer) ----
                var oscB = ctx.createOscillator();
                oscB.type = "sine";
                var tB0 = tA0 + 0.003;
                oscB.frequency.setValueAtTime(startB, tB0);
                try {
                    oscB.frequency.exponentialRampToValueAtTime(Math.max(40, endB), tB0 + dur * 0.92);
                } catch (e2) {
                    oscB.frequency.linearRampToValueAtTime(endB, tB0 + dur * 0.92);
                }
                var lpfB = ctx.createBiquadFilter();
                lpfB.type = "lowpass";
                lpfB.frequency.value = lpfCut;
                var gB = ctx.createGain();
                env(gB, tB0, toneBGain, 0.014 * atkScale, toneBGain * 0.20, 0.082, dur + 0.01);
                oscB.connect(lpfB);
                lpfB.connect(gB);
                if (typeof ctx.createStereoPanner === "function") {
                    var pB = ctx.createStereoPanner();
                    pB.pan.setValueAtTime(panVal + 0.10, tB0);
                    gB.connect(pB);
                    space.input(pB);
                } else {
                    space.input(gB);
                }
                oscB.start(tB0);
                oscB.stop(tB0 + dur + 0.05);

                // ---- Shared noise buffer (slightly different paths for body/air) ----
                var noiseBuf = makeNoiseBuffer(ctx, dur + 0.08);
                var n0 = now + noiseOnset;

                // Body (low-mid mass)
                var bodySrc = ctx.createBufferSource();
                bodySrc.buffer = noiseBuf;
                var bodyBp = ctx.createBiquadFilter();
                bodyBp.type = "bandpass";
                bodyBp.frequency.value = bodyCenter;
                bodyBp.Q.value = 0.6;
                var bodyG = ctx.createGain();
                env(bodyG, n0, bodyGain, 0.008 * atkScale, bodyGain * 0.25, 0.055, Math.min(dur * 0.82, 0.145));
                bodySrc.connect(bodyBp);
                bodyBp.connect(bodyG);
                space.input(bodyG);
                bodySrc.start(n0);
                bodySrc.stop(n0 + dur);

                // Air streak (higher, thinner)
                var airSrc = ctx.createBufferSource();
                airSrc.buffer = noiseBuf;
                var airBp = ctx.createBiquadFilter();
                airBp.type = "bandpass";
                airBp.frequency.value = airCenter;
                airBp.Q.value = 0.8;
                var airG = ctx.createGain();
                env(airG, n0 + 0.004, airGain, 0.006 * atkScale, airGain * 0.2, 0.05, Math.min(dur * 0.75, 0.130));
                airSrc.connect(airBp);
                airBp.connect(airG);
                if (typeof ctx.createStereoPanner === "function") {
                    var pAir = ctx.createStereoPanner();
                    pAir.pan.setValueAtTime(panVal * 0.5 + (Math.random() * 0.12 - 0.06), n0);
                    airG.connect(pAir);
                    space.input(pAir);
                } else {
                    space.input(airG);
                }
                airSrc.start(n0);
                airSrc.stop(n0 + dur);
            } catch (e) {}
        }

        if (ctx.state === "running") {
            run();
        } else {
            try {
                ctx.resume().then(run).catch(function () { try { run(); } catch (e) {} });
            } catch (e) {
                run();
            }
        }
    }





    /**
     * Safe voice starter — never exp-ramp to 0; never automate meteorBus.gain.
     * Content stays in ~300–1400 Hz (audible above HPF + laptop speakers).
     */
    function startVoice(ctx, dest, opts) {
        opts = opts || {};
        try {
            var type = opts.type || "sine";
            var f0 = opts.f0;
            var f1 = opts.f1 != null ? opts.f1 : f0;
            var t0 = opts.t0;
            var glideT = opts.glideT != null ? opts.glideT : 0.4;
            var atk = opts.atk != null ? opts.atk : 0.04;
            var hold = opts.hold != null ? opts.hold : 0;
            var rel = opts.rel != null ? opts.rel : 0.8;
            var peak = opts.peak != null ? opts.peak : 0.1;
            var pan = opts.pan;

            var o = ctx.createOscillator();
            o.type = type;
            o.frequency.setValueAtTime(Math.max(40, f0), t0);
            if (f1 !== f0) {
                try {
                    o.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + glideT);
                } catch (e) {
                    o.frequency.linearRampToValueAtTime(f1, t0 + glideT);
                }
            }

            var g = ctx.createGain();
            // Never use 0 with exponential ramps
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.linearRampToValueAtTime(peak, t0 + atk);
            g.gain.setValueAtTime(peak, t0 + atk + hold);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + atk + hold + rel);

            o.connect(g);
            if (typeof pan === "number" && ctx.createStereoPanner) {
                var p = ctx.createStereoPanner();
                p.pan.setValueAtTime(pan, t0);
                if (opts.panEnd != null) {
                    p.pan.linearRampToValueAtTime(opts.panEnd, t0 + atk + hold + rel * 0.6);
                }
                g.connect(p);
                p.connect(dest);
            } else {
                g.connect(dest);
            }
            o.start(t0);
            o.stop(t0 + atk + hold + rel + 0.05);
            return true;
        } catch (e) {
            try { console.warn("[VoidStarfield] voice error", e); } catch (e2) {}
            return false;
        }
    }

    function startNoiseBurst(ctx, dest, opts) {
        opts = opts || {};
        try {
            var t0 = opts.t0;
            var dur = opts.dur != null ? opts.dur : 0.35;
            var peak = opts.peak != null ? opts.peak : 0.04;
            var center = opts.center != null ? opts.center : 3500;
            var src = ctx.createBufferSource();
            src.buffer = makeNoiseBuffer(ctx, dur + 0.05);
            var bp = ctx.createBiquadFilter();
            bp.type = "bandpass";
            bp.frequency.value = center;
            bp.Q.value = opts.Q != null ? opts.Q : 0.8;
            var g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.linearRampToValueAtTime(peak, t0 + 0.04);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
            src.connect(bp);
            bp.connect(g);
            g.connect(dest);
            src.start(t0);
            src.stop(t0 + dur + 0.02);
            return true;
        } catch (e) {
            try { console.warn("[VoidStarfield] noise error", e); } catch (e2) {}
            return false;
        }
    }

    /**
     * Formation: gather (0–0.45s) → lock (~0.45s) → sustain/release (~2.3s)
     * Return/break: consonant → scatter (~1.1s)
     * Own `out` gain into meteorBus — never touch meteorBus.gain automation.
     */
    function playConstellationFormation(mode, opts) {
        opts = opts || {};
        mode = mode === "break" ? "break" : "form";
        if (opts.silent || !soundEnabled) return;
        var ctx = unlockAudioSync();
        if (!ctx || !meteorBus) return;

        function run() {
            try {
                if (ctx.state !== "running") {
                    try { console.warn("[VoidStarfield] ctx not running", ctx.state); } catch (e) {}
                }
                var out = ctx.createGain();
                out.gain.value = 1;
                out.connect(meteorBus);
                setTimeout(function () {
                    try { out.disconnect(); } catch (e) {}
                }, 4000);

                var t = ctx.currentTime + 0.02;
                var voices = 0;

                // One mood per event; return reuses the key of the formation it ends.
                var mood = drawMood(mode === "form" ? "form" : "ret");
                var e = mood.energy, w = mood.warmth;
                var root = mode === "form" ? nextRoot() : (lastRoot || nextRoot());
                var ratios = [1, 1.5, 2];            // DNA: fixed intervals (root, fifth, octave)
                var panOff = rand(-0.2, 0.2) * VAR;
                var atk = (mode === "form" ? 0.05 : 0.03) * (1 - 0.2 * e);

                if (mode === "form") {
                    // Never louder than the designed peak: -0..1.5 dB only.
                    var pk = dB(-rand(0, 1.5) * VAR);
                    var lockAt = 0.45 * (1 - 0.06 * e) * jit(0.02);   // stays locked to the visual
                    var glideT = 0.40 * (1 - 0.06 * e);
                    var hold = 0.55 * (1 - 0.10 * e);
                    var rel = 1.2 * (1 - 0.12 * e) * jit(0.04);
                    var scatter = [0.909, 1.053, 1.184];              // start ratios vs target
                    var basePans = [-0.2, 0, 0.2];
                    var enter = [0, 0.10 + rand(-0.015, 0.015) * VAR, 0.20 + rand(-0.015, 0.015) * VAR];

                    // --- Gather: three scattered sines glide onto the stack ---
                    for (var i = 0; i < 3; i++) {
                        var target = root * ratios[i] * cents(rand(-8, 8) * VAR);
                        if (startVoice(ctx, out, {
                            f0: target * scatter[i] * jit(0.02),
                            f1: target,
                            t0: t + enter[i],
                            glideT: glideT,
                            atk: atk,
                            hold: hold,
                            rel: rel,
                            peak: 0.07 * pk,
                            pan: clampPan(basePans[i] + panOff),
                            panEnd: clampPan(panOff)
                        })) voices++;
                    }
                    // Lock click-into-place: soft fifth-above-octave (root x3)
                    if (startVoice(ctx, out, {
                        f0: root * 3 * cents(rand(-4, 4) * VAR),
                        t0: t + lockAt,
                        atk: 0.04 * (1 - 0.2 * e),
                        hold: 0.15,
                        rel: 0.9 * (1 - 0.12 * e),
                        peak: 0.06 * pk * dB(0.75 * w),
                        pan: clampPan(panOff)
                    })) voices++;
                    // Air swell at lock (kept under the bus low-pass)
                    if (startNoiseBurst(ctx, out, {
                        t0: t + lockAt - 0.03,
                        dur: 0.35 * (1 - 0.10 * e),
                        peak: 0.035 * pk * dB(0.75 * w),
                        center: Math.min(4400, 4000 * (1 + 0.15 * w) * jit(0.05))
                    })) voices++;
                    // Stack sustain reinforcement
                    if (startVoice(ctx, out, {
                        f0: root * 1.5,
                        t0: t + lockAt,
                        atk: 0.08 * (1 - 0.2 * e),
                        hold: 0.5,
                        rel: 1.0 * (1 - 0.12 * e),
                        peak: 0.05 * pk,
                        pan: clampPan(panOff)
                    })) voices++;
                } else {
                    // --- Return: same three pitches drift apart and fall ---
                    var pkb = dB(-rand(0, 1.0) * VAR);                // never louder than the approved level
                    var glideB = 0.7 * (1 - 0.10 * e);
                    var relB = 0.85 * (1 - 0.10 * e);
                    var driftEnds = [0.939, 0.931, 1.062];            // scatter direction is DNA, amount jitters
                    var epans = [-0.22, 0, 0.22];
                    for (var j = 0; j < 3; j++) {
                        var f0b = root * ratios[j];
                        if (startVoice(ctx, out, {
                            f0: f0b,
                            f1: f0b * (1 + (driftEnds[j] - 1) * jit(0.15)),
                            t0: t + Math.max(0, j * 0.03 + rand(-0.01, 0.01) * VAR),
                            glideT: glideB,
                            atk: atk,
                            hold: 0.15,
                            rel: relB,
                            peak: 0.055 * pkb,
                            pan: 0,
                            panEnd: clampPan(epans[j] + panOff * 0.5)
                        })) voices++;
                    }
                    // Soft downward sigh (fifth -> ~major second above root)
                    if (startVoice(ctx, out, {
                        f0: root * 1.5,
                        f1: root * 1.121,
                        t0: t + 0.35 * (1 - 0.10 * e),
                        glideT: 0.55 * (1 - 0.10 * e),
                        atk: 0.04,
                        hold: 0.05,
                        rel: 0.55,
                        peak: 0.04 * pkb,
                        pan: clampPan(panOff * 0.5)
                    })) voices++;
                    // Closing air
                    if (startNoiseBurst(ctx, out, {
                        t0: t,
                        dur: 0.7 * (1 - 0.10 * e),
                        peak: 0.025 * pkb * dB(0.75 * w),
                        center: 2000 * (1 + 0.15 * w) * jit(0.05)
                    })) voices++;
                }

                try {
                    console.log("[VoidStarfield] constellation", mode, "voices=", voices, "state=", ctx.state,
                        "root=", Math.round(root), "warmth=", w.toFixed(2), "energy=", e.toFixed(2));
                } catch (e) {}
            } catch (err) {
                try { console.warn("[VoidStarfield] constellation error", mode, err); } catch (e2) {}
            }
        }

        if (ctx.state === "running") {
            run();
        } else {
            try {
                ctx.resume().then(function () { run(); }).catch(function () { try { run(); } catch (e) {} });
            } catch (e) {
                run();
            }
        }
    }

    loadSoundPref();

    window.VoidStarfield = {
        triggerMeteor: function (count, opts) {
            count = Math.max(1, Math.min(3, count || 1));
            opts = opts || {};
            var silent = !!opts.silent;
            unlockAudioSync();
            for (var i = 0; i < count; i++) {
                (function (index, delay) {
                    var fire = function () {
                        try { createShootingStar(); } catch (e) {}
                        if (!silent) {
                            var pan = count === 1
                                ? (Math.random() * 0.3 - 0.15)
                                : (index % 2 === 0 ? -0.18 : 0.18);
                            var pitchScale = 1 + (index % 2 === 0 ? -0.03 : 0.05);
                            playMeteorVoiceNow({ pan: pan, pitchScale: pitchScale });
                        }
                    };
                    if (delay <= 0) fire();
                    else setTimeout(fire, delay);
                })(i, i === 0 ? 0 : (110 + Math.random() * 50));
            }
        },
        /** Formation or break. mode: "form"|"break". opts.silent skips audio (e.g. storage restore). */
        playConstellationFormation: function (mode, opts) {
            unlockAudioSync();
            playConstellationFormation(mode === "break" ? "break" : "form", opts || {});
        },
        playConstellationBreak: function () {
            unlockAudioSync();
            playConstellationFormation("break", {});
        },
        setSoundEnabled: function (on) {
            soundEnabled = !!on;
            try { chrome.storage.local.set({ voidTabSound: soundEnabled }); } catch (e) {}
        },
        isSoundEnabled: function () { return !!soundEnabled; },
        /** Scale all variation: 0 = deterministic, 1 = designed range, max 1.5. Tune by ear. */
        setVariation: function (v) {
            v = +v;
            if (isNaN(v)) return VAR;
            VAR = Math.max(0, Math.min(1.5, v));
            return VAR;
        },
        /** Listening test: VoidStarfield.audition("meteor"|"form"|"break", 20). Judge outliers, not averages. */
        audition: function (kind, n, gapMs) {
            n = n || 12;
            gapMs = gapMs || (kind === "meteor" ? 650 : 2800);
            unlockAudioSync();
            var i = 0;
            (function step() {
                if (i++ >= n) return;
                if (kind === "meteor") playMeteorVoiceNow({});
                else playConstellationFormation(kind === "break" ? "break" : "form", {});
                setTimeout(step, gapMs);
            })();
        },
        unlockAudio: function () { unlockAudioSync(); }
    };

    function unlockOnce() {
        unlockAudioSync();
        try {
            document.removeEventListener("pointerdown", unlockOnce, true);
            document.removeEventListener("keydown", unlockOnce, true);
        } catch (e) {}
    }
    try {
        document.addEventListener("pointerdown", unlockOnce, true);
        document.addEventListener("keydown", unlockOnce, true);
    } catch (e) {}

    init();
})();
