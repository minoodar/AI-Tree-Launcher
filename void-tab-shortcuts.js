// ============================================================================
// AI Tree Launcher — Void Tab shared "edit shortcut" modal
// ----------------------------------------------------------------------------
// یک دیالوگ واحد (همان #ai-void-profile-dialog موجود در void-tab.html) که هم
// برای ردیفِ اپ‌های گوگل (void-tab-apps.js) و هم برای لینک‌های پرکاربرد
// (void-tab-topsites.js) استفاده می‌شود — به‌جای دو پاپ‌آپِ جدا، یک تجربهٔ
// واحد و قابل‌پیش‌بینی برای «افزودن/ویرایش/حذف» در هر دو ردیف.
// باید قبل از void-tab-apps.js و void-tab-topsites.js لود شود.
// ============================================================================
(function () {
  const dialog = document.getElementById('ai-void-profile-dialog');
  if (!dialog) { window.VoidShortcutModal = { open() {}, close() {} }; return; }

  const titleEl = document.getElementById('ai-void-profile-title');
  const labelInput = document.getElementById('ai-void-profile-label');
  const urlInput = document.getElementById('ai-void-profile-url');
  const saveBtn = document.getElementById('ai-void-profile-save');
  const cancelBtn = document.getElementById('ai-void-profile-cancel');
  const deleteBtn = document.getElementById('ai-void-profile-delete');

  let activeConfig = null;
  let lastFocused = null;

  // نشانیِ بدونِ اسکیم را با https:// کامل می‌کند تا کاربر لازم نباشد تایپش کند.
  function normalizeUrl(raw) {
    const v = (raw || '').trim();
    if (!v) return '';
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) return v;
    if (/^[\w-]+(\.[\w-]+)+/.test(v) || /^localhost(:\d+)?/i.test(v)) return 'https://' + v;
    return v;
  }

  function close() {
    dialog.classList.remove('open');
    activeConfig = null;
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (e) {}
    }
    lastFocused = null;
  }

  function open(config) {
    activeConfig = config || {};
    lastFocused = document.activeElement;
    titleEl.textContent = activeConfig.title || 'Shortcut';
    labelInput.value = activeConfig.label || '';
    urlInput.value = activeConfig.url || '';
    labelInput.placeholder = activeConfig.labelPlaceholder || 'Label';
    urlInput.placeholder = activeConfig.urlPlaceholder || 'https://example.com';
    deleteBtn.hidden = !activeConfig.allowDelete;
    dialog.classList.add('open');
    setTimeout(() => {
      try { labelInput.focus(); labelInput.select(); } catch (e) {}
    }, 10);
  }

  saveBtn.addEventListener('click', () => {
    if (!activeConfig) return;
    const label = labelInput.value.trim().slice(0, 24);
    const url = normalizeUrl(urlInput.value);
    if (!url) { urlInput.focus(); return; }
    const cfg = activeConfig;
    close();
    if (typeof cfg.onSave === 'function') cfg.onSave(label, url);
  });

  cancelBtn.addEventListener('click', () => close());

  deleteBtn.addEventListener('click', () => {
    if (!activeConfig) return;
    const cfg = activeConfig;
    close();
    if (typeof cfg.onDelete === 'function') cfg.onDelete();
  });

  // کلیک روی زمینهٔ تیره (بیرونِ کارت) هم دیالوگ را می‌بندد.
  dialog.addEventListener('mousedown', (e) => {
    if (e.target === dialog) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!dialog.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Enter' && (e.target === labelInput || e.target === urlInput)) {
      e.preventDefault();
      saveBtn.click();
    }
  });

  window.VoidShortcutModal = { open, close };
})();
