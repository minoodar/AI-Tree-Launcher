// ============================================================================
// AI Tree Launcher — Zen Toolbar Dock Engine (shared)
// ----------------------------------------------------------------------------
// موتور بزرگ‌نمایی هاور (Dock magnification) + tooltip تأخیری + fallback لمسی
// + اتصال دکمهٔ میکروفون به AITreeVoiceEngine. هم در ویجت توکار (content.js)
// هم در صفحهٔ نوت‌پد مستقل (notepad.html/notepad.js) استفاده می‌شود.
//
// فرمول و اعداد دقیقاً طبق تصمیم قفل‌شدهٔ معماری:
//   پایه ۳۲px، اوج مقیاس ۱.۴×، شعاع تأثیر ۶۴px فیزیکی (نه بر اساس ایندکس آیکون)،
//   فرمول کسینوسی، Lift = -(scale-1)×۱۰px، easing فنری برای بازگشت.
// ============================================================================

const AITreeZenDock = (() => {
  const CONFIG = { maxScale: 1.4, radius: 64, liftFactor: 10 };

  function initDock(container) {
    if (!container || container.__ztInit) return;
    container.__ztInit = true;
    container.setAttribute('data-zen-toolbar', '');
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    const isCoarse = !!(window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches);
    const tooltip = createTooltip(container);

    if (isCoarse) {
      wireTouchFallback(container);
      return;
    }

    let items = [];
    function cacheItems() {
      items = Array.from(container.querySelectorAll('.zt-btn')).map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          mid: rect.left + rect.width / 2,
          tip: el.getAttribute('title') || el.getAttribute('data-tooltip') || ''
        };
      });
    }

    let hovering = false;
    let tooltipTimer = null;
    let activeEl = null;

    // چون کلیک کردن (مثلاً روی دکمهٔ میکروفون) لزوماً باعث رخداد mousemove
    // نمی‌شود، صرفِ به‌روزرسانیِ متن تولتیپ داخل مسیر mousemove کافی نیست — اگر
    // مؤشر بعد از کلیک بی‌حرکت بماند، تولتیپ همان متنِ لحظهٔ نمایش اولیه (مثلاً
    // «در حال شنیدن») را نشان می‌داد و هرگز به‌روز نمی‌شد، حتی وقتی state واقعاً
    // به «در حال تبدیل» تغییر کرده بود. این ناظر مستقل از حرکتِ مؤشر، همان لحظه‌ای
    // که title دکمهٔ در حال نمایش عوض شود، متنِ تولتیپ را زنده به‌روز می‌کند.
    const titleObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'title' && m.target === activeEl && tooltip.classList.contains('is-visible')) {
          const liveTip = activeEl.getAttribute('title') || activeEl.getAttribute('data-tooltip') || '';
          if (liveTip) tooltip.textContent = liveTip;
          break;
        }
      }
    });
    titleObserver.observe(container, { attributes: true, attributeFilter: ['title'], subtree: true });

    container.addEventListener('mouseenter', () => { hovering = true; cacheItems(); });

    container.addEventListener('mousemove', (e) => {
      if (!hovering) return;
      const mx = e.clientX;
      let closest = null;
      let minD = Infinity;

      items.forEach((it) => {
        const d = Math.abs(mx - it.mid);
        if (d < minD) { minD = d; closest = it; }
        if (d < CONFIG.radius) {
          const scale = 1 + (CONFIG.maxScale - 1) * Math.cos((d / CONFIG.radius) * (Math.PI / 2));
          const lift = -(scale - 1) * CONFIG.liftFactor;
          it.el.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
        } else {
          it.el.style.transform = '';
        }
      });

      if (closest && minD < 18) {
        if (activeEl !== closest.el) {
          clearTimeout(tooltipTimer);
          activeEl = closest.el;
          tooltipTimer = setTimeout(() => {
            if (!hovering || activeEl !== closest.el) return;
            showTooltip(container, tooltip, closest);
            setTimeout(() => hideTooltip(tooltip), 800);
          }, 280);
        } else if (tooltip.classList.contains('is-visible')) {
          // مؤشر هنوز روی همان دکمه است — اگر عنوانِ دکمه در همین حین عوض شده
          // باشد (مثلاً حالت میکروفون از «شنیدن» به «تبدیل» رفته)، متنِ در حال
          // نمایش را زنده به‌روزرسانی کن، بدون نیاز به خارج/داخل‌شدن دوبارهٔ مؤشر
          const liveTip = closest.el.getAttribute('title') || closest.el.getAttribute('data-tooltip') || '';
          if (liveTip && tooltip.textContent !== liveTip) tooltip.textContent = liveTip;
        }
      } else {
        clearTimeout(tooltipTimer);
        activeEl = null;
        hideTooltip(tooltip);
      }
    });

    container.addEventListener('mouseleave', () => {
      hovering = false;
      clearTimeout(tooltipTimer);
      activeEl = null;
      hideTooltip(tooltip);
      items.forEach((it) => {
        it.el.style.transition = 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)';
        it.el.style.transform = '';
      });
      setTimeout(() => { items.forEach((it) => { it.el.style.transition = ''; }); }, 280);
    });

    window.addEventListener('resize', () => { if (hovering) cacheItems(); });
  }

  function createTooltip(container) {
    const el = document.createElement('div');
    el.className = 'zt-tooltip';
    el.setAttribute('aria-hidden', 'true');
    container.appendChild(el);
    return el;
  }

  function showTooltip(container, tooltipEl, item) {
    const tip = item.el.getAttribute('title') || item.el.getAttribute('data-tooltip') || item.tip || '';
    if (!tip) return;
    const rect = item.el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    tooltipEl.textContent = tip;
    tooltipEl.style.left = `${(rect.left + rect.width / 2) - cRect.left}px`;
    tooltipEl.classList.add('is-visible');
  }

  function hideTooltip(tooltipEl) { tooltipEl.classList.remove('is-visible'); }

  // --- حالت لمسی: بدون بزرگ‌نمایی، اجرای فوری + Action-Toast گذرا ---
  function wireTouchFallback(container) {
    container.querySelectorAll('.zt-btn').forEach((btn) => {
      btn.addEventListener('touchstart', () => { btn.classList.add('zt-tap'); }, { passive: true });
      btn.addEventListener('touchend', () => {
        setTimeout(() => btn.classList.remove('zt-tap'), 150);
        const label = btn.getAttribute('title') || btn.getAttribute('data-tooltip');
        if (label) showActionToast(container, label);
      }, { passive: true });
    });
  }

  function showActionToast(container, text) {
    let toast = container.querySelector('.zt-action-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'zt-action-toast';
      container.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.remove('is-visible');
    void toast.offsetWidth; // ری‌فلو اجباری برای ری‌استارت انیمیشن
    toast.classList.add('is-visible');
    clearTimeout(toast.__hideTimer);
    toast.__hideTimer = setTimeout(() => toast.classList.remove('is-visible'), 1400);
  }

  // --------------------------------------------------------------------------
  // اتصال دکمهٔ میکروفون به AITreeVoiceEngine — مشترک بین هر دو تولبار.
  // وضعیت‌ها روی data-state ست می‌شوند؛ خودِ انیمیشن مورف در toolbar-zen.css است.
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // HUD شناور «در حال شنیدن…» — نزدیک به رفتار استاندارد خودِ کروم (تایپ صوتی
  // در نوار آدرس/Google Docs که یک نشانگرِ شناور کنار کرسر نشان می‌دهد)، اما در
  // همان زبانِ بصریِ زن/مینیمالِ این افزونه. جدا از خودِ دکمهٔ میکروفون است چون
  // هدفش این‌ست که چشمِ کاربر نزدیکِ محلِ تایپ بماند، نه نزدیکِ تولبار.
  // فقط وقتی textarea داده شده باشد ساخته می‌شود؛ در غیر این صورت فقط
  // tooltip/data-state خودِ دکمه (رفتار قبلی) کار می‌کند.
  // --------------------------------------------------------------------------
  function createVoiceHud() {
    const hud = document.createElement('div');
    hud.className = 'zt-voice-hud';
    hud.innerHTML =
      '<span class="zt-voice-hud-bars">' +
        '<span class="zt-vb"></span><span class="zt-vb"></span><span class="zt-vb"></span><span class="zt-vb"></span>' +
      '</span>' +
      '<span class="zt-voice-hud-label"></span>';
    document.body.appendChild(hud);
    return hud;
  }

  function positionVoiceHud(hud, textarea) {
    if (!hud || !textarea || !textarea.getBoundingClientRect) return;
    const rect = textarea.getBoundingClientRect();
    const hudHeight = 34; // تقریبی؛ کافی برای محاسبهٔ جای‌گیری بالای جعبه
    const top = rect.top > hudHeight + 12 ? rect.top - hudHeight - 6 : rect.bottom + 6;
    const left = Math.min(Math.max(rect.left + 10, 8), window.innerWidth - 220);
    hud.style.top = `${Math.round(top)}px`;
    hud.style.left = `${Math.round(left)}px`;
  }

  function updateVoiceHud(hud, textarea, state, hudLabels) {
    if (!hud) return;
    const active = state === 'listening' || state === 'processing' || state === 'loading-model';
    if (!active) {
      hud.classList.remove('is-visible');
      return;
    }
    hud.dataset.state = state;
    const label = state === 'listening' ? hudLabels.listening
      : state === 'processing' ? hudLabels.processing
      : hudLabels.loadingModel;
    const labelEl = hud.querySelector('.zt-voice-hud-label');
    if (labelEl) labelEl.textContent = label;
    positionVoiceHud(hud, textarea);
    hud.classList.add('is-visible');
  }

  // --------------------------------------------------------------------------
  // نوار وضعیتِ درون‌صفحه‌ای — مخصوص صفحات کامل/تمام‌صفحه (مثل notepad.html)
  // که فضای کافی برای اطلاع‌رسانیِ مستقیم و دائمی (نه فقط یک HUD شناور گذرا)
  // دارند: هر مرحله از فرایند (شنیدن/آماده‌سازی مدل با درصد واقعی/تبدیل به
  // متن/تأیید افزوده‌شدن) با متن روشن نمایش داده می‌شود. کاملاً اختیاری است؛
  // فقط وقتی opts.statusEl داده شده باشد فعال می‌شود.
  // --------------------------------------------------------------------------
  function updateInlineVoiceStatus(statusEl, progressFillEl, state, hudLabels) {
    if (!statusEl) return;
    const active = state === 'listening' || state === 'processing' || state === 'loading-model';
    const track = progressFillEl ? progressFillEl.parentElement : null;
    if (!active) {
      statusEl.dataset.state = '';
      statusEl.textContent = '';
      if (track) track.hidden = true;
      return;
    }
    statusEl.dataset.state = state;
    statusEl.textContent = state === 'listening' ? hudLabels.listening
      : state === 'processing' ? hudLabels.processing
      : hudLabels.loadingModel;
    if (track) track.hidden = state !== 'loading-model';
  }

  function flashInlineVoiceDone(statusEl, doneLabel) {
    if (!statusEl) return;
    statusEl.dataset.state = 'done';
    statusEl.textContent = doneLabel;
    setTimeout(() => {
      if (statusEl.dataset.state === 'done') { statusEl.dataset.state = ''; statusEl.textContent = ''; }
    }, 1400);
  }

  function clearInlineVoiceStatus(statusEl, progressFillEl) {
    if (!statusEl) return;
    statusEl.dataset.state = '';
    statusEl.textContent = '';
    if (progressFillEl && progressFillEl.parentElement) progressFillEl.parentElement.hidden = true;
  }

  // --------------------------------------------------------------------------
  // ویژوالایزرِ دایره‌ایِ میکروفون — دقیقاً طبق درخواست: وقتی میکروفون فعال
  // می‌شود یک حلقهٔ کوچک دورش ظاهر می‌شود که «در حال شنیدن» را نشان می‌دهد،
  // وقتی صدا در حال پردازش/تبدیل است حلقه انیمیشنِ متفاوتی می‌گیرد (نشان‌دهندهٔ
  // «در حال فکر کردن»)، و به‌محض این‌که متن آماده شد کاملاً محو و ناپدید می‌شود.
  // جدا از تولتیپ/HUD متنی است — این صرفاً یک نشانگر بصریِ کوچک و مؤثر است، بدون
  // متن، دقیقاً کنار خودِ دکمهٔ میکروفون (نه نزدیکِ محل تایپ).
  // --------------------------------------------------------------------------
  function createMicVisualizer() {
    const el = document.createElement('div');
    el.className = 'zt-mic-visualizer';
    el.innerHTML =
      '<span class="zt-mic-ring zt-mic-ring-outer"></span>' +
      '<span class="zt-mic-ring zt-mic-ring-inner"></span>';
    document.body.appendChild(el);
    return el;
  }

  function positionMicVisualizer(vis, btn) {
    if (!vis || !btn || !btn.getBoundingClientRect) return;
    const rect = btn.getBoundingClientRect();
    vis.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    vis.style.top = `${Math.round(rect.top + rect.height / 2)}px`;
  }

  function updateMicVisualizer(vis, btn, state) {
    if (!vis) return;
    const active = state === 'listening' || state === 'processing' || state === 'loading-model';
    if (!active) {
      vis.classList.remove('is-visible');
      return;
    }
    vis.dataset.state = state;
    positionMicVisualizer(vis, btn);
    vis.classList.add('is-visible');
  }

  function wireMicButton(btn, textarea, opts) {
    if (!btn) return;
    if (typeof AITreeVoiceEngine === 'undefined' || !AITreeVoiceEngine.isSupported()) {
      btn.style.display = 'none';
      return;
    }

    const labels = Object.assign({
      idle: 'تایپ صوتی / Voice Input',
      listening: 'در حال شنیدن… (برای توقف بزنید) / Listening…',
      processing: 'در حال تبدیل به متن… / Transcribing…',
      loadingModel: 'آماده‌سازی اولیه… / Preparing model…'
    }, opts && opts.labels);

    // برچسب‌های کوتاه‌تر مخصوص HUD شناور / نوار وضعیت درون‌صفحه‌ای (بدون توضیح
    // پرانتزی داخل تولبار)
    const hudLabels = Object.assign({
      listening: 'در حال شنیدن… / Listening…',
      processing: 'در حال تبدیل به متن… / Transcribing…',
      loadingModel: 'آماده‌سازی مدل… / Preparing…'
    }, opts && opts.hudLabels);
    const doneLabel = (opts && opts.doneLabel) || '✓ متن اضافه شد / Added';

    // HUD شناور را می‌توان برای صفحاتی که خودشان یک نوار وضعیت درون‌صفحه‌ای
    // ثابت دارند (opts.hud === false) غیرفعال کرد تا دو نشانگر هم‌زمان روی هم نیفتند
    const hud = (textarea && opts && opts.hud === false) ? null : (textarea ? createVoiceHud() : null);
    if (hud) {
      window.addEventListener('resize', () => { if (hud.classList.contains('is-visible')) positionVoiceHud(hud, textarea); });
      window.addEventListener('scroll', () => { if (hud.classList.contains('is-visible')) positionVoiceHud(hud, textarea); }, true);
    }

    const statusEl = (opts && opts.statusEl) || null;
    const progressFillEl = (opts && opts.progressFillEl) || null;

    const micVisualizer = (opts && opts.visualizer === false) ? null : createMicVisualizer();
    if (micVisualizer) {
      window.addEventListener('resize', () => { if (micVisualizer.classList.contains('is-visible')) positionMicVisualizer(micVisualizer, btn); });
      window.addEventListener('scroll', () => { if (micVisualizer.classList.contains('is-visible')) positionMicVisualizer(micVisualizer, btn); }, true);
    }

    btn.dataset.state = 'idle';
    btn.title = labels.idle;
    btn.setAttribute('aria-label', labels.idle);

    AITreeVoiceEngine.on('state', (state) => {
      btn.dataset.state = state;
      updateMicVisualizer(micVisualizer, btn, state);
      const label = state === 'listening' ? labels.listening
        : state === 'processing' ? labels.processing
        : state === 'loading-model' ? labels.loadingModel
        : labels.idle;
      btn.title = label;
      btn.setAttribute('aria-label', label);
      updateVoiceHud(hud, textarea, state, hudLabels);
      updateInlineVoiceStatus(statusEl, progressFillEl, state, hudLabels);
    });

    AITreeVoiceEngine.on('progress', (percent) => {
      if (typeof percent !== 'number') return;
      if (btn.dataset.state !== 'loading-model') return;
      const label = `${labels.loadingModel} (${percent}%)`;
      btn.title = label;
      btn.setAttribute('aria-label', label);
      if (hud && hud.classList.contains('is-visible')) {
        const labelEl = hud.querySelector('.zt-voice-hud-label');
        if (labelEl) labelEl.textContent = `${hudLabels.loadingModel} (${percent}%)`;
      }
      if (statusEl && statusEl.dataset.state === 'loading-model') {
        statusEl.textContent = `${hudLabels.loadingModel} (${percent}%)`;
      }
      if (progressFillEl) {
        if (progressFillEl.parentElement) progressFillEl.parentElement.hidden = false;
        progressFillEl.style.width = percent + '%';
      }
    });

    AITreeVoiceEngine.on('result', (text) => {
      if (!textarea) return;
      if (!text) {
        showActionToast(btn.closest('[data-zen-toolbar]') || btn.parentElement, 'چیزی تشخیص داده نشد — دوباره امتحان کنید / Nothing recognized — try again');
        clearInlineVoiceStatus(statusEl, progressFillEl);
        return;
      }
      const start = textarea.selectionStart != null ? textarea.selectionStart : textarea.value.length;
      const end = textarea.selectionEnd != null ? textarea.selectionEnd : textarea.value.length;
      const needsSpace = start > 0 && !/\s$/.test(textarea.value.slice(0, start));
      const insert = (needsSpace ? ' ' : '') + text;
      textarea.value = textarea.value.slice(0, start) + insert + textarea.value.slice(end);
      const caret = start + insert.length;
      textarea.setSelectionRange(caret, caret);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
      flashInlineVoiceDone(statusEl, doneLabel);
    });

    AITreeVoiceEngine.on('error', (err) => {
      if (hud) hud.classList.remove('is-visible');
      if (micVisualizer) micVisualizer.classList.remove('is-visible');
      clearInlineVoiceStatus(statusEl, progressFillEl);
      if (err === 'needs_permission_tab') {
        btn.dataset.state = 'idle';
        showActionToast(btn.closest('[data-zen-toolbar]') || btn.parentElement, 'یک تب جدید برای گرفتن مجوز میکروفون باز شد / A tab opened to grant mic permission');
        return;
      }
      if (err === 'audio_too_short') {
        showActionToast(btn.closest('[data-zen-toolbar]') || btn.parentElement, 'صدا خیلی کوتاه بود — کمی بیشتر صحبت کنید / Recording was too short — try again');
        return;
      }
      console.warn('[AI Tree Voice]', err);
      showActionToast(btn.closest('[data-zen-toolbar]') || btn.parentElement, 'خطا در تبدیل صدا: ' + String(err).slice(0, 80));
    });

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      AITreeVoiceEngine.toggle();
    });
  }

  return { initDock, wireMicButton, showActionToast };
})();
