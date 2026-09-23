// ============================================================================
// AI Tree Launcher — void-tab.html pre-render router
// ----------------------------------------------------------------------------
// چون chrome_url_overrides.newtab در manifest.json ثابت است و هیچ Chrome API
// ای برای روشن/خاموش‌کردنِ آن در زمانِ اجرا وجود ندارد، این اسکریپت راهِ دور
// زدنِ آن محدودیت است: به‌جای تلاش برای لغوِ خودِ override، همین صفحه (که
// override به آن اشاره می‌کند) در همان لحظهٔ اول تصمیم می‌گیرد که خودش را
// نشان بدهد یا کاربر را به تجربهٔ استانداردِ تب‌جدید هدایت کند.
//
// این فایل باید همیشه اولین <script> در <head>ی void-tab.html باشد — قبل از
// استایل‌ها، canvas و بقیهٔ اسکریپت‌ها — چون همین ترتیب است که از فلاشِ کوتاهِ
// دیدنِ رابطِ افزونه قبل از ریدایرکت جلوگیری می‌کند.
//
// جهت (rtl/ltr)، سمتِ کوییک‌بار/داکِ Today، وضعیتِ جمع‌بودن، و مهم‌تر از همه
// وضعیتِ dissolve/صورت‌فلکی از chrome.storage.local خوانده می‌شوند و قبل از
// reveal روی DOM اعمال می‌شوند تا کاربر هنگام باز کردن تب جدید هیچ جابه‌جایی
// یا فلشِ پنلِ «Today» بسته نبیند.
// ============================================================================
(function () {
  // مخفی‌کردنِ فوری و همزمان (synchronous) — قبل از این‌که مرورگر حتی یک
  // فریمِ از canvas/ویجت را رسم کند.
  document.documentElement.style.display = 'none';
  // تا پایان boot، transition/animation را خاموش نگه می‌داریم تا بعد از
  // apply شدن state نهایی، هیچ «حرکت اضافی» دیده نشود.
  document.documentElement.classList.add('void-booting');

  function reveal() {
    document.documentElement.style.display = '';
    // یک فریم صبر کن تا layout با state نهایی settle شود، بعد transition را برگردان
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('void-booting');
      });
    });
  }

  var RTL_LANGS = ['fa', 'ar', 'he', 'ur', 'ps', 'sd', 'ckb', 'yi', 'dv'];
  function isRtlLang(lang) {
    if (!lang) return false;
    var base = String(lang).split('-')[0].toLowerCase();
    return RTL_LANGS.indexOf(base) !== -1;
  }

  function isMobileLayout() {
    try { return window.matchMedia('(max-width: 700px)').matches; } catch (e) { return window.innerWidth <= 700; }
  }

  function isDissolvedEntry(state, id) {
    return !!(state && state[id] && state[id].dissolved);
  }

  // اعمال layout + collapse + dissolve قبل از اولین paint قابل‌مشاهده
  function applyStableLayout(opts, onDone) {
    var dir = opts.dir || 'ltr';
    var dockSide = opts.dockSide || 'left';
    var quickbarSide = opts.quickbarSide || 'right';
    var dissolve = opts.dissolve || null;
    var dockCollapsed = opts.dockCollapsed !== false; // پیش‌فرض: جمع
    var dockVisible = opts.dockVisible !== false;
    var echoCollapsed = opts.echoCollapsed !== false;
    var goalsVisible = opts.goalsVisible !== false;

    document.documentElement.dir = dir;

    function apply() {
      var qb = document.getElementById('ai-ntp-quickbar');
      var dock = document.getElementById('ai-void-todo-dock');
      var echo = document.getElementById('ai-void-echo');
      var goals = document.getElementById('ai-void-agenda-goals-section');

      if (qb) qb.dataset.side = quickbarSide;
      if (dock) dock.dataset.side = dockSide;

      // ---- Today dock ----
      if (dock) {
        dock.classList.toggle('is-collapsed', !!dockCollapsed);
        try {
          var handle = document.getElementById('ai-void-todo-handle');
          if (handle) handle.setAttribute('aria-expanded', dockCollapsed ? 'false' : 'true');
        } catch (e) {}

        var todoDissolved = isDissolvedEntry(dissolve, 'todo');
        if (todoDissolved || !dockVisible) {
          // پنل کامل نباید حتی یک فریم دیده شود — singularity بعداً توسط
          // void-dissolve.js در همان موقعیت ذخیره‌شده ساخته می‌شود.
          dock.hidden = true;
          dock.classList.add('ai-void-is-dissolved');
          dock.setAttribute('aria-hidden', 'true');
          // علامت برای اسکریپت‌های بعدی: state از router از قبل اعمال شده
          dock.dataset.voidBootDissolved = '1';
        } else {
          dock.hidden = false;
          dock.classList.remove('ai-void-is-dissolved');
          dock.setAttribute('aria-hidden', 'false');
          delete dock.dataset.voidBootDissolved;
        }
      }

      // ---- Echo ----
      if (echo) {
        echo.classList.toggle('is-collapsed', !!echoCollapsed);
        var echoDissolved = isDissolvedEntry(dissolve, 'echo');
        if (echoDissolved) {
          // slot را نگه می‌داریم (visibility) تا Goals نپرد — مثل void-dissolve
          echo.hidden = false;
          echo.classList.add('ai-void-is-dissolved');
          echo.setAttribute('aria-hidden', 'true');
          echo.dataset.voidBootDissolved = '1';
        }
        // اگر dissolve نیست، visibility نهایی را memory/todo بعداً با داده تنظیم می‌کنند
      }

      // ---- Goals ----
      if (goals) {
        var goalsDissolved = isDissolvedEntry(dissolve, 'goals');
        if (goalsDissolved) {
          goals.hidden = false;
          goals.classList.add('ai-void-is-dissolved');
          goals.setAttribute('aria-hidden', 'true');
          goals.dataset.voidBootDissolved = '1';
        } else if (!goalsVisible) {
          goals.hidden = true;
          goals.classList.remove('ai-void-is-dissolved');
        }
      }

      // پرچم سراسری برای constellation — void-dissolve می‌تواند بدون فلش rebuild کند
      if (dissolve && dissolve.__constellation) {
        document.documentElement.dataset.voidBootConstellation = dissolve.__constellation.id || '1';
      }

      // اینجا، نه بیرونِ apply، باید صدا زده بشه — ببین کامنتِ پایینِ همین
      // تابع (سرِ شرطِ readyState) برای این‌که چرا این تغییر اصلاً لازم بود.
      if (typeof onDone === 'function') onDone();
    }

    // *** نکتهٔ حیاتی ***
    // وقتی این اسکریپت (اولین <script> در <head>) اجرا می‌شه، مرورگر هنوز
    // <body> رو پارس نکرده — یعنی document.getElementById('ai-void-todo-dock')
    // همین الان null برمی‌گردونه. برای همین apply() تا DOMContentLoaded عقب
    // می‌افته؛ این بخشش از اول درست بود. باگِ واقعی جای دیگه‌ای بود: قبلاً
    // reveal() از finalizeAndReveal، مستقیم و بدونِ توجه به این تاخیر صدا
    // زده می‌شد — یعنی صفحه (document.documentElement.style.display='')
    // زودتر از این‌که apply() اصلاً اجرا بشه نمایان می‌شد، و کاربر دقیقاً
    // همون حالتِ خامِ HTML (data-side="left" که مستقیم توی مارک‌آپ نوشته
    // شده، Todayِ نه‌هنوز-hidden) رو می‌دید تا DOMContentLoaded برسه و
    // apply() بالاخره اجرا بشه و درستش کنه — یعنی این نه یک رِیس، بلکه یک
    // باگِ تضمینی و همیشگی بود، چون readyState همین‌جا همیشه 'loading' است.
    // فیکس: reveal() دیگه از بیرون صدا زده نمی‌شه؛ به‌عنوانِ onDone به خودِ
    // apply() پاس داده می‌شه، تا مطمئن باشیم صفحه هیچ‌وقت زودتر از اعمالِ
    // وضعیتِ واقعی نمایان نمی‌شه — چه apply() فوری اجرا بشه چه بعداً.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
      apply();
    }
  }

  function finalizeAndReveal(opts) {
    var dockSide = opts.dockSide || 'left';
    var quickbarSide = isMobileLayout() ? 'right' : (dockSide === 'left' ? 'right' : 'left');
    applyStableLayout({
      dir: opts.dir || 'ltr',
      dockSide: dockSide,
      quickbarSide: quickbarSide,
      dissolve: opts.dissolve || null,
      dockCollapsed: opts.dockCollapsed,
      dockVisible: opts.dockVisible,
      echoCollapsed: opts.echoCollapsed,
      goalsVisible: opts.goalsVisible
    }, reveal);
  }

  try {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      finalizeAndReveal({ dir: 'ltr', dockSide: 'left' });
      return;
    }

    var params = new URLSearchParams(location.search);
    var explicitOpen = params.get('explicit') === '1';

    // یک get واحد برای همهٔ کلیدهای لازم برای اولین paint بدون فلش
    chrome.storage.local.get([
      'useDefaultNtp',
      'voidTodoDock',
      'appLanguage',
      'voidDissolveState',
      'voidTodoCollapsed',
      'voidTodoDockVisible',
      'voidEchoCollapsed',
      'voidGoalsVisible',
      'voidMemoryEchoVisible'
    ], function (res) {
      if (chrome.runtime && chrome.runtime.lastError) {
        finalizeAndReveal({ dir: 'ltr', dockSide: 'left' });
        return;
      }

      if (!explicitOpen && res && res.useDefaultNtp) {
        window.location.replace('https://www.google.com');
        return;
      }

      var dockSide = (res && res.voidTodoDock && res.voidTodoDock.side === 'right') ? 'right' : 'left';
      var dir = isRtlLang(res && res.appLanguage) ? 'rtl' : 'ltr';

      // اگر appLanguage فقط در sync باشد (نصب‌های قدیمی)، یک بار از sync بخوان
      // و local را پر کن — فقط وقتی local خالی است تا latency اضافه نشود.
      if (!(res && res.appLanguage)) {
        try {
          chrome.storage.sync.get(['appLanguage'], function (syncRes) {
            var lang = syncRes && syncRes.appLanguage;
            if (lang) {
              try { chrome.storage.local.set({ appLanguage: lang }); } catch (e) {}
              dir = isRtlLang(lang) ? 'rtl' : 'ltr';
            }
            finish(res, dir, dockSide);
          });
          return;
        } catch (e) { /* fall through */ }
      }

      finish(res, dir, dockSide);
    });
  } catch (e) {
    finalizeAndReveal({ dir: 'ltr', dockSide: 'left' });
  }

  function finish(res, dir, dockSide) {
    var dissolve = (res && res.voidDissolveState && typeof res.voidDissolveState === 'object')
      ? res.voidDissolveState
      : null;

    var dockCollapsed = (res && typeof res.voidTodoCollapsed === 'boolean')
      ? res.voidTodoCollapsed
      : true;
    var dockVisible = (res && typeof res.voidTodoDockVisible === 'boolean')
      ? res.voidTodoDockVisible
      : true;
    var echoCollapsed = (res && typeof res.voidEchoCollapsed === 'boolean')
      ? res.voidEchoCollapsed
      : true;
    var goalsVisible = (res && typeof res.voidGoalsVisible === 'boolean')
      ? res.voidGoalsVisible
      : true;

    finalizeAndReveal({
      dir: dir,
      dockSide: dockSide,
      dissolve: dissolve,
      dockCollapsed: dockCollapsed,
      dockVisible: dockVisible,
      echoCollapsed: echoCollapsed,
      goalsVisible: goalsVisible
    });
  }
})();
