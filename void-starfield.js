(() => {
    "use strict";

    const CONFIG = {
        starDensity: 0.00011,
        maxStars: 850,
        minStars: 250,
        brightness: 0.95,
        speed: 0.045,
        parallax: 0.65,
        twinkle: 0.22,
        coloredStars: 0.035,
        shootingStars: true,
        shootingStarChance: 0.0015,
        maxPixelRatio: 2
    };

    const canvas = document.getElementById("starfield");
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

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random();

            this.size = 0.25 + Math.pow(this.z, 2.2) * 1.65;
            this.baseAlpha = 0.12 + Math.pow(this.z, 1.7) * 0.82;
            this.speed = CONFIG.speed * (0.25 + this.z * 1.35);
            this.phase = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.45 + Math.random() * 1.5;
            this.parallaxDepth = 0.15 + this.z * CONFIG.parallax;

            const colorRoll = Math.random();
            if (colorRoll < CONFIG.coloredStars / 2) {
                this.color = "255, 225, 190";
            } else if (colorRoll < CONFIG.coloredStars) {
                this.color = "190, 215, 255";
            } else {
                this.color = "255, 255, 255";
            }

            this.sharpness = 0.5 + Math.random() * 0.5;

            if (initial) {
                this.x += (Math.random() - 0.5) * width * 0.15;
                this.y += (Math.random() - 0.5) * height * 0.15;
            }
        }

        update(delta) {
            this.x -= this.speed * delta * (0.15 + this.z * 0.4);
            this.y -= this.speed * delta * (0.05 + this.z * 0.15);

            if (this.x < -10) this.x = width + 10;
            if (this.y < -10) this.y = height + 10;
        }

        draw(time) {
            const pulse = 1 + Math.sin(time * 0.001 * this.twinkleSpeed + this.phase) * CONFIG.twinkle * this.sharpness;
            let alpha = this.baseAlpha * pulse * CONFIG.brightness;
            alpha = Math.max(0.03, Math.min(1, alpha));

            const offsetX = (mouseX - width / 2) * this.parallaxDepth * 0.012;
            const offsetY = (mouseY - height / 2) * this.parallaxDepth * 0.012;
            const x = this.x + offsetX;
            const y = this.y + offsetY;

            if (this.size < 0.75) {
                ctx.fillStyle = `rgba(${this.color},${alpha})`;
                ctx.fillRect(x, y, this.size, this.size);
                return;
            }

            if (this.size > 1.25) {
                const glow = this.size * 3.5;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, glow);
                gradient.addColorStop(0, `rgba(${this.color},${alpha})`);
                gradient.addColorStop(0.15, `rgba(${this.color},${alpha * 0.35})`);
                gradient.addColorStop(1, `rgba(${this.color},0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, glow, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = `rgba(${this.color},${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, this.size * 0.5, 0, Math.PI * 2);
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
        if (!CONFIG.shootingStars) return;
        shootingStar = {
            x: Math.random() * width * 0.75,
            y: Math.random() * height * 0.45,
            length: 80 + Math.random() * 130,
            speed: 0.7 + Math.random() * 1.1,
            progress: 0,
            angle: Math.PI * (0.12 + Math.random() * 0.12),
            opacity: 0.35 + Math.random() * 0.35
        };
    }

    function updateShootingStar(delta) {
        if (!shootingStar) {
            if (Math.random() < CONFIG.shootingStarChance * delta) createShootingStar();
            return;
        }

        shootingStar.progress += shootingStar.speed * delta;
        if (shootingStar.progress > 100) { shootingStar = null; return; }

        const distance = shootingStar.progress * 4;
        const x = shootingStar.x + Math.cos(shootingStar.angle) * distance;
        const y = shootingStar.y + Math.sin(shootingStar.angle) * distance;
        const tail = shootingStar.length * (1 - shootingStar.progress / 120);
        const endX = x - Math.cos(shootingStar.angle) * tail;
        const endY = y - Math.sin(shootingStar.angle) * tail;

        const gradient = ctx.createLinearGradient(endX, endY, x, y);
        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.65, `rgba(255,255,255,${shootingStar.opacity * 0.25})`);
        gradient.addColorStop(1, `rgba(255,255,255,${shootingStar.opacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(x, y);
        ctx.stroke();
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
    }

    window.addEventListener("mousemove", event => {
        targetMouseX = event.clientX;
        targetMouseY = event.clientY;
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
        targetMouseX = width / 2;
        targetMouseY = height / 2;
    });

    let animationRunning = true;

    document.addEventListener("visibilitychange", () => {
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

        mouseX += (targetMouseX - mouseX) * 0.035;
        mouseY += (targetMouseY - mouseY) * 0.035;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            star.update(delta);
            star.draw(time);
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
