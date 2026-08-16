document.addEventListener('DOMContentLoaded', () => {
  const i18n = {
    en: {
      title: 'NOTEPAD', subtitle: 'Synced live with the AI Tree Launcher widget on your pages',
      clear: 'Clear', copy: 'Copy', save: 'Save as .txt', back: 'Back to widget',
      prompts: 'Prompts', send: 'Send',
      tokenEmpty: '0 chars · 0 tokens', tokenMeter: '{chars} chars · {tokens} tokens',
      toastCopied: 'Copied!', toastCleared: 'Cleared', toastDownloaded: 'Downloaded!',
      toastEmptyPrompt: 'Write something first', toastSaved: 'Saved', toastDeleted: 'Deleted',
      toastLimit: 'Custom prompt limit reached (12)', toastNeedFields: 'Title and text are required',
      dockOpenedFilled: 'Opened {name} with your prompt', dockCopiedOpen: 'Copied — paste it into {name}',
      tplNew: 'New prompt', tplEdit: 'Edit prompt', tplNamePh: 'Title', tplBodyPh: 'Prompt text…',
      tplAdd: 'Add prompt', tplEditMode: 'Edit prompts', tplDoneMode: 'Done editing',
      translate: 'Translate', translateTitle: 'Translate note (FA ↔ EN, auto-detect)',
      toastTranslated: 'Translated 🌐', toastTranslateFail: 'Translation failed',
      toastTranslateBusy: 'Translating…', toastTranslateLong: 'Text is too long (max ~4500 chars)',
      spellcheck: 'Spell check', spellcheckTitle: 'Clean & Spell Check (FA/EN)',
      toastSpellcheckBusy: 'Checking English grammar…',
      toastSpellcheckNone: 'No grammar errors found! ✨',
      toastSpellcheckFixed: '{n} English error(s) fixed! 🧹',
      toastSpellcheckNoSuggest: 'No suggestions found.',
      toastSpellcheckFail: 'Server error',
      toastSpellcheckLong: 'Text is too long for spell-check',
      toastSpellcheckFaFixed: 'Persian formatting fixed! 🧹',
      toastSpellcheckFaClean: 'Text is already tidy! ✨',
      speak: 'Speak', speakTitle: 'Read note aloud', speakStopTitle: 'Stop reading',
      toastSpeakUnsupported: 'Read-aloud is not supported in this browser',
      toastSpeakStopped: 'Stopped',
      emojiOnline: 'Online vault', emojiOnlineTitle: 'Online emoji vault',
      emojiOnlineSearch: 'Search… fire, heart, book',
      emojiOnlineLoading: 'Loading vault…', emojiOnlineEmpty: 'No emoji found',
      emojiOnlineError: 'Could not load online emojis'
    },
    fa: {
      title: 'دفترچه یادداشت', subtitle: 'به‌صورت زنده با ویجت AI Tree Launcher روی صفحات هماهنگ است',
      clear: 'پاک کردن', copy: 'کپی', save: 'ذخیره به‌صورت txt.', back: 'بازگشت به ویجت',
      prompts: 'پرامپت‌ها', send: 'ارسال',
      tokenEmpty: '۰ کاراکتر · ۰ توکن', tokenMeter: '{chars} کاراکتر · {tokens} توکن',
      toastCopied: 'کپی شد!', toastCleared: 'پاک شد', toastDownloaded: 'دانلود شد!',
      toastEmptyPrompt: 'اول چیزی بنویسید', toastSaved: 'ذخیره شد', toastDeleted: 'حذف شد',
      toastLimit: 'به سقف ۱۲ پرامپت سفارشی رسیدید', toastNeedFields: 'عنوان و متن هر دو لازم است',
      dockOpenedFilled: '{name} با پرامپت شما باز شد', dockCopiedOpen: 'کپی شد — در {name} پیست کنید',
      tplNew: 'پرامپت جدید', tplEdit: 'ویرایش پرامپت', tplNamePh: 'عنوان', tplBodyPh: 'متن پرامپت…',
      tplAdd: 'افزودن پرامپت', tplEditMode: 'ویرایش پرامپت‌ها', tplDoneMode: 'پایان ویرایش',
      translate: 'ترجمه', translateTitle: 'ترجمه یادداشت (خودکار فارسی ↔ انگلیسی)',
      toastTranslated: 'ترجمه شد 🌐', toastTranslateFail: 'ترجمه ناموفق بود',
      toastTranslateBusy: 'در حال ترجمه…', toastTranslateLong: 'متن خیلی بلند است (حداکثر حدود ۴۵۰۰ نویسه)',
      spellcheck: 'غلط‌یابی', spellcheckTitle: 'پاک‌سازی و غلط‌یابی (فارسی/انگلیسی)',
      toastSpellcheckBusy: 'در حال بررسی گرامر انگلیسی…',
      toastSpellcheckNone: 'غلط املایی یا گرامری یافت نشد! ✨',
      toastSpellcheckFixed: '{n} خطای انگلیسی اصلاح شد! 🧹',
      toastSpellcheckNoSuggest: 'پیشنهادی برای اصلاح یافت نشد.',
      toastSpellcheckFail: 'خطا در ارتباط با سرور',
      toastSpellcheckLong: 'متن برای غلط‌یابی خیلی بلند است',
      toastSpellcheckFaFixed: 'نیم‌فاصله‌ها و علائم اصلاح شدند! 🧹',
      toastSpellcheckFaClean: 'متن شما از قبل مرتب است! ✨',
      speak: 'خواندن', speakTitle: 'خواندن یادداشت با صدا', speakStopTitle: 'توقف خواندن',
      toastSpeakUnsupported: 'خواندن با صدا در این مرورگر پشتیبانی نمی‌شود',
      toastSpeakStopped: 'متوقف شد',
      emojiOnline: 'گنجینه آنلاین', emojiOnlineTitle: 'گنجینه آنلاین ایموجی',
      emojiOnlineSearch: 'جستجو… آتش، قلب، کتاب',
      emojiOnlineLoading: 'در حال بارگذاری…', emojiOnlineEmpty: 'ایموجی یافت نشد',
      emojiOnlineError: 'بارگذاری آنلاین ناموفق بود'
    }
  };
  let lang = 'en';
  function t(key) { return (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key; }

  const els = {
    title: document.getElementById('title'),
    subtitle: document.getElementById('subtitle'),
    textarea: document.getElementById('note-text'),
    tokenMeter: document.getElementById('token-meter'),
    alignLeft: document.getElementById('align-left'),
    alignCenter: document.getElementById('align-center'),
    alignRight: document.getElementById('align-right'),
    fontDec: document.getElementById('font-dec'),
    fontInc: document.getElementById('font-inc'),
    fontLabel: document.getElementById('font-label'),
    clearBtn: document.getElementById('clear-btn'),
    copyBtn: document.getElementById('copy-btn'),
    saveBtn: document.getElementById('save-btn'),
    toast: document.getElementById('toast'),
    backBtn: document.getElementById('back-btn'),
    backLabel: document.getElementById('back-label'),
    promptsToggleBtn: document.getElementById('prompts-toggle-btn'),
    promptsToggleLabel: document.getElementById('prompts-toggle-label'),
    promptsBar: document.getElementById('prompts-bar'),
    emojiToggleBtn: document.getElementById('emoji-toggle-btn'),
    emojiPopover: document.getElementById('emoji-popover'),
    aiSelect: document.getElementById('ai-select'),
    sendBtn: document.getElementById('send-btn'),
    sendLabel: document.getElementById('send-label'),
    translateBtn: document.getElementById('translate-btn'),
    spellcheckBtn: document.getElementById('spellcheck-btn'),
    speakBtn: document.getElementById('speak-btn'),
    emojiOnlineBtn: document.getElementById('emoji-online-btn'),
    emojiOnlineModal: document.getElementById('emoji-online-modal'),
    emojiOnlineTitle: document.getElementById('emoji-online-title'),
    emojiOnlineClose: document.getElementById('emoji-online-close'),
    emojiOnlineSearch: document.getElementById('emoji-online-search'),
    emojiOnlineGrid: document.getElementById('emoji-online-grid'),
    tplModal: document.getElementById('tpl-modal'),
    tplModalTitle: document.getElementById('tpl-modal-title'),
    tplModalName: document.getElementById('tpl-modal-name'),
    tplModalBody: document.getElementById('tpl-modal-body'),
    tplModalDelete: document.getElementById('tpl-modal-delete'),
    tplModalCancel: document.getElementById('tpl-modal-cancel'),
    tplModalSave: document.getElementById('tpl-modal-save')
  };

  function applyTranslation() {
    document.body.className = lang === 'fa' ? 'rtl' : '';
    els.title.textContent = t('title');
    els.subtitle.textContent = t('subtitle');
    els.clearBtn.textContent = t('clear');
    els.copyBtn.textContent = t('copy');
    els.saveBtn.textContent = t('save');
    els.backLabel.textContent = t('back');
    els.promptsToggleLabel.textContent = t('prompts');
    els.sendLabel.textContent = t('send');
    if (els.translateBtn) {
      els.translateBtn.title = t('translateTitle');
      els.translateBtn.setAttribute('aria-label', t('translateTitle'));
    }
    if (els.spellcheckBtn) {
      els.spellcheckBtn.title = t('spellcheckTitle');
      els.spellcheckBtn.setAttribute('aria-label', t('spellcheckTitle'));
    }
    if (els.speakBtn) {
      els.speakBtn.title = t('speakTitle');
      els.speakBtn.setAttribute('aria-label', t('speakTitle'));
    }
    if (els.emojiOnlineBtn) {
      els.emojiOnlineBtn.title = t('emojiOnline');
      els.emojiOnlineBtn.setAttribute('aria-label', t('emojiOnline'));
    }
    if (els.emojiOnlineTitle) els.emojiOnlineTitle.textContent = t('emojiOnlineTitle');
    if (els.emojiOnlineSearch) els.emojiOnlineSearch.placeholder = t('emojiOnlineSearch');
    updateTokenMeter();
    renderPrompts();
  }

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    setTimeout(() => els.toast.classList.remove('show'), 2200);
  }

  function estimateTokens(text) {
    if (!text) return 0;
    const chars = text.length;
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words * 1.35 + chars * 0.08));
  }

  function updateTokenMeter() {
    const text = els.textarea.value;
    if (!text.trim()) { els.tokenMeter.textContent = t('tokenEmpty'); return; }
    els.tokenMeter.textContent = t('tokenMeter')
      .replace('{chars}', String(text.length))
      .replace('{tokens}', String(estimateTokens(text)));
  }

  // ============================= Alignment / Font size =============================
  function setAlign(align, persist) {
    els.textarea.style.textAlign = align;
    [els.alignLeft, els.alignCenter, els.alignRight].forEach(b => b.classList.remove('active'));
    const btn = align === 'right' ? els.alignRight : align === 'center' ? els.alignCenter : els.alignLeft;
    if (btn) btn.classList.add('active');
    if (persist !== false) {
      try { chrome.storage.local.set({ noteTextAlign: align }); } catch (e) {}
    }
  }
  els.alignLeft.addEventListener('click', () => setAlign('left'));
  els.alignCenter.addEventListener('click', () => setAlign('center'));
  els.alignRight.addEventListener('click', () => setAlign('right'));

  const FONT_MIN = 11, FONT_MAX = 24, FONT_DEFAULT = 14;
  let fontSize = FONT_DEFAULT;
  function applyFontSize(size, persist) {
    fontSize = Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(size)));
    els.textarea.style.fontSize = fontSize + 'px';
    els.fontLabel.textContent = String(fontSize);
    els.fontDec.disabled = fontSize <= FONT_MIN;
    els.fontInc.disabled = fontSize >= FONT_MAX;
    if (persist !== false) {
      try { chrome.storage.local.set({ noteFontSize: fontSize }); } catch (e) {}
    }
  }
  els.fontInc.addEventListener('click', () => applyFontSize(fontSize + 1));
  els.fontDec.addEventListener('click', () => applyFontSize(fontSize - 1));

  // ============================= Draft text sync =============================
  let draftSaveTimer = null;
  function saveDraftDebounced() {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = setTimeout(() => {
      try { chrome.storage.local.set({ savedPromptDraft: els.textarea.value }); } catch (e) {}
    }, 400);
  }
  els.textarea.addEventListener('input', () => {
    updateTokenMeter();
    saveDraftDebounced();
    harvestTypedEmoji();
  });

  els.clearBtn.addEventListener('click', () => {
    if (!els.textarea.value.trim()) return;
    els.textarea.value = '';
    updateTokenMeter();
    try { chrome.storage.local.set({ savedPromptDraft: '' }); } catch (e) {}
    showToast(t('toastCleared'));
  });

  els.copyBtn.addEventListener('click', () => {
    const text = els.textarea.value;
    if (!text.trim()) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(t('toastCopied'))).catch(() => {});
    }
  });

  els.saveBtn.addEventListener('click', () => {
    const text = els.textarea.value;
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_Note_' + Date.now() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('toastDownloaded'));
  });

  // ============================= Prompts (built-in + custom) =============================
  const BUILTIN_PROMPTS = [
    { id: 'builtin-refactor', title: 'Code Review', text: 'Act as a Principal Software Architect. Review the following code for efficiency, security, and edge-case resilience:\n\n', builtIn: true },
    { id: 'builtin-summary', title: 'Summarize', text: 'Analyze the text below and provide a structured comparative table and bullet-point executive summary:\n\n', builtIn: true },
    { id: 'builtin-critic', title: 'Critique', text: 'Critique the following thesis from first principles. Identify logical fallacies and hidden assumptions:\n\n', builtIn: true },
    { id: 'builtin-translate', title: 'Translate', text: 'Translate the following text into clear, natural English while preserving technical meaning:\n\n', builtIn: true },
    { id: 'builtin-song', title: 'Songwriter', text: 'Turn the following text into a beautiful song.\nThe song must not be a mere rewrite of the text; it should transform its feeling, meaning, and imagery into a musical work.\nUse rhyme and flowing words, and write the lyrics so a listener can easily remember them.\n\nText:\n', builtIn: true },
    { id: 'builtin-logo', title: 'Logo Maker', text: 'Act as an elite brand designer. Create a logo for [brand name] that captures [core value] and speaks directly to [audience]. Make it sophisticated, timeless, and instantly recognizable.\n\n', builtIn: true }
  ];
  const CUSTOM_PROMPT_MAX = 12;
  const CUSTOM_PROMPT_KEY = 'aiTreeCustomPrompts';
  const PROMPT_OVERRIDE_KEY = 'aiTreePromptOverrides';
  const PROMPT_HIDDEN_KEY = 'aiTreePromptHidden';
  let customPrompts = [];
  let promptOverrides = {};
  let promptHiddenIds = [];
  let tplEditMode = false;
  let tplEditingId = null;
  let tplEditingBuiltIn = false;

  function allPrompts() {
    const hidden = new Set(promptHiddenIds || []);
    const builtins = BUILTIN_PROMPTS.filter(p => !hidden.has(p.id)).map(p => {
      const ov = promptOverrides && promptOverrides[p.id];
      if (ov && (ov.title || ov.text)) {
        return { ...p, title: (ov.title != null ? String(ov.title) : p.title).slice(0, 40), text: ov.text != null ? String(ov.text) : p.text, overridden: true };
      }
      return { ...p, overridden: false };
    });
    return builtins.concat(customPrompts.map(p => ({ ...p, builtIn: false, overridden: false })));
  }

  function insertTemplate(text) {
    const start = els.textarea.selectionStart || 0;
    const end = els.textarea.selectionEnd || 0;
    const cur = els.textarea.value;
    els.textarea.value = cur.slice(0, start) + text + cur.slice(end);
    const pos = start + text.length;
    els.textarea.setSelectionRange(pos, pos);
    els.textarea.focus();
    updateTokenMeter();
    saveDraftDebounced();
  }

  function saveCustomPrompts() { try { chrome.storage.local.set({ [CUSTOM_PROMPT_KEY]: customPrompts }); } catch (e) {} }
  function savePromptOverrides() { try { chrome.storage.local.set({ [PROMPT_OVERRIDE_KEY]: promptOverrides }); } catch (e) {} }
  function savePromptHidden() { try { chrome.storage.local.set({ [PROMPT_HIDDEN_KEY]: promptHiddenIds }); } catch (e) {} }

  function renderPrompts() {
    els.promptsBar.innerHTML = '';
    allPrompts().forEach((tpl) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tpl-chip' + (tpl.builtIn ? '' : ' is-custom') + (tpl.overridden ? ' is-overridden' : '') + (tplEditMode ? ' is-editable' : '');
      chip.dir = 'auto';
      chip.textContent = tpl.title;
      chip.title = tpl.title;
      chip.addEventListener('click', () => {
        if (tplEditMode) { openTplModal(tpl); return; }
        insertTemplate(tpl.text);
      });
      els.promptsBar.appendChild(chip);
    });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'tpl-action';
    addBtn.textContent = '+';
    addBtn.title = t('tplAdd');
    addBtn.addEventListener('click', () => {
      if (customPrompts.length >= CUSTOM_PROMPT_MAX) { showToast(t('toastLimit')); return; }
      openTplModal(null);
    });
    els.promptsBar.appendChild(addBtn);
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'tpl-action' + (tplEditMode ? ' is-active' : '');
    editBtn.textContent = tplEditMode ? '✓' : '✎';
    editBtn.title = tplEditMode ? t('tplDoneMode') : t('tplEditMode');
    editBtn.addEventListener('click', () => { tplEditMode = !tplEditMode; renderPrompts(); });
    els.promptsBar.appendChild(editBtn);
  }

  function openTplModal(promptOrNull) {
    tplEditingId = promptOrNull ? promptOrNull.id : null;
    tplEditingBuiltIn = !!(promptOrNull && promptOrNull.builtIn);
    els.tplModalTitle.textContent = promptOrNull ? t('tplEdit') : t('tplNew');
    els.tplModalName.placeholder = t('tplNamePh');
    els.tplModalBody.placeholder = t('tplBodyPh');
    els.tplModalName.value = promptOrNull ? (promptOrNull.title || '') : '';
    els.tplModalBody.value = promptOrNull ? (promptOrNull.text || '') : '';
    els.tplModalDelete.style.display = promptOrNull ? '' : 'none';
    els.tplModal.classList.add('open');
    els.tplModalName.focus();
  }
  function closeTplModal() { els.tplModal.classList.remove('open'); tplEditingId = null; tplEditingBuiltIn = false; }
  els.tplModalCancel.addEventListener('click', closeTplModal);
  els.tplModal.addEventListener('click', (e) => { if (e.target === els.tplModal) closeTplModal(); });
  els.tplModalSave.addEventListener('click', () => {
    const title = (els.tplModalName.value || '').trim().slice(0, 40);
    const body = (els.tplModalBody.value || '').trim();
    if (!title || !body) { showToast(t('toastNeedFields')); return; }
    if (tplEditingId && tplEditingBuiltIn) {
      promptOverrides[tplEditingId] = { title, text: body };
      savePromptOverrides();
    } else if (tplEditingId) {
      const idx = customPrompts.findIndex(p => p.id === tplEditingId);
      if (idx >= 0) customPrompts[idx] = { ...customPrompts[idx], title, text: body };
      else customPrompts.push({ id: tplEditingId, title, text: body });
      saveCustomPrompts();
    } else {
      if (customPrompts.length >= CUSTOM_PROMPT_MAX) { showToast(t('toastLimit')); return; }
      customPrompts.push({ id: 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title, text: body });
      saveCustomPrompts();
    }
    closeTplModal();
    renderPrompts();
    showToast(t('toastSaved'));
  });
  els.tplModalDelete.addEventListener('click', () => {
    if (!tplEditingId) return;
    if (tplEditingBuiltIn) {
      if (!promptHiddenIds.includes(tplEditingId)) { promptHiddenIds.push(tplEditingId); savePromptHidden(); }
      if (promptOverrides[tplEditingId]) { delete promptOverrides[tplEditingId]; savePromptOverrides(); }
    } else {
      customPrompts = customPrompts.filter(p => p.id !== tplEditingId);
      saveCustomPrompts();
    }
    closeTplModal();
    renderPrompts();
    showToast(t('toastDeleted'));
  });

  els.promptsToggleBtn.addEventListener('click', () => {
    els.promptsBar.classList.toggle('open');
    els.promptsToggleBtn.classList.toggle('active', els.promptsBar.classList.contains('open'));
  });

  // ============================= Emoji =============================
  const DEFAULT_FAVORITE_EMOJIS = ['✨', '📌', '🔥', '💡', '🌱', '🎯', '🚀', '⭐'];
  const EMOJI_PICKER_GRID = [
    '😀','😊','🥰','😎','🤔','😂','🙌','👏',
    '✨','🔥','💡','📌','✅','❌','⚠️','💬',
    '🌱','🎯','🚀','⭐','❤️','💙','💜','🖤',
    '📝','📚','🧠','⚡','🛠️','🎨','🎵','☕'
  ];
  let favoriteEmojis = DEFAULT_FAVORITE_EMOJIS.slice();
  const EMOJI_CHAR_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  let lastValueForEmoji = '';

  function saveEmojiMemory() { try { chrome.storage.local.set({ aiTreeEmojiMemory: favoriteEmojis }); } catch (e) {} }
  function pushEmojiToMemory(emoji) {
    if (!emoji) return;
    favoriteEmojis = [emoji, ...favoriteEmojis.filter(e => e !== emoji)].slice(0, 10);
    saveEmojiMemory();
  }
  function insertEmojiAtCursor(emoji) {
    const start = els.textarea.selectionStart || 0;
    const end = els.textarea.selectionEnd || 0;
    const val = els.textarea.value;
    els.textarea.value = val.slice(0, start) + emoji + val.slice(end);
    const pos = start + [...emoji].length;
    els.textarea.setSelectionRange(pos, pos);
    els.textarea.focus();
    updateTokenMeter();
    saveDraftDebounced();
    pushEmojiToMemory(emoji);
    renderEmojiPopover();
  }
  function harvestTypedEmoji() {
    const next = els.textarea.value;
    if (next.length > lastValueForEmoji.length) {
      const added = next.slice(lastValueForEmoji.length);
      const m = added.match(EMOJI_CHAR_RE);
      if (m) pushEmojiToMemory(m[0]);
    }
    lastValueForEmoji = next;
  }
  function renderEmojiPopover() {
    els.emojiPopover.innerHTML = '';
    if (!favoriteEmojis.length) favoriteEmojis = DEFAULT_FAVORITE_EMOJIS.slice();
    function addGrid(title, list) {
      if (!list.length) return;
      const h = document.createElement('div');
      h.className = 'emoji-popover-title';
      h.textContent = title;
      els.emojiPopover.appendChild(h);
      const grid = document.createElement('div');
      grid.className = 'emoji-grid';
      list.forEach((emoji) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'emoji-item';
        btn.textContent = emoji;
        btn.addEventListener('click', () => insertEmojiAtCursor(emoji));
        grid.appendChild(btn);
      });
      els.emojiPopover.appendChild(grid);
    }
    addGrid(lang === 'fa' ? 'ایموجی‌های موردعلاقه' : 'Favorite emojis', favoriteEmojis.slice());
    const seen = new Set(favoriteEmojis);
    addGrid(lang === 'fa' ? 'ایموجی‌های بیشتر' : 'More emojis', EMOJI_PICKER_GRID.filter(e => !seen.has(e)));
  }
  els.emojiToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = els.emojiPopover.classList.toggle('open');
    if (open) renderEmojiPopover();
  });
  document.addEventListener('click', (e) => {
    if (els.emojiPopover.classList.contains('open') && !e.target.closest('.emoji-btn')) {
      els.emojiPopover.classList.remove('open');
    }
  });

  // ============================= Translate (background SW) =============================
  let translateBusy = false;
  function detectTranslateTarget(text) {
    const fa = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const la = (text.match(/[A-Za-z]/g) || []).length;
    if (fa > la) return 'en';
    if (la > 0) return 'fa';
    return lang === 'fa' ? 'en' : 'fa';
  }
  function requestTranslation(text, targetLang) {
    return new Promise((resolve, reject) => {
      try {
        if (!chrome.runtime || !chrome.runtime.id) {
          reject(new Error('no_extension_runtime'));
          return;
        }
        chrome.runtime.sendMessage(
          { action: 'translateText', text: text, targetLang: targetLang },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message || 'no_receiver'));
              return;
            }
            if (response && response.success && typeof response.text === 'string') resolve(response.text);
            else reject(new Error((response && response.error) || 'translate_failed'));
          }
        );
      } catch (err) { reject(err); }
    });
  }
  async function runTranslate() {
    if (translateBusy) return;
    const textVal = (els.textarea.value || '').trim();
    if (!textVal) { showToast(t('toastEmptyPrompt')); return; }
    if (textVal.length > 4500) { showToast(t('toastTranslateLong')); return; }
    const targetLang = detectTranslateTarget(textVal);
    translateBusy = true;
    if (els.translateBtn) {
      els.translateBtn.classList.add('is-busy');
      els.translateBtn.disabled = true;
    }
    showToast(t('toastTranslateBusy'));
    try {
      const translated = await requestTranslation(textVal, targetLang);
      els.textarea.value = translated;
      try {
        const end = els.textarea.value.length;
        els.textarea.setSelectionRange(end, end);
        els.textarea.focus();
      } catch (e) {}
      updateTokenMeter();
      saveDraftDebounced();
      showToast(t('toastTranslated'));
    } catch (err) {
      console.warn('[notepad] translate failed:', err);
      showToast(t('toastTranslateFail'));
    } finally {
      translateBusy = false;
      if (els.translateBtn) {
        els.translateBtn.classList.remove('is-busy');
        els.translateBtn.disabled = false;
      }
    }
  }
  if (els.translateBtn) {
    els.translateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      runTranslate();
    });
  }

  // ============================= خواندن با صدا (Web Speech API — رایگان و آفلاین) =============================
  function detectSpeechLang(text) {
    const fa = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const la = (text.match(/[A-Za-z]/g) || []).length;
    return fa > la ? 'fa-IR' : 'en-US';
  }
  function stopSpeaking() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (els.speakBtn) { els.speakBtn.classList.remove('is-speaking'); els.speakBtn.title = t('speakTitle'); }
  }
  function runSpeak() {
    if (!('speechSynthesis' in window)) { showToast(t('toastSpeakUnsupported')); return; }
    // اگر همین الان در حال خواندن است، دکمه به‌عنوان توقف عمل کند
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      stopSpeaking();
      showToast(t('toastSpeakStopped'));
      return;
    }
    const textVal = (els.textarea.value || '').trim();
    if (!textVal) { showToast(t('toastEmptyPrompt')); return; }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textVal);
    utterance.lang = detectSpeechLang(textVal);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang === utterance.lang)
      || voices.find(v => v.lang && v.lang.startsWith(utterance.lang.slice(0, 2)))
      || voices.find(v => v.name.includes('Google US English'));
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onend = () => stopSpeaking();
    utterance.onerror = () => stopSpeaking();

    if (els.speakBtn) { els.speakBtn.classList.add('is-speaking'); els.speakBtn.title = t('speakStopTitle'); }
    window.speechSynthesis.speak(utterance);
  }
  if (els.speakBtn) {
    els.speakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      runSpeak();
    });
  }

  // ============================= Hybrid spell-check (FA offline / EN online) =============================
  let spellcheckBusy = false;

  function normalizePersianText(raw) {
    if (!raw) return raw;
    let fixed = raw;
    const zwnj = '\u200C';
    fixed = fixed.replace(/\u064A/g, '\u06CC').replace(/\u0643/g, '\u06A9');
    fixed = fixed.replace(/\b(ن?می)\s+(?=[\u0600-\u06FF])/g, '$1' + zwnj);
    fixed = fixed.replace(
      /(?<=[\u0600-\u06FF])\s+(ها|های|هایی|تر|ترین|ام|ات|اش|مان|تان|شان|ای|ایم|اید|اند)\b/g,
      zwnj + '$1'
    );
    fixed = fixed.replace(/\s+([،؛:?.!])/g, '$1');
    fixed = fixed.replace(/([،؛:?.!])(?=[\u0600-\u06FFa-zA-Z])/g, '$1 ');
    fixed = fixed.replace(/[^\S\n]{2,}/g, ' ');
    return fixed.trim();
  }

  function requestSpellcheck(text, lang) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(
          { action: 'checkSpelling', text: text, lang: lang },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message || 'no_receiver'));
              return;
            }
            if (response && response.success && Array.isArray(response.matches)) resolve(response.matches);
            else reject(new Error((response && response.error) || 'spellcheck_failed'));
          }
        );
      } catch (err) { reject(err); }
    });
  }

  function applySpellcheckCorrections(originalText, matches) {
    if (!matches || !matches.length) return { text: originalText, count: 0 };
    const sorted = matches.slice().sort((a, b) => (b.offset || 0) - (a.offset || 0));
    let corrected = originalText;
    let count = 0;
    sorted.forEach((match) => {
      if (!match || !match.replacements || !match.replacements.length) return;
      const best = match.replacements[0] && match.replacements[0].value;
      if (best == null) return;
      const start = match.offset | 0;
      const length = match.length | 0;
      if (start < 0 || length <= 0 || start + length > corrected.length) return;
      corrected = corrected.slice(0, start) + best + corrected.slice(start + length);
      count++;
    });
    return { text: corrected, count };
  }

  async function runSpellcheck() {
    if (spellcheckBusy) return;
    const textVal = els.textarea.value || '';
    if (!textVal.trim()) { showToast(t('toastEmptyPrompt')); return; }

    const isPersian = /[\u0600-\u06FF]/.test(textVal);

    // Offline Persian normalizer
    if (isPersian) {
      const cleaned = normalizePersianText(textVal);
      if (cleaned === textVal) {
        showToast(t('toastSpellcheckFaClean'));
        return;
      }
      els.textarea.value = cleaned;
      try {
        const end = els.textarea.value.length;
        els.textarea.setSelectionRange(end, end);
        els.textarea.focus();
      } catch (e) {}
      updateTokenMeter();
      saveDraftDebounced();
      showToast(t('toastSpellcheckFaFixed'));
      return;
    }

    // Online English via LanguageTool
    if (textVal.length > 20000) { showToast(t('toastSpellcheckLong')); return; }
    spellcheckBusy = true;
    if (els.spellcheckBtn) {
      els.spellcheckBtn.classList.add('is-busy');
      els.spellcheckBtn.disabled = true;
    }
    showToast(t('toastSpellcheckBusy'));
    try {
      const matches = await requestSpellcheck(textVal, 'en-US');
      if (!matches.length) { showToast(t('toastSpellcheckNone')); return; }
      const { text: corrected, count } = applySpellcheckCorrections(textVal, matches);
      if (count <= 0) { showToast(t('toastSpellcheckNoSuggest')); return; }
      els.textarea.value = corrected;
      try {
        const end = els.textarea.value.length;
        els.textarea.setSelectionRange(end, end);
        els.textarea.focus();
      } catch (e) {}
      updateTokenMeter();
      saveDraftDebounced();
      showToast(t('toastSpellcheckFixed').replace('{n}', String(count)));
    } catch (err) {
      console.warn('[notepad] spellcheck failed:', err);
      showToast(t('toastSpellcheckFail'));
    } finally {
      spellcheckBusy = false;
      if (els.spellcheckBtn) {
        els.spellcheckBtn.classList.remove('is-busy');
        els.spellcheckBtn.disabled = false;
      }
    }
  }
  if (els.spellcheckBtn) {
    els.spellcheckBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      runSpellcheck();
    });
  }

  // ============================= Online emoji vault =============================
  const EMOJI_CDN_URLS = [
    'https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/15/native.json',
    'https://unpkg.com/@emoji-mart/data@latest/sets/15/native.json',
    'https://cdn.jsdelivr.net/npm/unicode-emoji-json@latest/data-by-group.json',
    'https://unpkg.com/unicode-emoji-json@latest/data-by-group.json'
  ];
  const EMOJI_CACHE_KEY = 'aiTreeOnlineEmojiCache_v5';
  const EMOJI_CACHE_MAX = 5000;
  const EMOJI_FA_HINTS = {
    'آتش': 'fire', 'شعله': 'fire', 'قلب': 'heart', 'عشق': 'heart', 'دوست': 'love',
    'خنده': 'grin', 'لبخند': 'smile', 'گریه': 'cry', 'اشک': 'tear', 'ناراحت': 'sad',
    'کتاب': 'book', 'ستاره': 'star', 'ماه': 'moon', 'خورشید': 'sun', 'گل': 'flower',
    'درخت': 'tree', 'ماشین': 'car', 'هواپیما': 'airplane', 'موشک': 'rocket',
    'کامپیوتر': 'computer', 'کد': 'laptop', 'تلفن': 'phone', 'موسیقی': 'music', 'آهنگ': 'song',
    'غذا': 'food', 'قهوه': 'coffee', 'چای': 'tea', 'کیک': 'cake', 'سیب': 'apple',
    'ورزش': 'sport', 'فوتبال': 'soccer', 'برنده': 'trophy', 'هدیه': 'gift', 'کادو': 'present',
    'تیک': 'check', 'خطا': 'cross', 'هشدار': 'warning', 'ایده': 'bulb', 'فکر': 'think',
    'پین': 'pushpin', 'یادداشت': 'memo', 'چشم': 'eye', 'دست': 'hand', 'انگشت': 'finger',
    'حیوان': 'animal', 'سگ': 'dog', 'گربه': 'cat', 'پرنده': 'bird', 'پول': 'money',
    'زمان': 'time', 'ساعت': 'clock', 'خانه': 'house', 'خواب': 'sleep', 'بیمار': 'sick',
    'سلام': 'wave', 'تشویق': 'clap', 'آفرین': 'thumbs up', 'جشن': 'party tada',
    'تولد': 'birthday cake', 'ایران': 'flag'
  };

  let cachedOnlineEmojis = null;
  let onlineEmojiPromise = null;

  // Infinite scroll state
  let currentEmojiResults = [];
  let currentEmojiRenderIndex = 0;
  const EMOJI_CHUNK_SIZE = 100;
  let emojiIntersectionObserver = null;

  function normalizeEmojiQuery(raw) {
    let q = String(raw || '').trim().toLowerCase();
    if (!q) return '';
    Object.keys(EMOJI_FA_HINTS).forEach((fa) => {
      if (q.includes(fa)) q += ' ' + EMOJI_FA_HINTS[fa];
    });
    return q.replace(/\s+/g, ' ').trim();
  }

  function fuzzyTokenScore(hay, token) {
    if (!token) return 1;
    if (!hay) return 0;
    if (hay === token) return 100;
    if (hay.startsWith(token)) return 90;
    const idx = hay.indexOf(token);
    if (idx >= 0) return 70 - Math.min(idx, 40);
    let hi = 0;
    for (let ti = 0; ti < token.length; ti++) {
      const ch = token.charCodeAt(ti);
      let found = false;
      while (hi < hay.length) {
        if (hay.charCodeAt(hi++) === ch) { found = true; break; }
      }
      if (!found) return 0;
    }
    return 35;
  }

  function scoreEmojiItem(item, parts) {
    if (!parts.length) return 1;
    const primary = (item.p || '').toLowerCase();
    const hay = (item.n || '').toLowerCase();
    let total = 0;
    for (let i = 0; i < parts.length; i++) {
      const tok = parts[i];
      const best = Math.max(
        fuzzyTokenScore(primary, tok) * 1.6,
        fuzzyTokenScore(hay, tok),
        (item.e && item.e.includes(tok)) ? 50 : 0
      );
      if (best <= 0) return 0;
      total += best;
    }
    return total;
  }

  function flattenEmojiCdnData(data) {
    const out = [];
    const seen = new Set();
    const pushItem = (emoji, primaryName, extraTags) => {
      if (!emoji || seen.has(emoji)) return;
      seen.add(emoji);
      const primary = String(primaryName || '').trim();
      const tags = Array.isArray(extraTags) ? extraTags.filter(Boolean).join(' ') : String(extraTags || '');
      const blob = (primary + ' ' + tags).toLowerCase().replace(/\s+/g, ' ').trim();
      out.push({ e: emoji, n: blob, p: primary.toLowerCase() });
    };
    if (data && data.emojis && typeof data.emojis === 'object' && !Array.isArray(data.emojis)) {
      Object.keys(data.emojis).forEach((id) => {
        const entry = data.emojis[id];
        if (!entry || typeof entry !== 'object') return;
        const native = (entry.skins && entry.skins[0] && (entry.skins[0].native || entry.skins[0].emoji))
          || entry.native || entry.emoji || entry.char;
        const keywords = [].concat(entry.keywords || [], entry.emoticons || [], id, entry.name || []);
        pushItem(native, entry.name || id, keywords);
      });
      return out.slice(0, EMOJI_CACHE_MAX);
    }
    const walkGroup = (group) => {
      if (!group) return;
      const list = group.emojis || group.emoji || (Array.isArray(group) ? group : null);
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        if (typeof item === 'string') pushItem(item, '', '');
        else if (item && typeof item === 'object') {
          pushItem(item.emoji || item.char || item.e || item.native, item.name || item.slug || item.n || '', [].concat(item.slug || [], item.group || []));
        }
      });
    };
    if (Array.isArray(data)) data.forEach(walkGroup);
    else if (data && typeof data === 'object') {
      Object.keys(data).forEach((k) => {
        const v = data[k];
        if (v && typeof v === 'object' && (v.emoji || v.char || v.native) && !v.emojis) {
          pushItem(v.emoji || v.char || v.native, v.description || v.name || k, [].concat(v.aliases || [], v.tags || [], k));
        } else walkGroup(v);
      });
    }
    return out.slice(0, EMOJI_CACHE_MAX);
  }

  function loadOnlineEmojisFromStorage() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get([EMOJI_CACHE_KEY], (res) => {
          const pack = res && res[EMOJI_CACHE_KEY];
          if (pack && Array.isArray(pack.items) && pack.items.length > 50) resolve(pack.items);
          else resolve(null);
        });
      } catch (e) { resolve(null); }
    });
  }

  function saveOnlineEmojisToStorage(items) {
    try {
      chrome.storage.local.set({ [EMOJI_CACHE_KEY]: { ts: Date.now(), items: items.slice(0, EMOJI_CACHE_MAX) } });
    } catch (e) {}
  }

  async function fetchOnlineEmojis() {
    if (cachedOnlineEmojis && cachedOnlineEmojis.length) return cachedOnlineEmojis;
    if (onlineEmojiPromise) return onlineEmojiPromise;
    onlineEmojiPromise = (async () => {
      const fromStore = await loadOnlineEmojisFromStorage();
      if (fromStore && fromStore.length) {
        cachedOnlineEmojis = fromStore.map((it) => ({ e: it.e, n: it.n || '', p: it.p || (it.n ? String(it.n).split(' ')[0] : '') }));
        return cachedOnlineEmojis;
      }
      let lastErr = null;
      for (let i = 0; i < EMOJI_CDN_URLS.length; i++) {
        try {
          const res = await fetch(EMOJI_CDN_URLS[i], { credentials: 'omit', cache: 'force-cache' });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const data = await res.json();
          const flat = flattenEmojiCdnData(data);
          if (flat.length < 20) throw new Error('empty catalog');
          cachedOnlineEmojis = flat;
          saveOnlineEmojisToStorage(flat);
          return cachedOnlineEmojis;
        } catch (err) { lastErr = err; }
      }
      console.warn('[notepad] online emoji fetch failed:', lastErr);
      cachedOnlineEmojis = EMOJI_PICKER_GRID.map((e) => ({ e, n: '', p: '' }));
      return cachedOnlineEmojis;
    })();
    try { return await onlineEmojiPromise; }
    finally {
      if (!cachedOnlineEmojis || !cachedOnlineEmojis.length) onlineEmojiPromise = null;
    }
  }

  function searchOnlineEmojis(queryRaw, limit) {
    const source = cachedOnlineEmojis || [];
    const q = normalizeEmojiQuery(queryRaw);
    if (!q) {
      const cap = (limit == null) ? source.length : Math.min(limit, source.length);
      return source.slice(0, cap);
    }
    const parts = q.split(/\s+/).filter(Boolean);
    const scored = [];
    for (let i = 0; i < source.length; i++) {
      const s = scoreEmojiItem(source[i], parts);
      if (s > 0) scored.push({ s, item: source[i] });
    }
    scored.sort((a, b) => b.s - a.s);
    const cap = (limit == null) ? scored.length : Math.min(limit, scored.length);
    return scored.slice(0, cap).map((x) => x.item);
  }

  function renderOnlineEmojiGrid(queryRaw) {
    if (!els.emojiOnlineGrid) return;
    const grid = els.emojiOnlineGrid;

    if (emojiIntersectionObserver) {
      try { emojiIntersectionObserver.disconnect(); } catch (e) {}
      emojiIntersectionObserver = null;
    }

    // Full ranked list; infinite scroll renders in chunks
    currentEmojiResults = searchOnlineEmojis(queryRaw, null);
    currentEmojiRenderIndex = 0;
    grid.innerHTML = '';

    if (!currentEmojiResults.length) {
      const empty = document.createElement('div');
      empty.className = 'emoji-online-status';
      empty.textContent = t('emojiOnlineEmpty');
      grid.appendChild(empty);
      return;
    }

    renderNextEmojiChunk(grid);
  }

  function renderNextEmojiChunk(grid) {
    if (!grid) return;
    const frag = document.createDocumentFragment();
    const endIndex = Math.min(currentEmojiRenderIndex + EMOJI_CHUNK_SIZE, currentEmojiResults.length);

    for (let i = currentEmojiRenderIndex; i < endIndex; i++) {
      const item = currentEmojiResults[i];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'emoji-online-cell';
      btn.textContent = item.e;
      btn.title = item.p || item.n || item.e;
      btn.addEventListener('click', () => {
        insertEmojiAtCursor(item.e);
        closeOnlineEmojiModal();
      });
      frag.appendChild(btn);
    }

    currentEmojiRenderIndex = endIndex;

    const oldSentinel = grid.querySelector('.ai-emoji-sentinel');
    if (oldSentinel) oldSentinel.remove();

    grid.appendChild(frag);

    if (currentEmojiRenderIndex < currentEmojiResults.length) {
      const sentinel = document.createElement('div');
      sentinel.className = 'ai-emoji-sentinel';
      sentinel.style.gridColumn = '1 / -1';
      sentinel.style.height = '12px';
      grid.appendChild(sentinel);

      emojiIntersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          try { emojiIntersectionObserver.disconnect(); } catch (e) {}
          emojiIntersectionObserver = null;
          renderNextEmojiChunk(grid);
        }
      }, { root: grid, rootMargin: '120px' });

      emojiIntersectionObserver.observe(sentinel);
    }
  }

  function closeOnlineEmojiModal() {
    if (els.emojiOnlineModal) els.emojiOnlineModal.classList.remove('open');
  }

  async function openOnlineEmojiModal() {
    if (!els.emojiOnlineModal) return;
    els.emojiPopover.classList.remove('open');
    if (els.emojiOnlineTitle) els.emojiOnlineTitle.textContent = t('emojiOnlineTitle');
    if (els.emojiOnlineSearch) {
      els.emojiOnlineSearch.placeholder = t('emojiOnlineSearch');
      els.emojiOnlineSearch.value = '';
    }
    if (els.emojiOnlineGrid) {
      els.emojiOnlineGrid.innerHTML = '<div class="emoji-online-status">' + t('emojiOnlineLoading') + '</div>';
    }
    els.emojiOnlineModal.classList.add('open');
    try {
      await fetchOnlineEmojis();
      renderOnlineEmojiGrid('');
      if (els.emojiOnlineSearch) setTimeout(() => els.emojiOnlineSearch.focus(), 40);
    } catch (err) {
      if (els.emojiOnlineGrid) {
        els.emojiOnlineGrid.innerHTML = '<div class="emoji-online-status">' + t('emojiOnlineError') + '</div>';
      }
    }
  }

  if (els.emojiOnlineBtn) {
    els.emojiOnlineBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (els.emojiOnlineModal && els.emojiOnlineModal.classList.contains('open')) closeOnlineEmojiModal();
      else openOnlineEmojiModal();
    });
  }
  if (els.emojiOnlineClose) {
    els.emojiOnlineClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeOnlineEmojiModal();
    });
  }
  if (els.emojiOnlineModal) {
    els.emojiOnlineModal.addEventListener('click', (e) => {
      if (e.target === els.emojiOnlineModal) closeOnlineEmojiModal();
    });
  }
  if (els.emojiOnlineSearch) {
    let searchTimer = null;
    els.emojiOnlineSearch.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => renderOnlineEmojiGrid(els.emojiOnlineSearch.value), 80);
    });
    els.emojiOnlineSearch.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); closeOnlineEmojiModal(); }
    });
  }

  // ============================= AI dispatch =============================
  const AI_DISPATCH_CATALOG = [
    { id: 'chatgpt', label: 'ChatGPT', url: 'https://chatgpt.com', qParam: 'q' },
    { id: 'claude', label: 'Claude', url: 'https://claude.ai', qParam: null },
    { id: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/app', qParam: null },
    { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com', qParam: null },
    { id: 'grok', label: 'Grok', url: 'https://grok.com', qParam: 'q' },
    { id: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai', qParam: 'q' },
    { id: 'copilot', label: 'Copilot', url: 'https://copilot.microsoft.com', qParam: 'q' },
    { id: 'mistral', label: 'Mistral', url: 'https://chat.mistral.ai', qParam: null },
    { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai', qParam: null },
    { id: 'pi', label: 'Pi', url: 'https://pi.ai/talk', qParam: null },
    { id: 'metaai', label: 'Meta AI', url: 'https://www.meta.ai', qParam: null },
    { id: 'poe', label: 'Poe', url: 'https://poe.com', qParam: null },
    { id: 'you', label: 'You.com', url: 'https://you.com', qParam: null },
    { id: 'huggingchat', label: 'HuggingChat', url: 'https://huggingface.co/chat', qParam: null },
    { id: 'kimi', label: 'Kimi', url: 'https://www.kimi.com', qParam: null }
  ];
  const DEFAULT_NOTE_AI_ID = 'chatgpt';
  AI_DISPATCH_CATALOG.forEach((node) => {
    const opt = document.createElement('option');
    opt.value = node.id;
    opt.textContent = node.label;
    els.aiSelect.appendChild(opt);
  });
  els.aiSelect.value = DEFAULT_NOTE_AI_ID;

  function buildAiDispatchUrl(baseUrl, promptText, qParam) {
    if (!baseUrl || !promptText || !qParam) return baseUrl || '';
    try {
      const u = new URL(baseUrl);
      u.searchParams.set(qParam, promptText.trim());
      return u.toString();
    } catch (e) { return baseUrl; }
  }
  function pushPromptHistory(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    try {
      chrome.storage.local.get(['aiTreePromptHistory'], (res) => {
        let history = (res && Array.isArray(res.aiTreePromptHistory)) ? res.aiTreePromptHistory : [];
        history = [{ ts: Date.now(), text: trimmed }, ...history.filter(h => h.text !== trimmed)].slice(0, 10);
        chrome.storage.local.set({ aiTreePromptHistory: history });
      });
    } catch (e) {}
  }
  function sendPromptToSelectedAi() {
    const promptText = els.textarea.value.trim();
    if (!promptText) { showToast(t('toastEmptyPrompt')); return; }
    const node = AI_DISPATCH_CATALOG.find(n => n.id === els.aiSelect.value) || AI_DISPATCH_CATALOG[0];
    pushPromptHistory(promptText);
    const targetUrl = buildAiDispatchUrl(node.url, promptText, node.qParam);
    const openTab = () => window.open(targetUrl, '_blank', 'noopener,noreferrer');
    const notifyThenOpen = () => {
      const msg = (node.qParam ? t('dockOpenedFilled') : t('dockCopiedOpen')).replace('{name}', node.label);
      showToast(msg);
      setTimeout(openTab, 300);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptText).then(notifyThenOpen).catch(notifyThenOpen);
    } else {
      notifyThenOpen();
    }
  }
  els.sendBtn.addEventListener('click', sendPromptToSelectedAi);

  // ============================= Live two-way sync =============================
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        if (changes.savedPromptDraft && document.activeElement !== els.textarea) {
          const newVal = changes.savedPromptDraft.newValue || '';
          if (newVal !== els.textarea.value) { els.textarea.value = newVal; updateTokenMeter(); }
        }
        if (changes.noteTextAlign && changes.noteTextAlign.newValue) setAlign(changes.noteTextAlign.newValue, false);
        if (changes.noteFontSize && changes.noteFontSize.newValue) applyFontSize(changes.noteFontSize.newValue, false);
        if (changes[CUSTOM_PROMPT_KEY]) { customPrompts = changes[CUSTOM_PROMPT_KEY].newValue || []; renderPrompts(); }
        if (changes[PROMPT_OVERRIDE_KEY]) { promptOverrides = changes[PROMPT_OVERRIDE_KEY].newValue || {}; renderPrompts(); }
        if (changes[PROMPT_HIDDEN_KEY]) { promptHiddenIds = changes[PROMPT_HIDDEN_KEY].newValue || []; renderPrompts(); }
        if (changes.aiTreeEmojiMemory) { favoriteEmojis = changes.aiTreeEmojiMemory.newValue || DEFAULT_FAVORITE_EMOJIS.slice(); }
      }
      if (area === 'sync' && changes.appLanguage) { lang = changes.appLanguage.newValue || 'en'; applyTranslation(); }
    });
  } catch (e) {}

  // ============================= Initial load =============================
  try {
    chrome.storage.local.get(
      ['savedPromptDraft', 'noteTextAlign', 'noteFontSize', CUSTOM_PROMPT_KEY, PROMPT_OVERRIDE_KEY, PROMPT_HIDDEN_KEY, 'aiTreeEmojiMemory'],
      (data) => {
        els.textarea.value = (data && typeof data.savedPromptDraft === 'string') ? data.savedPromptDraft : '';
        lastValueForEmoji = els.textarea.value;
        setAlign((data && data.noteTextAlign) || 'left', false);
        applyFontSize((data && data.noteFontSize) || FONT_DEFAULT, false);
        if (data && Array.isArray(data[CUSTOM_PROMPT_KEY])) customPrompts = data[CUSTOM_PROMPT_KEY];
        if (data && data[PROMPT_OVERRIDE_KEY] && typeof data[PROMPT_OVERRIDE_KEY] === 'object') promptOverrides = data[PROMPT_OVERRIDE_KEY];
        if (data && Array.isArray(data[PROMPT_HIDDEN_KEY])) promptHiddenIds = data[PROMPT_HIDDEN_KEY];
        if (data && Array.isArray(data.aiTreeEmojiMemory) && data.aiTreeEmojiMemory.length) favoriteEmojis = data.aiTreeEmojiMemory.slice(0, 12);
        updateTokenMeter();
        renderPrompts();
      }
    );
    chrome.storage.sync.get(['appLanguage'], (data) => {
      lang = (data && data.appLanguage) || 'en';
      applyTranslation();
    });
  } catch (e) {
    applyTranslation();
  }

  els.textarea.focus();

  // --- Back to the tab/widget this notepad was opened from ---
  const params = new URLSearchParams(window.location.search);
  const fromTab = params.get('fromTab');
  const fromWindow = params.get('fromWindow');
  if (fromTab) {
    els.backBtn.style.display = 'flex';
    els.backBtn.addEventListener('click', () => {
      try {
        clearTimeout(draftSaveTimer);
        chrome.storage.local.set({ savedPromptDraft: els.textarea.value }, () => {
          chrome.runtime.sendMessage({
            action: 'returnToParentTab',
            tabId: fromTab,
            windowId: fromWindow || undefined
          }, () => { void chrome.runtime.lastError; });
        });
      } catch (e) {}
    });
  }
});
