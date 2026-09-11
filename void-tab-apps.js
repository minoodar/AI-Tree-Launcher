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
  const TYPE_META = {
    mail: { cls: 'is-mail', glyph: '✉️' },
    drive: { cls: 'is-drive', glyph: '📁' },
    cal: { cls: 'is-cal', glyph: '📅' },
    photos: { cls: 'is-photos', glyph: '🖼️' },
    custom: { cls: 'is-custom', glyph: '' }
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

    const icon = document.createElement('span');
    icon.className = 'ai-void-app-icon ' + meta.cls;
    if (app.type === 'custom') {
      const img = document.createElement('img');
      img.src = faviconUrl(app.url);
      img.alt = '';
      img.onerror = () => {
        img.remove();
        icon.textContent = (app.label || '?').trim().charAt(0).toUpperCase() || '★';
      };
      icon.appendChild(img);
    } else {
      icon.textContent = meta.glyph;
    }

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
    try {
      chrome.storage.local.get([STORAGE_KEY], (res) => {
        apps = Array.isArray(res[STORAGE_KEY]) ? res[STORAGE_KEY] : DEFAULTS.map((d) => Object.assign({}, d));
        render();
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
})();
