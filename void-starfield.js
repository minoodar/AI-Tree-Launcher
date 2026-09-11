(() => {
    "use strict";

    // Tuned toward X (Twitter) new-tab starfield: calm star field, rare slow meteors.
    const CONFIG = {
        starDensity: 0.00012,
        maxStars: 900,
        minStars: 280,
        brightness: 0.88,
        // Near-static drift — X stars barely crawl
        speed: 0.012,
        parallax: 0.35,
        twinkle: 0.12,
        coloredStars: 0.04,
        shootingStars: true,
        // Rare: roughly one every 12–20s at 60fps
        shootingStarChance: 0.00009,
        // Multiplier on meteor travel (lower = slower streak)
        shootingStarSpeedScale: 0.32,
        maxPixelRatio: 2
    };

    const prefersReducedMotion = !!(
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const canvas = document.getElementById("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

    let width = 0;
    let height = 0;
    let dpr = 1;

    let stars = [];
    let shootingStar = null;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let lastTime = performance.now();

    class Star {
        constructor() { this.reset(true); }

        reset(initial) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random();

            this.size = 0.2 + Math.pow(this.z, 2.4) * 1.45;
            this.baseAlpha = 0.1 + Math.pow(this.z, 1.65) * 0.72;
            this.speed = CONFIG.speed * (0.2 + this.z * 1.1);
            this.phase = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.25 + Math.random() * 0.9;
            this.parallaxDepth = 0.08 + this.z * CONFIG.parallax;

            const r = Math.random();
            if (r < CONFIG.coloredStars * 0.45) this.color = "210, 225, 255";
            else if (r < CONFIG.coloredStars) this.color = "255, 230, 200";
            else this.color = "255, 255, 255";

            this.sharpness = 0.45 + Math.random() * 0.55;

            if (initial) {
                this.x += (Math.random() - 0.5) * width * 0.1;
                this.y += (Math.random() - 0.5) * height * 0.1;
            }
        }

        update(delta) {
            if (prefersReducedMotion) return;
            this.x -= this.speed * delta * (0.08 + this.z * 0.22);
            this.y -= this.speed * delta * (0.03 + this.z * 0.08);
            if (this.x < -8) this.x = width + 8;
            if (this.y < -8) this.y = height + 8;
            if (this.x > width + 8) this.x = -8;
            if (this.y > height + 8) this.y = -8;
        }

        draw(time) {
            const pulse = prefersReducedMotion
                ? 1
                : 1 + Math.sin(time * 0.001 * this.twinkleSpeed + this.phase) * CONFIG.twinkle * this.sharpness;
            let alpha = this.baseAlpha * pulse * CONFIG.brightness;
            alpha = Math.max(0.04, Math.min(1, alpha));

            const ox = (mouseX - width / 2) * this.parallaxDepth * 0.01;
            const oy = (mouseY - height / 2) * this.parallaxDepth * 0.01;
            const x = this.x + ox;
            const y = this.y + oy;

            if (this.size < 0.7) {
                ctx.fillStyle = "rgba(" + this.color + "," + alpha + ")";
                ctx.fillRect(x, y, this.size, this.size);
                return;
            }

            if (this.size > 1.15) {
                const glow = this.size * 3.2;
                const g = ctx.createRadialGradient(x, y, 0, x, y, glow);
                g.addColorStop(0, "rgba(" + this.color + "," + alpha + ")");
                g.addColorStop(0.35, "rgba(" + this.color + "," + (alpha * 0.15) + ")");
                g.addColorStop(1, "rgba(" + this.color + ",0)");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, glow, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = "rgba(" + this.color + "," + alpha + ")";
            ctx.beginPath();
            ctx.arc(x, y, this.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createStars() {
        const calculated = Math.floor(width * height * CONFIG.starDensity);
        const count = Math.max(CONFIG.minStars, Math.min(CONFIG.maxStars, calculated));
        stars.length = 0;
        for (let i = 0; i < count; i++) stars.push(new Star());
    }

    function createShootingStar() {
        if (!CONFIG.shootingStars || prefersReducedMotion) return;
        // Thin, short, slow streak — X-style, not a fireball
        shootingStar = {
            x: Math.random() * width * 0.85,
            y: Math.random() * height * 0.4,
            length: 60 + Math.random() * 90,
            speed: (0.22 + Math.random() * 0.28) * CONFIG.shootingStarSpeedScale,
            progress: 0,
            angle: Math.PI * (0.1 + Math.random() * 0.14),
            opacity: 0.28 + Math.random() * 0.22,
            color: Math.random() < 0.6 ? "200,220,255" : "240,235,220",
            width: 0.7 + Math.random() * 0.45
        };
    }

    function updateShootingStar(delta) {
        if (!CONFIG.shootingStars || prefersReducedMotion) return;

        if (!shootingStar) {
            if (Math.random() < CONFIG.shootingStarChance * delta) createShootingStar();
            return;
        }

        shootingStar.progress += shootingStar.speed * delta;
        if (shootingStar.progress > 100) {
            shootingStar = null;
            return;
        }

        const life = shootingStar.progress / 100;
        // Soft fade in / out so it never flashes harshly
        const fade = life < 0.15 ? life / 0.15 : life > 0.75 ? (1 - life) / 0.25 : 1;
        const opacity = shootingStar.opacity * Math.max(0, fade);

        // Distance scale kept low so motion reads as a gentle glide
        const distance = shootingStar.progress * 2.15;
        const x = shootingStar.x + Math.cos(shootingStar.angle) * distance;
        const y = shootingStar.y + Math.sin(shootingStar.angle) * distance;
        const tail = shootingStar.length * (1 - shootingStar.progress / 130);
        const endX = x - Math.cos(shootingStar.angle) * tail;
        const endY = y - Math.sin(shootingStar.angle) * tail;

        const gradient = ctx.createLinearGradient(endX, endY, x, y);
        gradient.addColorStop(0, "rgba(" + shootingStar.color + ",0)");
        gradient.addColorStop(0.55, "rgba(" + shootingStar.color + "," + (opacity * 0.14) + ")");
        gradient.addColorStop(1, "rgba(" + shootingStar.color + "," + opacity + ")");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = shootingStar.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Tiny head glow — not a large fireball
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 4.5);
        glow.addColorStop(0, "rgba(255,255,255," + opacity + ")");
        glow.addColorStop(0.4, "rgba(" + shootingStar.color + "," + (opacity * 0.35) + ")");
        glow.addColorStop(1, "rgba(" + shootingStar.color + ",0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        createStars();
        shootingStar = null;
    }

    window.addEventListener("mousemove", function (event) {
        targetMouseX = event.clientX;
        targetMouseY = event.clientY;
    }, { passive: true });

    window.addEventListener("mouseleave", function () {
        targetMouseX = width / 2;
        targetMouseY = height / 2;
    });

    let animationRunning = true;
    document.addEventListener("visibilitychange", function () {
        animationRunning = !document.hidden;
        if (animationRunning) {
            lastTime = performance.now();
            requestAnimationFrame(render);
        }
    });

    function render(time) {
        if (!animationRunning) return;

        let delta = time - lastTime;
        lastTime = time;
        delta = Math.min(delta, 40);

        mouseX += (targetMouseX - mouseX) * 0.025;
        mouseY += (targetMouseY - mouseY) * 0.025;

        // Deep black like X
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < stars.length; i++) {
            stars[i].update(delta);
            stars[i].draw(time);
        }

        updateShootingStar(delta);
        requestAnimationFrame(render);
    }

    function init() {
        targetMouseX = width / 2;
        targetMouseY = height / 2;
        mouseX = width / 2;
        mouseY = height / 2;
        resize();
        window.addEventListener("resize", resize, { passive: true });
        requestAnimationFrame(render);
    }

    init();
})();
