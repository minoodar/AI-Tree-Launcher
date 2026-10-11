/* ======================================================================
   Void Tab — Music Remote (content script)
   وقتی موسیقی در تبِ Void Tab پخش می‌شود و کاربر در تب‌های دیگر است، یک orb شناورِ کوچک
   (با ویژولایزرِ کوچک، پخش/مکث، بعدی، توقف) روی همان صفحه نشان داده می‌شود.
   صدا همچنان فقط در تبِ Void Tab پخش می‌شود؛ اینجا فقط «کنترل از راه دور» است.

   ارتباط:  void-music.js (صفحهٔ افزونه) → chrome.tabs.sendMessage → این اسکریپت   {type:'vm-state', …}
            این اسکریپت → chrome.runtime.sendMessage → صفحهٔ افزونه                {type:'vm-cmd', cmd}
   بدونِ نیاز به background.js. ایزوله در Shadow DOM تا CSS سایت‌ها اثر نکند.
   دامنه‌هایی که کاربر ابزارکِ اصلی را در آن‌ها پنهان کرده (aiTreeHiddenDomains) محترم شمرده می‌شوند.
   ====================================================================== */
(function () {
  'use strict';
  if (window.__voidMusicRemote) return;
  if (window.top !== window) return;
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) return;
  window.__voidMusicRemote = true;

  const TAU = Math.PI * 2;
  const POS_KEY = 'voidMusicRemotePos';
  const RAINBOW_HUES = [0, 30, 56, 125, 218, 248, 282];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function hsl(h, s, l) {
    h /= 360; const a = s * Math.min(l, 1 - l);
    const f = n => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
  }
  const PAL = Array.from({ length: 12 }, (_, i) => i < RAINBOW_HUES.length ? hsl(RAINBOW_HUES[i], 0.78, 0.62) : [228, 234, 248]);

  let host = null, ui = null, st = null, hidden = false, lastMsg = 0, drag = null, justDragged = false;
  let raf = 0, tmr = 0, lastDraw = 0, tick = 0;
  const chroma = new Float32Array(12), target = new Float32Array(12);
  let side = 'r', yFrac = null;

  const CSS = `
  :host { all: initial; }
  .wrap { --o: 56px; position: fixed; z-index: 2147483000; width: var(--o); height: var(--o); left: 16px; top: 16px; direction: ltr;
    opacity: 0; visibility: hidden; transform: scale(.88); pointer-events: none; touch-action: none; -webkit-tap-highlight-color: transparent;
    font: 12px/1 system-ui, sans-serif; transition: opacity .3s ease, transform .35s cubic-bezier(.34,1.56,.64,1), visibility 0s linear .35s, left .28s ease, top .28s ease; }
  .wrap.on { opacity: .96; visibility: visible; transform: none; pointer-events: auto; transition: opacity .3s ease, transform .35s cubic-bezier(.34,1.56,.64,1), left .28s ease, top .28s ease; }
  .wrap.drag { transition: none !important; cursor: grabbing; }
  .orb { position: relative; width: 100%; height: 100%; margin: 0; padding: 0; border-radius: 50%; border: 1px solid rgba(235,240,245,.24);
    background: radial-gradient(circle, #02030a 0 30%, #070b16 100%); box-shadow: 0 6px 22px rgba(0,0,0,.55); cursor: pointer; color: #eef; overflow: visible; }
  .orb:focus-visible, .b:focus-visible { outline: 2px solid rgba(220,230,240,.9); outline-offset: 3px; }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 50%; pointer-events: none; }
  .orb::after { content: ''; position: absolute; inset: -5px; border-radius: 50%; pointer-events: none; opacity: 0;
    box-shadow: 0 0 14px 2px rgba(251,191,36,.38), 0 0 30px 5px rgba(90,150,255,.2); }
  .wrap.playing .orb::after { animation: breath 2.6s ease-in-out infinite; }
  @keyframes breath { 0%,100% { opacity: .12; } 50% { opacity: .95; } }
  svg.ring { position: absolute; inset: -3px; width: calc(100% + 6px); height: calc(100% + 6px); fill: none; pointer-events: none; }
  .trk { stroke: rgba(235,240,245,.08); stroke-width: 1.2; } .prog { stroke: rgba(251,191,36,.92); stroke-width: 1.8; stroke-linecap: round; transition: stroke-dashoffset .3s linear; }
  .b { position: absolute; margin: 0; padding: 0; display: grid; place-items: center; border-radius: 50%; cursor: pointer; color: #f0f4fa;
    border: 1px solid rgba(235,240,245,.3); background: rgba(8,10,14,.86); transition: opacity .2s ease, transform .2s ease, border-color .2s ease; }
  .b::before { content: ''; position: absolute; inset: -9px; border-radius: 50%; }
  .b svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .b:hover, .b:focus-visible { border-color: rgba(251,191,36,.9); color: #fff; }
  .play { right: -7px; bottom: -7px; width: 24px; height: 24px; }
  .play .pa { display: none; } .wrap.playing .play .pl { display: none; } .wrap.playing .play .pa { display: block; }
  .stop, .next { width: 21px; height: 21px; opacity: 0; transform: scale(.8); pointer-events: none; }
  .stop { right: -6px; top: -6px; } .next { left: -6px; bottom: -6px; }
  .wrap:hover .stop, .wrap:focus-within .stop, .wrap:hover .next, .wrap:focus-within .next { opacity: .92; transform: none; pointer-events: auto; }
  @media (prefers-reduced-motion: reduce) { .wrap, .wrap.on, .prog, .b { transition: none !important; } .wrap.playing .orb::after { animation: none; opacity: .5; } }`;

  function ico(d) { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); d.forEach(x => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', x); s.appendChild(p); }); return s; }

  function build() {
    if (ui) return;
    host = document.createElement('div'); host.id = 'void-music-remote-host';
    host.style.cssText = 'all:initial;position:fixed;z-index:2147483000;top:0;left:0;width:0;height:0;';
    const root = host.attachShadow({ mode: 'open' });
    try { const sh = new CSSStyleSheet(); sh.replaceSync(CSS); root.adoptedStyleSheets = [sh]; }
    catch (e) { const el = document.createElement('style'); el.textContent = CSS; root.appendChild(el); }
    const wrap = document.createElement('div'); wrap.className = 'wrap';
    const orb = document.createElement('button'); orb.className = 'orb'; orb.type = 'button';
    const cv = document.createElement('canvas'); cv.width = cv.height = 112;
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ring.setAttribute('class', 'ring'); ring.setAttribute('viewBox', '0 0 44 44');
    const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c1.setAttribute('class', 'trk'); c1.setAttribute('cx', '22'); c1.setAttribute('cy', '22'); c1.setAttribute('r', '21.4');
    const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c2.setAttribute('class', 'prog'); c2.setAttribute('cx', '22'); c2.setAttribute('cy', '22'); c2.setAttribute('r', '21.4'); c2.setAttribute('pathLength', '1000'); c2.setAttribute('stroke-dasharray', '1000'); c2.setAttribute('stroke-dashoffset', '1000'); c2.setAttribute('transform', 'rotate(-90 22 22)');
    ring.append(c1, c2); orb.append(cv, ring);
    const play = document.createElement('button'); play.className = 'b play'; play.type = 'button';
    const pl = ico(['M8.5 5.5 L18.5 12 L8.5 18.5 Z']); pl.setAttribute('class', 'pl'); const pa = ico(['M9 6V18', 'M15 6V18']); pa.setAttribute('class', 'pa'); play.append(pl, pa);
    const stop = document.createElement('button'); stop.className = 'b stop'; stop.type = 'button'; stop.appendChild(ico(['M7 7L17 17', 'M17 7L7 17']));
    const next = document.createElement('button'); next.className = 'b next'; next.type = 'button'; next.appendChild(ico(['M17.5 6V18', 'M6 6.5L14.5 12L6 17.5Z']));
    wrap.append(orb, play, stop, next); root.appendChild(wrap);
    (document.documentElement || document.body).appendChild(host);
    ui = { wrap, orb, cv, g: cv.getContext('2d'), play, stop, next, prog: c2 };

    const send = cmd => { try { chrome.runtime.sendMessage({ type: 'vm-cmd', cmd: cmd }, () => void chrome.runtime.lastError); } catch (e) {} };
    play.addEventListener('click', e => { e.stopPropagation(); if (st) { st.playing = !st.playing; paint(); } send('toggle'); });
    next.addEventListener('click', e => { e.stopPropagation(); send('next'); });
    stop.addEventListener('click', e => { e.stopPropagation(); send('stop'); hide(); });
    orb.addEventListener('click', () => { if (!justDragged) send('open'); });
    orb.addEventListener('contextmenu', e => { e.preventDefault(); send('stop'); hide(); });
    orb.addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); send('toggle'); } });
    orb.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const r = wrap.getBoundingClientRect(); drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, l0: r.left, t0: r.top, moved: false };
      try { orb.setPointerCapture(e.pointerId); } catch (er) {}
    });
    orb.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.moved && Math.hypot(dx, dy) < 6) return;
      drag.moved = true; wrap.classList.add('drag'); place(drag.l0 + dx, drag.t0 + dy);
    });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null; wrap.classList.remove('drag');
      try { orb.releasePointerCapture(e.pointerId); } catch (er) {}
      if (d.moved) { justDragged = true; setTimeout(() => { justDragged = false; }, 80); snap(); }
    };
    orb.addEventListener('pointerup', end); orb.addEventListener('pointercancel', end);
    window.addEventListener('resize', applyPos);
    applyPos();
  }

  function size() { return ui ? ui.wrap.offsetWidth || 56 : 56; }
  function place(l, t) { const w = size(); ui.wrap.style.left = clamp(l, 8, Math.max(8, innerWidth - w - 8)) + 'px'; ui.wrap.style.top = clamp(t, 8, Math.max(8, innerHeight - w - 8)) + 'px'; }
  function applyPos() {
    if (!ui) return; const w = size(), M = 16;
    const top = yFrac === null ? innerHeight - w - M - 56 : clamp(yFrac * innerHeight, M, innerHeight - w - M);
    place(side === 'l' ? M : innerWidth - w - M, top);
  }
  function snap() {
    const r = ui.wrap.getBoundingClientRect(), M = 16;
    side = (r.left + r.width / 2) < innerWidth / 2 ? 'l' : 'r';
    yFrac = clamp(r.top, M, innerHeight - r.height - M) / innerHeight;
    place(side === 'l' ? M : innerWidth - r.width - M, yFrac * innerHeight);
    try { chrome.storage.local.set({ [POS_KEY]: { side: side, y: yFrac } }); } catch (e) {}
  }

  /* ---- ویژولایزرِ کوچک: ۱۲ حلقهٔ نت، دیدِ از بالا، کرهٔ سیاه (هم‌زبان با Void Tab) ---- */
  const CSS_C = PAL.map(k => 'rgb(' + k[0] + ',' + k[1] + ',' + k[2] + ')');
  const CSS_L = PAL.map(k => 'rgb(' + Math.min(255, k[0] + 60) + ',' + Math.min(255, k[1] + 60) + ',' + Math.min(255, k[2] + 60) + ')');
  const GR = { W: 0, g: null, bg: null, sph: null, conic: null };
  function grads(g, W, c, R) {                       // فقط وقتی اندازه عوض شود؛ نه هر فریم (بدونِ تخصیصِ تکراری)
    GR.W = W; GR.g = g;
    GR.bg = g.createRadialGradient(c, c, 0, c, c, R); GR.bg.addColorStop(0, 'rgba(0,0,0,1)'); GR.bg.addColorStop(0.35, 'rgba(2,3,9,.94)'); GR.bg.addColorStop(1, 'rgba(9,14,28,.88)');
    const sr = R * 0.22;
    GR.sph = g.createRadialGradient(0, 0, sr * 0.2, 0, 0, sr * 1.25);
    GR.sph.addColorStop(0, 'rgba(0,0,0,1)'); GR.sph.addColorStop(0.8, 'rgba(0,0,0,1)'); GR.sph.addColorStop(0.9, 'rgba(60,44,20,.55)'); GR.sph.addColorStop(1, 'rgba(0,0,0,0)');
    GR.conic = g.createConicGradient ? g.createConicGradient(0, 0, 0) : null;
    if (GR.conic) { GR.conic.addColorStop(0, 'rgba(255,215,150,.75)'); GR.conic.addColorStop(0.3, 'rgba(255,190,110,.12)'); GR.conic.addColorStop(0.62, 'rgba(255,170,100,.04)'); GR.conic.addColorStop(0.86, 'rgba(255,200,130,.30)'); GR.conic.addColorStop(1, 'rgba(255,215,150,.75)'); }
  }
  function draw(t) {
    if (!ui) return; const cv = ui.cv, g = ui.g, W = cv.width, c = W / 2, R = c * 0.97, px = W / 64;
    if (GR.W !== W || GR.g !== g) grads(g, W, c, R);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.clearRect(0, 0, W, W); g.save(); g.beginPath(); g.arc(c, c, R, 0, TAU); g.clip();
    g.fillStyle = GR.bg; g.fillRect(0, 0, W, W);
    const live = st && st.playing; g.translate(c, c); g.rotate(Math.sin(t * 0.11) * 0.28); const ratio = 0.74 + 0.05 * Math.sin(t * 0.09);
    for (let i = 0; i < 12; i++) {
      const e = live ? chroma[i] : 0.08, rx = R * (0.36 + 0.049 * i), ry = rx * ratio;
      g.strokeStyle = CSS_C[i]; g.globalAlpha = 0.17 + 0.83 * Math.min(1, e * 1.15);
      g.lineWidth = Math.max(1, px * (0.9 + 1.1 * e)); g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, TAU); g.stroke();
      if (live && e > 0.32) {
        g.fillStyle = CSS_L[i]; g.globalAlpha = 0.95;
        for (let n = 0; n < 3; n++) { const a = (i * 2.399 + tick * 0.61 + n * 2.09) % TAU; g.beginPath(); g.arc(rx * Math.cos(a), ry * Math.sin(a), px * 0.95, 0, TAU); g.fill(); }
      }
    }
    g.globalAlpha = 1; const sr = R * 0.22;
    g.fillStyle = GR.sph; g.beginPath(); g.arc(0, 0, sr * 1.25, 0, TAU); g.fill();
    if (GR.conic) { g.save(); g.rotate(t * (live ? 0.55 : 0.12)); g.globalAlpha = live ? 0.55 : 0.2; g.strokeStyle = GR.conic; g.lineWidth = Math.max(1, px * 1.7); g.beginPath(); g.arc(0, 0, sr * 1.04, 0, TAU); g.stroke(); g.restore(); }
    g.restore();
  }
  function frame(now) {
    raf = 0;
    if (!ui || !st || !st.active || document.hidden) return;
    if (now - lastDraw >= 64) {
      const dt = Math.min(0.2, (now - lastDraw) / 1000); lastDraw = now; tick++;
      const k = 1 - Math.exp(-dt / 0.14);
      for (let i = 0; i < 12; i++) chroma[i] += (target[i] - chroma[i]) * k;
      draw(now / 1000);
    }
    if (st.playing) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && ui && st && st.active && !document.hidden) { lastDraw = 0; raf = requestAnimationFrame(frame); } }

  function paint() {
    if (!ui || !st) return;
    ui.wrap.classList.toggle('playing', !!st.playing);
    const L = st.labels || {};
    ui.orb.setAttribute('aria-label', (L.open || 'Open Music Mode') + (st.title ? ' — ' + st.title : '')); ui.orb.title = ui.orb.getAttribute('aria-label');
    ui.play.setAttribute('aria-label', st.playing ? (L.pause || 'Pause') : (L.play || 'Play')); ui.play.title = ui.play.getAttribute('aria-label');
    ui.stop.setAttribute('aria-label', L.stop || 'Stop'); ui.stop.title = ui.stop.getAttribute('aria-label');
    ui.next.setAttribute('aria-label', L.next || 'Next'); ui.next.title = ui.next.getAttribute('aria-label');
    if (st.rtl) ui.wrap.setAttribute('dir', 'ltr');
    progress();
    kick();
  }
  function progress() {
    if (!ui || !st || !st.dur) return;
    const pos = st.pos + (st.playing ? (Date.now() - st.ts) / 1000 : 0);
    ui.prog.setAttribute('stroke-dashoffset', String(1000 * (1 - clamp(pos / st.dur, 0, 1))));
  }
  function show() { build(); ui.wrap.classList.add('on'); paint(); if (!tmr) tmr = setInterval(() => { progress(); if (st && Date.now() - lastMsg > 6500) hide(); }, 500); }
  function hide() { if (ui) ui.wrap.classList.remove('on'); if (tmr) { clearInterval(tmr); tmr = 0; } }

  function apply(m) {
    lastMsg = Date.now();
    if (hidden) return;
    if (!m.active) { st = m; hide(); return; }
    st = m; st.ts = m.ts || Date.now();
    if (m.viz && m.viz.chroma) for (let i = 0; i < 12; i++) target[i] = clamp(+m.viz.chroma[i] || 0, 0, 1);
    else for (let i = 0; i < 12; i++) target[i] = 0.12 + 0.1 * Math.sin(Date.now() / 700 + i);
    show();
  }

  try {
    chrome.runtime.onMessage.addListener(function (m, sender, respond) {
      if (m && m.type === 'vm-state') { apply(m); try { respond({ ok: true }); } catch (e) {} }
    });
    chrome.storage.local.get(['aiTreeHiddenDomains', POS_KEY], function (res) {
      if (chrome.runtime.lastError) return;
      const list = Array.isArray(res.aiTreeHiddenDomains) ? res.aiTreeHiddenDomains : [];
      if (list.indexOf(location.hostname) >= 0) { hidden = true; return; }
      if (res[POS_KEY]) { side = res[POS_KEY].side === 'l' ? 'l' : 'r'; yFrac = typeof res[POS_KEY].y === 'number' ? res[POS_KEY].y : null; }
      hello();
    });
    chrome.storage.onChanged.addListener(function (ch, area) {
      if (area === 'local' && ch.aiTreeHiddenDomains) { const l = ch.aiTreeHiddenDomains.newValue || []; hidden = l.indexOf(location.hostname) >= 0; if (hidden) hide(); else hello(); }
    });
  } catch (e) {}
  function hello() { try { chrome.runtime.sendMessage({ type: 'vm-hello' }, () => void chrome.runtime.lastError); } catch (e) {} }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { hello(); kick(); } });
  window.addEventListener('focus', hello);
})();
