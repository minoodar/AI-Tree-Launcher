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
      tplAdd: 'Add prompt', tplEditMode: 'Edit prompts', tplDoneMode: 'Done editing'
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
      tplAdd: 'افزودن پرامپت', tplEditMode: 'ویرایش پرامپت‌ها', tplDoneMode: 'پایان ویرایش'
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
