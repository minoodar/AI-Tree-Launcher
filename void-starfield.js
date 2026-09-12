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
    init();
})();
