// ============================================================================
// AI Tree Launcher — Void Tab frequent-links row (#ai-ntp-topsites)
// ----------------------------------------------------------------------------
// پیش از این فقط یک نمایشِ کاملاً فقط‌خواندنیِ chrome.topSites بود — دقیقاً
// همان محدودیتی که گزارش شده بود («امکانِ ویرایش یا اضافه‌کردن ندارد»).
// حالا این ردیف از دو منبع تشکیل می‌شود:
//   ۱) لینک‌های «سنجاق‌شده» — کاملاً دستیِ کاربر: افزودن/ویرایشِ برچسب و
//      نشانی/حذف، دقیقاً مثل ردیفِ اپ‌های گوگل.
//   ۲) پیشنهادهای خودکارِ مرورگر (chrome.topSites) — قابلِ «حذف از این لیست»
//      (فقط از نمایش پنهان می‌شود، به تاریخچهٔ واقعیِ مرورگر کاری ندارد) یا
//      «تبدیل به سنجاق‌شده» برای ویرایشِ برچسب/نشانی‌اش.
// جایگزینِ بخشِ بارگذاریِ topSites که قبلاً داخلِ void-tab-menu.js بود؛ از
// دیالوگِ مشترکِ void-tab-shortcuts.js استفاده می‌کند — باید بعد از آن لود شود.
// ============================================================================
(function () {
  const container = document.getElementById('ai-ntp-topsites');
  if (!container) return;

  const PINNED_KEY = 'voidPinnedLinks';
  const HIDDEN_KEY = 'voidHiddenAutoLinks';
  const MAX_TILES = 10;

  let pinned = [];
  let hiddenAuto = [];
  let autoSites = [];

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

  function hostOf(u) {
    try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; }
  }

  function savePinned() { try { chrome.storage.local.set({ [PINNED_KEY]: pinned }); } catch (e) {} }
  function saveHidden() { try { chrome.storage.local.set({ [HIDDEN_KEY]: hiddenAuto }); } catch (e) {} }
  function newId() { return 'tl-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function buildTile({ text, url, onEdit, onRemove, removeTitle, editTitle }) {
    const wrap = document.createElement('div');
    wrap.className = 'ai-ts-tile-wrap';

    const a = document.createElement('a');
    a.className = 'ai-ts-tile';
    a.href = url;
    a.title = text || url;

    const iconWrap = document.createElement('div');
    iconWrap.className = 'ai-ts-icon';
    const img = document.createElement('img');
    img.src = faviconUrl(url);
    img.alt = '';
    img.onerror = () => { img.style.display = 'none'; };
    iconWrap.appendChild(img);

    const lbl = document.createElement('div');
    lbl.className = 'ai-ts-label';
    lbl.textContent = text || hostOf(url);

    a.append(iconWrap, lbl);
    wrap.appendChild(a);

    const controls = document.createElement('div');
    controls.className = 'ai-ts-controls';

    if (onEdit) {
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'ai-ts-ctrl-btn';
      editBtn.title = editTitle || label('voidEditShortcut', 'Edit');
      editBtn.textContent = '\u270E';
      editBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onEdit(); });
      controls.appendChild(editBtn);
    }
    if (onRemove) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'ai-ts-ctrl-btn ai-ts-ctrl-remove';
      removeBtn.title = removeTitle || label('voidRemove', 'Remove');
      removeBtn.textContent = '\u00D7';
      removeBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onRemove(); });
      controls.appendChild(removeBtn);
    }
    wrap.appendChild(controls);
    return wrap;
  }

  function buildAddTile() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ai-ts-tile ai-ts-tile-add';
    btn.title = label('voidAddLink', 'Add link');

    const iconWrap = document.createElement('div');
    iconWrap.className = 'ai-ts-icon ai-ts-icon-add';
    iconWrap.textContent = '+';

    const lbl = document.createElement('div');
    lbl.className = 'ai-ts-label';
    lbl.textContent = label('voidAdd', 'Add');

    btn.append(iconWrap, lbl);
    btn.addEventListener('click', () => openEditor(null));
    return btn;
  }

  function openEditor(pin) {
    if (!window.VoidShortcutModal) return;
    window.VoidShortcutModal.open({
      title: pin ? label('voidEditLink', 'Edit link') : label('voidNewLink', 'New link'),
      label: pin ? pin.label : '',
      url: pin ? pin.url : '',
      labelPlaceholder: label('voidLinkLabelPh', 'Link name'),
      urlPlaceholder: 'https://…',
      allowDelete: !!pin,
      onSave(newLabel, newUrl) {
        if (pin) {
          pin.label = newLabel || hostOf(newUrl);
          pin.url = newUrl;
        } else {
          pinned.push({ id: newId(), label: newLabel || hostOf(newUrl), url: newUrl });
        }
        savePinned();
        render();
      },
      onDelete() {
        if (!pin) return;
        pinned = pinned.filter((x) => x.id !== pin.id);
        savePinned();
        render();
      }
    });
  }

  // تبدیلِ یک پیشنهادِ خودکار به یک لینکِ سنجاق‌شدهٔ قابل‌ویرایش: خودش از
  // لیستِ خودکار مخفی می‌شود (تا تکراری دیده نشود) و بلافاصله دیالوگِ ویرایش
  // برایش باز می‌شود تا کاربر برچسب/نشانی را دلخواه تغییر دهد.
  function promote(site) {
    if (!hiddenAuto.includes(site.url)) { hiddenAuto.push(site.url); saveHidden(); }
    const pin = { id: newId(), label: site.title || hostOf(site.url), url: site.url };
    pinned.push(pin);
    savePinned();
    render();
    openEditor(pin);
  }

  function render() {
    container.innerHTML = '';
    const usedUrls = new Set(pinned.map((p) => p.url));

    pinned.forEach((pin) => {
      container.appendChild(buildTile({
        text: pin.label,
        url: pin.url,
        onEdit: () => openEditor(pin),
        onRemove: () => { pinned = pinned.filter((x) => x.id !== pin.id); savePinned(); render(); },
        editTitle: label('voidEditShortcut', 'Edit'),
        removeTitle: label('voidRemoveLink', 'Remove')
      }));
    });

    const remainingSlots = Math.max(0, MAX_TILES - pinned.length - 1);
    autoSites
      .filter((s) => !hiddenAuto.includes(s.url) && !usedUrls.has(s.url))
      .slice(0, remainingSlots)
      .forEach((site) => {
        container.appendChild(buildTile({
          text: site.title || hostOf(site.url),
          url: site.url,
          onEdit: () => promote(site),
          onRemove: () => {
            if (!hiddenAuto.includes(site.url)) { hiddenAuto.push(site.url); saveHidden(); }
            render();
          },
          editTitle: label('voidCustomizeLink', 'Customize'),
          removeTitle: label('voidHideLink', 'Hide from this list')
        }));
      });

    container.appendChild(buildAddTile());
  }

  function loadAuto() {
    try {
      if (chrome.topSites && chrome.topSites.get) {
        chrome.topSites.get((sites) => { autoSites = sites || []; render(); });
      } else {
        render();
      }
    } catch (e) { render(); }
  }

  function init() {
    try {
      chrome.storage.local.get([PINNED_KEY, HIDDEN_KEY], (res) => {
        pinned = Array.isArray(res[PINNED_KEY]) ? res[PINNED_KEY] : [];
        hiddenAuto = Array.isArray(res[HIDDEN_KEY]) ? res[HIDDEN_KEY] : [];
        loadAuto();
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local') return;
        let dirty = false;
        if (changes[PINNED_KEY]) {
          pinned = Array.isArray(changes[PINNED_KEY].newValue) ? changes[PINNED_KEY].newValue : pinned;
          dirty = true;
        }
        if (changes[HIDDEN_KEY]) {
          hiddenAuto = Array.isArray(changes[HIDDEN_KEY].newValue) ? changes[HIDDEN_KEY].newValue : hiddenAuto;
          dirty = true;
        }
        if (dirty) render();
      });
    } catch (e) {
      loadAuto();
    }
  }

  init();
})();
