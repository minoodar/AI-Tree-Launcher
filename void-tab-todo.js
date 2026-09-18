// ============================================================================
// AI Tree Launcher — Void Tab "Today" panel
// ----------------------------------------------------------------------------
// قبلاً این داک فقط کارهای روزانه (TODO) را نشان می‌داد. حالا یک پنلِ کاملِ
// «امروز»ه، بخش‌بندی‌شده:
//   ۱) سرِ تاریخ/سن — همان منطقِ تاریخ/سنِ ویجتِ اصلی (updateClockAge در
//      content.js)، اما مستقل محاسبه می‌شود؛ چون آن تابع فقط وقتی پنلِ ساعتِ
//      اصلی باز است اجرا می‌شود و برای این داک که همیشه باید درست باشد کافی
//      نیست. فرمول و منابعِ داده (userBirthYear در storage.sync) دقیقاً همان‌هایی
//      است که content.js استفاده می‌کند — نه حدسی، مستقیماً از رویِ همان کد.
//   ۲) رویدادهای ساعتیِ امروز (از aiTreeTimeEvents در storage.local) + یک
//      کادرِ فشردهٔ پیش‌نمایشِ «فردا» — همان دادهٔ داشبوردِ زمانِ ویجتِ اصلی،
//      چون رندرِ زندهٔ #ai-timeline-content به رویدادن/بازشدنِ پنلِ اصلی وابسته
//      است و روی این صفحه همیشه در دسترس نیست، این بخش مستقیماً از storage
//      می‌خواند و evaluateEventStatus را (با همان قوانین) دوباره پیاده می‌کند.
//   ۳) کارهای روزانه (TODO) — همان منطقِ قبلی، بدون تغییر.
// ============================================================================
(() => {
  'use strict';

  const dock = document.getElementById('ai-void-todo-dock');
  const handle = document.getElementById('ai-void-todo-handle');
  const panelTitleEl = document.getElementById('ai-void-todo-title');
  const list = document.getElementById('ai-void-todo-list');
  const count = document.getElementById('ai-void-todo-count');
  const sideButton = document.getElementById('ai-void-todo-side');
  const dateHead = document.getElementById('ai-void-agenda-datehead');
  const eventsTitleEl = document.getElementById('ai-void-agenda-events-title');
  const eventsList = document.getElementById('ai-void-agenda-events');
  const tasksTitleEl = document.getElementById('ai-void-agenda-tasks-title');
  let goalsSection = document.getElementById('ai-void-agenda-goals-section');
  let goalsTitleEl = document.getElementById('ai-void-agenda-goals-title');
  let goalsList = document.getElementById('ai-void-goals-list');
  if (!dock || !handle || !list || !count || !sideButton || !dateHead || !eventsList) return;

  document.body.appendChild(dock);

  // اگر HTML قدیمی بدون بخش Goals باشد، همین‌جا می‌سازیم تا نمایش اهداف از کار نیفتد.
  // محلِ پیش‌فرضِ ساخت: کنارِ Today's Echo (نه داخلِ داکِ Today) — چون این
  // بخش دیگه به‌جای داک، زیرِ Echo زندگی می‌کنه.
  if (!goalsSection || !goalsList) {
    const echoEl = document.getElementById('ai-void-echo');
    const fallbackParent = (echoEl && echoEl.parentNode) || document.getElementById('ai-void-agenda-body') || dock;
    goalsSection = document.createElement('div');
    goalsSection.className = 'ai-void-agenda-section is-goals';
    goalsSection.id = 'ai-void-agenda-goals-section';
    goalsSection.hidden = true;
    goalsTitleEl = document.createElement('div');
    goalsTitleEl.className = 'ai-void-agenda-section-title';
    goalsTitleEl.id = 'ai-void-agenda-goals-title';
    goalsList = document.createElement('div');
    goalsList.className = 'ai-void-todo-list ai-void-goals-list';
    goalsList.id = 'ai-void-goals-list';
    goalsSection.append(goalsTitleEl, goalsList);
    if (echoEl && echoEl.nextSibling) fallbackParent.insertBefore(goalsSection, echoEl.nextSibling);
    else fallbackParent.appendChild(goalsSection);
  }

  function label(key, fallback) {
    try { if (typeof t === 'function') { const v = t(key); if (v) return v; } } catch (e) {}
    return fallback;
  }

  let todos = [];
  let timeEvents = [];
  let userBirthYear = null;
  let userBirthMonth = null;
  let userBirthDay = null;
  let familyAges = [];
  let voidFamilyExpanded = false;

  let markedDays = [];
  const VISIBLE_KEY = 'voidTodoDockVisible';
  let position = { side: 'left', top: 0.22 };
  let collapsed = true;
  let dockVisible = true;
  let hasGoals = false;

  // ---------------------------------------------------------------- عمومی —
  function pad2(n) { return String(n).padStart(2, '0'); }
  function isoFromDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  function todayIso() { return isoFromDate(new Date()); }
  function tomorrowIso() { const d = new Date(); d.setDate(d.getDate() + 1); return isoFromDate(d); }

  // Match content.js daily list:
  // - type daily (not goals)
  // - createdAt in the past/now → today (tomorrow is stored as createdAt > now)
  // - still within the 24h TTL window
  const TODO_DAILY_TTL_MS = 24 * 60 * 60 * 1000;
  function todoCreatedAt(todo, now) {
    const raw = todo && todo.createdAt;
    const parsed = typeof raw === 'number' ? raw : Date.parse(raw);
    return Number.isFinite(parsed) ? parsed : (now || Date.now());
  }
  function isToday(todo, now) {
    now = now || Date.now();
    if (!todo) return false;
    if ((todo.type || 'daily') !== 'daily') return false;
    const created = todoCreatedAt(todo, now);
    if (created > now) return false; // scheduled for tomorrow
    if (now - created >= TODO_DAILY_TTL_MS) return false; // expired daily
    return true;
  }
  function isTomorrowTodo(todo, now) {
    now = now || Date.now();
    if (!todo) return false;
    if ((todo.type || 'daily') !== 'daily') return false;
    return todoCreatedAt(todo, now) > now;
  }

  function applyCollapsed() {
    dock.classList.toggle('is-collapsed', collapsed);
    handle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }
  function setCollapsed(next) {
    collapsed = !!next;
    applyCollapsed();
    try { chrome.storage.local.set({ voidTodoCollapsed: collapsed }); } catch (e) {}
  }

  // نمایش/پنهان‌کردنِ کاملِ داک (نه فقط جمع‌شدن) — از منوی سه‌تایی کنترل
  // می‌شه. Goals دیگه داخلِ داک نیست (کنارِ Today's Echo‌ست)، ولی هم‌زمان
  // با Today پنهان/آشکار می‌شه — عمداً یه آیتمِ جدا براش توی منو نذاشتم تا
  // منو شلوغ نشه؛ یه دکمهٔ «Today» هم داک و هم Goals رو با هم کنترل می‌کنه.
  // Goals علاوه‌براین وقتی چیزی برای نشون‌دادن نداره (hasGoals=false) هم
  // مخفیه — این دو شرط با هم AND می‌شن.
  // Goals visibility is independent of Today dock (separate dissolve + own flag).
  // Menu "Today" still toggles both for convenience; dissolve buttons act separately.
  let goalsVisible = true;

  function applyDockVisibility() {
    const todoDissolved = !!(window.VoidDissolve && VoidDissolve.isDissolved('todo'));
    const goalsDissolved = !!(window.VoidDissolve && VoidDissolve.isDissolved('goals'));
    if (todoDissolved) {
      // Today dock is side panel — full hide is fine (nothing stacked under it in flow)
      dock.hidden = true;
      dock.classList.remove('ai-void-is-dissolved');
    } else {
      dock.hidden = !dockVisible;
      if (dockVisible) dock.classList.remove('ai-void-is-dissolved');
    }
    dock.setAttribute('aria-hidden', (dock.hidden || dock.classList.contains('ai-void-is-dissolved')) ? 'true' : 'false');
    if (goalsSection) {
      if (goalsDissolved) {
        // Keep layout slot so position stays under Echo
        goalsSection.hidden = false;
        goalsSection.classList.add('ai-void-is-dissolved');
      } else if (!goalsVisible || !hasGoals) {
        goalsSection.classList.remove('ai-void-is-dissolved');
        goalsSection.hidden = true;
      } else {
        goalsSection.classList.remove('ai-void-is-dissolved');
        goalsSection.hidden = false;
      }
    }
  }
  function wireMenu() {
    const btn = document.getElementById('ai-ntp-menu-todo');
    if (!btn) return;
    const sync = () => {
      const on = window.VoidDissolve
        ? !VoidDissolve.isDissolved('todo') && dockVisible
        : dockVisible;
      btn.setAttribute('data-on', on ? '1' : '0');
      const labelEl = document.getElementById('ai-ntp-menu-todo-label');
      if (labelEl && !labelEl.textContent) labelEl.textContent = label('ntpMenuTodo', 'Today Task');
    };
    sync();
    if (btn.dataset.wired === '1') return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Unified with ◎ dissolve: hide → stars / constellation; show → restore
      if (window.VoidDissolve) {
        const todoGone = VoidDissolve.isDissolved('todo') || !dockVisible;
        if (todoGone) {
          if (VoidDissolve.isDissolved('todo')) {
            try { VoidDissolve.restore('todo'); } catch (err) {}
          } else {
            dockVisible = true;
            applyDockVisibility();
          }
          if (VoidDissolve.isDissolved('goals')) {
            try { VoidDissolve.restore('goals'); } catch (err) {}
          } else if (hasGoals) {
            goalsVisible = true;
            applyDockVisibility();
          }
        } else {
          try { VoidDissolve.dissolve('todo'); } catch (err) {}
          // Goals travels with Today from the menu so the triad can form
          if (hasGoals && goalsSection && !VoidDissolve.isDissolved('goals')) {
            const goalsHiddenHard = goalsSection.hidden && !goalsSection.classList.contains('ai-void-is-dissolved');
            if (!goalsHiddenHard) {
              try { VoidDissolve.dissolve('goals'); } catch (err) {}
            }
          }
        }
        try {
          chrome.storage.local.set({
            [VISIBLE_KEY]: !VoidDissolve.isDissolved('todo'),
            voidGoalsVisible: !VoidDissolve.isDissolved('goals')
          });
        } catch (err) {}
        setTimeout(sync, 50);
        setTimeout(sync, 800);
        return;
      }
      dockVisible = !dockVisible;
      goalsVisible = dockVisible;
      applyDockVisibility();
      try {
        chrome.storage.local.set({
          [VISIBLE_KEY]: dockVisible,
          voidGoalsVisible: goalsVisible
        });
      } catch (err) {}
      sync();
    });
  }

  // Dissolve into stars — Today and Goals each have their own singularity
  function wireDissolve() {
    if (!window.VoidDissolve) return;

    const todoTrigger = document.getElementById('ai-void-todo-dissolve');
    if (dock) {
      if (todoTrigger) {
        todoTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
      VoidDissolve.register('todo', {
        el: dock,
        label: (typeof label === 'function' ? label('ntpMenuTodo', 'Today') : 'Today'),
        trigger: todoTrigger || null,
        onHide: function () {
          dockVisible = false;
          try { chrome.storage.local.set({ [VISIBLE_KEY]: false }); } catch (e) {}
          const btn = document.getElementById('ai-ntp-menu-todo');
          if (btn) btn.setAttribute('data-on', '0');
        },
        onShow: function () {
          dockVisible = true;
          try { chrome.storage.local.set({ [VISIBLE_KEY]: true }); } catch (e) {}
          applyDockVisibility();
          const btn = document.getElementById('ai-ntp-menu-todo');
          if (btn) btn.setAttribute('data-on', '1');
        }
      });
    }

    const goalsTrigger = document.getElementById('ai-void-goals-dissolve');
    if (goalsSection) {
      if (goalsTrigger) {
        goalsTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
      VoidDissolve.register('goals', {
        el: goalsSection,
        label: (typeof label === 'function' ? label('todoTabGoals', 'Goals') : 'Goals'),
        trigger: goalsTrigger || null,
        onHide: function () {
          goalsVisible = false;
          try { chrome.storage.local.set({ voidGoalsVisible: false }); } catch (e) {}
        },
        onShow: function () {
          goalsVisible = true;
          try { chrome.storage.local.set({ voidGoalsVisible: true }); } catch (e) {}
          applyDockVisibility();
        }
      });
    }
  }
  try { wireDissolve(); } catch (e) {}


  // -------------------------------------------------------- سرِ تاریخ/سن —

  function computeVoidAge(year, month, day) {
    const y = parseInt(year, 10);
    if (!y || isNaN(y)) return 0;
    const isJalali = y < 1500;
    let m = parseInt(month, 10);
    let d = parseInt(day, 10);
    const hasFull = !!(month && day && m >= 1 && m <= 12 && d >= 1 && d <= 31);
    if (!m || m < 1 || m > 12) m = 1;
    if (!d || d < 1 || d > 31) d = 1;
    let gY, gM, gD;
    try {
      if (isJalali && typeof jalaaliToGregorian === 'function') {
        const g = jalaaliToGregorian(y, m, d); gY = g.gy; gM = g.gm; gD = g.gd;
      } else { gY = y; gM = m; gD = d; }
    } catch (e) { gY = isJalali ? y + 621 : y; gM = m; gD = d; }
    const now = new Date();
    let age;
    if (hasFull) {
      age = now.getFullYear() - gY;
      const had = (now.getMonth() + 1 > gM) || (now.getMonth() + 1 === gM && now.getDate() >= gD);
      if (!had) age -= 1;
    } else if (isJalali) {
      try {
        const jYearStr = new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(now);
        age = parseInt(jYearStr.replace(/\D/g, ''), 10) - y;
      } catch (e) { age = now.getFullYear() - gY; }
    } else { age = now.getFullYear() - gY; }
    return Math.max(0, age);
  }
  const VOID_JALALI_MONTHS_FA = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

  function formatVoidBirthLines(year, month, day) {
    const y = parseInt(year, 10);
    if (!y || isNaN(y)) return { jalali: '', gregorian: '', plain: '' };
    const isJalali = y < 1500;
    let m = parseInt(month, 10);
    let d = parseInt(day, 10);
    const hasFull = !!(month && day && m >= 1 && m <= 12 && d >= 1 && d <= 31);
    if (!m || m < 1 || m > 12) m = 1;
    if (!d || d < 1 || d > 31) d = 1;
    try {
      let gY, gM, gD;
      if (isJalali && typeof jalaaliToGregorian === 'function') {
        const g = jalaaliToGregorian(y, m, d); gY = g.gy; gM = g.gm; gD = g.gd;
      } else { gY = y; gM = m; gD = d; }
      if (hasFull) {
        const gDate = new Date(gY, gM - 1, gD);
        const gStr = gDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        let jStr = '';
        if (typeof gregorianToJalaali === 'function') {
          const j = gregorianToJalaali(gY, gM, gD);
          jStr = j.jd + ' ' + VOID_JALALI_MONTHS_FA[Math.max(0, j.jm - 1)] + ' ' + j.jy;
        } else if (isJalali) {
          jStr = d + ' ' + VOID_JALALI_MONTHS_FA[Math.max(0, m - 1)] + ' ' + y;
        }
        return { jalali: jStr, gregorian: gStr, plain: (jStr ? jStr + ' · ' : '') + gStr };
      }
      if (isJalali) {
        let s = y + ' شمسی';
        try { const g = jalaaliToGregorian(y, 1, 1); if (g) s += ' · ≈' + g.gy + ' CE'; } catch (e) {}
        return { jalali: s, gregorian: '', plain: s };
      }
      let s = y + ' CE';
      try { const j = gregorianToJalaali(y, 1, 1); if (j) s += ' · ≈' + j.jy + ' شمسی'; } catch (e) {}
      return { jalali: '', gregorian: s, plain: s };
    } catch (e) { return { jalali: '', gregorian: '', plain: '' }; }
  }

  function formatVoidBirthLabel(year, month, day) {
    return formatVoidBirthLines(year, month, day).plain;
  }
  function getVoidPrimary() {
    if (Array.isArray(familyAges) && familyAges.length) {
      const p = familyAges.find(m => m.primary) || familyAges[0];
      if (p && p.year) return p;
    }
    if (userBirthYear) return { name: '', year: userBirthYear, month: userBirthMonth, day: userBirthDay, primary: true };
    return null;
  }

  function renderDateHead() {
    const now = new Date();
    dateHead.innerHTML = '';
    const primary = document.createElement('div'); primary.className = 'ai-void-agenda-date-primary';
    primary.textContent = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    dateHead.appendChild(primary);
    try {
      const secondary = document.createElement('div'); secondary.className = 'ai-void-agenda-date-secondary';
      secondary.textContent = now.toLocaleDateString('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' });
      secondary.dir = 'rtl';
      dateHead.appendChild(secondary);
    } catch (e) {}
    try {
      const tertiary = document.createElement('div'); tertiary.className = 'ai-void-agenda-date-tertiary';
      tertiary.textContent = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      tertiary.dir = 'rtl';
      dateHead.appendChild(tertiary);
    } catch (e) {
      try {
        const tertiary = document.createElement('div'); tertiary.className = 'ai-void-agenda-date-tertiary';
        tertiary.textContent = now.toLocaleDateString('en-US-u-ca-islamic-umalqura', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        dateHead.appendChild(tertiary);
      } catch (e2) {}
    }
    const primaryBirth = getVoidPrimary();
    if (primaryBirth && primaryBirth.year) {
      const age = computeVoidAge(primaryBirth.year, primaryBirth.month, primaryBirth.day);
      const wrap = document.createElement('div');
      wrap.className = 'ai-void-agenda-journey';
      const top = document.createElement('div');
      top.className = 'ai-void-agenda-journey-top';
      const origin = document.createElement('span');
      origin.textContent = label('originLabel', 'Origin');
      const present = document.createElement('span');
      present.textContent = label('presentLabel', 'Now');
      top.append(origin, present);
      const track = document.createElement('div');
      track.className = 'ai-void-agenda-journey-track';
      const fill = document.createElement('div');
      fill.className = 'ai-void-agenda-journey-fill';
      const pct = Math.max(4, Math.min(96, (age / 90) * 100));
      fill.style.width = pct + '%';
      track.appendChild(fill);
      const cap = document.createElement('div');
      cap.className = 'ai-void-agenda-journey-caption';
      const nameBit = primaryBirth.name ? (primaryBirth.name + ' · ') : '';
      cap.textContent = nameBit + label('journeyCaption', '{age} years on the path').replace('{age}', String(age));
      wrap.append(top, track, cap);
      const birthLines = formatVoidBirthLines(primaryBirth.year, primaryBirth.month, primaryBirth.day);
      if (birthLines.jalali || birthLines.gregorian || birthLines.plain) {
        const birthWrap = document.createElement('div');
        birthWrap.className = 'ai-void-agenda-birth';
        if (birthLines.jalali) {
          const jLine = document.createElement('div');
          jLine.className = 'ai-void-agenda-birth-j';
          jLine.textContent = '🌱 ' + birthLines.jalali;
          birthWrap.appendChild(jLine);
        }
        if (birthLines.gregorian) {
          const gLine = document.createElement('div');
          gLine.className = 'ai-void-agenda-birth-g';
          gLine.textContent = '✦ ' + birthLines.gregorian;
          birthWrap.appendChild(gLine);
        }
        if (!birthLines.jalali && !birthLines.gregorian && birthLines.plain) {
          birthWrap.textContent = birthLines.plain;
        }
        wrap.appendChild(birthWrap);
      }
      // Collapsible family roster — primary only until toggle opens
      const others = (familyAges || []).filter(m => m && m.year && !m.primary);
      if (others.length) {
        const tog = document.createElement('button');
        tog.type = 'button';
        tog.className = 'ai-void-agenda-family-toggle' + (voidFamilyExpanded ? ' is-open' : '');
        tog.setAttribute('aria-expanded', voidFamilyExpanded ? 'true' : 'false');
        const n = others.length;
        const openTxt = (typeof currentLang !== 'undefined' && currentLang === 'fa')
          ? (n + ' عضو دیگر خانواده')
          : (n + ' more');
        const closeTxt = (typeof currentLang !== 'undefined' && currentLang === 'fa')
          ? 'بستن'
          : 'Hide';
        tog.textContent = (voidFamilyExpanded ? closeTxt : openTxt) + ' ▾';
        tog.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          voidFamilyExpanded = !voidFamilyExpanded;
          renderDateHead();
        });
        wrap.appendChild(tog);
        if (voidFamilyExpanded) {
          const fam = document.createElement('div');
          fam.className = 'ai-void-agenda-family is-open';
          const ordered = (familyAges || []).filter(m => m && m.year).slice()
            .sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
          ordered.forEach((m) => {
            const a = computeVoidAge(m.year, m.month, m.day);
            const row = document.createElement('div');
            row.className = 'ai-void-agenda-family-row' + (m.primary ? ' is-primary' : '');
            row.textContent = (m.name || (m.primary ? 'Me' : '—')) + ' · ' + a + ' yrs';
            const bl = formatVoidBirthLabel(m.year, m.month, m.day);
            if (bl) row.title = bl;
            fam.appendChild(row);
          });
          wrap.appendChild(fam);
        }
      }
      dateHead.appendChild(wrap);
    }
    renderMarkedDayLine();
  }

  // ------------------------------------------------ خطِ عمرِ تقویم (مناسبت‌ها) —
  // «مناسبت‌های علامت‌گذاری‌شده» (تولد، سالگرد، یادآوری‌های سالانه) دقیقاً با
  // همان منطقِ خودِ افزونه (calendar-engine.js: daysUntilNext/isMarkedDayPast،
  // که همین‌جا به‌صورتِ سراسری در دسترسند چون این فایل بعد از آن لود می‌شود) —
  // نه یک فرمولِ حدسی. یک آیتمِ «امروز» با 🎉 برجسته می‌شود؛ در غیرِ این صورت
  // نزدیک‌ترین موردِ پیشِ‌رو (در بازهٔ ۴۵ روزِ آینده، تا شلوغ/بی‌ربط نشود).
  function renderMarkedDayLine() {
    if (typeof daysUntilNext !== 'function' || typeof isMarkedDayPast !== 'function') return;
    const kept = (markedDays || []).filter((m) => m && m.golden || !isMarkedDayPast(m.day, m.month, m.cal));
    if (!kept.length) return;

    const withDays = kept.map((m) => ({ m, days: daysUntilNext(m.day, m.month, m.cal) }));
    const todays = withDays.filter((x) => x.days === 0);
    const upcoming = withDays.filter((x) => x.days > 0).sort((a, b) => a.days - b.days);

    function formatDate(m) {
      const dd = String(m.day).padStart(2, '0');
      const mm = String(m.month).padStart(2, '0');
      const isJ = m.cal === 'j' || m.cal === 'jalali';
      let currentLangSafe = 'en';
      try { if (typeof currentLang !== 'undefined') currentLangSafe = currentLang; } catch (e) {}
      if (isJ && currentLangSafe === 'fa' && typeof toPersianDigits === 'function') return toPersianDigits(`${dd}/${mm}`);
      if (currentLangSafe === 'ar' && typeof toArabicDigits === 'function') return toArabicDigits(`${dd}/${mm}`);
      return `${dd}/${mm}`;
    }

    const line = document.createElement('div');
    line.className = 'ai-void-agenda-mark-line';

    if (todays.length) {
      line.classList.add('is-today');
      line.textContent = '\u{1F389} ' + todays.map((x) => (x.m.golden ? '\u2605 ' : '') + x.m.label).join(', ');
    } else if (upcoming.length && upcoming[0].days <= 45) {
      const { m, days } = upcoming[0];
      line.textContent = '\u{1F4CC} ' + (m.golden ? '\u2605 ' : '') + m.label + '  \u00b7  ' + formatDate(m);
    } else {
      return;
    }
    dateHead.appendChild(line);
  }

  function loadMarkedDays() {
    try {
      chrome.storage.sync.get(['aiTreeMarkedDays'], (res) => {
        markedDays = Array.isArray(res.aiTreeMarkedDays) ? res.aiTreeMarkedDays : [];
        renderDateHead();
      });
    } catch (e) {}
  }

  // ------------------------------------------------- رویدادهای ساعتی —
  // دقیقاً همان قوانینِ evaluateEventStatus در content.js (از جمله وضعیتِ
  // «recurring-elapsed» برای رویدادهای ستاره‌دارِ گذشته که دیگر «missed»
  // قرمز/خط‌خورده نشان داده نمی‌شوند، چون فردا خودشان تازه می‌شوند).
  function evaluateStatus(evt) {
    if (evt.status === 'done') return 'done';
    const eventTime = new Date(`${evt.date}T${evt.startTime}:00`);
    if (isNaN(eventTime.getTime())) return 'future';
    const diffMinutes = (eventTime - new Date()) / 60000;
    if (diffMinutes < 0) return evt.recurring ? 'recurring-elapsed' : 'missed';
    if (diffMinutes <= 30) return 'near';
    return 'future';
  }

  function saveTimeEventsToStorage() {
    try { chrome.storage.local.set({ aiTreeTimeEvents: timeEvents }); } catch (e) {}
  }

  // حذفِ یک رویداد: دقیقاً هم‌رفتار با deleteDashEvent در content.js — اگر
  // رویداد یک TODوی روزانهٔ لینک‌شده دارد (linkedTodoId)، آن هم حذف می‌شود تا
  // یک TODوی یتیم و بی‌معنی در پنلِ اصلی باقی نماند.
  function deleteEvent(id) {
    const evt = timeEvents.find(e => e.id === id);
    if (evt && evt.linkedTodoId) {
      const idx = todos.findIndex(td => td.id === evt.linkedTodoId);
      if (idx !== -1) {
        todos.splice(idx, 1);
        try { chrome.storage.sync.set({ aiTreeTodos: todos }); chrome.storage.local.set({ aiTreeTodos: todos }); } catch (e) {}
        renderTodos();
      }
    }
    timeEvents = timeEvents.filter(e => e.id !== id);
    saveTimeEventsToStorage();
    renderEvents();
  }

  function updateEventTime(id, newTime) {
    const evt = timeEvents.find(e => e.id === id);
    if (!evt || !/^\d{2}:\d{2}$/.test(newTime) || evt.startTime === newTime) return;
    evt.startTime = newTime;
    // TODوی لینک‌شده هم متنش با ساعتِ جدید هماهنگ شود (همان قالبِ content.js: "HH:mm — عنوان")
    if (evt.linkedTodoId) {
      const linked = todos.find(td => td.id === evt.linkedTodoId);
      if (linked) {
        linked.text = `${newTime} — ${evt.title}`;
        try { chrome.storage.sync.set({ aiTreeTodos: todos }); chrome.storage.local.set({ aiTreeTodos: todos }); } catch (e) {}
        renderTodos();
      }
    }
    saveTimeEventsToStorage();
    renderEvents();
  }

  function beginTimeEdit(row, timeEl, evt) {
    if (row.classList.contains('is-editing-time')) return;
    row.classList.add('is-editing-time');
    const input = document.createElement('input');
    input.type = 'time';
    input.className = 'ai-void-event-time-input';
    input.value = evt.startTime;
    timeEl.replaceWith(input);
    input.focus();
    let done = false;
    const commit = () => {
      if (done) return; done = true;
      const val = input.value || evt.startTime;
      input.replaceWith(timeEl);
      row.classList.remove('is-editing-time');
      if (val !== evt.startTime) updateEventTime(evt.id, val); else timeEl.textContent = evt.startTime;
    };
    const cancel = () => {
      if (done) return; done = true;
      input.replaceWith(timeEl);
      row.classList.remove('is-editing-time');
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    });
  }

  function buildEventRow(evt, status) {
    const row = document.createElement('div');
    row.className = 'ai-void-event-row' + (status === 'near' ? ' is-near' : status === 'missed' ? ' is-missed' : status === 'done' ? ' is-done' : status === 'recurring-elapsed' ? ' is-recurring-elapsed' : '');
    const time = document.createElement('span'); time.className = 'ai-void-event-time'; time.textContent = evt.startTime;
    time.title = label('voidEditShortcut', 'Edit');
    row.addEventListener('click', () => beginTimeEdit(row, time, evt));
    const title = document.createElement('span'); title.className = 'ai-void-event-title'; title.textContent = evt.title; title.title = evt.title;
    row.append(time, title);
    if (status === 'recurring-elapsed') {
      const chip = document.createElement('span'); chip.className = 'ai-void-event-badge';
      chip.textContent = '\u21bb ' + label('scrubberTomorrowBadge', 'Tomorrow');
      row.appendChild(chip);
    } else if (evt.recurring) {
      const star = document.createElement('span'); star.className = 'ai-void-event-badge'; star.textContent = '\u2605';
      row.appendChild(star);
    }
    const delBtn = document.createElement('button');
    delBtn.type = 'button'; delBtn.className = 'ai-void-event-del';
    delBtn.title = label('voidRemove', 'Remove');
    delBtn.setAttribute('aria-label', label('voidRemove', 'Remove') + ': ' + evt.title);
    delBtn.textContent = '\u00D7';
    delBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteEvent(evt.id); });
    row.appendChild(delBtn);
    return row;
  }

  function renderEvents() {
    if (eventsTitleEl) eventsTitleEl.textContent = label('voidAgendaEventsLabel', "Today's schedule");
    eventsList.innerHTML = '';
    const iso = todayIso();
    const todays = timeEvents.filter(e => e && e.date === iso).slice().sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (!todays.length) {
      const empty = document.createElement('div'); empty.className = 'ai-void-event-empty';
      empty.textContent = label('dashNoEvents', 'No events');
      eventsList.appendChild(empty);
    } else {
      todays.forEach(evt => eventsList.appendChild(buildEventRow(evt, evaluateStatus(evt))));
    }

    const tIso = tomorrowIso();
    const tomorrows = timeEvents.filter(e => e && e.date === tIso).slice().sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (tomorrows.length) {
      const box = document.createElement('div'); box.className = 'ai-void-tomorrow-box';
      const head = document.createElement('div'); head.className = 'ai-void-tomorrow-head';
      head.textContent = `${label('scrubberTomorrowBadge', 'Tomorrow')} \u00b7 ${tomorrows.length}`;
      box.appendChild(head);
      tomorrows.slice(0, 3).forEach(evt => box.appendChild(buildEventRow(evt, evaluateStatus(evt))));
      eventsList.appendChild(box);
    }
  }

  function loadTimeEvents() {
    try {
      chrome.storage.local.get(['aiTreeTimeEvents'], (res) => {
        timeEvents = Array.isArray(res.aiTreeTimeEvents) ? res.aiTreeTimeEvents : [];
        renderEvents();
      });
    } catch (e) { renderEvents(); }
  }

  function loadBirthYear() {
    try {
      chrome.storage.sync.get(['userBirthYear', 'userBirthMonth', 'userBirthDay', 'aiTreeFamilyAges'], (res) => {
        userBirthYear = res.userBirthYear ? parseInt(res.userBirthYear, 10) : null;
        userBirthMonth = res.userBirthMonth ? parseInt(res.userBirthMonth, 10) : null;
        userBirthDay = res.userBirthDay ? parseInt(res.userBirthDay, 10) : null;
        if (Array.isArray(res.aiTreeFamilyAges) && res.aiTreeFamilyAges.length) {
          familyAges = res.aiTreeFamilyAges.filter(m => m && m.year).map(m => ({
            id: m.id, name: String(m.name || '').slice(0, 24),
            year: parseInt(m.year, 10),
            month: m.month ? parseInt(m.month, 10) : null,
            day: m.day ? parseInt(m.day, 10) : null,
            primary: !!m.primary
          }));
          if (familyAges.length && !familyAges.some(m => m.primary)) familyAges[0].primary = true;
          const prim = familyAges.find(m => m.primary) || familyAges[0];
          if (prim) { userBirthYear = prim.year; userBirthMonth = prim.month; userBirthDay = prim.day; }
        } else if (userBirthYear) {
          familyAges = [{ id: 'legacy', name: '', year: userBirthYear, month: userBirthMonth, day: userBirthDay, primary: true }];
        } else { familyAges = []; }
        renderDateHead();
      });
    } catch (e) { renderDateHead(); }
  }

  // ---------------------------------------------------------------- تودو —
  function acceptTodos(next, allowEmpty) {
    if (!Array.isArray(next)) return;
    if (!allowEmpty && next.length === 0 && todos.length > 0) return;
    const sig = function (arr) {
      return (arr || []).map(function (t) {
        if (!t) return '';
        return [t.id || '', t.text || '', t.done ? '1' : '0', t.type || 'daily', String(t.createdAt || ''), String(typeof t.progress === 'number' ? t.progress : '')].join('\x1f');
      }).join('\x1e');
    };
    if (sig(next) === sig(todos)) return;
    todos = next.slice();
    renderTodos();
  }

  function isGoal(todo) {
    if (!todo) return false;
    const ty = String(todo.type || '').toLowerCase();
    return ty === 'goal' || ty === 'goals';
  }

  function goalProgress(todo) {
    if (!todo) return 0;
    if (typeof todo.progress === 'number' && isFinite(todo.progress)) {
      return Math.max(0, Math.min(100, Math.round(todo.progress)));
    }
    return todo.done ? 100 : 0;
  }

  function persistTodos() {
    try {
      chrome.storage.sync.set({ aiTreeTodos: todos });
      chrome.storage.local.set({ aiTreeTodos: todos });
    } catch (err) {}
    try {
      window.__aiTreeTodosForVoid = todos;
      window.dispatchEvent(new CustomEvent('ai-tree-todos-updated', { detail: todos }));
    } catch (err) {}
  }

  function buildTodoRow(todo, opts) {
    opts = opts || {};
    const isTomorrow = !!opts.isTomorrow;
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'ai-void-todo-row'
      + (isTomorrow ? ' is-tomorrow' : '')
      + (todo.done ? ' done' : '');
    row.title = todo.text || '';
    const check = document.createElement('span');
    check.className = 'ai-void-todo-check';
    check.textContent = todo.done ? '\u2713' : '';
    const textEl = document.createElement('span');
    textEl.className = 'ai-void-todo-text';
    textEl.textContent = todo.text || '';
    row.append(check, textEl);
    if (isTomorrow) {
      const badge = document.createElement('span');
      badge.className = 'ai-void-tomorrow-badge';
      badge.textContent = label('todoWhenTomorrow', 'Tomorrow');
      row.appendChild(badge);
    }
    row.addEventListener('click', function (e) {
      e.stopPropagation();
      if (todo.sourceCheck && typeof todo.sourceCheck.click === 'function') {
        todo.sourceCheck.click();
        return;
      }
      todo.done = !todo.done;
      persistTodos();
      renderTodos();
    });
    return row;
  }

  function buildGoalCard(todo) {
    const pct = goalProgress(todo);
    const card = document.createElement('div');
    card.className = 'ai-void-goal-card' + (pct >= 100 ? ' is-complete' : '');
    card.dataset.goalId = todo.id || '';

    const head = document.createElement('div');
    head.className = 'ai-void-goal-head';

    const spark = document.createElement('span');
    spark.className = 'ai-void-goal-spark';
    spark.textContent = '\u2728';
    spark.setAttribute('aria-hidden', 'true');

    const labelEl = document.createElement('div');
    labelEl.className = 'ai-void-goal-label';
    labelEl.textContent = todo.text || '';

    const pctEl = document.createElement('span');
    pctEl.className = 'ai-void-goal-pct' + (pct >= 70 ? ' is-high' : '');
    pctEl.textContent = pct + '%';

    head.append(spark, labelEl, pctEl);

    const wrap = document.createElement('div');
    wrap.className = 'ai-void-goal-slider-wrap';

    const track = document.createElement('div');
    track.className = 'ai-void-goal-slider-track';
    const veil = document.createElement('div');
    veil.className = 'ai-void-goal-slider-veil';
    veil.style.width = (100 - pct) + '%';
    track.appendChild(veil);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'ai-void-goal-slider';
    slider.min = '0';
    slider.max = '100';
    slider.step = '1';
    slider.value = String(pct);
    slider.setAttribute('aria-label', (todo.text || 'Goal') + ' progress');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuenow', String(pct));

    function applyVisual(val) {
      const v = Math.max(0, Math.min(100, Math.round(Number(val) || 0)));
      veil.style.width = (100 - v) + '%';
      pctEl.textContent = v + '%';
      pctEl.classList.toggle('is-high', v >= 70);
      card.classList.toggle('is-complete', v >= 100);
      slider.setAttribute('aria-valuenow', String(v));
      // Thumb glow scales with progress
      const glow = 6 + (v / 100) * 16;
      const gold = (v / 100) * 0.75;
      slider.style.setProperty('--thumb-glow', glow + 'px');
      slider.style.setProperty('--thumb-gold', gold);
    }

    function commit(val) {
      const v = Math.max(0, Math.min(100, Math.round(Number(val) || 0)));
      todo.progress = v;
      todo.done = v >= 100;
      applyVisual(v);
      persistTodos();
    }

    slider.addEventListener('input', function () {
      applyVisual(slider.value);
    });
    slider.addEventListener('change', function () {
      commit(slider.value);
    });
    // Prevent dock drag / collapse when adjusting the lever
    slider.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    slider.addEventListener('click', function (e) { e.stopPropagation(); });

    wrap.append(track, slider);

    const ends = document.createElement('div');
    ends.className = 'ai-void-goal-ends';
    const dim = document.createElement('span');
    dim.textContent = label('goalDimLabel', 'Dim');
    const light = document.createElement('span');
    light.className = 'end-light';
    light.textContent = label('goalLightLabel', 'Radiant');
    ends.append(dim, light);

    card.append(head, wrap, ends);
    applyVisual(pct);
    return card;
  }

  function renderTodos() {
    if (tasksTitleEl) tasksTitleEl.textContent = label('voidAgendaTasksLabel', 'Tasks');
    const now = Date.now();
    const shown = todos.filter(function (t) { return isToday(t, now); });
    const tomorrow = todos.filter(function (t) { return isTomorrowTodo(t, now); });
    const goals = todos.filter(function (t) { return isGoal(t); });

    const pendingDaily = shown.filter(function (t) { return !t.done; }).length;
    const pendingTomorrow = tomorrow.filter(function (t) { return !t.done; }).length;
    const pendingGoals = goals.filter(function (t) { return goalProgress(t) < 100; }).length;
    const totalOpen = pendingDaily + pendingTomorrow + pendingGoals;
    const totalAll = shown.length + tomorrow.length + goals.length;
    count.textContent = totalAll ? (totalOpen + '/' + totalAll) : '';

    list.innerHTML = '';
    if (!shown.length && !tomorrow.length) {
      const empty = document.createElement('div');
      empty.className = 'ai-void-todo-empty';
      empty.textContent = label('todoNoDaily', 'No daily tasks');
      list.appendChild(empty);
    } else {
      shown.forEach(function (todo) {
        list.appendChild(buildTodoRow(todo, { isGoal: false }));
      });
      tomorrow.forEach(function (todo) {
        list.appendChild(buildTodoRow(todo, { isGoal: false, isTomorrow: true }));
      });
    }

    if (goalsSection && goalsList) {
      hasGoals = goals.length > 0;
      if (!hasGoals) {
        goalsList.innerHTML = '';
      } else {
        if (goalsTitleEl) goalsTitleEl.textContent = label('todoTabGoals', 'Goals');
        goalsList.innerHTML = '';
        goals.slice().sort(function (a, b) {
          return goalProgress(b) - goalProgress(a);
        }).forEach(function (todo) {
          goalsList.appendChild(buildGoalCard(todo));
        });
      }
      // hidden واقعیِ Goals از applyDockVisibility میاد — چون هم به تعدادِ
      // Goals (hasGoals) و هم به روشن/خاموش‌بودنِ Today (dockVisible) بستگی داره.
      applyDockVisibility();
    }
  }

  function isMobileLayout() {
    try { return window.matchMedia('(max-width: 700px)').matches; } catch (e) { return window.innerWidth <= 700; }
  }
  function applyQuickbarOpposite() {
    const qb = document.getElementById('ai-ntp-quickbar');
    if (!qb) return;
    if (isMobileLayout()) { qb.dataset.side = 'right'; return; }
    const dockSide = position.side === 'left' ? 'left' : 'right';
    qb.dataset.side = dockSide === 'right' ? 'left' : 'right';
  }
  function applyPosition() {
    dock.dataset.side = position.side === 'left' ? 'left' : 'right';
    dock.style.top = (Math.max(0.04, Math.min(0.78, Number(position.top) || 0.22)) * 100) + 'vh';
    applyQuickbarOpposite();
  }
  function savePosition() {
    try { chrome.storage.local.set({ voidTodoDock: position }); } catch (e) {}
  }

  let dragMoved = false;
  function isDockChromeControl(target) {
    if (!target) return false;
    const dissolveBtn = document.getElementById('ai-void-todo-dissolve');
    if (sideButton && (target === sideButton || sideButton.contains(target))) return true;
    if (dissolveBtn && (target === dissolveBtn || dissolveBtn.contains(target))) return true;
    return false;
  }
  handle.addEventListener('click', function (event) {
    if (isDockChromeControl(event.target)) return;
    if (dragMoved) { dragMoved = false; return; }
    setCollapsed(!collapsed);
  });
  handle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setCollapsed(!collapsed);
    }
  });

  window.addEventListener('ai-tree-todos-updated', function (event) {
    acceptTodos(event.detail, false);
  });
  if (Array.isArray(window.__aiTreeTodosForVoid) && window.__aiTreeTodosForVoid.length) {
    acceptTodos(window.__aiTreeTodosForVoid, false);
  }

  function loadFromStorage() {
    try {
      chrome.storage.local.get(['aiTreeTodos', 'voidTodoDock', 'voidTodoCollapsed', VISIBLE_KEY, 'voidGoalsVisible'], function (localData) {
        if (localData.voidTodoDock && typeof localData.voidTodoDock === 'object') {
          position = Object.assign({}, position, localData.voidTodoDock);
        }
        if (typeof localData.voidTodoCollapsed === 'boolean') collapsed = localData.voidTodoCollapsed;
        if (typeof localData[VISIBLE_KEY] === 'boolean') dockVisible = localData[VISIBLE_KEY];
        if (typeof localData.voidGoalsVisible === 'boolean') goalsVisible = localData.voidGoalsVisible;
        else goalsVisible = dockVisible;
        applyPosition();
        applyCollapsed();
        applyDockVisibility();
        wireMenu();
        chrome.storage.sync.get(['aiTreeTodos'], function (syncData) {
          const localTodos = Array.isArray(localData.aiTreeTodos) ? localData.aiTreeTodos : [];
          const syncTodos = Array.isArray(syncData.aiTreeTodos) ? syncData.aiTreeTodos : [];
          // Prefer the richer list — not only by length, but by presence of goals
          // (DOM-scraped fallbacks are daily-only and must not win over full storage).
          function score(arr) {
            let s = arr.length;
            for (let i = 0; i < arr.length; i++) {
              const ty = String((arr[i] && arr[i].type) || '').toLowerCase();
              if (ty === 'goal' || ty === 'goals') s += 10;
            }
            return s;
          }
          let preferred = localTodos;
          if (score(syncTodos) > score(localTodos)) preferred = syncTodos;
          else if (syncTodos.length && !localTodos.length) preferred = syncTodos;
          acceptTodos(preferred, true);
        });
      });
    } catch (e) {
      applyPosition();
      applyCollapsed();
      applyDockVisibility();
      wireMenu();
    }
  }
  loadFromStorage();
  loadTimeEvents();
  loadBirthYear();
  loadMarkedDays();
  renderDateHead();
  renderEvents();

  if (panelTitleEl) panelTitleEl.textContent = label('voidTodayPanelTitle', 'Today');

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if ((area === 'sync' || area === 'local') && changes.aiTreeTodos) {
        acceptTodos(Array.isArray(changes.aiTreeTodos.newValue) ? changes.aiTreeTodos.newValue : [], true);
      }
      if (area === 'local' && changes.aiTreeTimeEvents) {
        timeEvents = Array.isArray(changes.aiTreeTimeEvents.newValue) ? changes.aiTreeTimeEvents.newValue : [];
        renderEvents();
      }
      if (area === 'sync' && (changes.userBirthYear || changes.userBirthMonth || changes.userBirthDay || changes.aiTreeFamilyAges)) {
        if (changes.userBirthYear) userBirthYear = changes.userBirthYear.newValue ? parseInt(changes.userBirthYear.newValue, 10) : null;
        if (changes.userBirthMonth) userBirthMonth = changes.userBirthMonth.newValue ? parseInt(changes.userBirthMonth.newValue, 10) : null;
        if (changes.userBirthDay) userBirthDay = changes.userBirthDay.newValue ? parseInt(changes.userBirthDay.newValue, 10) : null;
        if (changes.aiTreeFamilyAges) {
          const list = Array.isArray(changes.aiTreeFamilyAges.newValue) ? changes.aiTreeFamilyAges.newValue : [];
          familyAges = list.filter(m => m && m.year).map(m => ({
            id: m.id, name: String(m.name || '').slice(0, 24),
            year: parseInt(m.year, 10),
            month: m.month ? parseInt(m.month, 10) : null,
            day: m.day ? parseInt(m.day, 10) : null,
            primary: !!m.primary
          }));
          if (familyAges.length && !familyAges.some(m => m.primary)) familyAges[0].primary = true;
          const prim = familyAges.find(m => m.primary) || familyAges[0];
          if (prim) { userBirthYear = prim.year; userBirthMonth = prim.month; userBirthDay = prim.day; }
        }
        renderDateHead();
      }
      if (area === 'sync' && changes.aiTreeMarkedDays) {
        markedDays = Array.isArray(changes.aiTreeMarkedDays.newValue) ? changes.aiTreeMarkedDays.newValue : [];
        renderDateHead();
      }
      if (area === 'local' && changes[VISIBLE_KEY]) {
        dockVisible = changes[VISIBLE_KEY].newValue !== false;
        applyDockVisibility();
        wireMenu();
      }
    });
  } catch (e) {}

  // رفرشِ خفیفِ دوره‌ای: چون evaluateStatus (near/missed) وابسته به «الان» است،
  // بدون تغییرِ داده هم باید هر دقیقه یک‌بار خودش را به‌روز کند — درست مثل
  // رفتارِ ویجتِ اصلی (renderTimeline هر دقیقه).
  setInterval(() => { renderEvents(); renderDateHead(); }, 60 * 1000);

  function poll() {
    // منبع اصلی: آرایهٔ کامل (روزانه + فردا + اهداف) از content.js
    if (Array.isArray(window.__aiTreeTodosForVoid) && window.__aiTreeTodosForVoid.length) {
      acceptTodos(window.__aiTreeTodosForVoid, false);
      return;
    }
    // فقط وقتی هنوز هیچ todoای نداریم از DOM اسکرپ کن —
    // و هرگز لیستی که فقط daily است را روی لیست کامل‌تر (با goal) ننویس
    if (todos.length) return;
    const sources = [
      { el: document.getElementById('ai-todo-list'), row: '.ai-todo-item, .ai-goal-item', text: '.ai-todo-text, .ai-goal-text', check: '.ai-todo-check, .ai-goal-check' },
      { el: document.getElementById('ai-dash-todo-list'), row: '.ai-dash-todo-row', text: '.ai-dash-todo-text', check: '.ai-dash-todo-check' }
    ];
    for (let s = 0; s < sources.length; s++) {
      const src = sources[s];
      if (!src.el) continue;
      const rows = src.el.querySelectorAll(src.row);
      if (!rows.length) continue;
      const mapped = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const textEl = row.querySelector(src.text);
        const checkEl = row.querySelector(src.check);
        const text = textEl ? textEl.textContent.trim() : '';
        if (!text) continue;
        const isGoalRow = row.classList.contains('ai-goal-item');
        mapped.push({
          text: text,
          done: row.classList.contains('done'),
          sourceCheck: checkEl,
          type: isGoalRow ? 'goal' : 'daily',
          createdAt: Date.now() - 1000
        });
      }
      if (mapped.length) {
        acceptTodos(mapped, false);
        break;
      }
    }
  }
  poll();
  setInterval(poll, 400);

  sideButton.addEventListener('click', function (event) {
    event.stopPropagation();
    position.side = position.side === 'left' ? 'right' : 'left';
    applyPosition();
    savePosition();
  });

  let dragging = null;
  handle.addEventListener('pointerdown', function (event) {
    if (isDockChromeControl(event.target)) return;
    dragMoved = false;
    dragging = { y: event.clientY, top: dock.getBoundingClientRect().top };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    if (Math.abs(event.clientY - dragging.y) > 4) dragMoved = true;
    const maxTop = Math.max(16, window.innerHeight - dock.offsetHeight - 16);
    const top = Math.max(16, Math.min(maxTop, dragging.top + event.clientY - dragging.y));
    position.top = top / window.innerHeight;
    position.side = event.clientX < window.innerWidth / 2 ? 'left' : 'right';
    applyPosition();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = null;
    if (dragMoved) savePosition();
  }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);


  // ============================================================
  // Daily report — email (mailto) + copy + download .txt
  // ============================================================
  const REPORT_EMAIL_KEY = 'voidReportEmail';
  const reportBar = document.getElementById('ai-void-report-bar');
  const reportEmailInput = document.getElementById('ai-void-report-email');
  const reportSendBtn = document.getElementById('ai-void-report-send');
  const reportCopyBtn = document.getElementById('ai-void-report-copy');
  const reportTxtBtn = document.getElementById('ai-void-report-txt');
  const reportHint = document.getElementById('ai-void-report-hint');
  let reportHintTimer = null;

  function showReportHint(msg, isError) {
    if (!reportHint) return;
    reportHint.textContent = msg || '';
    reportHint.classList.toggle('is-error', !!isError);
    reportHint.classList.add('is-visible');
    clearTimeout(reportHintTimer);
    reportHintTimer = setTimeout(() => { reportHint.classList.remove('is-visible'); }, 3200);
  }

  function statusLabel(status) {
    const map = { done: '✓', missed: '✗', near: '⚡', 'recurring-elapsed': '↻', future: '·' };
    return map[status] || '·';
  }
  function statusWord(status) {
    if (status === 'done') return 'done';
    if (status === 'missed') return 'missed';
    if (status === 'near') return 'soon';
    if (status === 'recurring-elapsed') return 'repeats';
    return '';
  }

  function buildDailyReport() {
    const now = new Date();
    const iso = todayIso();
    const tIso = tomorrowIso();
    const dateLine = now.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const lines = [];
    lines.push('AI Tree — Daily Report');
    lines.push(dateLine);
    lines.push('='.repeat(Math.min(40, dateLine.length + 8)));
    lines.push('');

    const todaysEvents = timeEvents
      .filter((e) => e && e.date === iso)
      .slice()
      .sort((a, b) => String(a.startTime || '').localeCompare(String(b.startTime || '')));
    lines.push(label('voidAgendaEventsLabel', "Today's schedule"));
    if (!todaysEvents.length) {
      lines.push('  — ' + label('dashNoEvents', 'No events'));
    } else {
      todaysEvents.forEach((evt) => {
        const st = evaluateStatus(evt);
        const mark = statusLabel(st);
        const extra = statusWord(st);
        const rec = evt.recurring ? ' ★' : '';
        const end = evt.endTime ? ('–' + evt.endTime) : '';
        lines.push('  ' + mark + ' ' + (evt.startTime || '--:--') + end + '  ' + (evt.title || '') + rec + (extra ? '  [' + extra + ']' : ''));
      });
    }
    lines.push('');

    const tomorrowEvents = timeEvents
      .filter((e) => e && e.date === tIso)
      .slice()
      .sort((a, b) => String(a.startTime || '').localeCompare(String(b.startTime || '')));
    if (tomorrowEvents.length) {
      lines.push(label('scrubberTomorrowBadge', 'Tomorrow') + ' — ' + label('voidAgendaEventsLabel', "Today's schedule"));
      tomorrowEvents.forEach((evt) => {
        const rec = evt.recurring ? ' ★' : '';
        const end = evt.endTime ? ('–' + evt.endTime) : '';
        lines.push('  · ' + (evt.startTime || '--:--') + end + '  ' + (evt.title || '') + rec);
      });
      lines.push('');
    }

    const todayTasks = todos.filter((t) => isToday(t, now));
    const tomorrowTasks = todos.filter((t) => isTomorrowTodo(t, now));
    const goals = todos.filter((t) => isGoal(t));

    lines.push(label('voidAgendaTasksLabel', 'Tasks') + ' — ' + label('todoWhenToday', 'Today'));
    if (!todayTasks.length) {
      lines.push('  — ' + label('todoNoDaily', 'No daily tasks'));
    } else {
      todayTasks.forEach((t) => {
        lines.push('  ' + (t.done ? '[x]' : '[ ]') + ' ' + (t.text || ''));
      });
    }
    lines.push('');

    if (tomorrowTasks.length) {
      lines.push(label('voidAgendaTasksLabel', 'Tasks') + ' — ' + label('todoWhenTomorrow', 'Tomorrow'));
      tomorrowTasks.forEach((t) => {
        lines.push('  ' + (t.done ? '[x]' : '[ ]') + ' ' + (t.text || ''));
      });
      lines.push('');
    }

    if (goals.length) {
      lines.push(label('todoTabGoals', 'Goals'));
      goals.slice().sort((a, b) => goalProgress(b) - goalProgress(a)).forEach((g) => {
        const pct = goalProgress(g);
        const barLen = 10;
        const filled = Math.round((pct / 100) * barLen);
        const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
        lines.push('  ' + bar + ' ' + pct + '%  ' + (g.text || ''));
      });
      lines.push('');
    }

    const openTasks = todayTasks.filter((t) => !t.done).length + tomorrowTasks.filter((t) => !t.done).length;
    const openGoals = goals.filter((g) => goalProgress(g) < 100).length;
    const openEvents = todaysEvents.filter((e) => {
      const s = evaluateStatus(e);
      return s !== 'done' && s !== 'missed' && s !== 'recurring-elapsed';
    }).length;
    lines.push('-'.repeat(28));
    lines.push(
      label('voidReportSummary', 'Open: {tasks} tasks · {events} events · {goals} goals')
        .replace('{tasks}', String(openTasks))
        .replace('{events}', String(openEvents))
        .replace('{goals}', String(openGoals))
    );
    lines.push('');
    lines.push('— AI Tree Launcher');
    return lines.join('\n');
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
  }
  function saveReportEmail(email) {
    try { chrome.storage.local.set({ [REPORT_EMAIL_KEY]: email }); } catch (e) {}
  }
  function loadReportEmail() {
    try {
      chrome.storage.local.get([REPORT_EMAIL_KEY], (res) => {
        if (reportEmailInput && res && typeof res[REPORT_EMAIL_KEY] === 'string' && res[REPORT_EMAIL_KEY]) {
          reportEmailInput.value = res[REPORT_EMAIL_KEY];
        }
      });
    } catch (e) {}
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        resolve();
      } catch (err) { reject(err); }
    });
  }
  function downloadReportTxt() {
    const body = buildDailyReport();
    const filename = 'AITree_Daily_' + todayIso() + '.txt';
    try {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch (e) {}
        try { a.remove(); } catch (e) {}
      }, 1500);
      showReportHint(label('voidReportTxtSaved', 'Saved as {file}').replace('{file}', filename));
    } catch (err) {
      showReportHint(label('voidReportTxtFail', 'Could not save .txt file'), true);
    }
  }
  function sendReportEmail() {
    const email = (reportEmailInput && reportEmailInput.value || '').trim();
    if (!isValidEmail(email)) {
      showReportHint(label('voidReportNeedEmail', 'Enter a valid email address'), true);
      if (reportEmailInput) reportEmailInput.focus();
      return;
    }
    saveReportEmail(email);
    const body = buildDailyReport();
    const subject = label('voidReportSubject', 'AI Tree — Daily report ({date})').replace('{date}', todayIso());
    const encodedBody = encodeURIComponent(body);
    const encodedSubject = encodeURIComponent(subject);
    const mailtoBase = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodedSubject + '&body=';
    const fullUrl = mailtoBase + encodedBody;
    if (fullUrl.length <= 1800) {
      window.location.href = fullUrl;
      showReportHint(label('voidReportOpenedMail', 'Opening your email client…'));
      return;
    }
    copyText(body).then(() => {
      const short = label('voidReportBodyCopied', 'The full daily report was copied to your clipboard.\n\nPaste it here (Ctrl/Cmd+V).\n\n— AI Tree Launcher');
      window.location.href = mailtoBase + encodeURIComponent(short);
      showReportHint(label('voidReportCopiedLong', 'Report copied — paste into the email'));
    }).catch(() => {
      showReportHint(label('voidReportCopyFail', 'Could not copy report'), true);
    });
  }
  function copyReportOnly() {
    const body = buildDailyReport();
    copyText(body).then(() => {
      showReportHint(label('voidReportCopied', 'Report copied to clipboard'));
    }).catch(() => {
      showReportHint(label('voidReportCopyFail', 'Could not copy report'), true);
    });
  }
  function applyReportLabels() {
    if (reportEmailInput) {
      reportEmailInput.placeholder = label('voidReportEmailPh', 'you@email.com');
      reportEmailInput.setAttribute('aria-label', label('voidReportEmailAria', 'Email for daily report'));
    }
    if (reportSendBtn) {
      reportSendBtn.title = label('voidReportSendTitle', 'Email today’s report');
      reportSendBtn.setAttribute('aria-label', label('voidReportSendTitle', 'Email today’s report'));
    }
    if (reportCopyBtn) {
      reportCopyBtn.title = label('voidReportCopyTitle', 'Copy report');
      reportCopyBtn.setAttribute('aria-label', label('voidReportCopyTitle', 'Copy report'));
    }
    if (reportTxtBtn) {
      reportTxtBtn.title = label('voidReportTxtTitle', 'Download as .txt');
      reportTxtBtn.setAttribute('aria-label', label('voidReportTxtTitle', 'Download as .txt'));
    }
    const dissolveTitle = label('voidDissolveBtn', 'Dissolve into stars');
    ['ai-void-todo-dissolve', 'ai-void-goals-dissolve'].forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.title = dissolveTitle;
      btn.setAttribute('aria-label', dissolveTitle);
    });
  }

  if (reportSendBtn) reportSendBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); sendReportEmail(); });
  if (reportCopyBtn) reportCopyBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); copyReportOnly(); });
  if (reportTxtBtn) reportTxtBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); downloadReportTxt(); });
  if (reportEmailInput) {
    reportEmailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); sendReportEmail(); }
    });
    reportEmailInput.addEventListener('change', () => {
      const v = reportEmailInput.value.trim();
      if (isValidEmail(v)) saveReportEmail(v);
    });
    reportEmailInput.addEventListener('pointerdown', (e) => e.stopPropagation());
  }
  if (reportBar) reportBar.addEventListener('pointerdown', (e) => e.stopPropagation());

  loadReportEmail();
  applyReportLabels();
  try {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.appLanguage) applyReportLabels();
    });
  } catch (e) {}

  applyCollapsed();
  applyQuickbarOpposite();
  try { window.addEventListener('resize', applyQuickbarOpposite); } catch (e) {}
})();
