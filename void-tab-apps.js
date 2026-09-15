// ============================================================================
// AI Tree Launcher — Void Tab Google-apps shortcut row (#ai-void-apps)
// ----------------------------------------------------------------------------
// چهار میان‌بر پیش‌فرضِ گوگل (Gmail / Drive / Calendar / Photos) به‌علاوهٔ
// امکانِ افزودنِ نامحدودِ میان‌برِ سفارشی، و ویرایشِ برچسب/نشانیِ هرکدام
// (شاملِ موارد پیش‌فرض — مثلاً برای اشاره به یک حساب/دامنهٔ دیگر) یا حذفشان.
// ذخیره‌سازی در chrome.storage.local زیرِ کلیدِ voidApps. از دیالوگِ مشترکِ
// void-tab-shortcuts.js استفاده می‌کند — باید بعد از آن لود شود.
// ============================================================================
(function () {
  const row = document.getElementById('ai-void-apps');
  if (!row) return;

  const STORAGE_KEY = 'voidApps';
  // چهار خط‌آیکونِ ژنریک (نه لوگوی رسمیِ گوگل) که فقط وقتی favicon بارگذاری
  // نشد به‌کار می‌روند؛ هم‌خانواده با آیکونِ ذره‌بینِ سرچ (stroke=currentColor)
  // تا رگهٔ رنگِ برندِ .is-mail/.is-drive/.is-cal/.is-photos روشون بنشیند.
  const SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const TYPE_META = {
    mail: { cls: 'is-mail', svg: `<svg ${SVG_ATTRS}><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>` },
    drive: { cls: 'is-drive', svg: `<svg ${SVG_ATTRS}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path></svg>` },
    cal: { cls: 'is-cal', svg: `<svg ${SVG_ATTRS}><rect x="3" y="5" width="18" height="16" rx="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line><line x1="8" y1="3" x2="8" y2="7"></line><line x1="16" y1="3" x2="16" y2="7"></line></svg>` },
    photos: { cls: 'is-photos', svg: `<svg ${SVG_ATTRS}><rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M21 15l-5-5-4 4-2-2-5 5"></path></svg>` },
    custom: { cls: 'is-custom', svg: '' }
  };

  const DEFAULTS = [
    { id: 'app-gmail', type: 'mail', label: 'Gmail', url: 'https://mail.google.com/mail/u/0/' },
    { id: 'app-drive', type: 'drive', label: 'Drive', url: 'https://drive.google.com/' },
    { id: 'app-calendar', type: 'cal', label: 'Calendar', url: 'https://calendar.google.com/' },
    { id: 'app-photos', type: 'photos', label: 'Photos', url: 'https://photos.google.com/' }
  ];

  let apps = [];

  function label(key, fallback) {
    try { if (typeof t === 'function') { const v = t(key); if (v) return v; } } catch (e) {}
    return fallback;
  }

  function faviconUrl(pageUrl) {
    try {
      const url = new URL(chrome.runtime.getURL('/_favicon/'));
      url.searchParams.set('pageUrl', pageUrl);
      url.searchParams.set('size', '32');
      return url.toString();
    } catch (e) { return ''; }
  }

  // آیکونِ لوکالِ chrome._favicon فقط از تاریخچهٔ بازدیدِ خودِ کاربر می‌خونه —
  // اگر کسی Gmail/Drive/... را قبلاً در همین مرورگر باز نکرده باشه، بدونِ
  // خطا یک آیکونِ خاکستریِ پیش‌فرض برمی‌گردونه (نه ارورِ img که بشه fallback
  // زد). برای همین چهار اپِ پیش‌فرض از سرویسِ عمومیِ favicon گوگل استفاده
  // می‌کنیم که مستقل از تاریخچهٔ محلیه و همیشه آیکونِ واقعی/رسمی رو می‌ده.
  function officialFaviconUrl(domain) {
    return 'https://www.google.com/s2/favicons?sz=64&domain=' + encodeURIComponent(domain);
  }
  const TYPE_DOMAIN = { mail: 'mail.google.com', drive: 'drive.google.com', cal: 'calendar.google.com', photos: 'photos.google.com' };

  function save() {
    try { chrome.storage.local.set({ [STORAGE_KEY]: apps }); } catch (e) {}
  }

  function newId() {
    return 'app-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function buildTile(app) {
    const meta = TYPE_META[app.type] || TYPE_META.custom;
    const a = document.createElement('a');
    a.className = 'ai-void-app';
    a.href = app.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = app.label || app.url;

    // همیشه اول تلاش برای آیکونِ واقعیِ favicon (نشانِ رسمیِ Gmail/Drive/...
    // را خودِ مرورگر می‌آورد، نه یک ایموجیِ تقریبی). فقط اگر favicon بارگذاری
    // نشد (مثلاً بدونِ اینترنت)، به گلیفِ پیش‌فرض یا حرفِ اول برمی‌گردیم.
    const icon = document.createElement('span');
    icon.className = 'ai-void-app-icon ' + meta.cls;
    const img = document.createElement('img');
    img.src = app.type === 'custom' ? faviconUrl(app.url) : officialFaviconUrl(TYPE_DOMAIN[app.type] || app.url);
    img.alt = '';
    img.onerror = () => {
      img.remove();
      if (app.type === 'custom') {
        icon.textContent = (app.label || '?').trim().charAt(0).toUpperCase() || '★';
      } else {
        icon.innerHTML = meta.svg;
      }
    };
    icon.appendChild(img);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'ai-void-app-edit';
    editBtn.title = label('voidEditShortcut', 'Edit');
    editBtn.setAttribute('aria-label', label('voidEditShortcutAria', 'Edit shortcut') + ': ' + (app.label || app.url));
    editBtn.textContent = '\u270E';
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditor(app);
    });

    const lbl = document.createElement('div');
    lbl.className = 'ai-void-app-label';
    lbl.textContent = app.label || app.url;

    a.append(icon, editBtn, lbl);
    return a;
  }

  function buildAddTile() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ai-void-app ai-void-app-add';
    btn.title = label('voidAddShortcut', 'Add shortcut');

    const icon = document.createElement('span');
    icon.className = 'ai-void-app-icon';
    icon.textContent = '+';

    const lbl = document.createElement('div');
    lbl.className = 'ai-void-app-label';
    lbl.textContent = label('voidAdd', 'Add');

    btn.append(icon, lbl);
    btn.addEventListener('click', () => openEditor(null));
    return btn;
  }

  function render() {
    row.innerHTML = '';
    apps.forEach((app) => row.appendChild(buildTile(app)));
    row.appendChild(buildAddTile());
  }

  function openEditor(app) {
    if (!window.VoidShortcutModal) return;
    window.VoidShortcutModal.open({
      title: app ? label('voidEditApp', 'Edit shortcut') : label('voidNewApp', 'New shortcut'),
      label: app ? app.label : '',
      url: app ? app.url : '',
      labelPlaceholder: label('voidAppLabelPh', 'Gmail, Drive…'),
      urlPlaceholder: 'https://…',
      allowDelete: !!app,
      onSave(newLabel, newUrl) {
        if (app) {
          app.label = newLabel || app.label;
          app.url = newUrl;
        } else {
          apps.push({
            id: newId(),
            type: 'custom',
            label: newLabel || newUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
            url: newUrl
          });
        }
        save();
        render();
      },
      onDelete() {
        if (!app) return;
        apps = apps.filter((x) => x.id !== app.id);
        save();
        render();
      }
    });
  }

  function init() {
    apps = DEFAULTS.map((d) => Object.assign({}, d));
    render();
    try {
      chrome.storage.local.get([STORAGE_KEY], (res) => {
        const stored = res[STORAGE_KEY];
        if (Array.isArray(stored) && stored.length > 0) {
          apps = stored;
          render();
        }
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes[STORAGE_KEY]) {
          apps = Array.isArray(changes[STORAGE_KEY].newValue) ? changes[STORAGE_KEY].newValue : apps;
          render();
        }
      });
    } catch (e) {
      apps = DEFAULTS.map((d) => Object.assign({}, d));
      render();
    }
  }

  init();

  const appsWrap = document.getElementById('ai-ntp-apps-wrap');
  const appsBtn = document.getElementById('ai-ntp-apps-btn');
  if (appsWrap && appsBtn) {
    appsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = appsWrap.classList.toggle('open');
      appsBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      const mainMenu = document.getElementById('ai-ntp-menu');
      if (mainMenu) {
        mainMenu.classList.remove('open');
        const mb = document.getElementById('ai-ntp-menu-btn');
        if (mb) mb.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', (e) => {
      if (!appsWrap.contains(e.target)) {
        appsWrap.classList.remove('open');
        appsBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && appsWrap.classList.contains('open')) {
        appsWrap.classList.remove('open');
        appsBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
