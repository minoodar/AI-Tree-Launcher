// AI Tree Launcher — Core (V25.6 - Compact Clock + Special Days)
(function () {
  'use strict';

  const isTopFrame = (window === window.top);
  if (!isTopFrame || document.getElementById('ai-orbit-root')) return;

  // --- سیستم ترجمه (i18n) ---
  let currentLang = 'en';
  const i18n = {
    en: {
      todoTitle: "📝 To-Do List",
      todoPending: "Pending",
      todoGoalPending: "In Progress",
      todoWhenToday: "Today",
      todoWhenTomorrow: "📅 Tomorrow",
      todoScheduledTomorrow: "📅 Tomorrow",
      todoInput: "New task...",
      todoTabDaily: "🗓️ Daily",
      todoTabGoals: "✨ Goals",
      todoDailyInput: "New task (auto-clears in 24h)...",
      todoGoalInput: "New goal or wish...",
      todoNoDaily: "No daily tasks",
      todoNoTomorrow: "No tasks planned for tomorrow yet",
      todoNoGoals: "No goals yet — add a wish ✨",
      todoExpiresIn: "{h}h left",
      todoExpiresSoon: "<1h left",
      todoAddBtn: "Add",
      todoDelTitle: "Delete task",
      todoPostponeTitle: "Move to tomorrow",
      toastTodoPostponed: "Moved to tomorrow 📅",
      todoCopyTitle: "Copy text",
      searchTitle: "Search Bookmarks",
      searchPlaceholder: "Type to search bookmarks...",
      searchNoResults: "No matching bookmarks",
      searchMetaHubStars: "G{hub} · {stars}",
      searchMetaHubOnly: "G{hub}",
      searchEditBtn: "Edit bookmark",
      searchDeleteBtn: "Delete bookmark",
      noteTitle: "Notepad & AI",
      allTitle: "Show All Bookmarks",
      collapseTitle: "Collapse Menu",
      calcTitle: "Calculator",
      clockTitle: "Clock & Date",
      undoTitle: "Restore last cleared text, task, or bookmark",
      spacingTitle: "Drag to adjust spacing",
      addNodeTitle: "Add Bookmark",
      formAddTitle: "🔖 Add Bookmark",
      formEditTitle: "✏️ Edit Bookmark",
      formCancelBtn: "Cancel",
      formSaveBtn: "Save",
      formUpdateBtn: "Update",
      formDeleteBtn: "Delete Bookmark",
      formClearCoreBtn: "Reset to Empty",
      formUrlPlaceholder: "URL: https://example.com",
      formLabelPlaceholder: "Name (Auto)",
      formDescPlaceholder: "Description (optional, shown on hover)",
      formGalaxyLabel: "Galaxy (drag to move)",
      toastGalaxyMoved: "Moved to Galaxy {n}",
      formImportanceLabel: "Importance",
      noteInput: "Type prompt or note here...",
      noteClearBtn: "Clear",
      noteCopyBtn: "Copy",
      noteTxtBtn: "TXT",
      noteAskBtn: "✨ Ask AI",
      dockSendTo: "Send to {name}",
      dockAskName: "✨ Ask {name}",
      dockPostName: "𝕏 Post to {name}",
      dockNoCore: "No AI configured",
      dockEmptyPrompt: "Type something first",
      dockCopiedOpen: "Copied! Paste it into {name} 📋",
      dockOpenedFilled: "Opened {name} with your text ready ⚡",
      dockMethodAuto: "Opens pre-filled",
      dockMethodCopy: "Copy & paste",
      calcError: "Error",
      ageLabel: "Age: {age} Years",
      toastCleared: "Cleared! Use Undo to restore it.",
      toastCopied: "Copied!",
      toastDownloaded: "TXT Downloaded!",
      toastStorageErr: "Storage Error!",
      toastStarUpdated: "Importance Updated ⭐",
      toastInvalidUrl: "Invalid URL",
      toastExists: "Bookmark already exists!",
      toastUpdated: "Bookmark Updated! ✏️",
      toastPlanted: "Bookmark Planted! 🌱",
      toastDeleted: "Deleted! Use Undo to restore it.",
      toastCoreCleared: "Reset to empty",
      toastRestored: "Restored!",
      toastTodoDeleted: "Task deleted! Use Undo to restore it.",
      toastTodoCopied: "Copied to clipboard",
      hubAll: "All",
      hubCore: "Core",
      portalForward: "Extended Network {n}",
      portalHome: "Home",
      hubDotTitle: "Galaxy {n}",
      hubDotHome: "Home",
      toastOverflowed: "{tier} tier is full — saved to Extended Network {hub} instead.",
      toastTierFullEverywhere: "{tier} tier is full across all networks!",
      toastQuickAdded: "Bookmarked: {label} {stars}",
      hubHoldHint: "Hold to bookmark this page — release at the star rating you want",
      markToggleTitle: "Special Days",
      markAddPlaceholder: "Title (e.g. Child's Birthday)",
      markAddBtn: "Add",
      markEmpty: "No special days marked yet",
      markDeleteTitle: "Delete",
      markToastAdded: "Special day added! 🎉",
      markToastDeleted: "Special day deleted",
      markInvalid: "Enter a title and pick a date",
      markTodayLine: "🎉 Today: {label}",
      markUpcomingLine: "📌 {label} — in {days}d",
      noteTplBarTitle: "Templates",
      noteTplRefactor: "Code Review",
      noteTplSummary: "Summarize",
      noteTplCritic: "Critique",
      noteTplTranslate: "Translate",
      noteTokenMeter: "{chars} chars · ~{tokens} tokens",
      noteTokenEmpty: "0 chars · 0 tokens",
      noteHistoryTitle: "Recent prompts",
      noteHistoryEmpty: "No recent prompts"
    },
    fa: {
      todoTitle: "📝 کارهای روزانه",
      todoPending: "انجام نشده",
      todoGoalPending: "در مسیر",
      todoWhenToday: "امروز",
      todoWhenTomorrow: "📅 فردا",
      todoScheduledTomorrow: "📅 فردا",
      todoInput: "وظیفه جدید...",
      todoTabDaily: "🗓️ روزانه",
      todoTabGoals: "✨ اهداف",
      todoDailyInput: "کار جدید (تا ۲۴ ساعت دیگر پاک می‌شود)...",
      todoGoalInput: "هدف یا آرزوی جدید...",
      todoNoDaily: "کار روزانه‌ای ثبت نشده",
      todoNoTomorrow: "هنوز کاری برای فردا برنامه‌ریزی نشده",
      todoNoGoals: "هنوز هدفی ثبت نشده — یک آرزو اضافه کن ✨",
      todoExpiresIn: "{h} ساعت مانده",
      todoExpiresSoon: "کمتر از ۱ ساعت مانده",
      todoAddBtn: "افزودن",
      todoDelTitle: "حذف وظیفه",
      todoPostponeTitle: "انتقال به فردا",
      toastTodoPostponed: "به فردا منتقل شد 📅",
      todoCopyTitle: "کپی متن",
      searchTitle: "جستجوی بوک‌مارک‌ها",
      searchPlaceholder: "برای جستجو تایپ کنید...",
      searchNoResults: "بوک‌مارکی یافت نشد",
      searchMetaHubStars: "کهکشان {hub} · {stars}",
      searchMetaHubOnly: "کهکشان {hub}",
      searchEditBtn: "ویرایش بوک‌مارک",
      searchDeleteBtn: "حذف بوک‌مارک",
      noteTitle: "یادداشت و هوش مصنوعی",
      allTitle: "نمایش تمام بوک‌مارک‌ها",
      collapseTitle: "بستن منو",
      calcTitle: "ماشین حساب",
      clockTitle: "ساعت و تاریخ",
      undoTitle: "بازگردانی متن، وظیفه، یا بوک‌مارک پاک‌شده",
      spacingTitle: "فاصله‌ی بوک‌مارک‌ها را با کشیدن تنظیم کنید",
      addNodeTitle: "افزودن بوک‌مارک",
      formAddTitle: "🔖 افزودن بوک‌مارک",
      formEditTitle: "✏️ ویرایش بوک‌مارک",
      formCancelBtn: "لغو",
      formSaveBtn: "ذخیره",
      formUpdateBtn: "به‌روزرسانی",
      formDeleteBtn: "حذف بوک‌مارک",
      formClearCoreBtn: "بازنشانی به خالی",
      formUrlPlaceholder: "لینک: https://example.com",
      formLabelPlaceholder: "نام بوک‌مارک (خودکار)",
      formDescPlaceholder: "توضیحات (اختیاری، هنگام هاور نمایش داده می‌شود)",
      formGalaxyLabel: "کهکشان (برای انتقال بکشید)",
      toastGalaxyMoved: "به کهکشان {n} منتقل شد",
      formImportanceLabel: "اهمیت",
      noteInput: "متن یا درخواست خود را بنویسید...",
      noteClearBtn: "پاک کردن",
      noteCopyBtn: "کپی",
      noteTxtBtn: "متنی",
      noteAskBtn: "✨ ارسال به هوش مصنوعی",
      dockSendTo: "ارسال به {name}",
      dockAskName: "✨ ارسال به {name}",
      dockPostName: "𝕏 پست در {name}",
      dockNoCore: "هوش مصنوعی تنظیم نشده",
      dockEmptyPrompt: "اول یه متن بنویس",
      dockCopiedOpen: "کپی شد! توی {name} پیستش کن 📋",
      dockOpenedFilled: "{name} با متنت باز شد، آماده ارسال ⚡",
      dockMethodAuto: "با متن آماده باز می‌شود",
      dockMethodCopy: "کپی و سپس پیست",
      calcError: "خطا",
      ageLabel: "سن: {age} سال",
      toastCleared: "پاک شد؛ با Undo بازگردانید.",
      toastCopied: "کپی شد!",
      toastDownloaded: "فایل متنی دانلود شد!",
      toastStorageErr: "خطای فضای ذخیره‌سازی!",
      toastStarUpdated: "میزان اهمیت بروز شد ⭐",
      toastInvalidUrl: "لینک نامعتبر است",
      toastExists: "این بوک‌مارک از قبل وجود دارد!",
      toastUpdated: "بوک‌مارک به‌روزرسانی شد! ✏️",
      toastPlanted: "بوک‌مارک افزوده شد! 🌱",
      toastDeleted: "حذف شد؛ با Undo بازگردانید.",
      toastCoreCleared: "به حالت خالی بازنشانی شد",
      toastRestored: "بازیابی شد!",
      toastTodoDeleted: "وظیفه حذف شد؛ با Undo بازگردانید.",
      toastTodoCopied: "متن کپی شد",
      hubAll: "همه",
      hubCore: "هسته",
      portalForward: "منظومه‌ی فرعی {n}",
      portalHome: "خانه",
      hubDotTitle: "کهکشان {n}",
      hubDotHome: "خانه",
      toastOverflowed: "رده‌ی {tier} پر شد؛ در منظومه‌ی فرعی {hub} ذخیره شد.",
      toastTierFullEverywhere: "رده‌ی {tier} در همه‌ی منظومه‌ها پر است!",
      toastQuickAdded: "بوک‌مارک شد: {label} {stars}",
      hubHoldHint: "نگه دارید تا بوک‌مارک شود — در ستاره‌ی دلخواه رها کنید",
      markToggleTitle: "مناسبت‌ها",
      markAddPlaceholder: "عنوان (مثلاً تولد فرزند)",
      markAddBtn: "افزودن",
      markEmpty: "هنوز مناسبتی ثبت نشده",
      markDeleteTitle: "حذف",
      markToastAdded: "مناسبت ثبت شد! 🎉",
      markToastDeleted: "مناسبت حذف شد",
      markInvalid: "یک عنوان و تاریخ معتبر وارد کنید",
      markTodayLine: "🎉 امروز: {label}",
      markUpcomingLine: "📌 {label} — {days} روز مانده",
      noteTplBarTitle: "قالب‌ها",
      noteTplRefactor: "بازبینی کد",
      noteTplSummary: "خلاصه‌سازی",
      noteTplCritic: "نقد",
      noteTplTranslate: "ترجمه",
      noteTokenMeter: "{chars} نویسه · ≈{tokens} توکن",
      noteTokenEmpty: "۰ نویسه · ۰ توکن",
      noteHistoryTitle: "پرامپت‌های اخیر",
      noteHistoryEmpty: "پرامپتی ذخیره نشده"
    }
  };

  function t(key) { return i18n[currentLang] && i18n[currentLang][key] ? i18n[currentLang][key] : i18n['en'][key]; }

  let linksData = []; 
  let linksData2 = []; 
  let linksData3 = [];
  const HUB_COUNT = 3; 
  function hubData(hubIdx) { return hubIdx === 1 ? linksData : hubIdx === 2 ? linksData2 : linksData3; }
  let currentHubIndex = 1; 
  let hubNavDirection = 'forward'; // remembers last portal click direction so a "return trip" keeps showing 🌍 in the same slot
  let todosData = [];
  let activeTodoTab = 'daily';
  let addForTomorrow = false;
  const TODO_DAILY_TTL_MS = 24 * 60 * 60 * 1000;
  let userBirthYear = null; 
  let markedDays = []; // مناسبت‌های نشانه‌گذاری‌شده: [{ id, label, day, month }]
  let isNotePinned = false;

  const systemLocale = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
  const RTL_LOCALE_PREFIXES = ['ar', 'fa', 'he', 'ur', 'ps', 'sd', 'ug', 'yi'];
  function isRTLLocale(locale) { return RTL_LOCALE_PREFIXES.includes((locale || '').split('-')[0].toLowerCase()); }
  
  const WIDGET1_DEFAULT_LEFT = '28px'; const WIDGET1_DEFAULT_BOTTOM = '108px';

  const GOLDEN_ANGLE = 137.51; let SPACING = 32; const START_RADIUS = 88; const MAX_NODES = 80;
  const MIN_SPACING = 18; const MAX_SPACING = 84;
  let currentLayerMode = 0; let showAllOverride = false; const MAX_LAYERS = 5;
  let isOpen = false; let isDragging = false; let dragMoved = false;
  let spiralNodeEls = []; 
  
  let editingNodeIndex = null; 
  let isLabelManuallyEdited = false;

  function extractDomainName(urlStr) {
    if (!urlStr) return '';
    try {
      let u = urlStr.trim(); if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      const hostname = new URL(u).hostname.replace(/^www\./i, '');
      const parts = hostname.split('.'); if (parts.length > 1) parts.pop(); 
      let name = parts.join('.'); if (name) name = name.charAt(0).toUpperCase() + name.slice(1);
      return name.substring(0, 18); 
    } catch (e) { return ''; }
  }

  const DAILY_QUOTES = [
    { text: "إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ", ref: "شعراء: 62" },
    { text: "هُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", ref: "حدید: 4" },
    { text: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ", ref: "ق: 16" },
    { text: "وَاللَّهُ خَيْرٌ حَافِظًا", ref: "یوسف: 64" },
    { text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", ref: "آل‌عمران: 173" },
    { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ref: "رعد: 28" },
    { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "شرح: 5" },
    { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "شرح: 6" },
    { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", ref: "بقره: 153" },
    { text: "لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ", ref: "بقره: 62" },
    { text: "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ", ref: "زمر: 53" },
    { text: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", ref: "اعراف: 156" },
    { text: "إِنَّ رَبِّي رَحِيمٌ وَدُودٌ", ref: "هود: 90" },
    { text: "إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ", ref: "بقره: 37" },
    { text: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", ref: "ده‌ها آیه" },
    { text: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ", ref: "ذاریات: 58" },
    { text: "وَاللَّهُ خَيْرُ الرَّازِقِينَ", ref: "حج: 58" },
    { text: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", ref: "طلاق: 3" },
    { text: "وَمَا بِكُم مِّن نِّعْمَةٍ فَمِنَ اللَّهِ", ref: "نحل: 53" },
    { text: "وَاللَّهُ ذُو الْفَضْلِ الْعَظِيمِ", ref: "بقره: 105" },
    { text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", ref: "طلاق: 3" },
    { text: "وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ", ref: "آل‌عمران: 122" },
    { text: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ", ref: "آل‌عمران: 159" },
    { text: "إِلَى اللَّهِ تُرْجَعُ الْأُمُورُ", ref: "آل‌عمران: 109" },
    { text: "إِلَى اللَّهِ الْمَصِيرُ", ref: "نور: 42 و آیات دیگر" },
    { text: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", ref: "نور: 35" },
    { text: "وَاللَّهُ يَهْدِي مَن يَشَاءُ", ref: "نور: 46" },
    { text: "إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ", ref: "هود: 61" },
    { text: "رَبِّ زِدْنِي عِلْمًا", ref: "طه: 114" },
    { text: "وَقُل رَّبِّ ارْحَمْهُمَا", ref: "اسراء: 24" },
    { text: "وَهُوَ أَرْحَمُ الرَّاحِمِينَ", ref: "یوسف: 64" },
    { text: "إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", ref: "بقره: 20" },
    { text: "إِنَّ اللَّهَ بِكُلِّ شَيْءٍ عَلِيمٌ", ref: "بقره: 282" },
    { text: "إِنَّ اللَّهَ لَطِيفٌ خَبِيرٌ", ref: "لقمان: 16" },
    { text: "إِنَّ اللَّهَ عَزِيزٌ حَكِيمٌ", ref: "ده‌ها آیه" },
    { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", ref: "فاتحه: 2" },
    { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", ref: "فاتحه: 5" },
    { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", ref: "فاتحه: 6" },
    { text: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", ref: "بقره: 156" },
    { text: "فَاذْكُرُونِي أَذْكُرْكُمْ", ref: "بقره: 152" }
  ];
  function getDailyQuoteIndex() {
    const today = new Date(); const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let hash = 0; for (let i = 0; i < dateStr.length; i++) { hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0; }
    return hash % DAILY_QUOTES.length;
  }

  const RING_CONFIG = [
    { labelKey: 'hubCore', max: 4 },
    { label: '5★',   importance: 5,     max: 7  },
    { label: '4★',   importance: 4,     max: 14 },
    { label: '3★',   importance: 3,     max: 20 },
    { label: '1-2★', importanceMax: 2,  max: 30 }
  ];

  function importanceMatchesRing(importance, ring) {
    return ring.importance !== undefined ? importance === ring.importance : importance <= ring.importanceMax;
  }
  function tierRingForImportance(importance) {
    for (let i = 1; i < RING_CONFIG.length; i++) { if (importanceMatchesRing(importance, RING_CONFIG[i])) return RING_CONFIG[i]; }
    return RING_CONFIG[RING_CONFIG.length - 1];
  }
  function tierCountInHub(hubIdx, ring) {
    const data = hubData(hubIdx); let n = 0;
    for (let i = 4; i < data.length; i++) { if (importanceMatchesRing(data[i].importance || 3, ring)) n++; }
    return n;
  }
  function findTargetHubForImportance(importance, startHub) {
    const ring = tierRingForImportance(importance);
    let targetHub = startHub;
    while (targetHub <= HUB_COUNT && (tierCountInHub(targetHub, ring) >= ring.max || hubData(targetHub).length >= MAX_NODES)) {
      targetHub++;
    }
    return { ring, targetHub };
  }
  function hubHasTierItems(hubIdx, ring) { return tierCountInHub(hubIdx, ring) > 0; }

  const CORE_COLORS = [
    { bg: "rgba(154, 52, 18, 0.82)", border: "rgba(249, 115, 22, 0.8)", glow: "rgba(249, 115, 22, 0.55)" }, 
    { bg: "rgba(26, 54, 153, 0.82)", border: "rgba(66, 133, 244, 0.8)", glow: "rgba(66, 133, 244, 0.55)" }, 
    { bg: "rgba(4, 90, 66, 0.82)",   border: "rgba(16, 185, 129, 0.8)", glow: "rgba(16, 185, 129, 0.55)" }, 
    { bg: "rgba(23, 49, 118, 0.82)", border: "rgba(77, 107, 254, 0.8)", glow: "rgba(77, 107, 254, 0.55)" }  
  ];
  const EXTRA_COLORS = [
    { bg: "rgba(107, 33, 168, 0.75)", border: "rgba(168, 85, 247, 0.5)", glow: "rgba(168, 85, 247, 0.2)" }, 
    { bg: "rgba(79, 70, 229, 0.75)",  border: "rgba(99, 102, 241, 0.5)", glow: "rgba(99, 102, 241, 0.2)" },  
    { bg: "rgba(153, 27, 27, 0.75)",  border: "rgba(239, 68, 68, 0.5)",  glow: "rgba(239, 68, 68, 0.2)" }
  ];
  // همان منطقِ رنگ‌دهیِ نودهای اسپیرال، برای استفاده در نتایج جستجو (تا رنگ‌ها همیشه هم‌خوان بمانند)
  function colorSetForBookmark(link, idxInHub) {
    if (idxInHub < 4) return CORE_COLORS[idxInHub] || EXTRA_COLORS[0];
    const importance = (link && link.importance) || 3;
    const nodeLayer = Math.max(0, importance - 1);
    return EXTRA_COLORS[nodeLayer % EXTRA_COLORS.length];
  }

  const root = document.createElement('div'); root.id = 'ai-orbit-root';
  const hub = document.createElement('div'); hub.id = 'ai-orbit-hub'; hub.innerHTML = mainAIIcon();
  
  const todoToggleDot = document.createElement('div'); todoToggleDot.id = 'ai-todo-toggle'; todoToggleDot.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`; hub.appendChild(todoToggleDot);
  const searchToggleDot = document.createElement('div'); searchToggleDot.id = 'ai-search-toggle'; searchToggleDot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`; hub.appendChild(searchToggleDot);
  const noteToggleDot = document.createElement('div'); noteToggleDot.id = 'ai-note-toggle'; noteToggleDot.innerHTML = `<span class="ai-toggle-glyph">✦</span>`; hub.appendChild(noteToggleDot);
  const allToggleDot = document.createElement('div'); allToggleDot.id = 'ai-all-toggle'; allToggleDot.innerHTML = `<span class="ai-toggle-glyph">❂</span>`; hub.appendChild(allToggleDot);
  const collapseToggleDot = document.createElement('div'); collapseToggleDot.id = 'ai-collapse-toggle'; collapseToggleDot.innerHTML = `<span class="ai-toggle-glyph">◉</span>`; hub.appendChild(collapseToggleDot);
  const calcToggleDot = document.createElement('div'); calcToggleDot.id = 'ai-calc-hub-toggle'; calcToggleDot.innerHTML = `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="8" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="16" y2="14"></line><line x1="8" y1="18" x2="16" y2="18"></line></svg>`; hub.appendChild(calcToggleDot);
  const clockToggleDot = document.createElement('div'); clockToggleDot.id = 'ai-clock-toggle'; clockToggleDot.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`; hub.appendChild(clockToggleDot);
  const undoToggleDot = document.createElement('div'); undoToggleDot.id = 'ai-undo-toggle'; undoToggleDot.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>`; hub.appendChild(undoToggleDot);

  const spacingArc = document.createElement('div'); spacingArc.id = 'ai-spacing-arc';
  spacingArc.innerHTML = `
    <svg viewBox="0 0 104 104" width="104" height="104">
      <path id="ai-spacing-track" d="M94,52 A42,42 0 0 0 52,10" fill="none"></path>
      <path id="ai-spacing-fill" d="M94,52 A42,42 0 0 0 52,10" fill="none"></path>
    </svg>
    <div id="ai-spacing-thumb"></div>
    <div id="ai-spacing-value">42</div>`;
  hub.appendChild(spacingArc);

  const addNodeBtn = document.createElement('div'); addNodeBtn.id = 'ai-add-node'; addNodeBtn.textContent = '+';
  const inlineForm = document.createElement('div'); inlineForm.id = 'ai-inline-form';
  inlineForm.innerHTML = `
    <div class="ai-form-header">
      <span class="ai-form-title" id="ai-form-main-title"></span>
      <span class="ai-form-close" id="ai-form-close" title="✕">✕</span>
    </div>
    <input type="url" id="ai-form-url" dir="ltr" />
    <input type="text" id="ai-form-label" maxlength="18" dir="auto" />
    <input type="text" id="ai-form-description" maxlength="140" dir="auto" />
    <div class="ai-form-importance">
      <span class="ai-form-importance-label" id="ai-form-imp-label"></span>
      <div class="ai-star-rating" id="ai-form-stars">
        <span class="ai-star" data-value="1">★</span>
        <span class="ai-star" data-value="2">★</span>
        <span class="ai-star" data-value="3">★</span>
        <span class="ai-star" data-value="4">★</span>
        <span class="ai-star" data-value="5">★</span>
      </div>
    </div>
    <div class="ai-form-galaxy" id="ai-form-galaxy" style="display:none;">
      <span class="ai-form-galaxy-label" id="ai-form-galaxy-label"></span>
      <div class="ai-galaxy-track" id="ai-galaxy-track">
        <div class="ai-galaxy-stop" data-hub="1">🌌<b>۱</b></div>
        <div class="ai-galaxy-stop" data-hub="2">🌌<b>۲</b></div>
        <div class="ai-galaxy-stop" data-hub="3">🌌<b>۳</b></div>
        <div class="ai-galaxy-knob" id="ai-galaxy-knob">🪐</div>
      </div>
    </div>
    <div class="ai-form-actions">
      <button id="ai-form-delete" class="ai-form-btn-delete" style="display:none;"></button>
      <button id="ai-form-cancel" class="ai-form-btn-cancel"></button>
      <button id="ai-form-save" class="ai-form-btn-save"></button>
    </div>`;

  const quickNoteForm = document.createElement('div'); quickNoteForm.id = 'ai-quick-note-form';
  quickNoteForm.innerHTML = `
    <div class="ai-note-header" id="ai-note-header">
      <span class="ai-note-header-title">NOTEPAD & AI</span>
      <button type="button" id="ai-note-pin-btn" class="ai-note-pin-btn" title="Pin Window">📌</button>
    </div>
    <div class="ai-note-format-bar" id="ai-note-format-bar">
      <button type="button" id="ai-align-right-btn" class="ai-format-btn ai-align-icon ai-align-icon-right" title="Right align"><span></span><span></span><span></span></button>
      <button type="button" id="ai-align-center-btn" class="ai-format-btn ai-align-icon ai-align-icon-center" title="Center align"><span></span><span></span><span></span></button>
      <button type="button" id="ai-align-left-btn" class="ai-format-btn ai-align-icon ai-align-icon-left" title="Left align"><span></span><span></span><span></span></button>
    </div>
    <div class="ai-note-tpl-bar" id="ai-note-tpl-bar"></div>
    <div class="ai-note-text-wrap" id="ai-note-text-wrap">
      <textarea id="ai-note-text" rows="1" dir="auto"></textarea>
    </div>
    <div class="ai-note-status-row">
      <span id="ai-note-token-meter" class="ai-note-token-meter">0 chars · 0 tokens</span>
      <button type="button" id="ai-note-history-btn" class="ai-note-history-btn" title="Recent prompts">⏱</button>
      <div id="ai-note-history-menu" class="ai-note-history-menu"></div>
    </div>
    <div class="ai-note-toolbar">
      <button id="ai-note-clear-btn" class="ai-toolbar-btn" style="background: rgba(217, 119, 87, 0.22); color: #E8A088;"></button>
      <button id="ai-note-copy-btn" class="ai-toolbar-btn" style="background: rgba(16, 185, 129, 0.22); color: #34D399;"></button>
      <button id="ai-save-txt-btn" class="ai-toolbar-btn" style="background: rgba(255, 255, 255, 0.14); color: #fff;"></button>
      <div id="ai-smart-send-wrapper" class="ai-smart-send-wrapper" tabindex="0" role="listbox" aria-label="Ask AI">
        <button type="button" id="ai-send-action-btn" class="ai-send-action-btn">
          <span class="ai-send-dot" id="ai-send-dot"></span>
          <span class="ai-send-label" id="ai-send-label"></span>
          <span class="ai-send-method" id="ai-send-method"></span>
        </button>
        <div class="ai-wheel-popover" id="ai-wheel-popover">
          <div class="ai-wheel-viewport" id="ai-wheel-viewport">
            <div class="ai-wheel-list" id="ai-wheel-list"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="ai-note-resize-handle ai-note-resize-bl" id="ai-note-resize-bl" title="Resize"></div>
    <div class="ai-note-resize-handle ai-note-resize-br" id="ai-note-resize-br" title="Resize"></div>
  `;

  const calcPanel = document.createElement('div'); calcPanel.id = 'ai-calc-panel';
  calcPanel.innerHTML = `
    <div class="ai-calc-display">
      <div class="ai-calc-expr" id="calc-expr"></div>
      <div class="ai-calc-result" id="calc-display">0</div>
    </div>
    <div class="ai-calc-grid"></div>
  `;

  const clockPanel = document.createElement('div'); clockPanel.id = 'ai-clock-panel';
  clockPanel.innerHTML = `
    <div class="ai-clock-halo"></div>
    <div class="ai-clock-kicker"><span></span><span id="ai-clock-kicker-text">اکنون</span><span></span></div>
    <div class="ai-clock-time" id="ai-time">--:--</div>
    <div class="ai-clock-date-fa" id="ai-date-fa">...</div>
    <div class="ai-clock-date-en" id="ai-date-en">...</div>
    <div class="ai-mark-dots-row" id="ai-mark-dots-row" style="display:none;"></div>
    <button type="button" class="ai-clock-marks-toggle-btn" id="ai-clock-marks-toggle">📌</button>
    <div class="ai-clock-marks-panel" id="ai-clock-marks-panel">
      <ul class="ai-clock-marks-list" id="ai-clock-marks-list"></ul>
      <div class="ai-clock-marks-form">
        <input type="text" id="ai-mark-label-input" dir="auto" />
        <div class="ai-smart-date-wrap">
          <input type="text" id="ai-smart-date" dir="ltr" autocomplete="off" inputmode="text" />
          <button type="button" id="ai-smart-date-picker-btn" title="Calendar">📅</button>
        </div>
        <div class="ai-dual-picker" id="ai-dual-picker" hidden>
          <div class="ai-dual-picker-header">
            <button type="button" id="ai-dual-prev" aria-label="Previous">‹</button>
            <span id="ai-dual-month-label"></span>
            <button type="button" id="ai-dual-next" aria-label="Next">›</button>
          </div>
          <div class="ai-dual-weekdays" id="ai-dual-weekdays"></div>
          <div class="ai-dual-grid" id="ai-dual-grid"></div>
        </div>
        <button type="button" id="ai-mark-add-btn"></button>
      </div>
    </div>
    <div class="ai-life-journey" id="ai-life-journey" style="display: none;">
      <div class="ai-life-horizon"><span class="ai-life-origin"></span><span class="ai-life-path"></span><span class="ai-life-now"></span></div>
      <div class="ai-life-copy"><span id="ai-life-start">آغاز</span><span id="ai-life-caption"></span><span id="ai-life-now-label">اکنون</span></div>
    </div>
    <div class="ai-clock-age" id="ai-age" style="display: none;"></div>
  `;

  const searchPanel = document.createElement('div'); searchPanel.id = 'ai-search-panel';
  searchPanel.innerHTML = `
    <input type="text" id="ai-search-input" dir="auto" autocomplete="off" />
    <ul id="ai-search-results"></ul>
  `;

  const tierDotsNav = document.createElement('div'); tierDotsNav.id = 'ai-tier-dots';
  const hubDotsNav = document.createElement('div'); hubDotsNav.id = 'ai-hub-dots';

  const todoPanel = document.createElement('div'); todoPanel.id = 'ai-todo-panel';
  todoPanel.innerHTML = `
    <div class="ai-todo-quote" id="ai-todo-quote">
      <button type="button" class="ai-quote-tab" id="ai-quote-tab" title="آیه روز">
        <span class="ai-quote-tab-label" id="ai-quote-tab-label">☀️</span>
        <span class="ai-quote-tab-chevron" id="ai-quote-tab-chevron">▲</span>
      </button>
      <div class="ai-todo-quote-body" id="ai-todo-quote-body">
        <div class="ai-todo-quote-fa" id="ai-todo-quote-fa"></div>
        <div class="ai-todo-quote-title" id="ai-todo-quote-title"></div>
      </div>
    </div>
    <div class="ai-todo-header">
      <span id="ai-todo-main-title"></span>
      <span class="ai-todo-count" id="ai-todo-count">0</span>
    </div>
    <div class="ai-todo-tabs">
      <button class="ai-todo-tab active" id="ai-todo-tab-daily" data-type="daily"></button>
      <button class="ai-todo-tab" id="ai-todo-tab-goal" data-type="goal"></button>
    </div>
    <div class="ai-todo-when-row" id="ai-todo-when-row">
      <button type="button" class="ai-todo-when-btn active" id="ai-todo-when-today" data-when="today"></button>
      <button type="button" class="ai-todo-when-btn" id="ai-todo-when-tomorrow" data-when="tomorrow"></button>
    </div>
    <div class="ai-todo-input-row">
      <input type="text" id="ai-todo-input" dir="auto" />
      <button id="ai-todo-add-btn"></button>
    </div>
    <ul id="ai-todo-list"></ul>
  `;

  const toastBox = document.createElement('div'); toastBox.className = 'ai-toast-notification';

  const starEditorPopup = document.createElement('div'); starEditorPopup.id = 'ai-star-editor-popup';
  starEditorPopup.innerHTML = `
    <span class="ai-star-edit" data-value="1">★</span>
    <span class="ai-star-edit" data-value="2">★</span>
    <span class="ai-star-edit" data-value="3">★</span>
    <span class="ai-star-edit" data-value="4">★</span>
    <span class="ai-star-edit" data-value="5">★</span>`;

  root.classList.add('orbit-root'); hub.classList.add('orbit-hub');
  addNodeBtn.classList.add('orbit-add-node'); inlineForm.classList.add('orbit-inline-form');
  starEditorPopup.classList.add('orbit-star-editor');

  root.appendChild(hub); root.appendChild(addNodeBtn);

  const mountFragment = document.createDocumentFragment();
  mountFragment.append(root, inlineForm, quickNoteForm, calcPanel, clockPanel, todoPanel, searchPanel, tierDotsNav, hubDotsNav, toastBox, starEditorPopup);

  function mountWidget() { document.body.appendChild(mountFragment); }
  if (document.body) { mountWidget(); }
  else { document.addEventListener('DOMContentLoaded', mountWidget); }

  const noteTextarea = quickNoteForm.querySelector('#ai-note-text');

  const uiEls = {
    formMainTitle: inlineForm.querySelector('#ai-form-main-title'),
    formUrl: inlineForm.querySelector('#ai-form-url'),
    formLabel: inlineForm.querySelector('#ai-form-label'),
    formDescription: inlineForm.querySelector('#ai-form-description'),
    formGalaxyWrap: inlineForm.querySelector('#ai-form-galaxy'),
    formGalaxyLabel: inlineForm.querySelector('#ai-form-galaxy-label'),
    formGalaxyTrack: inlineForm.querySelector('#ai-galaxy-track'),
    formGalaxyKnob: inlineForm.querySelector('#ai-galaxy-knob'),
    formImpLabel: inlineForm.querySelector('#ai-form-imp-label'),
    formImportanceWrap: inlineForm.querySelector('.ai-form-importance'),
    formCancel: inlineForm.querySelector('#ai-form-cancel'),
    formDelete: inlineForm.querySelector('#ai-form-delete'),
    formSave: inlineForm.querySelector('#ai-form-save'),
    noteText: quickNoteForm.querySelector('#ai-note-text'),
    noteClearBtn: quickNoteForm.querySelector('#ai-note-clear-btn'),
    noteCopyBtn: quickNoteForm.querySelector('#ai-note-copy-btn'),
    saveTxtBtn: quickNoteForm.querySelector('#ai-save-txt-btn'),
    alignRightBtn: quickNoteForm.querySelector('#ai-align-right-btn'),
    alignCenterBtn: quickNoteForm.querySelector('#ai-align-center-btn'),
    alignLeftBtn: quickNoteForm.querySelector('#ai-align-left-btn'),
    textWrap: quickNoteForm.querySelector('#ai-note-text-wrap'),
    tplBar: quickNoteForm.querySelector('#ai-note-tpl-bar'),
    tokenMeter: quickNoteForm.querySelector('#ai-note-token-meter'),
    historyBtn: quickNoteForm.querySelector('#ai-note-history-btn'),
    historyMenu: quickNoteForm.querySelector('#ai-note-history-menu'),
    sendWrapper: quickNoteForm.querySelector('#ai-smart-send-wrapper'),
    sendActionBtn: quickNoteForm.querySelector('#ai-send-action-btn'),
    sendDot: quickNoteForm.querySelector('#ai-send-dot'),
    sendLabelEl: quickNoteForm.querySelector('#ai-send-label'),
    sendMethodEl: quickNoteForm.querySelector('#ai-send-method'),
    wheelPopover: quickNoteForm.querySelector('#ai-wheel-popover'),
    wheelViewport: quickNoteForm.querySelector('#ai-wheel-viewport'),
    wheelList: quickNoteForm.querySelector('#ai-wheel-list'),
    todoMainTitle: todoPanel.querySelector('#ai-todo-main-title'),
    todoInput: todoPanel.querySelector('#ai-todo-input'),
    todoAddBtn: todoPanel.querySelector('#ai-todo-add-btn'),
    todoTabDaily: todoPanel.querySelector('#ai-todo-tab-daily'),
    todoTabGoal: todoPanel.querySelector('#ai-todo-tab-goal'),
    todoQuoteTitle: todoPanel.querySelector('#ai-todo-quote-title'),
    todoQuoteFa: todoPanel.querySelector('#ai-todo-quote-fa'),
    todoQuoteBody: todoPanel.querySelector('#ai-todo-quote-body'),
    todoQuoteTab: todoPanel.querySelector('#ai-quote-tab'),
    todoQuoteChevron: todoPanel.querySelector('#ai-quote-tab-chevron'),
    todoQuoteLabel: todoPanel.querySelector('#ai-quote-tab-label'),
    todoQuote: todoPanel.querySelector('#ai-todo-quote'),
    searchInput: searchPanel.querySelector('#ai-search-input'),
    searchResults: searchPanel.querySelector('#ai-search-results'),
    todoWhenRow: todoPanel.querySelector('#ai-todo-when-row'),
    todoWhenToday: todoPanel.querySelector('#ai-todo-when-today'),
    todoWhenTomorrow: todoPanel.querySelector('#ai-todo-when-tomorrow'),
    markDotsRow: clockPanel.querySelector('#ai-mark-dots-row'),
    markToggle: clockPanel.querySelector('#ai-clock-marks-toggle'),
    markPanel: clockPanel.querySelector('#ai-clock-marks-panel'),
    markList: clockPanel.querySelector('#ai-clock-marks-list'),
    markLabelInput: clockPanel.querySelector('#ai-mark-label-input'),
    smartDateInput: clockPanel.querySelector('#ai-smart-date'),
    smartDatePickerBtn: clockPanel.querySelector('#ai-smart-date-picker-btn'),
    dualPicker: clockPanel.querySelector('#ai-dual-picker'),
    dualPrev: clockPanel.querySelector('#ai-dual-prev'),
    dualNext: clockPanel.querySelector('#ai-dual-next'),
    dualMonthLabel: clockPanel.querySelector('#ai-dual-month-label'),
    dualWeekdays: clockPanel.querySelector('#ai-dual-weekdays'),
    dualGrid: clockPanel.querySelector('#ai-dual-grid'),
    markAddBtn: clockPanel.querySelector('#ai-mark-add-btn'),
  };

  function updateUITexts() {
    todoToggleDot.title = t('todoTitle');
    searchToggleDot.title = t('searchTitle');
    noteToggleDot.title = t('noteTitle');
    allToggleDot.title = t('allTitle');
    collapseToggleDot.title = t('collapseTitle');
    calcToggleDot.title = t('calcTitle');
    clockToggleDot.title = t('clockTitle');
    undoToggleDot.title = t('undoTitle');
    spacingArc.title = t('spacingTitle');
    addNodeBtn.title = t('addNodeTitle');
    hub.title = t('hubHoldHint');

    uiEls.formMainTitle.textContent = editingNodeIndex === null ? t('formAddTitle') : t('formEditTitle');
    uiEls.formUrl.placeholder = t('formUrlPlaceholder');
    uiEls.formLabel.placeholder = t('formLabelPlaceholder');
    uiEls.formDescription.placeholder = t('formDescPlaceholder');
    uiEls.formGalaxyLabel.textContent = t('formGalaxyLabel');
    uiEls.formImpLabel.textContent = t('formImportanceLabel');
    uiEls.formCancel.textContent = t('formCancelBtn');
    uiEls.formDelete.textContent = t('formDeleteBtn');
    uiEls.formSave.textContent = editingNodeIndex === null ? t('formSaveBtn') : t('formUpdateBtn');

    uiEls.noteText.placeholder = t('noteInput');
    uiEls.noteClearBtn.textContent = t('noteClearBtn');
    uiEls.noteCopyBtn.textContent = t('noteCopyBtn');
    uiEls.saveTxtBtn.textContent = t('noteTxtBtn');
    if (typeof renderNoteTemplates === 'function') renderNoteTemplates();
    if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
    if (uiEls.historyBtn) uiEls.historyBtn.title = t('noteHistoryTitle');
    renderSmartRibbon();

    uiEls.todoMainTitle.textContent = t('todoTitle');
    uiEls.todoInput.placeholder = activeTodoTab === 'daily' ? t('todoDailyInput') : t('todoGoalInput');
    uiEls.todoAddBtn.textContent = t('todoAddBtn');
    uiEls.todoTabDaily.textContent = t('todoTabDaily');
    uiEls.todoTabGoal.textContent = t('todoTabGoals');

    uiEls.searchInput.placeholder = t('searchPlaceholder');
    uiEls.todoWhenToday.textContent = t('todoWhenToday');
    uiEls.todoWhenTomorrow.textContent = t('todoWhenTomorrow');

    clockToggleDot.title = t('clockTitle');
    uiEls.markToggle.title = t('markToggleTitle');
    uiEls.markLabelInput.placeholder = t('markAddPlaceholder');
    uiEls.markAddBtn.textContent = t('markAddBtn');
    if (uiEls.smartDateInput) {
      uiEls.smartDateInput.placeholder = currentLang === 'fa'
        ? 'امروز · فردا · ۱۴۰۳/۰۵/۱۶ · 2026-07-27'
        : 'today · tomorrow · 2026-07-27 · 1403/05/16';
    }

    root.style.direction = currentLang === 'fa' ? 'rtl' : 'ltr';
    inlineForm.style.direction = currentLang === 'fa' ? 'rtl' : 'ltr';
    quickNoteForm.style.direction = currentLang === 'fa' ? 'rtl' : 'ltr';
    todoPanel.style.direction = currentLang === 'fa' ? 'rtl' : 'ltr';
    searchPanel.style.direction = currentLang === 'fa' ? 'rtl' : 'ltr';
    
    if(todoPanel.classList.contains('active')) renderTodos();
    if(clockPanel.classList.contains('active')) { updateClockAge(); renderMarkedDays(); }
    if(searchPanel.classList.contains('active')) renderSearchResults(uiEls.searchInput.value);
    renderTierDots();
    if(isOpen) setHubLabel(currentLayerMode === 0 ? t('hubCore') : RING_CONFIG[currentLayerMode].label);
  }

  function updateClockAge() {
      const timeEl = document.getElementById('ai-time'); if (!timeEl) return; 
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', hour12: false });
      const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const primaryDateEl = document.getElementById('ai-date-fa');   
      const secondaryDateEl = document.getElementById('ai-date-en'); 

      const primaryDate = now.toLocaleDateString(systemLocale, dateOpts);
      primaryDateEl.textContent = primaryDate;
      primaryDateEl.style.direction = isRTLLocale(systemLocale) ? 'rtl' : 'ltr';

      let systemCalendar = 'gregory';
      try { systemCalendar = new Intl.DateTimeFormat(systemLocale).resolvedOptions().calendar; } catch (e) {}

      if (currentLang === 'fa') {
        // وقتی زبان برنامه فارسی است، تاریخ شمسی را همیشه به‌عنوان خط دوم نشان بده —
        // مستقل از تقویم سیستم، پس روی زبان‌های دیگر (نسخه‌ی جهانی) هیچ اثری ندارد.
        try {
          secondaryDateEl.textContent = now.toLocaleDateString('fa-IR-u-ca-persian', dateOpts);
          secondaryDateEl.style.direction = 'rtl';
          secondaryDateEl.style.display = '';
        } catch (e) { secondaryDateEl.textContent = ''; secondaryDateEl.style.display = 'none'; }
      } else if (systemCalendar !== 'gregory') {
        secondaryDateEl.textContent = now.toLocaleDateString('en-US', dateOpts); secondaryDateEl.style.display = '';
      } else {
        secondaryDateEl.textContent = ''; secondaryDateEl.style.display = 'none';
      }
      
      const ageEl = document.getElementById('ai-age'); const journeyEl = document.getElementById('ai-life-journey'); const journeyCaption = document.getElementById('ai-life-caption');
      const journeyStart = document.getElementById('ai-life-start'); const journeyNow = document.getElementById('ai-life-now-label'); const clockKicker = document.getElementById('ai-clock-kicker-text');
      const isPersian = currentLang === 'fa';
      if (clockKicker) clockKicker.textContent = isPersian ? 'اکنون' : 'THE PRESENT';
      if (journeyStart) journeyStart.textContent = isPersian ? 'آغاز' : 'ORIGIN';
      if (journeyNow) journeyNow.textContent = isPersian ? 'اکنون' : 'NOW';
      if (userBirthYear && !isNaN(userBirthYear)) {
          let currentYear = now.getFullYear(); 
          if (userBirthYear < 1500) { const jYearStr = new Intl.DateTimeFormat('en-US-u-ca-persian', {year: 'numeric'}).format(now); currentYear = parseInt(jYearStr.replace(/\D/g, ''), 10); }
         const age = currentYear - userBirthYear;
         ageEl.textContent = t('ageLabel').replace('{age}', age); ageEl.style.display = 'block';
         if (journeyEl && journeyCaption) {
             const progress = Math.max(7, Math.min(93, (age / 100) * 100));
             journeyEl.style.setProperty('--life-progress', `${progress}%`);
             journeyCaption.textContent = isPersian ? `${age} سال در مسیرِ اکنون` : `${age} years into your journey`;
             journeyEl.style.display = 'block';
         }
      } else {
         ageEl.textContent = ''; ageEl.style.display = 'none'; if (journeyEl) journeyEl.style.display = 'none';
      }
  }
  setInterval(updateClockAge, 1000);

  function saveMarkedDays() { try { if (chrome.runtime?.id) chrome.storage.sync.set({ aiTreeMarkedDays: markedDays }); } catch (e) {} }

  // === تبدیل تقویم شمسی (جلالی) <-> میلادی — الگوریتم استاندارد، بدون کتابخانه‌ی خارجی ===
  function jdiv(a, b) { return ~~(a / b); }
  function jmod(a, b) { return a - ~~(a / b) * b; }
  function jalCal(jy) {
    const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
    const bl = breaks.length; const gy = jy + 621;
    let leapJ = -14, jp = breaks[0], jm, jump = 0, n, i;
    for (i = 1; i < bl; i += 1) {
      jm = breaks[i]; jump = jm - jp;
      if (jy < jm) break;
      leapJ += jdiv(jump, 33) * 8 + jdiv(jmod(jump, 33), 4);
      jp = jm;
    }
    n = jy - jp;
    leapJ += jdiv(n, 33) * 8 + jdiv(jmod(n, 33) + 3, 4);
    if (jmod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
    const leapG = jdiv(gy, 4) - jdiv((jdiv(gy, 100) + 1) * 3, 4) - 150;
    const march = 20 + leapJ - leapG;
    if (jump - n < 6) n = n - jump + jdiv(jump + 4, 33) * 33;
    let leap = jmod(jmod(n + 1, 33) - 1, 4);
    if (leap === -1) leap = 4;
    return { leap, gy, march };
  }
  function g2d(gy, gm, gd) {
    let d = jdiv((gy + jdiv(gm - 8, 6) + 100100) * 1461, 4) + jdiv(153 * jmod(gm + 9, 12) + 2, 5) + gd - 34840408;
    d = d - jdiv(jdiv(gy + 100100 + jdiv(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
  }
  function d2g(jdn) {
    let j = 4 * jdn + 139361631;
    j = j + jdiv(jdiv(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = jdiv(jmod(j, 1461), 4) * 5 + 308;
    const gd = jdiv(jmod(i, 153), 5) + 1;
    const gm = jmod(jdiv(i, 153), 12) + 1;
    const gy = jdiv(j, 1461) - 100100 + jdiv(8 - gm, 6);
    return { gy, gm, gd };
  }
  function jalaaliToGregorian(jy, jm, jd) { const r = jalCal(jy); return d2g(g2d(r.gy, 3, r.march) + (jm - 1) * 31 - jdiv(jm, 7) * (jm - 7) + jd - 1); }
  function gregorianToJalaali(gy, gm, gd) {
    const jdn = g2d(gy, gm, gd);
    let gy2 = d2g(jdn).gy; let jy = gy2 - 621; const r = jalCal(jy);
    const jdn1f = g2d(gy2, 3, r.march); let k = jdn - jdn1f; let jm, jd;
    if (k >= 0) {
      if (k <= 185) { jm = 1 + jdiv(k, 31); jd = jmod(k, 31) + 1; return { jy, jm, jd }; }
      k -= 186;
    } else { jy -= 1; k += 179; if (r.leap === 1) k += 1; }
    jm = 7 + jdiv(k, 30); jd = jmod(k, 30) + 1;
    return { jy, jm, jd };
  }

  function daysUntilNext(day, month, cal) {
    const now = new Date();
    const todayStripped = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // cal: 'j' = Jalali annual, 'g' = Gregorian annual (default for legacy entries)
    const useJalali = cal === 'j' || cal === 'jalali';
    if (useJalali) {
      const jToday = gregorianToJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
      let g = jalaaliToGregorian(jToday.jy, month, day);
      let target = new Date(g.gy, g.gm - 1, g.gd);
      if (target < todayStripped) {
        g = jalaaliToGregorian(jToday.jy + 1, month, day);
        target = new Date(g.gy, g.gm - 1, g.gd);
      }
      return Math.round((target - todayStripped) / 86400000);
    }
    let target = new Date(now.getFullYear(), month - 1, day);
    if (target < todayStripped) target = new Date(now.getFullYear() + 1, month - 1, day);
    return Math.round((target - todayStripped) / 86400000);
  }

  function renderMarkedDays() {
    if (!uiEls.markDotsRow) return;
    // ردیف بالای ساعت: تا ۳ مناسبت نزدیک (امروز یا آینده)، هر کدوم یه تاگل دایره‌ای
    uiEls.markDotsRow.innerHTML = '';
    if (markedDays.length === 0) {
      uiEls.markDotsRow.style.display = 'none';
    } else {
      const nearestThree = markedDays
        .map(m => ({ ...m, days: daysUntilNext(m.day, m.month, m.cal) }))
        .sort((a, b) => a.days - b.days)
        .slice(0, 3);

      nearestThree.forEach((m, idx) => {
        const wrap = document.createElement('div'); wrap.className = 'ai-mark-dot-wrap';
        const dot = document.createElement('button'); dot.type = 'button';
        dot.className = 'ai-mark-dot' + (m.days === 0 ? ' is-today' : '');
        dot.textContent = String(idx + 1);
        const popup = document.createElement('div'); popup.className = 'ai-mark-dot-popup';
        popup.textContent = m.days === 0
          ? t('markTodayLine').replace('{label}', m.label)
          : t('markUpcomingLine').replace('{label}', m.label).replace('{days}', m.days);
        dot.addEventListener('mousedown', (e) => e.stopPropagation());
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasActive = popup.classList.contains('active');
          uiEls.markDotsRow.querySelectorAll('.ai-mark-dot-popup.active').forEach(p => p.classList.remove('active'));
          if (!wasActive) popup.classList.add('active');
        });
        wrap.appendChild(dot); wrap.appendChild(popup);
        uiEls.markDotsRow.appendChild(wrap);
      });
      uiEls.markDotsRow.style.display = 'flex';
    }

    // لیست مدیریت مناسبت‌ها داخل پنل
    if (!uiEls.markList) return;
    uiEls.markList.innerHTML = '';
    if (markedDays.length === 0) {
      const empty = document.createElement('li'); empty.className = 'ai-mark-empty'; empty.textContent = t('markEmpty');
      uiEls.markList.appendChild(empty);
      return;
    }
    markedDays.slice().sort((a, b) => daysUntilNext(a.day, a.month, a.cal) - daysUntilNext(b.day, b.month, b.cal)).forEach(m => {
      const li = document.createElement('li'); li.className = 'ai-mark-item';
      const span = document.createElement('span'); span.className = 'ai-mark-item-label';
      const dd = String(m.day).padStart(2, '0'); const mm = String(m.month).padStart(2, '0');
      const isJ = m.cal === 'j' || m.cal === 'jalali';
      const dateStr = (isJ && currentLang === 'fa') ? toPersianDigits(`${dd}/${mm}`) : `${dd}/${mm}`;
      span.textContent = `${m.label}  ·  ${dateStr}`;
      const delBtn = document.createElement('button'); delBtn.type = 'button'; delBtn.className = 'ai-mark-item-del'; delBtn.title = t('markDeleteTitle'); delBtn.textContent = '×';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        markedDays = markedDays.filter(x => x.id !== m.id);
        saveMarkedDays(); renderMarkedDays(); showToastNotification(t('markToastDeleted'));
      });
      li.appendChild(span); li.appendChild(delBtn);
      uiEls.markList.appendChild(li);
    });
    // Panel grows a bit wider once the event list gets long, so entries stay comfortable to read/tap
    if (uiEls.markPanel) uiEls.markPanel.classList.toggle('is-grown', markedDays.length > 3);
    // Width/height may have just changed (grew or shrank) — re-clamp so it never sticks off-screen
    if (uiEls.markPanel && uiEls.markPanel.classList.contains('active')) positionMarksPanelSide();
  }

  function positionMarksPanelSide() {
    if (!uiEls.markPanel || !uiEls.markPanel.classList.contains('active')) return;
    const rect = clockPanel.getBoundingClientRect();
    const panelW = (uiEls.markPanel.offsetWidth || 244) + 2; // marks panel actual width + tiny gap
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceRight = vw - rect.right;
    const spaceLeft = rect.left;
    const clockCenterX = rect.left + rect.width / 2;

    // اگر ساعت در نیمهٔ چپ صفحه است → تقویم سمت راست و مماس
    // اگر ساعت در نیمهٔ راست صفحه است → تقویم سمت چپ و مماس
    // در صورت کمبود فضا، طرفی که جا دارد انتخاب می‌شود
    let openLeft;
    if (clockCenterX < vw / 2) {
      openLeft = false; // سمت راست ساعت
      if (spaceRight < panelW && spaceLeft >= panelW) openLeft = true;
    } else {
      openLeft = true; // سمت چپ ساعت
      if (spaceLeft < panelW && spaceRight >= panelW) openLeft = false;
    }

    uiEls.markPanel.classList.toggle('side-left', openLeft);

    // Vertical clamp: the panel defaults to top-aligned with the clock (CSS top:0), but if the
    // clock sits low/high on screen the (now taller) panel can run off the viewport — shift it
    // up/down with an inline offset so it always stays fully visible.
    const margin = 10;
    const panelH = uiEls.markPanel.offsetHeight || 300;
    let topOffset = 0;
    if (rect.top + panelH > vh - margin) topOffset = (vh - margin) - panelH - rect.top;
    if (rect.top + topOffset < margin) topOffset = margin - rect.top;
    uiEls.markPanel.style.top = `${topOffset}px`;
  }

  uiEls.markToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    uiEls.markPanel.classList.toggle('active');
    const isOpen = uiEls.markPanel.classList.contains('active');
    uiEls.markToggle.classList.toggle('is-open', isOpen);
    if (!isOpen) {
      closeDualPicker();
      uiEls.markPanel.classList.remove('side-left');
    } else {
      positionMarksPanelSide();
    }
  });

  // --- Smart Dual-Calendar: single omni-input + NLP + dual grid picker ---
  let smartDateISO = ''; // hidden canonical YYYY-MM-DD (Gregorian)
  let dualViewYear = null, dualViewMonth = null; // 1-based month of currently shown Gregorian month
  let dualPickerOpen = false;

  function toAsciiDigits(str) {
    return String(str).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
              .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  }
  function toPersianDigits(str) { return String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]); }

  function isoFromYMD(y, m, d) {
    return `${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
  function formatDisplayFromISO(iso, preferJalali) {
    if (!iso) return '';
    const [gy, gm, gd] = iso.split('-').map(Number);
    if (preferJalali) {
      const j = gregorianToJalaali(gy, gm, gd);
      const text = `${j.jy}/${String(j.jm).padStart(2,'0')}/${String(j.jd).padStart(2,'0')}`;
      return currentLang === 'fa' ? toPersianDigits(text) : text;
    }
    return iso;
  }
  function setSmartDate(iso, silent) {
    smartDateISO = iso || '';
    if (!uiEls.smartDateInput) return;
    if (!iso) { uiEls.smartDateInput.value = ''; uiEls.smartDateInput.classList.remove('invalid'); return; }
    const preferJalali = currentLang === 'fa';
    uiEls.smartDateInput.value = formatDisplayFromISO(iso, preferJalali);
    uiEls.smartDateInput.classList.remove('invalid');
    if (!silent && dualPickerOpen) renderDualGrid();
  }

  function parseSmartDateInput(raw) {
    const trimmed = (raw || '').trim();
    if (!trimmed) return { ok: false, empty: true };

    const lower = toAsciiDigits(trimmed).toLowerCase().replace(/\s+/g, ' ');

    const todayWords = ['today', 'امروز'];
    const tomorrowWords = ['tomorrow', 'فردا'];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (todayWords.some(w => lower === w || lower === toAsciiDigits(w))) {
      return { ok: true, iso: isoFromYMD(today.getFullYear(), today.getMonth()+1, today.getDate()), nlp: 'today', source: currentLang === 'fa' ? 'jalali' : 'gregorian' };
    }
    if (tomorrowWords.some(w => lower === w || lower === toAsciiDigits(w))) {
      const tmr = new Date(today); tmr.setDate(tmr.getDate() + 1);
      return { ok: true, iso: isoFromYMD(tmr.getFullYear(), tmr.getMonth()+1, tmr.getDate()), nlp: 'tomorrow', source: currentLang === 'fa' ? 'jalali' : 'gregorian' };
    }

    let cleaned = toAsciiDigits(trimmed).replace(/[.\-]/g, '/').replace(/[^\d/]/g, '');
    const parts = cleaned.split('/').filter(Boolean).map(p => parseInt(p, 10));

    function isJalaliYear(y) { const s = String(y); return s.startsWith('13') || s.startsWith('14') || (y >= 1300 && y <= 1499); }
    function isGregYear(y) { const s = String(y); return s.startsWith('19') || s.startsWith('20') || y >= 1900; }

    // Resolve Y, M, D from flexible order: YYYY/MM/DD or DD/MM/YYYY (common in Iran)
    let y, m, d, source = null;
    if (parts.length === 3) {
      const [a, b, c] = parts;
      if (isJalaliYear(a) || isGregYear(a)) {
        // YYYY/MM/DD
        y = a; m = b; d = c;
        source = isJalaliYear(a) ? 'jalali' : 'gregorian';
      } else if (isJalaliYear(c) || isGregYear(c)) {
        // DD/MM/YYYY  (Iranian everyday form: 11/5/1405)
        d = a; m = b; y = c;
        source = isJalaliYear(c) ? 'jalali' : 'gregorian';
      } else if (a < 100 && c <= 31) {
        // short year first? rare — treat as YY/MM/DD
        y = currentLang === 'fa' ? (1400 + a) : (2000 + a);
        m = b; d = c;
        source = currentLang === 'fa' ? 'jalali' : 'gregorian';
      } else if (c < 100) {
        // DD/MM/YY
        d = a; m = b; y = currentLang === 'fa' ? (1400 + c) : (2000 + c);
        source = currentLang === 'fa' ? 'jalali' : 'gregorian';
      } else {
        return { ok: false };
      }
      if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return { ok: false };

      if (source === 'jalali') {
        try {
          const g = jalaaliToGregorian(y, m, d);
          if (!g || !g.gy) return { ok: false };
          return { ok: true, iso: isoFromYMD(g.gy, g.gm, g.gd), source: 'jalali', jy: y, jm: m, jd: d };
        } catch (e) { return { ok: false }; }
      }
      try {
        const j = gregorianToJalaali(y, m, d);
        if (!j) return { ok: false };
        return { ok: true, iso: isoFromYMD(y, m, d), source: 'gregorian', jy: j.jy, jm: j.jm, jd: j.jd };
      } catch (e) { return { ok: false }; }
    }

    // Compact 8-digit: always YYYYMMDD
    const digitsOnly = toAsciiDigits(trimmed).replace(/\D/g, '');
    if (digitsOnly.length === 8) {
      y = parseInt(digitsOnly.slice(0,4),10); m = parseInt(digitsOnly.slice(4,6),10); d = parseInt(digitsOnly.slice(6,8),10);
      if (m < 1 || m > 12 || d < 1 || d > 31) return { ok: false };
      if (isJalaliYear(y)) {
        try {
          const g = jalaaliToGregorian(y, m, d);
          return { ok: true, iso: isoFromYMD(g.gy, g.gm, g.gd), source: 'jalali', jy: y, jm: m, jd: d };
        } catch (e) { return { ok: false }; }
      }
      const j = gregorianToJalaali(y, m, d);
      return { ok: true, iso: isoFromYMD(y, m, d), source: 'gregorian', jy: j.jy, jm: j.jm, jd: j.jd };
    }

    return { ok: false };
  }

  let smartDateMeta = null; // { source, jy, jm, jd } from last successful parse

  function applySmartDateFromInput() {
    const raw = uiEls.smartDateInput.value;
    const result = parseSmartDateInput(raw);
    if (result.empty) { smartDateISO = ''; smartDateMeta = null; uiEls.smartDateInput.classList.remove('invalid'); return; }
    if (result.ok) {
      smartDateMeta = { source: result.source, jy: result.jy, jm: result.jm, jd: result.jd };
      setSmartDate(result.iso);
    } else if (raw.trim().length >= 6) {
      uiEls.smartDateInput.classList.add('invalid');
    } else {
      uiEls.smartDateInput.classList.remove('invalid');
    }
  }

  uiEls.smartDateInput.addEventListener('input', () => {
    applySmartDateFromInput();
  });
  uiEls.smartDateInput.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); applySmartDateFromInput(); closeDualPicker(); }
    if (e.key === 'Escape') { e.preventDefault(); closeDualPicker(); }
  });
  uiEls.smartDateInput.addEventListener('blur', () => {
    if (smartDateISO) setSmartDate(smartDateISO);
  });

  const JALALI_MONTHS_FA = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const GREG_MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const GREG_MONTHS_FA = ['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
  const WEEKDAYS_FA = ['ش','ی','د','س','چ','پ','ج'];
  const WEEKDAYS_EN = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  function daysInGregorianMonth(y, m) { return new Date(y, m, 0).getDate(); }

  function closeDualPicker() {
    dualPickerOpen = false;
    if (uiEls.dualPicker) { uiEls.dualPicker.hidden = true; uiEls.dualPicker.style.display = 'none'; }
    if (uiEls.markPanel) uiEls.markPanel.classList.remove('picker-open');
    if (uiEls.markPanel && uiEls.markPanel.classList.contains('active')) positionMarksPanelSide();
  }
  function openDualPicker() {
    const base = smartDateISO ? new Date(smartDateISO + 'T12:00:00') : new Date();
    dualViewYear = base.getFullYear();
    dualViewMonth = base.getMonth() + 1;
    dualPickerOpen = true;
    uiEls.dualPicker.hidden = false;
    uiEls.dualPicker.style.display = 'block';
    if (uiEls.markPanel) uiEls.markPanel.classList.add('picker-open');
    renderDualGrid();
    positionMarksPanelSide(); // the grid adds significant height — re-clamp so it doesn't run off-screen
  }

  function renderDualGrid() {
    if (!uiEls.dualGrid || dualViewYear == null) return;
    const preferJalali = currentLang === 'fa';
    const y = dualViewYear, m = dualViewMonth;
    const first = new Date(y, m - 1, 1);
    const startDow = first.getDay();
    const offset = preferJalali ? (startDow + 1) % 7 : startDow;
    const totalDays = daysInGregorianMonth(y, m);

    // One grid = one real (Gregorian) month, always — title just names that month.
    // (Its Jalali equivalent can span two Jalali months, but the grid itself never mixes days
    // from two different months, so the title shouldn't imply that either.)
    uiEls.dualMonthLabel.textContent = preferJalali
      ? `${GREG_MONTHS_FA[m - 1]} ${toPersianDigits(y)}`
      : `${GREG_MONTHS_EN[m - 1]} ${y}`;

    const wd = preferJalali ? WEEKDAYS_FA : WEEKDAYS_EN;
    uiEls.dualWeekdays.innerHTML = wd.map(d => `<span class="ai-dual-wd">${d}</span>`).join('');

    const todayISO = isoFromYMD(new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate());

    // Precompute marked day keys for quick lookup in this month
    function isMarkedDay(gy, gm, gd, jy, jm, jd) {
      return markedDays.some(mk => {
        const isJ = mk.cal === 'j' || mk.cal === 'jalali';
        if (isJ) return mk.day === jd && mk.month === jm;
        return mk.day === gd && mk.month === gm;
      });
    }

    let html = '';
    for (let i = 0; i < offset; i++) html += '<div class="day-cell empty"></div>';
    for (let d = 1; d <= totalDays; d++) {
      const iso = isoFromYMD(y, m, d);
      const j = gregorianToJalaali(y, m, d);
      const isToday = iso === todayISO;
      const isSelected = iso === smartDateISO;
      const isMarked = isMarkedDay(y, m, d, j.jy, j.jm, j.jd);
      const primary = preferJalali ? toPersianDigits(j.jd) : String(d);
      const sub = preferJalali ? String(d) : String(j.jd);
      const cls = ['day-cell'];
      if (isToday) cls.push('is-today');
      if (isMarked) cls.push('is-marked');
      if (isSelected) cls.push('is-selected');
      html += `<div class="${cls.join(' ')}" data-iso="${iso}" role="button" tabindex="0">
        <span class="primary-day">${primary}</span>
        <span class="sub-day">${sub}</span>
      </div>`;
    }
    uiEls.dualGrid.innerHTML = html;

    uiEls.dualGrid.querySelectorAll('.day-cell[data-iso]').forEach(cell => {
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        const iso = cell.dataset.iso;
        const [gy, gm, gd] = iso.split('-').map(Number);
        const j = gregorianToJalaali(gy, gm, gd);
        smartDateMeta = { source: currentLang === 'fa' ? 'jalali' : 'gregorian', jy: j.jy, jm: j.jm, jd: j.jd };
        setSmartDate(iso);
        closeDualPicker();
        uiEls.smartDateInput.focus();
      });
    });
  }

  uiEls.smartDatePickerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dualPickerOpen) closeDualPicker(); else openDualPicker();
  });
  uiEls.dualPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    dualViewMonth -= 1;
    if (dualViewMonth < 1) { dualViewMonth = 12; dualViewYear -= 1; }
    renderDualGrid();
  });
  uiEls.dualNext.addEventListener('click', (e) => {
    e.stopPropagation();
    dualViewMonth += 1;
    if (dualViewMonth > 12) { dualViewMonth = 1; dualViewYear += 1; }
    renderDualGrid();
  });

 [uiEls.markToggle, uiEls.markLabelInput, uiEls.smartDateInput, uiEls.smartDatePickerBtn, uiEls.markAddBtn, uiEls.markPanel, uiEls.markList, uiEls.dualPicker].forEach(el => {
    if (!el) return;
    el.addEventListener('mousedown', (e) => e.stopPropagation());
    el.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });
    el.addEventListener('click', (e) => e.stopPropagation());
  });
  uiEls.markLabelInput.addEventListener('keydown', (e) => e.stopPropagation());

  document.addEventListener('mousedown', (e) => {
    if (!dualPickerOpen) return;
    if (uiEls.dualPicker.contains(e.target) || uiEls.smartDatePickerBtn.contains(e.target) || uiEls.smartDateInput.contains(e.target)) return;
    closeDualPicker();
  });

  uiEls.markAddBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const label = uiEls.markLabelInput.value.trim();
    applySmartDateFromInput();
    const dateVal = smartDateISO;
    if (!label || !dateVal) {
      showToastNotification(t('markInvalid'), true);
      if (!dateVal) uiEls.smartDateInput.classList.add('invalid');
      return;
    }
    // Prefer Jalali annual storage when input was Jalali or app language is FA
    let day, month, cal;
    if (smartDateMeta && (smartDateMeta.source === 'jalali' || currentLang === 'fa')) {
      if (smartDateMeta.jm && smartDateMeta.jd) {
        day = smartDateMeta.jd; month = smartDateMeta.jm; cal = 'j';
      } else {
        const [gy, gm, gd] = dateVal.split('-').map(Number);
        const j = gregorianToJalaali(gy, gm, gd);
        day = j.jd; month = j.jm; cal = 'j';
      }
    } else {
      const parts = dateVal.split('-');
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
      cal = 'g';
    }
    if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
      showToastNotification(t('markInvalid'), true);
      return;
    }
    markedDays.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), label, day, month, cal });
    saveMarkedDays(); renderMarkedDays();
    uiEls.markLabelInput.value = '';
    smartDateMeta = null;
    setSmartDate('');
    closeDualPicker();
    showToastNotification(t('markToastAdded'));
  });

  function adjustClockPosition() {
      if (!clockPanel.classList.contains('active')) return;
      if (clockManuallyPositioned) return; // کاربر خودش کادر ساعت را جابه‌جا کرده

      // مثل یادداشت: چسبیده به هاب اصلی (فاصلهٔ کم)، نه با زاویه و فاصلهٔ دور
      const rect = hub.getBoundingClientRect();
      const panelWidth = clockPanel.offsetWidth || 244;
      const panelHeight = clockPanel.offsetHeight || 174;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const hubCenterX = rect.left + rect.width / 2;
      const hubCenterY = rect.top + rect.height / 2;
      const GAP = 12; // تقریباً چسبیده به ابزارک شناور

      // اگر پنل مناسبت‌ها باز است، عرض اضافه برای انتخاب سمت در نظر گرفته می‌شود
      const marksOpen = uiEls.markPanel && uiEls.markPanel.classList.contains('active');
      const marksW = marksOpen ? 224 : 0;

      let leftPos, topPos;

      if (hubCenterX < vw * 0.40) {
        // هاب سمت چپ → ساعت سمت راست هاب (تقویم بعداً باز هم به راست/چپ خودش می‌رود)
        leftPos = rect.right + GAP;
        topPos = hubCenterY - panelHeight / 2;
      } else if (hubCenterX > vw * 0.60) {
        // هاب سمت راست → ساعت سمت چپ هاب
        leftPos = rect.left - panelWidth - GAP;
        topPos = hubCenterY - panelHeight / 2;
      } else {
        // هاب وسط → ترجیح سمت راست؛ اگر جا نبود سمت چپ
        leftPos = rect.right + GAP;
        topPos = hubCenterY - panelHeight / 2;
        if (leftPos + panelWidth + marksW > vw - 12) {
          leftPos = rect.left - panelWidth - GAP;
        }
      }

      // اگر هنوز بیرون صفحه است، طرف دیگر
      if (leftPos < 12) leftPos = rect.right + GAP;
      if (leftPos + panelWidth > vw - 12) leftPos = rect.left - panelWidth - GAP;
      if (leftPos < 12) leftPos = 12;
      if (leftPos + panelWidth > vw - 12) leftPos = vw - panelWidth - 12;

      if (topPos < 12) topPos = 12;
      if (topPos + panelHeight > vh - 12) topPos = vh - panelHeight - 12;

      clockPanel.style.left = `${leftPos}px`;
      clockPanel.style.top = `${topPos}px`;
      if (typeof positionMarksPanelSide === 'function') positionMarksPanelSide();
  }
  
  clockToggleDot.addEventListener('click', (e) => {
      e.stopPropagation(); closeTree(); const isActive = clockPanel.classList.contains('active'); closeAllPanelsExcept(''); 
      if (!isActive) {
        // هر بار باز شدن: مثل یادداشت کنار هاب لنگر شود (موقعیت ذخیره‌شدهٔ دور قبلی نادیده)
        clockManuallyPositioned = false;
        try { if (chrome.runtime?.id) chrome.storage.sync.remove(['clockCustomX', 'clockCustomY']); } catch (err) {}
        clockPanel.classList.add('active');
        root.classList.add('show-clock');
        updateClockAge();
        renderMarkedDays();
        adjustClockPosition();
      }
      resetToggleTimeout();
  });

  let isClockDragging = false;
  let clockDragMoved = false;
  let clockStartX, clockStartY, clockStartLeft, clockStartTop;
  let clockManuallyPositioned = false;

  function startClockDrag(clientX, clientY) {
    isClockDragging = true; clockDragMoved = false;
    clockStartX = clientX; clockStartY = clientY;

    // فقط موقعیت خودِ کادر ساعت گرفته می‌شود — نه کل سیستم/هاب
    clockStartLeft = clockPanel.offsetLeft;
    clockStartTop = clockPanel.offsetTop;

    clockPanel.style.transition = 'none'; clockPanel.classList.add('is-dragging');
  }

  clockPanel.addEventListener('mousedown', (e) => {
    e.stopPropagation(); startClockDrag(e.clientX, e.clientY);
  });
  clockPanel.addEventListener('touchstart', (e) => {
    e.stopPropagation(); startClockDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  document.addEventListener('mousemove', (e) => {
    if (!isClockDragging) return;
    const dx = e.clientX - clockStartX; const dy = e.clientY - clockStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) clockDragMoved = true;

    // فقط کادر ساعت جابه‌جا می‌شود؛ ابزار اصلی (هاب) سرجایش می‌ماند و پنهان نمی‌شود
    clockPanel.style.left = `${clockStartLeft + dx}px`;
    clockPanel.style.top = `${clockStartTop + dy}px`;
    if (clockDragMoved) clockManuallyPositioned = true;
  });
  document.addEventListener('touchmove', (e) => {
    if (!isClockDragging) return;
    const dx = e.touches[0].clientX - clockStartX; const dy = e.touches[0].clientY - clockStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) clockDragMoved = true;

    clockPanel.style.left = `${clockStartLeft + dx}px`;
    clockPanel.style.top = `${clockStartTop + dy}px`;
    if (clockDragMoved) clockManuallyPositioned = true;
  }, { passive: false });

  function endClockDrag() {
    if (isClockDragging) {
      isClockDragging = false; 
      clockPanel.style.transition = ''; clockPanel.classList.remove('is-dragging');
      if (clockDragMoved) {
        try {
          if (chrome.runtime?.id) {
            chrome.storage.sync.set({ clockCustomX: parseInt(clockPanel.style.left, 10), clockCustomY: parseInt(clockPanel.style.top, 10) });
          }
        } catch (err) {}
      }
      if (typeof positionMarksPanelSide === 'function') positionMarksPanelSide();
    }
  }
  document.addEventListener('mouseup', endClockDrag);
  document.addEventListener('touchend', endClockDrag);

  clockPanel.addEventListener('click', (e) => {
      e.stopPropagation();
      // هاب دیگر مخفی نمی‌شود؛ کلیک روی ساعت نباید هاب را جابه‌جا کند یا پنل را ببندد
  });

  function saveTodos() { try { if (chrome.runtime?.id) chrome.storage.sync.set({ aiTreeTodos: todosData }); } catch(e){} }

  function migrateTodos() {
    let changed = false;
    todosData.forEach(todo => {
      if (!todo.type) { todo.type = 'daily'; changed = true; }
      if (!todo.createdAt) { todo.createdAt = Date.now(); changed = true; }
    });
    return changed;
  }

  function pruneExpiredDailyTodos() {
    const before = todosData.length;
    const now = Date.now();
    todosData = todosData.filter(todo => !(todo.type === 'daily' && (now - (todo.createdAt || now)) >= TODO_DAILY_TTL_MS));
    if (todosData.length !== before) { saveTodos(); return true; }
    return false;
  }

  function setAddForTomorrow(val) {
    addForTomorrow = val;
    uiEls.todoWhenToday.classList.toggle('active', !val);
    uiEls.todoWhenTomorrow.classList.toggle('active', val);
    renderTodos();
  }

  function switchTodoTab(type) {
    activeTodoTab = type;
    uiEls.todoTabDaily.classList.toggle('active', type === 'daily');
    uiEls.todoTabGoal.classList.toggle('active', type === 'goal');
    todoPanel.classList.toggle('goal-mode', type === 'goal');
    uiEls.todoInput.placeholder = type === 'daily' ? t('todoDailyInput') : t('todoGoalInput');
    uiEls.todoWhenRow.style.display = type === 'daily' ? '' : 'none';
    if (type !== 'daily') setAddForTomorrow(false);
    renderTodos();
  }
  uiEls.todoWhenToday.addEventListener('click', (e) => { e.stopPropagation(); setAddForTomorrow(false); });
  uiEls.todoWhenTomorrow.addEventListener('click', (e) => { e.stopPropagation(); setAddForTomorrow(true); });

  let manualQuoteIndex = null;
  let isQuoteCollapsed = true; // Hidden by default — shows only the closed "🌙" tab until the user opens it

  function renderDailyQuote() {
    const idx = manualQuoteIndex !== null ? manualQuoteIndex : getDailyQuoteIndex();
    const q = DAILY_QUOTES[idx];
    if (uiEls.todoQuoteFa) {
      uiEls.todoQuoteFa.textContent = q.text || '';
      uiEls.todoQuoteFa.dir = 'rtl';
    }
    if (uiEls.todoQuoteTitle) {
      uiEls.todoQuoteTitle.textContent = q.ref || '';
      uiEls.todoQuoteTitle.style.display = q.ref ? '' : 'none';
    }
    if (uiEls.todoQuote) uiEls.todoQuote.classList.toggle('is-collapsed', isQuoteCollapsed);
    if (uiEls.todoQuoteChevron) uiEls.todoQuoteChevron.textContent = isQuoteCollapsed ? '▼' : '▲';
    
    // کدی که آیکون خورشید و ماه را تغییر می‌دهد:
    if (uiEls.todoQuoteLabel) {
      uiEls.todoQuoteLabel.textContent = isQuoteCollapsed ? '🌙' : '☀️';
    }

    if (uiEls.todoQuoteTab) {
      uiEls.todoQuoteTab.title = isQuoteCollapsed
        ? (currentLang === 'fa' ? 'نمایش آیه' : 'Show verse')
        : (currentLang === 'fa' ? 'جمع کردن آیه' : 'Hide verse');
    }
  }

  function toggleQuoteCollapse(e) {
    if (e) e.stopPropagation();
    isQuoteCollapsed = !isQuoteCollapsed;
    renderDailyQuote();
    if (typeof adjustTodoPosition === 'function') adjustTodoPosition();
  }

  function cycleToRandomQuote(e) {
    if (e) e.stopPropagation();
    if (isQuoteCollapsed) return; // body is invisible/inert while collapsed — nothing to cycle
    const currentIdx = manualQuoteIndex !== null ? manualQuoteIndex : getDailyQuoteIndex();
    let next = currentIdx;
    if (DAILY_QUOTES.length > 1) {
      while (next === currentIdx) next = Math.floor(Math.random() * DAILY_QUOTES.length);
    }
    manualQuoteIndex = next;
    uiEls.todoQuote.classList.remove('pulse');
    void uiEls.todoQuote.offsetWidth;
    uiEls.todoQuote.classList.add('pulse');
    renderDailyQuote();
    if (typeof adjustTodoPosition === 'function') adjustTodoPosition();
  }

  if (uiEls.todoQuoteTab) {
    uiEls.todoQuoteTab.addEventListener('click', toggleQuoteCollapse);
  }
  // Left-click on the verse body itself cycles to a new random verse (previously this was right-click only)
  if (uiEls.todoQuoteBody) {
    uiEls.todoQuoteBody.addEventListener('click', cycleToRandomQuote);
  }

  function renderTodos() {
    pruneExpiredDailyTodos();
    renderDailyQuote();
    const list = document.getElementById('ai-todo-list'); const countEl = document.getElementById('ai-todo-count'); list.innerHTML = '';
    const now = Date.now();
    const visibleTodos = todosData.filter(td => {
      if ((td.type || 'daily') !== activeTodoTab) return false;
      if (activeTodoTab !== 'daily') return true;
      const isTomorrow = (td.createdAt || now) > now;
      return addForTomorrow ? isTomorrow : !isTomorrow;
    });
    const pendingCount = visibleTodos.filter(td => !td.done).length; if (countEl) countEl.textContent = `${pendingCount} ${activeTodoTab === 'goal' ? t('todoGoalPending') : t('todoPending')}`;

    if (visibleTodos.length === 0) {
      const empty = document.createElement('li'); empty.className = 'ai-todo-empty';
      empty.textContent = activeTodoTab === 'daily' ? (addForTomorrow ? t('todoNoTomorrow') : t('todoNoDaily')) : t('todoNoGoals');
      list.appendChild(empty); adjustTodoPosition(); return;
    }

    visibleTodos.forEach((todo) => {
      const idx = todosData.indexOf(todo);
      const isGoal = (todo.type || 'daily') === 'goal';
      const li = document.createElement('li'); li.className = (isGoal ? 'ai-goal-item' : 'ai-todo-item') + (todo.done ? ' done' : '');
      const check = document.createElement('div'); check.className = (isGoal ? 'ai-goal-check' : 'ai-todo-check') + (todo.done ? ' checked' : '');
      if (isGoal) check.innerHTML = '<span class="ai-goal-star">✨</span>';
      const text = document.createElement('span'); text.className = isGoal ? 'ai-goal-text' : 'ai-todo-text'; text.textContent = String(todo.text || '');
      const copyButton = document.createElement('div'); copyButton.className = isGoal ? 'ai-goal-copy' : 'ai-todo-copy'; copyButton.title = t('todoCopyTitle');
      copyButton.innerHTML = `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
      const isScheduledTomorrow = !isGoal && (todo.createdAt || now) > now;
      const postponeButton = (!isGoal && !isScheduledTomorrow) ? document.createElement('div') : null;
      if (postponeButton) { postponeButton.className = 'ai-todo-postpone'; postponeButton.title = t('todoPostponeTitle'); postponeButton.textContent = '📅'; }
      const deleteButton = document.createElement('div'); deleteButton.className = isGoal ? 'ai-goal-del' : 'ai-todo-del'; deleteButton.title = t('todoDelTitle'); deleteButton.textContent = '✕';
      li.append(check, text, copyButton);
      if (postponeButton) li.append(postponeButton);
      li.append(deleteButton);

      if (!isGoal) {
        const expiry = document.createElement('span'); expiry.className = 'ai-todo-expiry';
        if ((todo.createdAt || now) > now) {
          expiry.classList.add('scheduled'); expiry.textContent = t('todoScheduledTomorrow');
        } else {
          const remainMs = TODO_DAILY_TTL_MS - (now - (todo.createdAt || now));
          const remainH = Math.max(0, Math.floor(remainMs / 3600000));
          expiry.textContent = remainH < 1 ? t('todoExpiresSoon') : t('todoExpiresIn').replace('{h}', remainH);
        }
        li.appendChild(expiry);
      }

      check.onclick = (e) => { e.stopPropagation(); todo.done = !todo.done; saveTodos(); renderTodos(); };
      copyButton.onclick = (e) => {
        e.stopPropagation();
        const finish = () => showToastNotification(t('toastTodoCopied'));
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(todo.text || '').then(finish).catch(finish); }
        else { finish(); }
      };
      if (postponeButton) {
        postponeButton.onclick = (e) => {
          e.stopPropagation();
          const tmrw = new Date(); tmrw.setHours(24, 0, 0, 0);
          todo.createdAt = tmrw.getTime();
          saveTodos(); renderTodos(); showToastNotification(t('toastTodoPostponed'));
        };
      }
      deleteButton.onclick = (e) => {
        e.stopPropagation();
        const [deletedTodo] = todosData.splice(idx, 1);
        saveTodos(); renderTodos(); showToastNotification(t('toastTodoDeleted'), true);
        setUndoState('todo', { item: deletedTodo, index: idx });
      };
      list.appendChild(li);
    });
    adjustTodoPosition(); 
  }

  setInterval(() => { if (pruneExpiredDailyTodos() && todoPanel.classList.contains('active')) renderTodos(); }, 5 * 60 * 1000);

  document.getElementById('ai-todo-add-btn').onclick = (e) => {
    e.stopPropagation(); const input = document.getElementById('ai-todo-input'); const text = input.value.trim();
    if (text) {
      let createdAt = Date.now();
      if (activeTodoTab === 'daily' && addForTomorrow) {
        const tmrw = new Date(); tmrw.setHours(24, 0, 0, 0); 
        createdAt = tmrw.getTime();
      }
      todosData.push({ text, done: false, type: activeTodoTab, createdAt }); input.value = ''; saveTodos(); renderTodos();
    }
  };
  document.getElementById('ai-todo-input').addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') document.getElementById('ai-todo-add-btn').click(); });
  uiEls.todoTabDaily.addEventListener('click', (e) => { e.stopPropagation(); switchTodoTab('daily'); });
  uiEls.todoTabGoal.addEventListener('click', (e) => { e.stopPropagation(); switchTodoTab('goal'); });
  
  function adjustTodoPosition() {
      if (!todoPanel.classList.contains('active')) return;
      const rect = todoToggleDot.getBoundingClientRect(); const panelWidth = 280; const panelHeight = todoPanel.offsetHeight || 300; const vw = window.innerWidth; const vh = window.innerHeight;
      let leftPos = rect.right + 30; if (leftPos + panelWidth > vw - 16) leftPos = rect.left - panelWidth - 30; 
      let topPos = rect.top - (panelHeight / 2); if (topPos + panelHeight > vh - 16) topPos = vh - panelHeight - 16; if (topPos < 16) topPos = 16;
      todoPanel.style.left = `${leftPos}px`; todoPanel.style.top = `${topPos}px`;
  }
  todoToggleDot.addEventListener('click', (e) => {
      if (!chrome.runtime?.id) return; e.stopPropagation(); closeTree(); const isActive = todoPanel.classList.contains('active'); closeAllPanelsExcept(''); 
      if (!isActive) {
        todoPanel.classList.add('active'); root.classList.add('show-todo');
        uiEls.todoTabDaily.classList.toggle('active', activeTodoTab === 'daily');
        uiEls.todoTabGoal.classList.toggle('active', activeTodoTab === 'goal');
        todoPanel.classList.toggle('goal-mode', activeTodoTab === 'goal');
        uiEls.todoInput.placeholder = activeTodoTab === 'daily' ? t('todoDailyInput') : t('todoGoalInput');
        renderTodos(); adjustTodoPosition(); setTimeout(() => document.getElementById('ai-todo-input').focus(), 50);
      } resetToggleTimeout();
  });

  function allBookmarksFlat() {
    const out = [];
    [linksData, linksData2, linksData3].forEach((arr, hubIdx) => {
      for (let i = 0; i < arr.length; i++) { if (arr[i] && arr[i].url) out.push({ link: arr[i], hub: hubIdx + 1, idx: i }); }
    });
    return out;
  }

  // امتیازدهی فازیِ سبک: مچ مستقیم بالاترین امتیاز را می‌گیرد؛ در غیر این صورت
  // اگر حروف کوئری به همان ترتیب (نه لزوماً پشت‌سرهم) در متن پیدا شوند امتیاز نسبی می‌گیرد.
  function fuzzyScore(text, query) {
    text = (text || '').toLowerCase(); query = query.toLowerCase();
    if (!query) return 0;
    if (text.includes(query)) return 1000 - text.length;
    let qi = 0, score = 0, lastIdx = -1;
    for (let i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) {
        score += (lastIdx === i - 1) ? 5 : 1;
        lastIdx = i; qi++;
      }
    }
    return qi === query.length ? score - text.length * 0.1 : -1;
  }

  function renderSearchResults(rawQuery) {
    const list = uiEls.searchResults; list.innerHTML = '';
    const query = (rawQuery || '').trim().toLowerCase();
    if (!query) { adjustSearchPosition(); return; }

    const matches = allBookmarksFlat()
      .map(({ link, hub, idx }) => ({ link, hub, idx, score: fuzzyScore(link.label, query) }))
      .filter(x => x.score > -1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    if (matches.length === 0) {
      const empty = document.createElement('li'); empty.className = 'ai-search-empty'; empty.textContent = t('searchNoResults');
      list.appendChild(empty);
    } else {
      matches.forEach(({ link, hub, idx }) => {
        const li = document.createElement('li'); li.className = 'ai-search-result';

        // رنگ همان تیرِ بوک‌مارک در چرخ - همیشه محاسبه می‌شود، هرگز خالی نمی‌ماند
        const colorDot = document.createElement('span'); colorDot.className = 'ai-search-result-color';
        const colorSet = colorSetForBookmark(link, idx);
        colorDot.style.background = colorSet.border; colorDot.style.boxShadow = `0 0 5px ${colorSet.glow}`;

        const fav = document.createElement('img'); fav.className = 'ai-search-result-favicon'; fav.src = getFaviconUrl(link.url);
        fav.addEventListener('error', () => fav.style.display = 'none');
        const span = document.createElement('span'); span.className = 'ai-search-result-label'; span.textContent = link.label;

        // بج کهکشان همیشه و جدا از بج ستاره نشان داده می‌شود تا هیچ‌وقت گم نشود
        const badges = document.createElement('span'); badges.className = 'ai-search-result-badges';
        const hubStr = currentLang === 'fa' ? toPersianDigits(hub) : String(hub);
        const galaxyBadge = document.createElement('span'); galaxyBadge.className = 'ai-search-result-galaxy';
        galaxyBadge.textContent = t('searchMetaHubOnly').replace('{hub}', hubStr);
        badges.appendChild(galaxyBadge);
        if (link.importance != null) {
          const starBadge = document.createElement('span'); starBadge.className = 'ai-search-result-stars';
          starBadge.textContent = '★'.repeat(Math.max(1, Math.min(5, link.importance)));
          badges.appendChild(starBadge);
        }

        li.appendChild(colorDot); li.appendChild(fav); li.appendChild(span); li.appendChild(badges);

        // ویرایش/حذف فقط برای بوک‌مارک‌های واقعی (نه ۴ اسلوت ثابت هوش مصنوعی)
        if (idx >= 4) {
          const actions = document.createElement('span'); actions.className = 'ai-search-result-actions';
          const editBtn = document.createElement('button'); editBtn.type = 'button'; editBtn.className = 'ai-search-action-btn ai-search-action-edit';
          editBtn.title = t('searchEditBtn'); editBtn.setAttribute('aria-label', t('searchEditBtn')); editBtn.textContent = '✎';
          editBtn.addEventListener('click', (e) => { e.stopPropagation(); editBookmarkFromSearch(link, hub, idx); });
          const delBtn = document.createElement('button'); delBtn.type = 'button'; delBtn.className = 'ai-search-action-btn ai-search-action-delete';
          delBtn.title = t('searchDeleteBtn'); delBtn.setAttribute('aria-label', t('searchDeleteBtn')); delBtn.textContent = '✕';
          delBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteBookmarkFromSearch(link, hub); });
          actions.appendChild(editBtn); actions.appendChild(delBtn);
          li.appendChild(actions);
        }

        li.addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(link.url, '_blank', 'noopener,noreferrer');
          closeAllPanelsExcept(''); closeTree();
        });
        list.appendChild(li);
      });
    }
    adjustSearchPosition();
  }

  // باز کردن فرم ویرایش برای نتیجه‌ی جستجو: ابتدا به کهکشانِ واقعیِ بوک‌مارک سوییچ می‌کنیم
  // (باگ قبلی همین بود؛ فرم همیشه از روی کهکشانِ در حالِ نمایش می‌خواند، نه کهکشانِ واقعیِ آیتم)
  function editBookmarkFromSearch(link, hubIdx, idxInHub) {
    closeAllPanelsExcept('');
    if (currentHubIndex !== hubIdx) switchHub(hubIdx);
    openEditForm(idxInHub, null);
  }

  // حذف مستقیم از نتایج جستجو، با همان الگوی Undo موجود در برنامه
  function deleteBookmarkFromSearch(link, hubIdx) {
    const arr = hubData(hubIdx);
    const pos = arr.indexOf(link);
    if (pos === -1) return;
    const deletedItem = arr.splice(pos, 1)[0]; deletedItem._hub = hubIdx;
    saveLinksAll();
    if (currentHubIndex === hubIdx) renderSpiral();
    if (typeof renderTierDots === 'function') renderTierDots();
    showToastNotification(t('toastDeleted'), true);
    setUndoState('bookmark', deletedItem, hubIdx);
    renderSearchResults(uiEls.searchInput.value);
  }

  function adjustSearchPosition() {
      if (!searchPanel.classList.contains('active')) return;
      const rect = hub.getBoundingClientRect(); const panelWidth = 400; const panelHeight = searchPanel.offsetHeight || 260; const vw = window.innerWidth; const vh = window.innerHeight;
      const hubCenterX = rect.left + rect.width / 2; const hubCenterY = rect.top + rect.height / 2;
      let leftPos = hubCenterX + 55; if (leftPos + panelWidth > vw - 16) leftPos = hubCenterX - panelWidth - 55;
      let topPos = hubCenterY - (panelHeight / 2); if (topPos + panelHeight > vh - 16) topPos = vh - panelHeight - 16; if (topPos < 16) topPos = 16;
      searchPanel.style.left = `${leftPos}px`; searchPanel.style.top = `${topPos}px`;
  }

  uiEls.searchInput.addEventListener('input', () => renderSearchResults(uiEls.searchInput.value));
  uiEls.searchInput.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); searchToggleDot.click(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const first = uiEls.searchResults.querySelector('.ai-search-result');
      if (first) first.click();
    }
  });

  searchToggleDot.addEventListener('click', (e) => {
      if (!chrome.runtime?.id) return; e.stopPropagation(); closeTree(); const isActive = searchPanel.classList.contains('active'); closeAllPanelsExcept('');
      if (!isActive) {
        searchPanel.classList.add('active'); root.classList.add('show-search');
        uiEls.searchInput.value = ''; renderSearchResults(''); adjustSearchPosition();
        setTimeout(() => uiEls.searchInput.focus(), 50);
      }
      resetToggleTimeout();
  });

  function renderTierDots() {
      tierDotsNav.innerHTML = '';
      for (let i = 0; i < MAX_LAYERS; i++) {
        const ring = RING_CONFIG[i];
        const dot = document.createElement('div'); dot.className = 'tier-dot' + (isOpen && !showAllOverride && i === currentLayerMode ? ' active' : '');
        dot.title = ring.labelKey ? t(ring.labelKey) : ring.label;
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          showAllOverride = false; root.classList.remove('show-all-active');
          if (!isOpen) { closeAllPanelsExcept(''); isOpen = true; root.classList.add('open'); }
          if (currentLayerMode === i) { resetToggleTimeout(); resetAutoCollapseTimer(); return; }
          currentLayerMode = i;
          let nextLabel = ring.labelKey ? t(ring.labelKey) : ring.label;
          setHubLabel(nextLabel); renderSpiral(); resetToggleTimeout(); resetAutoCollapseTimer();
        });
        tierDotsNav.appendChild(dot);
      }
      adjustDotsNavPosition(); syncDotsVisibility();
  }

  function renderHubDots() {
      hubDotsNav.innerHTML = '';
      for (let i = 1; i <= HUB_COUNT; i++) {
        const dot = document.createElement('div'); dot.className = 'hub-dot' + (i === currentHubIndex ? ' active' : '');
        dot.title = i === 1 ? t('hubDotHome') : t('hubDotTitle').replace('{n}', i - 1);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          if (i === currentHubIndex) { resetToggleTimeout(); resetAutoCollapseTimer(); return; }
          hubNavDirection = i > currentHubIndex ? 'forward' : 'backward';
          switchHub(i);
          resetToggleTimeout(); resetAutoCollapseTimer();
        });
        hubDotsNav.appendChild(dot);
      }
      adjustHubDotsPosition(); syncHubDotsVisibility();
  }

  function adjustHubDotsPosition() {
      const rect = hub.getBoundingClientRect(); const navWidth = hubDotsNav.offsetWidth || 40;
      let leftPos = rect.left + (rect.width / 2) - (navWidth / 2);
      leftPos = Math.max(8, Math.min(leftPos, window.innerWidth - navWidth - 8));
      // Prefer above the hub so it doesn't collide with the tier-dots row below.
      let topPos = rect.top - 26;
      if (topPos < 8) topPos = rect.bottom + 10;
      hubDotsNav.style.left = `${leftPos}px`; hubDotsNav.style.top = `${topPos}px`;
  }

  function syncHubDotsVisibility() {
      const collapsed = hub.classList.contains('hub-collapsed');
      const shouldShow = !collapsed && isOpen && HUB_COUNT > 1;
      hubDotsNav.style.opacity = shouldShow ? '1' : '0';
      hubDotsNav.style.pointerEvents = shouldShow ? 'auto' : 'none';
  }
  new MutationObserver(syncHubDotsVisibility).observe(hub, { attributes: true, attributeFilter: ['class'] });
  [hubDotsNav].forEach(el => {
      el.addEventListener('mouseenter', () => { isHoveringWidget = true; clearTimeout(autoCollapseTimeout); clearTimeout(toggleHideTimeout); clearTimeout(treeAutoHideTimeout); });
      el.addEventListener('mousemove', () => { isHoveringWidget = true; clearTimeout(autoCollapseTimeout); clearTimeout(toggleHideTimeout); clearTimeout(treeAutoHideTimeout); });
      el.addEventListener('mouseleave', () => { isHoveringWidget = false; resetAutoCollapseTimer(); resetToggleTimeout(); });
  });

  function adjustDotsNavPosition() {
      const rect = hub.getBoundingClientRect(); const navWidth = tierDotsNav.offsetWidth || 60;
      let leftPos = rect.left + (rect.width / 2) - (navWidth / 2);
      leftPos = Math.max(8, Math.min(leftPos, window.innerWidth - navWidth - 8));
      let topPos = rect.bottom + 10;
      if (topPos + 20 > window.innerHeight) topPos = rect.top - 26;
      tierDotsNav.style.left = `${leftPos}px`; tierDotsNav.style.top = `${topPos}px`;
  }

  function syncDotsVisibility() {
      const collapsed = hub.classList.contains('hub-collapsed');
      const shouldShow = !collapsed && isOpen && currentLayerMode !== 0;
      tierDotsNav.style.opacity = shouldShow ? '1' : '0';
      tierDotsNav.style.pointerEvents = shouldShow ? 'auto' : 'none';
  }
  new MutationObserver(syncDotsVisibility).observe(hub, { attributes: true, attributeFilter: ['class'] });
  [tierDotsNav].forEach(el => {
      el.addEventListener('mouseenter', () => { isHoveringWidget = true; clearTimeout(autoCollapseTimeout); clearTimeout(toggleHideTimeout); clearTimeout(treeAutoHideTimeout); });
      el.addEventListener('mousemove', () => { isHoveringWidget = true; clearTimeout(autoCollapseTimeout); clearTimeout(toggleHideTimeout); clearTimeout(treeAutoHideTimeout); });
      el.addEventListener('mouseleave', () => { isHoveringWidget = false; resetAutoCollapseTimer(); resetToggleTimeout(); });
  });

  const calcGrid = calcPanel.querySelector('.ai-calc-grid'); const calcDisplay = calcPanel.querySelector('#calc-display'); const calcExprEl = calcPanel.querySelector('#calc-expr');
  const OPERATORS = ['+', '-', '*', '/']; const OP_SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const CALC_KEYS = [
    { label: 'C',  action: 'clear',   cls: 'fn' }, { label: '⌫',  action: 'back',    cls: 'fn' }, { label: '%',  action: 'percent', cls: 'fn' }, { label: '÷',  action: 'op', value: '/', cls: 'op' },
    { label: '7',  action: 'num' }, { label: '8', action: 'num' }, { label: '9', action: 'num' }, { label: '×',  action: 'op', value: '*', cls: 'op' },
    { label: '4',  action: 'num' }, { label: '5', action: 'num' }, { label: '6', action: 'num' }, { label: '−',  action: 'op', value: '-', cls: 'op' },
    { label: '1',  action: 'num' }, { label: '2', action: 'num' }, { label: '3', action: 'num' }, { label: '+',  action: 'op', value: '+', cls: 'op' },
    { label: '0',  action: 'num', wide: true }, { label: '.',  action: 'dot' }, { label: '=',  action: 'equals', cls: 'eq' }
  ];
  let calcExpr = ''; let calcHistory = ''; let isResultShown = false;
  function toDisplayString(expr) { return expr.replace(/[+\-*/]/g, (m) => OP_SYMBOL[m] || m); }
  const CALC_RESULT_FONT = { max: 30, min: 13 }; const CALC_EXPR_FONT = { max: 12, min: 9 };
  function fitTextToWidth(el, { max, min }) {
    const prevTransition = el.style.transition; el.style.transition = 'none';
    el.style.fontSize = max + 'px';
    if (el.scrollWidth <= el.clientWidth + 1) { void el.offsetWidth; el.style.transition = prevTransition; return; }
    let lo = min, hi = max, best = min;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.style.fontSize = mid + 'px';
      if (el.scrollWidth <= el.clientWidth + 1) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    el.style.fontSize = best + 'px';
    void el.offsetWidth; el.style.transition = prevTransition;
  }
  function updateCalcDisplay() { calcExprEl.textContent = calcHistory; calcDisplay.textContent = calcExpr === '' ? '0' : toDisplayString(calcExpr); fitTextToWidth(calcDisplay, CALC_RESULT_FONT); fitTextToWidth(calcExprEl, CALC_EXPR_FONT); }
  function evaluateExpression(expression) {
    const tokens = expression.match(/(\d+\.?\d*)|[+\-*/]/g); if (!tokens) return 0;
    const terms = []; let operator = '+'; let current = 0;
    for (let i = 0; i <= tokens.length; i++) {
      const token = tokens[i]; if (i < tokens.length && !isNaN(token)) { current = parseFloat(token); continue; }
      switch (operator) { case '+': terms.push(current); break; case '-': terms.push(-current); break; case '*': terms.push(terms.pop() * current); break; case '/': if (current === 0) throw new Error('Div0'); terms.push(terms.pop() / current); break; }
      if (i < tokens.length) operator = token;
    } return terms.reduce((sum, value) => sum + value, 0);
  }
  function clearCalc() { calcExpr = ''; calcHistory = ''; isResultShown = false; updateCalcDisplay(); }
  function backspaceCalc() { if (isResultShown) { clearCalc(); return; } calcExpr = calcExpr.slice(0, -1); updateCalcDisplay(); }
  function appendNumber(digit) { if (isResultShown || calcExpr === t('calcError')) { calcExpr = ''; calcHistory = ''; isResultShown = false; } const lastTerm = calcExpr.split(/[+\-*/]/).pop(); if (lastTerm === '0') calcExpr = calcExpr.slice(0, -1) + digit; else calcExpr += digit; updateCalcDisplay(); }
  function appendDot() { if (isResultShown || calcExpr === t('calcError')) { calcExpr = ''; calcHistory = ''; isResultShown = false; } const lastTerm = calcExpr.split(/[+\-*/]/).pop(); if (lastTerm.includes('.')) return; calcExpr += lastTerm === '' ? '0.' : '.'; updateCalcDisplay(); }
  function appendOperator(op) { if (calcExpr === '' || calcExpr === t('calcError')) { if (op === '-' && calcExpr === '') { calcExpr = '-'; updateCalcDisplay(); } return; } if (isResultShown) { isResultShown = false; calcHistory = ''; calcExpr += op; updateCalcDisplay(); return; } const lastChar = calcExpr.slice(-1); calcExpr = OPERATORS.includes(lastChar) ? calcExpr.slice(0, -1) + op : calcExpr + op; updateCalcDisplay(); }
  function applyPercent() { if (calcExpr === '' || calcExpr === t('calcError')) return; const match = calcExpr.match(/(\d+\.?\d*)$/); if (!match) return; const percentValue = (parseFloat(match[0]) / 100).toString(); calcExpr = calcExpr.slice(0, -match[0].length) + percentValue; updateCalcDisplay(); }
  function calcEquals() { let sanitized = calcExpr.replace(/[^-\d/*+.]/g, '').replace(/[+\-*/.]+$/, ''); if (!sanitized) return; try { const result = evaluateExpression(sanitized); if (!isFinite(result)) throw new Error('Inv'); calcHistory = `${toDisplayString(calcExpr)} =`; calcExpr = (Math.round(result * 1e8) / 1e8).toString(); } catch { calcHistory = ''; calcExpr = t('calcError'); } isResultShown = true; updateCalcDisplay(); }
  CALC_KEYS.forEach(key => {
    const b = document.createElement('div'); b.className = 'ai-calc-btn' + (key.cls ? ` ${key.cls}` : '') + (key.wide ? ' wide' : ''); b.textContent = key.label;
    b.onclick = (e) => { e.stopPropagation(); switch (key.action) { case 'clear': clearCalc(); break; case 'back': backspaceCalc(); break; case 'percent': applyPercent(); break; case 'op': appendOperator(key.value); break; case 'dot': appendDot(); break; case 'equals': calcEquals(); break; case 'num': appendNumber(key.label); break; } }; calcGrid.appendChild(b);
  });
  document.addEventListener('keydown', (e) => {
    if (!calcPanel.classList.contains('active')) return;
    if (/^[0-9]$/.test(e.key)) appendNumber(e.key); else if (OPERATORS.includes(e.key)) appendOperator(e.key); else if (e.key === '.') appendDot(); else if (e.key === '%') applyPercent(); else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calcEquals(); } else if (e.key === 'Backspace') backspaceCalc(); else if (e.key === 'Escape') clearCalc();
  });
  function adjustCalcPosition() {
      if (!calcPanel.classList.contains('active')) return;
      const rect = calcToggleDot.getBoundingClientRect(); const panelWidth = 240; const panelHeight = calcPanel.offsetHeight || 300; const vw = window.innerWidth; const vh = window.innerHeight;
      let leftPos = rect.right + 30; if (leftPos + panelWidth > vw - 16) leftPos = rect.left - panelWidth - 30; 
      let topPos = rect.top - (panelHeight / 2); if (topPos + panelHeight > vh - 16) topPos = vh - panelHeight - 16; if (topPos < 16) topPos = 16;
      calcPanel.style.left = `${leftPos}px`; calcPanel.style.top = `${topPos}px`;
  }
  calcToggleDot.addEventListener('click', (e) => {
      e.stopPropagation(); closeTree(); const isActive = calcPanel.classList.contains('active'); closeAllPanelsExcept(''); 
      if (!isActive) { calcPanel.classList.add('active'); root.classList.add('show-calc'); clearCalc(); adjustCalcPosition(); } resetToggleTimeout();
  });

  function showToastNotification(text, isError = false) {
    toastBox.textContent = text; toastBox.style.borderColor = isError ? "#EF4444" : "#10B981";
    toastBox.style.boxShadow = isError ? "0 8px 32px rgba(239, 68, 68, 0.3)" : "0 8px 32px rgba(16, 185, 129, 0.3)";
    toastBox.classList.add('show'); setTimeout(() => { toastBox.classList.remove('show'); }, 2500);
  }

  const uiToggles = ['ai-todo-toggle', 'ai-search-toggle', 'ai-note-toggle', 'ai-all-toggle', 'ai-collapse-toggle', 'ai-undo-toggle', 'ai-calc-hub-toggle', 'ai-clock-toggle', 'ai-spacing-arc', 'ai-spacing-thumb', 'ai-spacing-value'];

  let globalUndoTimeout = null; let pendingUndoState = { type: null, data: null, hub: 1 };
  function setUndoState(type, data, targetHub = currentHubIndex) {
      const previousType = pendingUndoState.type; pendingUndoState = { type, data, hub: targetHub };
      root.classList.remove('hide-toggles'); undoToggleDot.classList.add('active-undo'); clearTimeout(globalUndoTimeout);
      if ((previousType === 'bookmark' || previousType === 'storage') && type !== previousType) { try { chrome.storage.sync.remove('lastDeletedLink'); } catch (err) {} }
      globalUndoTimeout = setTimeout(() => {
          undoToggleDot.classList.remove('active-undo'); pendingUndoState = { type: null, data: null, hub: 1 };
          if (type === 'bookmark' || type === 'storage') { try { chrome.storage.sync.remove('lastDeletedLink'); } catch(err){} }
      }, 10000); 
  }
  undoToggleDot.addEventListener('click', (e) => {
      e.stopPropagation(); if(!undoToggleDot.classList.contains('active-undo')) return;
      const undoneType = pendingUndoState.type;
      if(undoneType === 'text') {
          if (typeof endNoteEditSession === 'function') endNoteEditSession();
          const textState = pendingUndoState.data; const restoredText = typeof textState === 'string' ? textState : textState.value;
          noteTextarea.value = restoredText;
          // Restore previous panel size if it was saved with the undo payload
          if (typeof textState === 'object') {
            if (textState.prevWidth) { quickNoteForm.style.width = textState.prevWidth; noteManuallyPositioned = true; }
            if (textState.prevHeight) { quickNoteForm.style.height = textState.prevHeight; noteManuallyPositioned = true; }
          }
          quickNoteForm.classList.add('active'); root.classList.add('show-notepad');
          if (typeof textState === 'object') {
            const caret = Math.min(textState.selectionStart ?? restoredText.length, restoredText.length);
            const caretEnd = Math.min(textState.selectionEnd ?? caret, restoredText.length);
            noteTextarea.focus(); noteTextarea.setSelectionRange(caret, caretEnd);
          }
          if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
          if (typeof saveNoteDraftDebounced === 'function') saveNoteDraftDebounced();
          adjustNotepadPosition(); showToastNotification(t('toastRestored'));
      }
      else if (undoneType === 'bookmark' || undoneType === 'storage') {
          let linkToRestore = pendingUndoState.data; let targetHub = pendingUndoState.hub;
          if(!linkToRestore) { chrome.storage.sync.get(['lastDeletedLink'], (res) => { if(res.lastDeletedLink) restoreBookmark(res.lastDeletedLink, res.lastDeletedLink._hub || targetHub); }); } 
          else restoreBookmark(linkToRestore, targetHub);
      }
      else if (undoneType === 'todo') {
          const { item, index } = pendingUndoState.data || {};
          if (item) {
            const insertAt = Math.min(index ?? todosData.length, todosData.length);
            todosData.splice(insertAt, 0, item);
            saveTodos();
            if ((item.type || 'daily') !== activeTodoTab) switchTodoTab(item.type || 'daily'); else if (todoPanel.classList.contains('active')) renderTodos();
            showToastNotification(t('toastRestored'));
          }
      }
      clearTimeout(globalUndoTimeout); undoToggleDot.classList.remove('active-undo'); pendingUndoState = { type: null, data: null, hub: 1 };
      if (undoneType === 'bookmark' || undoneType === 'storage') chrome.storage.sync.remove('lastDeletedLink');
  });

  function restoreBookmark(link, targetHub = 1) { 
    hubData(targetHub).push(link); 
    saveLinksAll(); 
    if (currentHubIndex !== targetHub) switchHub(targetHub); else renderSpiral(); 
    showToastNotification(t('toastRestored')); 
  }

  const spacingTrack = spacingArc.querySelector('#ai-spacing-track'); const spacingFill = spacingArc.querySelector('#ai-spacing-fill');
  const spacingThumb = spacingArc.querySelector('#ai-spacing-thumb'); const spacingValueEl = spacingArc.querySelector('#ai-spacing-value');
  const ARC_R = 42, ARC_CX = 52, ARC_CY = 10 + 42; const ARC_LEN = Math.PI * ARC_R / 2; 
  spacingTrack.style.strokeDasharray = `${ARC_LEN}`; spacingFill.style.strokeDasharray = `${ARC_LEN}`;
  let spacingSaveDebounce = null;
  const HUB_ALPHA_MIN = 0.14, HUB_ALPHA_MAX = 0.55; const HUB_BLUR_MIN = 12, HUB_BLUR_MAX = 26;

  function spacingFraction() { return Math.min(1, Math.max(0, (SPACING - MIN_SPACING) / (MAX_SPACING - MIN_SPACING))); }
  function paintSpacingArc() {
    const frac = spacingFraction(); const angleDeg = frac * 90; const rad = angleDeg * (Math.PI / 180);
    const x = ARC_CX + ARC_R * Math.cos(rad); const y = ARC_CY - ARC_R * Math.sin(rad);
    spacingThumb.style.left = `${x}px`; spacingThumb.style.top = `${y}px`; spacingFill.style.strokeDashoffset = `${ARC_LEN * (1 - frac)}`;
    spacingValueEl.textContent = Math.round(SPACING); spacingValueEl.style.left = `${x}px`; spacingValueEl.style.top = `${y - 16}px`;
    const alpha = HUB_ALPHA_MIN + frac * (HUB_ALPHA_MAX - HUB_ALPHA_MIN); const blur = HUB_BLUR_MIN + frac * (HUB_BLUR_MAX - HUB_BLUR_MIN);
    hub.style.setProperty('--hub-alpha', alpha.toFixed(2)); hub.style.setProperty('--hub-blur', `${blur.toFixed(0)}px`);
  }

  let isSpacingDragging = false;
  function spacingAngleFromPointer(clientX, clientY) {
    const rect = spacingArc.getBoundingClientRect(); const cx = rect.left + rect.width / 2; const cy = rect.top + rect.height / 2;
    const dx = clientX - cx; const dy = -(clientY - cy); let angle = Math.atan2(dy, dx) * (180 / Math.PI); return Math.min(90, Math.max(0, angle));
  }
  function applySpacingFromPointer(clientX, clientY) {
    SPACING = MIN_SPACING + (spacingAngleFromPointer(clientX, clientY) / 90) * (MAX_SPACING - MIN_SPACING);
    paintSpacingArc(); if (isOpen) renderSpiral();
    clearTimeout(spacingSaveDebounce); spacingSaveDebounce = setTimeout(() => { try { if (chrome.runtime?.id) chrome.storage.sync.set({ nodeSpacing: SPACING }); } catch (err) {} }, 400);
  }
  function startSpacingDrag(e) { e.stopPropagation(); e.preventDefault(); isSpacingDragging = true; spacingArc.classList.add('active-drag'); clearTimeout(autoCollapseTimeout); clearTimeout(toggleHideTimeout); clearTimeout(treeAutoHideTimeout); const point = e.touches ? e.touches[0] : e; applySpacingFromPointer(point.clientX, point.clientY); }
  spacingThumb.addEventListener('mousedown', startSpacingDrag); spacingTrack.addEventListener('mousedown', startSpacingDrag);
  spacingThumb.addEventListener('touchstart', startSpacingDrag, { passive: false }); spacingTrack.addEventListener('touchstart', startSpacingDrag, { passive: false });
  spacingArc.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('mousemove', (e) => { if (!isSpacingDragging) return; applySpacingFromPointer(e.clientX, e.clientY); });
  document.addEventListener('touchmove', (e) => { if (!isSpacingDragging) return; const t = e.touches[0]; applySpacingFromPointer(t.clientX, t.clientY); }, { passive: true });
  function endSpacingDrag() { if (!isSpacingDragging) return; isSpacingDragging = false; spacingArc.classList.remove('active-drag'); resetAutoCollapseTimer(); resetToggleTimeout(); }
  document.addEventListener('mouseup', endSpacingDrag); document.addEventListener('touchend', endSpacingDrag);

  function closeAllPanelsExcept(exceptStr, force) {
      if (exceptStr !== 'note') {
        if (force || !isNotePinned) {
          quickNoteForm.classList.remove('active');
          root.classList.remove('show-notepad');
          isNotePinned = false;
          if (typeof abortNoteClosing === 'function') abortNoteClosing();
          else if (typeof stopCollapseCountdown === 'function') stopCollapseCountdown();
          if (typeof applyPinVisual === 'function') applyPinVisual(false);
        }
      }
      if (exceptStr !== 'calc') { calcPanel.classList.remove('active'); root.classList.remove('show-calc'); }
      if (exceptStr !== 'clock') {
        clockPanel.classList.remove('active');
        root.classList.remove('show-clock');
        if (uiEls.markPanel) {
          uiEls.markPanel.classList.remove('active', 'side-left');
          if (uiEls.markToggle) uiEls.markToggle.classList.remove('is-open');
        }
        if (typeof closeDualPicker === 'function') { try { closeDualPicker(); } catch (_) {} }
      }
      if (exceptStr !== 'todo') { todoPanel.classList.remove('active'); root.classList.remove('show-todo'); }
      if (exceptStr !== 'search') { searchPanel.classList.remove('active'); root.classList.remove('show-search'); }
  }

  let autoCollapseTimeout = null; const AUTO_COLLAPSE_DELAY = 5200; let isInitialReveal = true;
  let isHoveringWidget = false;
  function triggerAutoCollapse() {
    if (isNotePinned) return;
    if (!isHoveringWidget && !isDragging && !inlineForm.classList.contains('active') && !quickNoteForm.classList.contains('active') && !calcPanel.classList.contains('active') && !clockPanel.classList.contains('active') && !todoPanel.classList.contains('active') && !searchPanel.classList.contains('active')) {
      isInitialReveal = false; root.classList.remove('initial-reveal'); closeTree(); hub.classList.add('hub-collapsed');
    }
  }
  function resetAutoCollapseTimer() { clearTimeout(autoCollapseTimeout); if (!hub.classList.contains('hub-collapsed') && !isHoveringWidget && !isNotePinned) autoCollapseTimeout = setTimeout(triggerAutoCollapse, AUTO_COLLAPSE_DELAY); }

  let toggleHideTimeout = null; let treeAutoHideTimeout = null;
  function hideToggles() {
    if (isInitialReveal || isHoveringWidget || isNotePinned) return;
    // Notepad is owned by its own idle + visual countdown system.
    // Never close it here — that raced the 5s grace and killed the ⏳ animation.
    if (quickNoteForm.classList.contains('active')) return;
    if (!todoPanel.classList.contains('active') && !calcPanel.classList.contains('active') && !clockPanel.classList.contains('active') && !searchPanel.classList.contains('active') && !undoToggleDot.classList.contains('active-undo')) {
      root.classList.add('hide-toggles');
    }
  }
  function resetToggleTimeout() {
    if (isNotePinned) return;
    root.classList.remove('hide-toggles'); clearTimeout(toggleHideTimeout);
    if (!isInitialReveal) toggleHideTimeout = setTimeout(hideToggles, 4000);
    if (isOpen) {
      clearTimeout(treeAutoHideTimeout);
      treeAutoHideTimeout = setTimeout(() => {
        if (isOpen && !isDragging && !isHoveringWidget && !inlineForm.classList.contains('active') && !isNotePinned) closeTree();
      }, 6000);
    }
  }

  [root, quickNoteForm, calcPanel, clockPanel, todoPanel, searchPanel].forEach(el => {
      el.addEventListener('mouseenter', () => {
          isHoveringWidget = true;
          clearTimeout(autoCollapseTimeout);
          clearTimeout(toggleHideTimeout);
          clearTimeout(treeAutoHideTimeout);
          if (typeof abortNoteClosing === 'function') abortNoteClosing();
      });
      el.addEventListener('mousemove', () => {
          isHoveringWidget = true;
          clearTimeout(autoCollapseTimeout);
          clearTimeout(toggleHideTimeout);
          clearTimeout(treeAutoHideTimeout);
      });
      el.addEventListener('mouseleave', () => {
          isHoveringWidget = false;
          resetAutoCollapseTimer();
          resetToggleTimeout();
          // notepad idle is handled by quickNoteForm mouseleave only
      });
  });
  document.addEventListener('click', () => { if(!hub.classList.contains('hub-collapsed')) resetAutoCollapseTimer(); });

  function adjustNotepadPosition() {
    if (!quickNoteForm.classList.contains('active')) return;
    // If user manually dragged the notepad, keep their position
    if (noteManuallyPositioned) return;

    const rect = hub.getBoundingClientRect();
    const formWidth = quickNoteForm.offsetWidth || Math.min(640, window.innerWidth - 32);
    const formHeight = quickNoteForm.offsetHeight || 180;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hubCenterX = rect.left + rect.width / 2;
    const hubCenterY = rect.top + rect.height / 2;

    let leftPos, topPos;
    if (hubCenterX < vw * 0.33) {
      leftPos = rect.right + 24;
      topPos = hubCenterY - formHeight / 2;
    } else if (hubCenterX > vw * 0.66) {
      leftPos = rect.left - formWidth - 24;
      topPos = hubCenterY - formHeight / 2;
    } else {
      leftPos = hubCenterX - formWidth / 2;
      topPos = rect.top - formHeight - 24;
      if (topPos < 16) topPos = rect.bottom + 24;
    }

    if (leftPos < 16) leftPos = 16;
    if (leftPos + formWidth > vw - 16) leftPos = vw - formWidth - 16;
    if (topPos < 16) topPos = 16;
    if (topPos + formHeight > vh - 16) topPos = vh - formHeight - 16;

    quickNoteForm.style.left = `${leftPos}px`;
    quickNoteForm.style.top = `${topPos}px`;
  }

  let noteManuallyPositioned = false;
  let noteLinkedStartLeft, noteLinkedStartTop;
  let isNoteDragging = false, noteDragMoved = false;
  let noteStartX, noteStartY, noteStartLeft, noteStartTop;
  // موقعیت هاب در شروع کشیدن یادداشت — تا هر دو با هم جابه‌جا شوند
  let noteHubStartLeft = 0, noteHubStartTop = 0, noteHubStartBottom = null;
  const noteHeaderEl = quickNoteForm.querySelector('#ai-note-header');
  if (noteHeaderEl) {
    noteHeaderEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('#ai-note-pin-btn')) return;
      e.stopPropagation(); e.preventDefault();
      isNoteDragging = true; noteDragMoved = false;
      noteStartX = e.clientX; noteStartY = e.clientY;
      const r = quickNoteForm.getBoundingClientRect();
      noteStartLeft = r.left; noteStartTop = r.top;
      // هاب را هم از rect واقعی بگیر (نه فقط style) تا با bottom/auto هم درست باشد
      const hubRect = root.getBoundingClientRect();
      noteHubStartLeft = hubRect.left + hubRect.width / 2;
      noteHubStartTop = hubRect.top + hubRect.height / 2;
      noteHubStartBottom = null;
      noteHeaderEl.style.cursor = 'grabbing';
      root.classList.add('dragging');
    });
  }
  document.addEventListener('mousemove', (e) => {
    if (!isNoteDragging) return;
    const dx = e.clientX - noteStartX, dy = e.clientY - noteStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) noteDragMoved = true;
    if (noteDragMoved) {
      noteManuallyPositioned = true;
      quickNoteForm.style.left = `${noteStartLeft + dx}px`;
      quickNoteForm.style.top = `${noteStartTop + dy}px`;
      // ابزارک اصلی (هاب) دقیقاً همان جابه‌جایی را می‌کند
      root.style.left = `${noteHubStartLeft + dx}px`;
      root.style.top = `${noteHubStartTop + dy}px`;
      root.style.bottom = 'auto';
      if (isOpen) repositionSpiralNodes();
      adjustCalcPosition(); adjustClockPosition(); adjustTodoPosition();
      adjustSearchPosition(); adjustDotsNavPosition(); adjustHubDotsPosition();
    }
  });
  document.addEventListener('mouseup', () => {
    if (!isNoteDragging) return;
    isNoteDragging = false;
    root.classList.remove('dragging');
    if (noteHeaderEl) noteHeaderEl.style.cursor = 'grab';
    if (noteDragMoved) {
      try {
        if (chrome.runtime?.id) {
          chrome.storage.sync.set({
            orbitX: parseInt(root.style.left, 10) || 0,
            orbitY: parseInt(root.style.top, 10) || 0
          });
        }
      } catch (err) {}
    }
  });

  // Pin button
  // --- Smart Notepad State & Timers ---
  let noteCollapseInterval = null;
  let noteCollapseSeconds = 5;
  let notepadIdleTimer = null;
  const IDLE_GRACE_PERIOD = 5000;
  const pinBtn = quickNoteForm.querySelector('#ai-note-pin-btn');

  function applyPinVisual(pinned) {
    if (!pinBtn) return;
    pinBtn.classList.remove('is-counting');
    pinBtn.classList.toggle('is-pinned', !!pinned);
    pinBtn.textContent = pinned ? '📍' : '📌';
    pinBtn.title = pinned
      ? (currentLang === 'fa' ? 'برداشتن پین' : 'Unpin')
      : (currentLang === 'fa' ? 'سنجاق کردن' : 'Pin');
    quickNoteForm.classList.toggle('is-pinned', !!pinned);
  }

  function startCollapseCountdown() {
    if (!pinBtn || !quickNoteForm.classList.contains('active')) return;
    clearInterval(noteCollapseInterval);
    noteCollapseSeconds = 5;
    pinBtn.classList.add('is-counting');
    pinBtn.classList.remove('is-pinned');
    pinBtn.textContent = '⏳ ' + noteCollapseSeconds + 's';
    pinBtn.title = currentLang === 'fa' ? 'در حال بستن…' : 'Closing…';

    noteCollapseInterval = setInterval(() => {
      noteCollapseSeconds--;
      if (noteCollapseSeconds > 0) {
        pinBtn.textContent = '⏳ ' + noteCollapseSeconds + 's';
      } else {
        clearInterval(noteCollapseInterval);
        noteCollapseInterval = null;
        pinBtn.classList.remove('is-counting');
        isNotePinned = false;
        applyPinVisual(false);
        closeAllPanelsExcept('', true);
        closeTree();
        hub.classList.add('hub-collapsed');
      }
    }, 1000);
  }

  function stopCollapseCountdown() {
    if (noteCollapseInterval) {
      clearInterval(noteCollapseInterval);
      noteCollapseInterval = null;
    }
    if (pinBtn) {
      pinBtn.classList.remove('is-counting');
      applyPinVisual(isNotePinned);
    }
  }

  function startNotepadIdleTimer() {
    clearTimeout(notepadIdleTimer);
    if (isNotePinned || !quickNoteForm.classList.contains('active')) return;
    // Already showing visual countdown — don't restart grace period
    if (noteCollapseInterval) return;
    notepadIdleTimer = setTimeout(() => {
      if (!isNotePinned && quickNoteForm.classList.contains('active') && !isHoveringWidget && !noteCollapseInterval) {
        startCollapseCountdown();
      }
    }, IDLE_GRACE_PERIOD);
  }

  function stopNotepadIdleTimer() {
    // Only clear the silent grace timer — do not kill an active visual countdown
    clearTimeout(notepadIdleTimer);
    notepadIdleTimer = null;
  }

  function abortNoteClosing() {
    // Full abort: idle + visual countdown (hover re-enter, typing, explicit actions)
    stopNotepadIdleTimer();
    stopCollapseCountdown();
  }

  if (pinBtn) {
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isNotePinned) {
        isNotePinned = true;
        abortNoteClosing();
        applyPinVisual(true);
        clearTimeout(autoCollapseTimeout);
        clearTimeout(treeAutoHideTimeout);
        clearTimeout(toggleHideTimeout);
        root.classList.remove('hide-toggles');
        if (!quickNoteForm.classList.contains('active')) {
          quickNoteForm.classList.add('active');
          root.classList.add('show-notepad');
        }
      } else {
        // UNPIN: start visual countdown; ignore mousemove so it is not cancelled immediately
        isNotePinned = false;
        stopNotepadIdleTimer();
        startCollapseCountdown();
      }
    });
  }

  // mouseenter = user returned → abort closing sequence
  quickNoteForm.addEventListener('mouseenter', abortNoteClosing);
  // mousemove only resets silent idle grace, never kills countdown
  quickNoteForm.addEventListener('mousemove', stopNotepadIdleTimer);
  quickNoteForm.addEventListener('mouseleave', startNotepadIdleTimer);

  noteToggleDot.addEventListener('click', (e) => {
    if (!chrome.runtime?.id) return;
    e.stopPropagation();
    closeTree();
    isInitialReveal = false;
    root.classList.remove('initial-reveal');

    const isActive = quickNoteForm.classList.contains('active');
    if (isActive) {
      isNotePinned = false;
      applyPinVisual(false);
      closeAllPanelsExcept('', true);
      abortNoteClosing();
    } else {
      closeAllPanelsExcept('note');
      quickNoteForm.classList.add('active');
      root.classList.add('show-notepad');
      noteManuallyPositioned = false;
      quickNoteForm.style.width = '';
      quickNoteForm.style.height = '';
      if (noteTextarea) {
        adjustNotepadPosition();
        setTimeout(() => {
          noteTextarea.focus();
          adjustNotepadPosition();
        }, 50);
      }
      startNotepadIdleTimer();
    }
    resetToggleTimeout();
  });

  // Custom dual-corner resize: notepad always opens at the fixed standard CSS size;
  // the user can resize during this session from either bottom corner (not just one side).
  const NOTE_MIN_W = 320, NOTE_MIN_H = 200;
  function noteMaxW() { return Math.round(window.innerWidth * 0.9); }
  function noteMaxH() { return Math.round(window.innerHeight * 0.9); }
  function setupNoteResizeHandle(handleEl, corner) {
    if (!handleEl) return;
    let dragging = false, startX, startY, startW, startH, startLeft;
    handleEl.addEventListener('mousedown', (e) => {
      e.stopPropagation(); e.preventDefault();
      dragging = true;
      // Disable size transition while dragging so the grip feels instant
      quickNoteForm.style.transition = 'none';
      const r = quickNoteForm.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      startW = r.width; startH = r.height; startLeft = r.left;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      let newW = corner === 'br' ? (startW + dx) : (startW - dx);
      newW = Math.max(NOTE_MIN_W, Math.min(noteMaxW(), newW));
      const newH = Math.max(NOTE_MIN_H, Math.min(noteMaxH(), startH + dy));
      noteManuallyPositioned = true;
      quickNoteForm.style.width = `${newW}px`;
      quickNoteForm.style.height = `${newH}px`;
      if (corner === 'bl') {
        // keep the right edge anchored — the left edge is the one that moves for this handle
        quickNoteForm.style.left = `${startLeft + (startW - newW)}px`;
      }
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = '';
      // Restore CSS transitions after a frame so the next Clear collapses smoothly
      requestAnimationFrame(() => { quickNoteForm.style.transition = ''; });
    });
  }
  setupNoteResizeHandle(quickNoteForm.querySelector('#ai-note-resize-bl'), 'bl');
  setupNoteResizeHandle(quickNoteForm.querySelector('#ai-note-resize-br'), 'br');

  // --- Minimal text formatting: alignment + line numbers ---
  function setNoteAlign(align) {
    noteTextarea.style.textAlign = align;
    [uiEls.alignRightBtn, uiEls.alignCenterBtn, uiEls.alignLeftBtn].forEach(b => b && b.classList.remove('active'));
    const btn = align === 'right' ? uiEls.alignRightBtn : align === 'center' ? uiEls.alignCenterBtn : uiEls.alignLeftBtn;
    if (btn) btn.classList.add('active');
    try { if (chrome.runtime?.id) chrome.storage.local.set({ noteTextAlign: align }); } catch (e) {}
  }
  if (uiEls.alignRightBtn) uiEls.alignRightBtn.addEventListener('click', (e) => { e.stopPropagation(); setNoteAlign('right'); });
  if (uiEls.alignCenterBtn) uiEls.alignCenterBtn.addEventListener('click', (e) => { e.stopPropagation(); setNoteAlign('center'); });
  if (uiEls.alignLeftBtn) uiEls.alignLeftBtn.addEventListener('click', (e) => { e.stopPropagation(); setNoteAlign('left'); });
  try {
    chrome.storage.local.get(['noteTextAlign'], (data) => {
      if (data.noteTextAlign) setNoteAlign(data.noteTextAlign);
    });
  } catch (e) {}

  // Undo معنادار برای دفترچه: یک اسنپ‌شات در شروع «جلسهٔ ویرایش»، نه برای هر کاراکتر.
  // جلسه با تایپ/حذف پیوسته ادامه دارد؛ بعد از سکوت کوتاه بسته می‌شود.
  // Undo سراسری همان متن قبل از شروع جلسه (یا قبل از Clear/Paste بزرگ) را برمی‌گرداند.
  let noteEditSessionOpen = false;
  let noteEditSessionTimer = null;
  const NOTE_EDIT_SESSION_IDLE_MS = 1200;

  function snapshotNoteText(extra) {
    if (!noteTextarea) return null;
    return Object.assign({
      value: noteTextarea.value,
      selectionStart: noteTextarea.selectionStart,
      selectionEnd: noteTextarea.selectionEnd,
      prevWidth: quickNoteForm.style.width || '',
      prevHeight: quickNoteForm.style.height || ''
    }, extra || {});
  }

  function beginNoteEditSessionIfNeeded() {
    if (!noteTextarea) return;
    // فقط وقتی متنی وجود دارد ارزش Undo دارد
    if (!noteTextarea.value) return;
    if (noteEditSessionOpen) {
      // تمدید جلسهٔ جاری
      clearTimeout(noteEditSessionTimer);
      noteEditSessionTimer = setTimeout(endNoteEditSession, NOTE_EDIT_SESSION_IDLE_MS);
      return;
    }
    noteEditSessionOpen = true;
    setUndoState('text', snapshotNoteText());
    clearTimeout(noteEditSessionTimer);
    noteEditSessionTimer = setTimeout(endNoteEditSession, NOTE_EDIT_SESSION_IDLE_MS);
  }

  function endNoteEditSession() {
    noteEditSessionOpen = false;
    clearTimeout(noteEditSessionTimer);
    noteEditSessionTimer = null;
  }

  // قبل از عملیات‌های بزرگ (Clear از قبل جداست؛ اینجا Paste / Cut / حذف انتخاب‌شده)
  function captureNoteUndoForBigChange(inputType, data) {
    if (!noteTextarea || !noteTextarea.value) return;
    const isDelete = inputType && inputType.startsWith('delete');
    const isInsert = inputType && (inputType.startsWith('insert') || inputType === 'historyUndo' || inputType === 'historyRedo');
    const selLen = Math.abs((noteTextarea.selectionEnd || 0) - (noteTextarea.selectionStart || 0));
    const incomingLen = (data && data.length) || 0;
    // حذف بازه‌ای، Cut، یا Paste با جایگزینی متن موجود → Undo کامل
    const significant =
      (isDelete && (selLen > 1 || noteTextarea.value.length > 0)) ||
      (isInsert && (selLen > 0 || incomingLen > 20));
    if (!significant && !(isDelete && noteTextarea.value.length > 0)) return;
    // اگر جلسه باز است اسنپ‌شات اول جلسه را نگه دار؛ وگرنه همین الان بگیر
    if (!noteEditSessionOpen) {
      setUndoState('text', snapshotNoteText());
      noteEditSessionOpen = true;
    }
    clearTimeout(noteEditSessionTimer);
    noteEditSessionTimer = setTimeout(endNoteEditSession, NOTE_EDIT_SESSION_IDLE_MS);
  }

  if (noteTextarea) {
    noteTextarea.addEventListener('beforeinput', function (e) {
      if (!e.inputType) return;
      // شروع جلسه روی اولین تغییر واقعی (insert یا delete)
      if (e.inputType.startsWith('delete') || e.inputType.startsWith('insert') || e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
        // برای Paste/حذف انتخاب‌شده: اسنپ‌شات قبل از تغییر
        const selLen = Math.abs((this.selectionEnd || 0) - (this.selectionStart || 0));
        if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop' || (e.inputType.startsWith('delete') && selLen > 1)) {
          if (!noteEditSessionOpen && this.value) {
            setUndoState('text', snapshotNoteText());
            noteEditSessionOpen = true;
          }
        } else if (e.inputType.startsWith('delete') || e.inputType.startsWith('insertText') || e.inputType === 'insertLineBreak') {
          beginNoteEditSessionIfNeeded();
        }
        clearTimeout(noteEditSessionTimer);
        noteEditSessionTimer = setTimeout(endNoteEditSession, NOTE_EDIT_SESSION_IDLE_MS);
      }
    });
    noteTextarea.addEventListener('keydown', function (e) {
      if (typeof abortNoteClosing === 'function') abortNoteClosing();
      // Ctrl/Cmd+A سپس Delete/Backspace — اسنپ‌شات قبل از پاک شدن کل متن
      if ((e.key === 'Backspace' || e.key === 'Delete') && this.selectionStart === 0 && this.selectionEnd === this.value.length && this.value.length > 0) {
        if (!noteEditSessionOpen) {
          setUndoState('text', snapshotNoteText());
          noteEditSessionOpen = true;
        }
      }
    });
    noteTextarea.addEventListener('input', function () {
      if (typeof abortNoteClosing === 'function') abortNoteClosing();
      if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
      if (typeof saveNoteDraftDebounced === 'function') saveNoteDraftDebounced();
      adjustNotepadPosition(); resetToggleTimeout();
    });
    noteTextarea.addEventListener('blur', function () {
      // با ترک فیلد، جلسه بسته شود تا Undo بعدی معنای روشن داشته باشد
      endNoteEditSession();
    });
  }
  
  // --- Prompt Studio: templates, token meter, autosave, history ---
  const PROMPT_TEMPLATES = [
    {
      key: 'noteTplRefactor',
      textEn: 'Act as a Principal Software Architect. Review the following code for efficiency, security, and edge-case resilience:\n\n',
      textFa: 'به‌عنوان یک معمار ارشد نرم‌افزار عمل کن. کد زیر را از نظر کارایی، امنیت و مقاومت در برابر حالت‌های لبه‌ای بررسی کن:\n\n'
    },
    {
      key: 'noteTplSummary',
      textEn: 'Analyze the text below and provide a structured comparative table and bullet-point executive summary:\n\n',
      textFa: 'متن زیر را تحلیل کن و یک جدول مقایسه‌ای ساخت‌یافته به‌همراه خلاصهٔ مدیریتی گلوله‌ای ارائه بده:\n\n'
    },
    {
      key: 'noteTplCritic',
      textEn: 'Critique the following thesis from first principles. Identify logical fallacies and hidden assumptions:\n\n',
      textFa: 'از اصول اولیه، تز زیر را نقد کن. مغالطات منطقی و فرض‌های پنهان را مشخص کن:\n\n'
    },
    {
      key: 'noteTplTranslate',
      textEn: 'Translate the following text into clear, natural English while preserving technical meaning:\n\n',
      textFa: 'متن زیر را به انگلیسی روان و طبیعی ترجمه کن و معنای فنی را حفظ کن:\n\n'
    }
  ];

  let promptHistory = [];
  let noteDraftSaveTimer = null;

  function estimateTokens(text) {
    if (!text) return 0;
    const chars = text.length;
    const words = text.split(/\s+/).filter(Boolean).length;
    // Heuristic: Latin ~1.35 tok/word; extra weight for dense Unicode (fa/ar/cjk)
    return Math.max(1, Math.round(words * 1.35 + chars * 0.08));
  }

  function updateNoteTokenMeter() {
    if (!uiEls.tokenMeter || !noteTextarea) return;
    const text = noteTextarea.value;
    if (!text.trim()) {
      uiEls.tokenMeter.textContent = t('noteTokenEmpty');
      return;
    }
    uiEls.tokenMeter.textContent = t('noteTokenMeter')
      .replace('{chars}', String(text.length))
      .replace('{tokens}', String(estimateTokens(text)));
  }

  function saveNoteDraftDebounced() {
    clearTimeout(noteDraftSaveTimer);
    noteDraftSaveTimer = setTimeout(() => {
      try {
        if (chrome.runtime?.id && noteTextarea) {
          chrome.storage.local.set({ savedPromptDraft: noteTextarea.value });
        }
      } catch (e) {}
    }, 400);
  }

  function restoreNoteDraft() {
    try {
      chrome.storage.local.get(['savedPromptDraft', 'aiTreePromptHistory'], (res) => {
        if (res && typeof res.savedPromptDraft === 'string' && noteTextarea && !noteTextarea.value) {
          noteTextarea.value = res.savedPromptDraft;
        }
        if (res && Array.isArray(res.aiTreePromptHistory)) {
          promptHistory = res.aiTreePromptHistory.slice(0, 10);
        }
        updateNoteTokenMeter();
      });
    } catch (e) {}
  }

  function pushPromptHistory(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    promptHistory = [{ ts: Date.now(), text: trimmed }, ...promptHistory.filter(h => h.text !== trimmed)].slice(0, 10);
    try {
      if (chrome.runtime?.id) chrome.storage.local.set({ aiTreePromptHistory: promptHistory });
    } catch (e) {}
  }

  function insertNoteTemplate(templateText) {
    if (!noteTextarea) return;
    if (noteTextarea.value) {
      endNoteEditSession();
      setUndoState('text', snapshotNoteText());
    }
    const start = noteTextarea.selectionStart || 0;
    const end = noteTextarea.selectionEnd || 0;
    const current = noteTextarea.value;
    noteTextarea.value = current.slice(0, start) + templateText + current.slice(end);
    const pos = start + templateText.length;
    noteTextarea.setSelectionRange(pos, pos);
    noteTextarea.focus();
    updateNoteTokenMeter();
    saveNoteDraftDebounced();
    if (typeof abortNoteClosing === 'function') abortNoteClosing();
    adjustNotepadPosition();
  }

  function renderNoteTemplates() {
    if (!uiEls.tplBar) return;
    uiEls.tplBar.innerHTML = '';
    PROMPT_TEMPLATES.forEach((tpl) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-note-tpl-chip';
      btn.textContent = t(tpl.key);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const body = currentLang === 'fa' ? tpl.textFa : tpl.textEn;
        insertNoteTemplate(body);
      });
      uiEls.tplBar.appendChild(btn);
    });
  }

  function renderPromptHistoryMenu() {
    if (!uiEls.historyMenu) return;
    uiEls.historyMenu.innerHTML = '';
    if (!promptHistory.length) {
      const empty = document.createElement('div');
      empty.className = 'ai-note-history-empty';
      empty.textContent = t('noteHistoryEmpty');
      uiEls.historyMenu.appendChild(empty);
      return;
    }
    promptHistory.forEach((item) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'ai-note-history-item';
      const preview = item.text.length > 72 ? item.text.slice(0, 72) + '…' : item.text;
      row.textContent = preview;
      row.title = item.text;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        if (noteTextarea) {
          if (noteTextarea.value && noteTextarea.value !== item.text) {
            endNoteEditSession();
            setUndoState('text', snapshotNoteText());
          }
          noteTextarea.value = item.text;
          noteTextarea.focus();
          updateNoteTokenMeter();
          saveNoteDraftDebounced();
        }
        uiEls.historyMenu.classList.remove('active');
      });
      uiEls.historyMenu.appendChild(row);
    });
  }

  if (uiEls.historyBtn && uiEls.historyMenu) {
    uiEls.historyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderPromptHistoryMenu();
      uiEls.historyMenu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!uiEls.historyMenu.classList.contains('active')) return;
      if (uiEls.historyMenu.contains(e.target) || e.target === uiEls.historyBtn) return;
      uiEls.historyMenu.classList.remove('active');
    });
  }

  restoreNoteDraft();
  renderNoteTemplates();
  updateNoteTokenMeter();

  function clearNoteWithUndo({ focus = true, notify = true } = {}) {
    if (!noteTextarea || noteTextarea.value.trim() === '') return false;
    endNoteEditSession();
    setUndoState('text', snapshotNoteText());
    noteTextarea.value = '';
    if (focus) noteTextarea.focus();
    // Reset inline size so CSS defaults (400×230) apply again
    quickNoteForm.style.width = '';
    quickNoteForm.style.height = '';
    noteManuallyPositioned = false;
    try { if (chrome.runtime?.id) chrome.storage.local.set({ savedPromptDraft: '' }); } catch (e) {}
    if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
    adjustNotepadPosition();
    resetToggleTimeout();
    if (notify) showToastNotification(t('toastCleared'));
    return true;
  }
  document.getElementById('ai-note-clear-btn').addEventListener('click', (e) => { e.stopPropagation(); clearNoteWithUndo(); });
  document.getElementById('ai-note-copy-btn').addEventListener('click', (e) => { e.stopPropagation(); const textToCopy = noteTextarea ? noteTextarea.value : ''; if (!textToCopy.trim()) return; if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(textToCopy).then(() => { clearNoteWithUndo({ focus: false, notify: false }); showToastNotification(t('toastCopied')); }).catch(() => { fallbackCopyText(textToCopy); }); } else fallbackCopyText(textToCopy); });
  document.getElementById('ai-save-txt-btn').addEventListener('click', (e) => { e.stopPropagation(); const textToSave = noteTextarea ? noteTextarea.value : ''; if (!textToSave.trim()) return; const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'AI_Note_' + new Date().getTime() + '.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); showToastNotification(t('toastDownloaded')); });

  // --- Smart Split Button + Ribbon Popover: pick which Core AI gets the prompt, remember the choice ---
  // Note: most AI chat sites do NOT reliably support prefilling via a "?q=" URL parameter
  // (only ChatGPT documents it; Claude/Gemini/DeepSeek ignore it or have removed it).
  // So instead we copy the prompt to the clipboard and open the chat — this works with 100% of sites.
  // Fixed catalog of popular AIs for notepad dispatch (independent of core bookmark slots)
  const AI_DISPATCH_CATALOG = [
    { id: 'chatgpt',    label: 'ChatGPT',    short: 'GPT',      url: 'https://chatgpt.com',              qParam: 'q',  color: '#10A37F' },
    { id: 'claude',     label: 'Claude',     short: 'Claude',   url: 'https://claude.ai',                qParam: null, color: '#D97757' },
    { id: 'gemini',     label: 'Gemini',     short: 'Gemini',   url: 'https://gemini.google.com/app',    qParam: null, color: '#4C8DF6' },
    { id: 'deepseek',   label: 'DeepSeek',   short: 'Seek',     url: 'https://chat.deepseek.com',        qParam: null, color: '#5B7CFA' },
    { id: 'grok',       label: 'Grok',       short: 'Grok',     url: 'https://grok.com',                 qParam: 'q',  color: '#B4B8C2' },
    { id: 'perplexity', label: 'Perplexity', short: 'Perplex',  url: 'https://www.perplexity.ai',        qParam: 'q',  color: '#22B8CF' },
    { id: 'copilot',    label: 'Copilot',    short: 'Copilot',  url: 'https://copilot.microsoft.com',    qParam: 'q',  color: '#3B9DF5' },
    { id: 'mistral',    label: 'Mistral',    short: 'Mistral',  url: 'https://chat.mistral.ai',          qParam: null, color: '#FF7A2F' },
    { id: 'qwen',       label: 'Qwen',       short: 'Qwen',     url: 'https://chat.qwen.ai',             qParam: null, color: '#9B6BF2' },
    { id: 'pi',         label: 'Pi',         short: 'Pi',       url: 'https://pi.ai/talk',               qParam: null, color: '#FF8FAE' },
    { id: 'x',          label: 'X (Twitter)', short: 'X',       url: 'https://x.com/intent/post',         qParam: 'text', color: '#E7E9EA', verb: 'post' }
  ];
  const AI_WHEEL_VISIBLE_ROWS = 5; // چند ردیف هم‌زمان دیده شود (با ۱۰ مدل، ۵ ردیف زمینهٔ بهتری می‌دهد)

  // آیتم‌هایی که پارامتر q دارند مستقیماً پرشده باز می‌شوند؛ بقیه فقط با کپی/پیست
  function aiMethodGlyph(node) { return node && node.qParam ? '⚡' : '📋'; }
  function aiMethodLabel(node) { return (node && node.qParam) ? t('dockMethodAuto') : t('dockMethodCopy'); }

  let activeNoteAIIndex = 0; // index into AI_DISPATCH_CATALOG

  function shortenAiLabel(label) {
    const lower = (label || '').toLowerCase();
    if (lower.includes('chatgpt')) return 'GPT';
    if (lower.includes('deepseek')) return 'Seek';
    if (lower.includes('perplexity')) return 'Perplex';
    if (label.length > 9) return label.slice(0, 8) + '…';
    return label;
  }

  /**
   * Builds a platform-optimized target URL.
   * Injects ?q= (or catalog qParam) when the host supports prompt auto-fill.
   */
  function buildAiDispatchUrl(baseUrl, promptText, qParam) {
    if (!baseUrl || !promptText) return baseUrl || '';
    try {
      const parsedUrl = new URL(baseUrl);
      const hostname = parsedUrl.hostname.toLowerCase();
      let param = qParam;
      if (param === undefined) {
        const isQHost =
          hostname.includes('chatgpt.com') ||
          hostname.includes('openai.com') ||
          hostname.includes('chat.openai.com') ||
          hostname.includes('perplexity.ai') ||
          hostname.includes('copilot.microsoft.com') ||
          hostname.includes('grok.com') ||
          hostname.includes('x.ai');
        param = isQHost ? 'q' : null;
      }
      if (param) {
        parsedUrl.searchParams.set(param, promptText.trim());
        return parsedUrl.toString();
      }
      return baseUrl;
    } catch (err) {
      console.warn('[AI Tree] URL parse failed, falling back to raw base URL:', err);
      return baseUrl;
    }
  }

  /**
   * Lightweight clipboard fallback for dispatch only (does NOT clear notepad).
   */
  function fallbackCopyTextForDispatch(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); } catch (err) { /* silent */ }
    document.body.removeChild(textArea);
  }

  /**
   * Hybrid dispatch:
   * 1. Always copy prompt to clipboard (universal safety net).
   * 2. Hosts with qParam → open URL with ?q= for auto-fill + clipboard fallback.
   * 3. Others → open base site; user pastes with Ctrl/Cmd+V.
   * 4. Apple-style zoom-out on notepad, then open tab.
   */
  function sendPromptToNode(node) {
    const promptText = (noteTextarea && noteTextarea.value) ? noteTextarea.value.trim() : '';
    if (!promptText) {
      showToastNotification(t('dockEmptyPrompt'), true);
      return;
    }

    if (typeof pushPromptHistory === 'function') pushPromptHistory(promptText);

    const targetUrl = buildAiDispatchUrl(node.url, promptText, node.qParam);

    const openTab = () => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    };

    const notifyThenOpen = () => {
      const msgKey = node.qParam ? 'dockOpenedFilled' : 'dockCopiedOpen';
      showToastNotification(t(msgKey).replace('{name}', node.label));
      quickNoteForm.classList.add('dispatching');
      setTimeout(() => {
        openTab();
        closeTree();
        closeAllPanelsExcept('');
        quickNoteForm.classList.remove('dispatching');
      }, 600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptText)
        .then(notifyThenOpen)
        .catch((err) => {
          console.warn('[AI Tree] Clipboard API failed, using fallback:', err);
          fallbackCopyTextForDispatch(promptText);
          notifyThenOpen();
        });
    } else {
      fallbackCopyTextForDispatch(promptText);
      notifyThenOpen();
    }
  }

  const AI_WHEEL_ITEM_H = 26; // px — باید با ارتفاع .ai-wheel-item در CSS یکی باشد
  const AI_WHEEL_SCRUB_HYSTERESIS = 0.35;
  // scrub state قبل از setActiveAiIndex
  let wheelScrubStartY = null, wheelScrubStartIndex = 0, wheelScrubRaf = null, wheelScrubLatestY = null;

  function clampAiIndex(idx) {
    const n = AI_DISPATCH_CATALOG.length;
    if (n === 0) return 0;
    // بدون wrap دایره‌ای — آخرین/اولین گزینه پایدار می‌ماند
    if (idx < 0) return 0;
    if (idx >= n) return n - 1;
    return idx | 0;
  }

  let persistAiIndexTimer = null;
  function setActiveAiIndex(idx, persist) {
    const next = clampAiIndex(idx);
    const changed = next !== activeNoteAIIndex;
    activeNoteAIIndex = next;
    if (changed && wheelScrubStartY !== null && typeof wheelScrubLatestY === 'number') {
      wheelScrubStartY = wheelScrubLatestY;
      wheelScrubStartIndex = activeNoteAIIndex;
    }
    if (persist !== false) {
      clearTimeout(persistAiIndexTimer);
      persistAiIndexTimer = setTimeout(() => {
        try { if (chrome.runtime?.id) chrome.storage.local.set({ activeNoteAIIndex }); } catch (err) {}
      }, 250);
    }
    renderSmartRibbon();
  }
  // انتخاب فعلی را فوراً (بدون تأخیر) ذخیره کن — پیش از ارسال یا وقتی چرخ بسته می‌شود
  function commitActiveAiIndex() {
    clearTimeout(persistAiIndexTimer);
    try { if (chrome.runtime?.id) chrome.storage.local.set({ activeNoteAIIndex }); } catch (err) {}
  }

  function isAiWheelOpen() {
    return !!(uiEls.wheelPopover && uiEls.wheelPopover.classList.contains('active'));
  }

  function openAiWheel() {
    if (!uiEls.wheelPopover || !uiEls.sendActionBtn) return;
    uiEls.wheelPopover.classList.add('active');
    uiEls.sendActionBtn.classList.add('wheel-open');
    renderSmartRibbon();
  }

  function closeAiWheel() {
    if (!uiEls.wheelPopover || !uiEls.sendActionBtn) return;
    uiEls.wheelPopover.classList.remove('active');
    uiEls.sendActionBtn.classList.remove('wheel-open');
    wheelScrubStartY = null;
    commitActiveAiIndex();
  }

  function renderSmartRibbon() {
    const list = uiEls.wheelList;
    const viewport = uiEls.wheelViewport;
    const wrapper = uiEls.sendWrapper;
    const actionBtn = uiEls.sendActionBtn;
    if (!list || !viewport || !wrapper || !actionBtn) return;

    const catalog = AI_DISPATCH_CATALOG;
    if (!catalog.length) {
      list.innerHTML = '';
      uiEls.sendLabelEl.textContent = t('dockNoCore');
      actionBtn.disabled = true;
      wrapper.style.opacity = '0.5';
      return;
    }
    wrapper.style.opacity = '';
    actionBtn.disabled = false;
    activeNoteAIIndex = clampAiIndex(activeNoteAIIndex);
    const active = catalog[activeNoteAIIndex];

    // دکمهٔ فشرده: نقطهٔ رنگی برند + نام + آیکن روش ارجاع (⚡ پرشونده خودکار / 📋 کپی-پیست)
    const actionLabelKey = active.verb === 'post' ? 'dockPostName' : 'dockAskName';
    if (uiEls.sendDot) uiEls.sendDot.style.background = active.color || '#fff';
    if (uiEls.sendLabelEl) uiEls.sendLabelEl.textContent = t(actionLabelKey).replace('{name}', active.short || active.label);
    if (uiEls.sendMethodEl) uiEls.sendMethodEl.textContent = aiMethodGlyph(active);
    actionBtn.title = t(actionLabelKey).replace('{name}', active.label) + ' · ' + aiMethodLabel(active);
    wrapper.title = actionBtn.title;

    list.innerHTML = '';
    const n = catalog.length;
    catalog.forEach((node, idx) => {
      // فاصلهٔ خطی تا مرکز (بدون wrap) — با clamp غیرحلقه‌ای هماهنگ است و پرش ندارد
      const raw = idx - activeNoteAIIndex;
      const dist = Math.abs(raw);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-wheel-item' + (idx === activeNoteAIIndex ? ' is-active' : '');
      btn.dataset.index = String(idx);

      const dot = document.createElement('span'); dot.className = 'ai-wheel-item-dot'; dot.style.background = node.color || '#fff';
      const label = document.createElement('span'); label.className = 'ai-wheel-item-label'; label.textContent = node.short || node.label;
      const method = document.createElement('span'); method.className = 'ai-wheel-item-method'; method.textContent = aiMethodGlyph(node);
      btn.appendChild(dot); btn.appendChild(label); btn.appendChild(method);
      btn.title = node.label + ' · ' + aiMethodLabel(node);

      // ذره‌بین: مرکز واضح و کمی بزرگ، اطراف محو/کوچک/چرخیده (افکت استوانه‌ای شبیه پیکر iOS)
      const scale = Math.max(0.74, 1 - dist * 0.1);
      const opacity = idx === activeNoteAIIndex ? 1 : Math.max(0.14, 1 - dist * 0.34);
      const blur = idx === activeNoteAIIndex ? 0 : Math.min(2.2, dist * 0.55);
      const rotateX = Math.max(-42, Math.min(42, raw * 20));
      btn.style.opacity = String(opacity);
      btn.style.filter = blur ? `blur(${blur}px)` : 'none';
      btn.style.transform = `perspective(360px) rotateX(${rotateX}deg) scale(${scale})`;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (idx === activeNoteAIIndex) {
          closeAiWheel();
          sendPromptToNode(node);
        } else {
          setActiveAiIndex(idx);
        }
      });
      list.appendChild(btn);
    });

    const centerRow = Math.floor(AI_WHEEL_VISIBLE_ROWS / 2);
    const offset = (activeNoteAIIndex * AI_WHEEL_ITEM_H) - (centerRow * AI_WHEEL_ITEM_H);
    list.style.transform = `translateY(${-offset}px)`;
  }

  // --- باز/بسته شدن با هاور موس (بهینه برای کاربر ماوس) + پشتیبانی کلیک/کیبورد ---
  let wheelOpenTimer = null, wheelCloseTimer = null;
  function scheduleOpenWheel() { clearTimeout(wheelCloseTimer); wheelOpenTimer = setTimeout(openAiWheel, 150); }
  function scheduleCloseWheel() { clearTimeout(wheelOpenTimer); wheelCloseTimer = setTimeout(closeAiWheel, 260); }

  if (uiEls.sendWrapper) {
    uiEls.sendWrapper.addEventListener('mouseenter', scheduleOpenWheel);
    uiEls.sendWrapper.addEventListener('mouseleave', scheduleCloseWheel);
    uiEls.sendWrapper.addEventListener('focusin', () => { clearTimeout(wheelCloseTimer); openAiWheel(); });
    uiEls.sendWrapper.addEventListener('focusout', (e) => {
      if (uiEls.sendWrapper.contains(e.relatedTarget)) return;
      closeAiWheel();
    });
    uiEls.sendWrapper.addEventListener('keydown', (e) => {
      if (!isAiWheelOpen()) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAiWheel(); } return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveAiIndex(activeNoteAIIndex - 1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveAiIndex(activeNoteAIIndex + 1); }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const node = AI_DISPATCH_CATALOG[clampAiIndex(activeNoteAIIndex)];
        if (node && node.url) { closeAiWheel(); sendPromptToNode(node); }
      } else if (e.key === 'Escape') { e.preventDefault(); closeAiWheel(); }
    });
  }

  // کلیک روی دکمهٔ فشرده: اگر چرخ بسته است بازش کن (لمسی/بدون‌ماوس)، اگر باز است یعنی مرکز را می‌فرستد
  if (uiEls.sendActionBtn) {
    uiEls.sendActionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isAiWheelOpen()) { openAiWheel(); return; }
      const node = AI_DISPATCH_CATALOG[clampAiIndex(activeNoteAIIndex)];
      if (!node || !node.url) return;
      closeAiWheel();
      sendPromptToNode(node);
    });
  }

  // اسکرول روی چرخ = یک پلهٔ گسسته؛ در ابتدا/انتها متوقف (بدون پرش)
  if (uiEls.wheelViewport) {
    let wheelLock = false;
    uiEls.wheelViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (wheelLock) return;
      const dir = e.deltaY > 0 ? 1 : (e.deltaY < 0 ? -1 : 0);
      if (!dir) return;
      const next = clampAiIndex(activeNoteAIIndex + dir);
      if (next === activeNoteAIIndex) return;
      wheelLock = true;
      setActiveAiIndex(next);
      setTimeout(() => { wheelLock = false; }, 90);
    }, { passive: false });
  }

  // اسکراب موس با hysteresis — بدون wrap
  if (uiEls.wheelViewport) {
    uiEls.wheelViewport.addEventListener('mousemove', (e) => {
      if (wheelScrubStartY === null) {
        wheelScrubStartY = e.clientY;
        wheelScrubStartIndex = activeNoteAIIndex;
      }
      wheelScrubLatestY = e.clientY;
      if (wheelScrubRaf) return;
      wheelScrubRaf = requestAnimationFrame(() => {
        wheelScrubRaf = null;
        if (wheelScrubStartY === null) return;
        const deltaY = wheelScrubLatestY - wheelScrubStartY;
        const raw = deltaY / AI_WHEEL_ITEM_H;
        let steps;
        if (raw >= 0) steps = Math.floor(raw + (1 - AI_WHEEL_SCRUB_HYSTERESIS));
        else steps = Math.ceil(raw - (1 - AI_WHEEL_SCRUB_HYSTERESIS));
        if (steps === 0) return;
        const target = clampAiIndex(wheelScrubStartIndex + steps);
        if (target !== activeNoteAIIndex) setActiveAiIndex(target, false);
      });
    });
    uiEls.wheelViewport.addEventListener('mouseleave', () => {
      wheelScrubStartY = null;
      wheelScrubLatestY = null;
    });
    uiEls.wheelViewport.addEventListener('mouseenter', (e) => {
      wheelScrubStartY = e.clientY;
      wheelScrubStartIndex = activeNoteAIIndex;
      wheelScrubLatestY = e.clientY;
    });
  }

  // کلیک بیرون از ویجت، چرخ را می‌بندد
  document.addEventListener('click', (e) => {
    if (!isAiWheelOpen()) return;
    const wrap = uiEls.sendWrapper;
    if (wrap && wrap.contains(e.target)) return;
    closeAiWheel();
  });

  function fallbackCopyText(text) { const textArea = document.createElement("textarea"); textArea.value = text; textArea.style.position = "fixed"; textArea.style.opacity = "0"; document.body.appendChild(textArea); textArea.focus(); textArea.select(); try { document.execCommand('copy'); clearNoteWithUndo({ focus: false, notify: false }); showToastNotification(t('toastCopied')); } catch (err) {} document.body.removeChild(textArea); setTimeout(resetToggleTimeout, 100); }

  function getFaviconUrl(urlStr) { try { const domain = new URL(urlStr).hostname; return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`; } catch(e) { return ''; } }

  function isDuplicateNodeAll(newUrl, newLabel, skipIndex = null, skipHub = null) {
    const cleanUrl = newUrl.replace(/\/$/, '').toLowerCase(); const cleanLabel = newLabel.toLowerCase();
    const checkArr = (arr, hubId) => arr.some((link, idx) => {
        if (hubId === skipHub && idx === skipIndex) return false;
        if (!link.url) return false;
        return link.url.replace(/\/$/, '').toLowerCase() === cleanUrl || link.label.toLowerCase() === cleanLabel;
    });
    return checkArr(linksData, 1) || checkArr(linksData2, 2) || checkArr(linksData3, 3);
  }

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
          let langChanged = false;
          if (changes.appLanguage) { currentLang = changes.appLanguage.newValue || 'en'; langChanged = true; }
          if (changes.userBirthYear) { userBirthYear = changes.userBirthYear.newValue ? parseInt(changes.userBirthYear.newValue, 10) : null; if(clockPanel.classList.contains('active')) updateClockAge(); }
          if (changes.aiTreeTodos) { todosData = changes.aiTreeTodos.newValue || []; migrateTodos(); pruneExpiredDailyTodos(); if(todoPanel.classList.contains('active')) renderTodos(); }
          if (changes.aiTreeMarkedDays) { markedDays = changes.aiTreeMarkedDays.newValue || []; if (clockPanel.classList.contains('active')) renderMarkedDays(); }
          if (changes.lastDeletedLink) {
              if (changes.lastDeletedLink.newValue) {
                  if (!pendingUndoState.type) setUndoState('storage', null);
              } else if (pendingUndoState.type === 'storage') {
                  clearTimeout(globalUndoTimeout); undoToggleDot.classList.remove('active-undo'); pendingUndoState = { type: null, data: null, hub: 1 };
              }
          }
          if (langChanged) { updateUITexts(); }
      }
    });
  } catch (e) {}

  function storageGet(area, keys) {
    return new Promise((resolve) => {
      try { chrome.storage[area].get(keys, (res) => resolve(res || {})); }
      catch (e) { resolve({}); }
    });
  }

  async function loadDataAndRender() {
    const [syncData, localData] = await Promise.all([
      storageGet('sync', ['orbitX', 'orbitY', 'linksData', 'coreAIConfig', 'lastDeletedLink', 'userBirthYear', 'nodeSpacing', 'aiTreeTodos', 'appLanguage', 'aiTreeMarkedDays', 'clockCustomX', 'clockCustomY']),
      storageGet('local', ['linksData', 'linksData2', 'linksData3', 'activeNoteAIIndex'])
    ]);

    if (typeof localData.activeNoteAIIndex === 'number') activeNoteAIIndex = clampAiIndex(localData.activeNoteAIIndex);

    let resolvedLinksData = localData.linksData;
    if ((!resolvedLinksData || resolvedLinksData.length === 0) && syncData.linksData && syncData.linksData.length > 0) {
      resolvedLinksData = syncData.linksData;
      try { chrome.storage.local.set({ linksData: resolvedLinksData }); chrome.storage.sync.remove('linksData'); } catch (err) {}
    }

    if (syncData.appLanguage) currentLang = syncData.appLanguage;
    updateUITexts();

    if (syncData.orbitX !== undefined) { root.style.left = syncData.orbitX + 'px'; root.style.top = syncData.orbitY + 'px'; root.style.bottom = 'auto'; } else { root.style.left = WIDGET1_DEFAULT_LEFT; root.style.top = 'auto'; root.style.bottom = WIDGET1_DEFAULT_BOTTOM; }

    let defaultCore = [{ label: 'Claude', url: 'https://claude.ai' }, { label: 'Gemini', url: 'https://gemini.google.com' }, { label: 'ChatGPT', url: 'https://chatgpt.com' }, { label: 'DeepSeek', url: 'https://chatdeepseek.com' }];
    if (syncData.coreAIConfig && syncData.coreAIConfig.length === 4) defaultCore = syncData.coreAIConfig;

    linksData = (resolvedLinksData && resolvedLinksData.length >= 4) ? resolvedLinksData : defaultCore;

    const blankQuad = () => [ { label: '', url: '' }, { label: '', url: '' }, { label: '', url: '' }, { label: '', url: '' } ];
    linksData2 = (localData.linksData2 && localData.linksData2.length >= 4) ? localData.linksData2 : blankQuad();
    linksData3 = (localData.linksData3 && localData.linksData3.length >= 4) ? localData.linksData3 : blankQuad();

    if(syncData.lastDeletedLink) setUndoState('storage', null);
    if(syncData.userBirthYear) userBirthYear = parseInt(syncData.userBirthYear, 10);
    if(syncData.aiTreeTodos) { todosData = syncData.aiTreeTodos; migrateTodos(); pruneExpiredDailyTodos(); }
    if(Array.isArray(syncData.aiTreeMarkedDays)) markedDays = syncData.aiTreeMarkedDays;
    if (typeof syncData.nodeSpacing === 'number' && !isNaN(syncData.nodeSpacing)) SPACING = Math.min(MAX_SPACING, Math.max(MIN_SPACING, syncData.nodeSpacing));
    if (syncData.clockCustomX !== undefined && syncData.clockCustomY !== undefined) {
      // فقط مختصات اولیه؛ لنگر دائمی نیست تا با باز شدن دوباره کنار هاب قرار بگیرد
      clockPanel.style.left = syncData.clockCustomX + 'px'; clockPanel.style.top = syncData.clockCustomY + 'px';
      clockManuallyPositioned = false;
    }
    paintSpacingArc();

    root.classList.add('initial-reveal'); resetAutoCollapseTimer(); resetToggleTimeout();
    renderTierDots(); syncDotsVisibility();
    renderSmartRibbon();
  }
  loadDataAndRender();
  
  function saveLinksAll() { 
    try { 
      if (chrome.runtime?.id) { chrome.storage.local.set({ linksData: linksData, linksData2: linksData2, linksData3: linksData3 }); } 
      renderSmartRibbon();
    } catch (e) { showToastNotification(t('toastStorageErr'), true); } 
  }

  allToggleDot.addEventListener('click', (e) => {
    if (!chrome.runtime?.id) return; e.stopPropagation(); 
    if (showAllOverride) { closeTree(); } else { closeAllPanelsExcept(''); isOpen = true; showAllOverride = true; root.classList.add('open', 'show-all-active'); setHubLabel(t('hubAll')); renderSpiral(); resetToggleTimeout(); }
  });
  
  function cycleLayer() { 
      showAllOverride = false; root.classList.remove('show-all-active'); 
      currentLayerMode++; if (currentLayerMode >= MAX_LAYERS) currentLayerMode = 0; 
      let nextLabel = RING_CONFIG[currentLayerMode].label;
      if (RING_CONFIG[currentLayerMode].labelKey) nextLabel = t(RING_CONFIG[currentLayerMode].labelKey);
      setHubLabel(nextLabel); renderSpiral(); 
  }

  function calculateSafePositions(countToGenerate) {
    const hubRect = hub.getBoundingClientRect(); const cx = hubRect.left + (hubRect.width / 2); const cy = hubRect.top + (hubRect.height / 2); const vw = window.innerWidth; const vh = window.innerHeight; const SAFE_W = 55; const SAFE_H = 24; const EDGE_PAD = 12; let validPositions = []; let attempt = 1; const MAX_ATTEMPTS = 900;
    const spaceLeft = cx - EDGE_PAD; const spaceRight = (vw - EDGE_PAD) - cx;
    const spaceTop = cy - EDGE_PAD; const spaceBottom = (vh - EDGE_PAD) - cy;
    const biasAngleDeg = Math.atan2(-(spaceBottom - spaceTop), (spaceRight - spaceLeft)) * (180 / Math.PI);
    const LEVER_ZONE_R = 88; 
    while (validPositions.length < countToGenerate && attempt < MAX_ATTEMPTS) { const angle = biasAngleDeg + (attempt * GOLDEN_ANGLE); const radius = START_RADIUS + (SPACING * Math.sqrt(attempt - 1)); const rad = angle * (Math.PI / 180); const x = Math.cos(rad) * radius; const y = -Math.sin(rad) * radius; const absX = cx + x; const absY = cy + y; const normAngle = ((angle % 360) + 360) % 360; const inLeverZone = radius < LEVER_ZONE_R && (normAngle <= 100 || normAngle >= 350); const isSafe = !inLeverZone && (absX - SAFE_W > EDGE_PAD && absX + SAFE_W < vw - EDGE_PAD && absY - SAFE_H > EDGE_PAD && absY + SAFE_H < vh - EDGE_PAD); if (isSafe) validPositions.push({ x, y }); attempt++; } return validPositions;
  }

  function renderSpiral() {
    document.querySelectorAll('.ai-node').forEach(el => el.remove()); spiralNodeEls = [];
    if (typeof closeStarEditor === 'function') closeStarEditor();
    if (typeof renderTierDots === 'function') renderTierDots();
    if (typeof renderHubDots === 'function') renderHubDots();
    
    const activeData = hubData(currentHubIndex);

    let visibleIndices = [];
    let ring = null;
    if (showAllOverride) {
        visibleIndices = activeData.map((_, i) => i);
    } else {
        if (currentLayerMode === 0) {
            visibleIndices = [0, 1, 2, 3].filter(i => i < activeData.length);
        } else {
            ring = RING_CONFIG[currentLayerMode];
            for (let i = 4; i < activeData.length; i++) {
                if (importanceMatchesRing(activeData[i].importance || 3, ring)) visibleIndices.push(i);
            }
            visibleIndices = visibleIndices.slice(0, ring.max);
        }
    }

    visibleIndices.sort((a, b) => {
        const aRank = a < 4 ? 999 : (activeData[a].importance || 3);
        const bRank = b < 4 ? 999 : (activeData[b].importance || 3);
        if (aRank !== bRank) return bRank - aRank;
        return a - b;
    });

    let coreIndices = visibleIndices.filter(i => i < 4);
    let bookmarkIndices = visibleIndices.filter(i => i >= 4);

    let portals = [];
    if (!showAllOverride) {
        // Slot order follows the direction the user is currently traveling in, so clicking the
        // *same spot* repeatedly continues the trip (forward keeps 🌌 in that slot, backward keeps 🌍).
        const forwardPortal = (currentLayerMode === 0)
            ? (currentHubIndex < HUB_COUNT ? { isPortal: true, target: currentHubIndex + 1, label: t('portalForward').replace('{n}', currentHubIndex), icon: '🌌' } : null)
            : (currentHubIndex < HUB_COUNT && hubHasTierItems(currentHubIndex + 1, ring) ? { isPortal: true, target: currentHubIndex + 1, label: `${ring.label} · ${t('portalForward').replace('{n}', currentHubIndex)}`, icon: '🌌', keepLayer: true } : null);
        const backPortal = (currentLayerMode === 0)
            ? (currentHubIndex > 1 ? { isPortal: true, target: 1, label: t('portalHome'), icon: '🌍' } : null)
            : (currentHubIndex > 1 && hubHasTierItems(1, ring) ? { isPortal: true, target: 1, label: `${ring.label} · ${t('portalHome')}`, icon: '🌍', keepLayer: true } : null);

        if (hubNavDirection === 'backward') {
            if (backPortal) portals.push(backPortal);
            if (forwardPortal) portals.push(forwardPortal);
        } else {
            if (forwardPortal) portals.push(forwardPortal);
            if (backPortal) portals.push(backPortal);
        }
    }

    let renderItems = [];
    coreIndices.forEach(idx => renderItems.push({ type: 'node', globalIdx: idx, data: activeData[idx] }));
    portals.forEach(p => renderItems.push({ type: 'portal', data: p }));
    bookmarkIndices.forEach(idx => renderItems.push({ type: 'node', globalIdx: idx, data: activeData[idx] }));

    const safePositions = calculateSafePositions(renderItems.length + 1);

    renderItems.forEach((item, index) => {
      if (index >= MAX_NODES) return; const pos = safePositions[index]; if (!pos) return;

      if (item.type === 'node') {
          const globalIdx = item.globalIdx; const link = item.data;
          const isBlankCore = globalIdx < 4 && !link.url;

          const a = document.createElement('a'); a.className = 'ai-node'; a.target = "_blank";
          let colorSet; const content = document.createElement('div'); content.className = 'ai-node-content';

          if (isBlankCore) {
              a.classList.add('core-text-circle', 'ai-node-empty');
              a.removeAttribute('target'); a.href = 'javascript:void(0)';
              const plus = document.createElement('span'); plus.className = 'ai-node-empty-plus'; plus.textContent = '+';
              content.appendChild(plus);
              a.style.left = `${pos.x}px`; a.style.top = `${pos.y}px`; a.style.transitionDelay = `${index * 0.03}s`;
              a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openEditForm(globalIdx, a); });
              a.appendChild(content); root.appendChild(a); spiralNodeEls.push(a);
              return;
          }

          const fav = document.createElement('img'); fav.className = 'ai-node-favicon'; fav.src = getFaviconUrl(link.url);
          fav.addEventListener('error', () => fav.style.display = 'none');
          const span = document.createElement('span');

          if (globalIdx < 4) {
            colorSet = CORE_COLORS[globalIdx]; a.classList.add('core-text-circle'); 
            let shortLabel = link.label; if (shortLabel.toLowerCase() === 'chatgpt') shortLabel = 'GPT'; if (shortLabel.toLowerCase() === 'deepseek') shortLabel = 'Seek';
            span.textContent = shortLabel; a.style.boxShadow = `0 0 16px ${colorSet.glow}, inset 0 0 8px ${colorSet.glow}`;

            const editBtn = document.createElement('div'); editBtn.className = 'edit-node-btn';
            editBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
            a.appendChild(editBtn); editBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openEditForm(globalIdx, a); });
          } else {
            const nodeLayer = Math.max(0, (link.importance || 3) - 1); const extraIdx = nodeLayer % EXTRA_COLORS.length;
            const importance = link.importance || 3; a.dataset.importance = importance; a.classList.add(`priority-${importance}`);
            colorSet = EXTRA_COLORS[extraIdx]; span.textContent = link.label;
            a.style.boxShadow = `0 4px ${10 + importance * 3}px ${colorSet.glow}`;

            const impBadge = document.createElement('div'); impBadge.className = 'importance-badge'; impBadge.textContent = '★'.repeat(importance); 
            a.appendChild(impBadge);
            impBadge.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); });
            impBadge.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openStarEditor(globalIdx, impBadge); });

            const editBtn = document.createElement('div'); editBtn.className = 'edit-node-btn';
            editBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
            a.appendChild(editBtn); editBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openEditForm(globalIdx, a); });

          }
          
          content.appendChild(fav); content.appendChild(span); a.appendChild(content); a.href = link.url;
          if (link.description) {
            const descTip = document.createElement('div'); descTip.className = 'ai-node-desc-tooltip'; descTip.textContent = link.description;
            a.appendChild(descTip);
          }
          a.style.background = colorSet.bg; a.style.border = `1px solid ${colorSet.border}`; a.style.left = `${pos.x}px`; a.style.top = `${pos.y}px`; a.style.transitionDelay = `${index * 0.03}s`;
          
          a.addEventListener('click', (e) => { 
              if(e.target.closest('.edit-node-btn')) { e.preventDefault(); e.stopPropagation(); return; }
              e.stopPropagation(); closeTree(); 
          }); 
          root.appendChild(a); spiralNodeEls.push(a);

      } else if (item.type === 'portal') {
          const a = document.createElement('a'); a.className = 'ai-node portal-node core-text-circle'; a.href = 'javascript:void(0)';
          if (item.data.icon === '🌍') a.classList.add('portal-node-home'); 
          a.title = item.data.label;
          const content = document.createElement('div'); content.className = 'ai-node-content';
          const iconSpan = document.createElement('span'); iconSpan.className = 'portal-icon'; iconSpan.textContent = item.data.icon;
          content.appendChild(iconSpan); a.appendChild(content);

          a.style.left = `${pos.x}px`; a.style.top = `${pos.y}px`; a.style.transitionDelay = `${index * 0.03}s`;

          a.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); hubNavDirection = (item.data.icon === '🌍') ? 'backward' : 'forward'; switchHub(item.data.target, item.data.keepLayer); });
          root.appendChild(a); spiralNodeEls.push(a);
      }
    });

    if (activeData.length < MAX_NODES) {
      const addPos = safePositions[renderItems.length];
      if (addPos) { addNodeBtn.style.left = `${addPos.x}px`; addNodeBtn.style.top = `${addPos.y}px`; addNodeBtn.style.display = 'flex'; }
      else {
        const hubRect = hub.getBoundingClientRect(); const vw = window.innerWidth; const vh = window.innerHeight;
        const cx = hubRect.left + hubRect.width / 2; const cy = hubRect.top + hubRect.height / 2;
        const dirX = cx < vw / 2 ? 1 : -1; const dirY = cy < vh / 2 ? 1 : -1;
        addNodeBtn.style.left = `${dirX * 66}px`; addNodeBtn.style.top = `${dirY * 66}px`; addNodeBtn.style.display = 'flex';
      }
    } else addNodeBtn.style.display = 'none';

    hub.classList.toggle('hub-infinity', currentHubIndex > 1);
  }

  function switchHub(targetIndex, keepLayer) {
      currentHubIndex = targetIndex;
      if (!keepLayer) currentLayerMode = 0;
      setHubLabel(currentLayerMode === 0 ? t('hubCore') : RING_CONFIG[currentLayerMode].label);
      renderSpiral(); renderTierDots();
  }

  function repositionSpiralNodes() {
    if (!isOpen || spiralNodeEls.length === 0) return;
    const activeData = hubData(currentHubIndex);
    const safePositions = calculateSafePositions(spiralNodeEls.length + 1);
    spiralNodeEls.forEach((el, index) => { const pos = safePositions[index]; if (pos) { el.style.left = `${pos.x}px`; el.style.top = `${pos.y}px`; } });
    if (activeData.length < MAX_NODES) {
      const addPos = safePositions[spiralNodeEls.length]; if (addPos) { addNodeBtn.style.left = `${addPos.x}px`; addNodeBtn.style.top = `${addPos.y}px`; }
    }
  }

  function openEditForm(globalIdx, anchorEl) {
    editingNodeIndex = globalIdx;
    const activeData = hubData(currentHubIndex);
    const link = activeData[globalIdx];
    const isAddFlow = !link || !link.url;
    isLabelManuallyEdited = !isAddFlow;

    document.querySelectorAll('.ai-node').forEach(node => node.classList.add('faded')); addNodeBtn.classList.remove('blinking');
    const vw = window.innerWidth; const vh = window.innerHeight; const FORM_WIDTH = 260; const FORM_HEIGHT = 375; 
    inlineForm.style.left = `${(vw - FORM_WIDTH) / 2}px`; inlineForm.style.top = `${(vh - FORM_HEIGHT) / 2}px`;
    
    uiEls.formUrl.value = link.url || ''; uiEls.formLabel.value = link.label || '';
    uiEls.formDescription.value = link.description || '';
    uiEls.formLabel.classList.remove('invalid'); uiEls.formUrl.classList.remove('invalid');
    selectedImportance = link.importance || DEFAULT_IMPORTANCE; paintStars(selectedImportance);
    uiEls.formImportanceWrap.style.display = (globalIdx < 4) ? 'none' : '';
    uiEls.formGalaxyWrap.style.display = (isAddFlow || globalIdx < 4) ? 'none' : '';
    if (!isAddFlow && globalIdx >= 4) {
      selectedGalaxy = currentHubIndex;
      requestAnimationFrame(() => snapGalaxyKnobTo(selectedGalaxy, false));
    }
    if (isAddFlow) { uiEls.formMainTitle.textContent = t('formAddTitle'); uiEls.formSave.textContent = t('formSaveBtn'); }
    else { uiEls.formMainTitle.textContent = t('formEditTitle'); uiEls.formSave.textContent = t('formUpdateBtn'); }
    uiEls.formDelete.style.display = isAddFlow ? 'none' : '';
    uiEls.formDelete.textContent = (globalIdx < 4) ? t('formClearCoreBtn') : t('formDeleteBtn');
    inlineForm.classList.add('active');
    if (isAddFlow) uiEls.formUrl.focus(); else uiEls.formLabel.focus();
  }

  let starEditorTargetIdx = null;
  function paintStarEditor(value) { starEditorPopup.querySelectorAll('.ai-star-edit').forEach(s => s.classList.toggle('active', parseInt(s.dataset.value, 10) <= value)); }
  
  function positionStarPopupAtHub() {
    const rect = hub.getBoundingClientRect(); const vw = window.innerWidth; const vh = window.innerHeight; const POP_W = 132; const POP_H = 32;
    let left = rect.left + (rect.width / 2) - (POP_W / 2); let top = rect.top - POP_H - 14;
    if (left < 8) left = 8; if (left + POP_W > vw - 8) left = vw - POP_W - 8; if (top < 8) top = rect.bottom + 14;
    starEditorPopup.style.left = `${left}px`; starEditorPopup.style.top = `${top}px`;
  }
  
  function openStarEditor(globalIdx, anchorEl) {
    starEditorTargetIdx = globalIdx;
    const rect = anchorEl.getBoundingClientRect(); const vw = window.innerWidth; const vh = window.innerHeight; const POP_W = 132; const POP_H = 32;
    let left = rect.left + (rect.width / 2) - (POP_W / 2); let top = rect.top - POP_H - 10;
    if (left < 8) left = 8; if (left + POP_W > vw - 8) left = vw - POP_W - 8; if (top < 8) top = rect.bottom + 10;
    starEditorPopup.style.left = `${left}px`; starEditorPopup.style.top = `${top}px`;
    const activeData = hubData(currentHubIndex);
    const link = activeData[globalIdx];
    paintStarEditor(link ? (link.importance || DEFAULT_IMPORTANCE) : DEFAULT_IMPORTANCE);
    starEditorPopup.classList.add('active');
  }
  
  function closeStarEditor() { 
    starEditorPopup.classList.remove('active', 'quickadd-mode'); 
    starEditorTargetIdx = null; 
    quickAddActive = false; 
    quickAddStars = 0;
  }

  starEditorPopup.querySelectorAll('.ai-star-edit').forEach(starEl => {
    starEl.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (quickAddActive) {
        const selectedStars = parseInt(starEl.dataset.value, 10);
        quickAddCurrentTab(selectedStars);
        closeStarEditor();
        return;
      }

      const activeData = hubData(currentHubIndex);
      if (starEditorTargetIdx === null || !activeData[starEditorTargetIdx]) { closeStarEditor(); return; }
      const link = activeData[starEditorTargetIdx];
      const newImportance = parseInt(starEl.dataset.value, 10);
      if (newImportance === (link.importance || DEFAULT_IMPORTANCE)) { closeStarEditor(); return; }

      const { ring, targetHub } = findTargetHubForImportance(newImportance, currentHubIndex);
      if (targetHub > HUB_COUNT) { closeStarEditor(); showToastNotification(t('toastTierFullEverywhere').replace('{tier}', ring.label), true); return; }

      if (targetHub === currentHubIndex) {
        link.importance = newImportance;
        saveLinksAll(); closeStarEditor(); renderSpiral(); showToastNotification(t('toastStarUpdated'));
      } else {
        activeData.splice(starEditorTargetIdx, 1);
        link.importance = newImportance;
        hubData(targetHub).push(link);
        saveLinksAll(); closeStarEditor();
        showToastNotification(t('toastOverflowed').replace('{tier}', ring.label).replace('{hub}', targetHub - 1));
        currentLayerMode = RING_CONFIG.indexOf(ring);
        switchHub(targetHub, true);
      }
    });
    
    starEl.addEventListener('mouseenter', () => paintStarEditor(parseInt(starEl.dataset.value, 10)));
    starEl.addEventListener('mousedown', (e) => { e.stopPropagation(); });
  });

  starEditorPopup.addEventListener('mouseleave', () => {
    const activeData = hubData(currentHubIndex);
    if (starEditorTargetIdx !== null && activeData[starEditorTargetIdx]) paintStarEditor(activeData[starEditorTargetIdx].importance || DEFAULT_IMPORTANCE);
  });
  
  document.addEventListener('mousedown', (e) => {
    if (!starEditorPopup.classList.contains('active')) return;
    if (starEditorPopup.contains(e.target) || e.target.classList.contains('importance-badge')) return;
    closeStarEditor();
  });

  let selectedImportance = 3; const DEFAULT_IMPORTANCE = 3;
  const starEls = Array.from(inlineForm.querySelectorAll('.ai-star'));
  function paintStars(value) { starEls.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value, 10) <= value)); }
  starEls.forEach(starEl => {
    starEl.addEventListener('click', (e) => { e.stopPropagation(); selectedImportance = parseInt(starEl.dataset.value, 10); paintStars(selectedImportance); });
    starEl.addEventListener('mouseenter', () => paintStars(parseInt(starEl.dataset.value, 10)));
  });
  const starsWrap = document.getElementById('ai-form-stars');
  starsWrap.addEventListener('mouseleave', () => paintStars(selectedImportance));

  let selectedGalaxy = 1;
  const galaxyStops = Array.from(uiEls.formGalaxyTrack.querySelectorAll('.ai-galaxy-stop'));
  function snapGalaxyKnobTo(hubNum, animate = true) {
    const stopEl = galaxyStops.find(s => parseInt(s.dataset.hub, 10) === hubNum);
    if (!stopEl) return;
    uiEls.formGalaxyKnob.classList.toggle('no-anim', !animate);
    const trackRect = uiEls.formGalaxyTrack.getBoundingClientRect();
    const stopRect = stopEl.getBoundingClientRect();
    const leftPx = stopRect.left + stopRect.width / 2 - trackRect.left - uiEls.formGalaxyKnob.offsetWidth / 2;
    uiEls.formGalaxyKnob.style.left = `${leftPx}px`;
    galaxyStops.forEach(s => s.classList.toggle('active', parseInt(s.dataset.hub, 10) === hubNum));
  }
  galaxyStops.forEach(stopEl => {
    stopEl.addEventListener('click', (e) => { e.stopPropagation(); selectedGalaxy = parseInt(stopEl.dataset.hub, 10); snapGalaxyKnobTo(selectedGalaxy); });
  });
  let isGalaxyDragging = false;
  function galaxyDragStart(e) { e.stopPropagation(); e.preventDefault(); isGalaxyDragging = true; uiEls.formGalaxyKnob.classList.add('dragging', 'no-anim'); }
  uiEls.formGalaxyKnob.addEventListener('mousedown', galaxyDragStart);
  uiEls.formGalaxyKnob.addEventListener('touchstart', galaxyDragStart, { passive: false });
  function galaxyDragMove(e) {
    if (!isGalaxyDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const trackRect = uiEls.formGalaxyTrack.getBoundingClientRect();
    let leftPx = clientX - trackRect.left - uiEls.formGalaxyKnob.offsetWidth / 2;
    leftPx = Math.max(0, Math.min(trackRect.width - uiEls.formGalaxyKnob.offsetWidth, leftPx));
    uiEls.formGalaxyKnob.style.left = `${leftPx}px`;
  }
  document.addEventListener('mousemove', galaxyDragMove);
  document.addEventListener('touchmove', galaxyDragMove, { passive: false });
  function galaxyDragEnd() {
    if (!isGalaxyDragging) return;
    isGalaxyDragging = false; uiEls.formGalaxyKnob.classList.remove('dragging');
    const knobRect = uiEls.formGalaxyKnob.getBoundingClientRect(); const knobCenterX = knobRect.left + knobRect.width / 2;
    let nearest = galaxyStops[0]; let nearestDist = Infinity;
    galaxyStops.forEach(s => {
      const r = s.getBoundingClientRect(); const dist = Math.abs((r.left + r.width / 2) - knobCenterX);
      if (dist < nearestDist) { nearestDist = dist; nearest = s; }
    });
    selectedGalaxy = parseInt(nearest.dataset.hub, 10);
    snapGalaxyKnobTo(selectedGalaxy);
  }
  document.addEventListener('mouseup', galaxyDragEnd);
  document.addEventListener('touchend', galaxyDragEnd);
  window.addEventListener('resize', () => { if (uiEls.formGalaxyWrap.style.display !== 'none') snapGalaxyKnobTo(selectedGalaxy, false); });

  addNodeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); addNodeBtn.classList.add('blinking'); document.querySelectorAll('.ai-node').forEach(node => node.classList.add('faded'));
    editingNodeIndex = null; isLabelManuallyEdited = false; 
    uiEls.formMainTitle.textContent = t('formAddTitle'); uiEls.formSave.textContent = t('formSaveBtn');
    const vw = window.innerWidth; const vh = window.innerHeight; const FORM_WIDTH = 260; const FORM_HEIGHT = 310; 
    inlineForm.style.left = `${(vw - FORM_WIDTH) / 2}px`; inlineForm.style.top = `${(vh - FORM_HEIGHT) / 2}px`;
    uiEls.formUrl.value = ''; uiEls.formLabel.value = ''; uiEls.formDescription.value = '';
    uiEls.formLabel.classList.remove('invalid'); uiEls.formUrl.classList.remove('invalid');
    uiEls.formImportanceWrap.style.display = '';
    uiEls.formDelete.style.display = 'none';
    uiEls.formGalaxyWrap.style.display = 'none';
    selectedImportance = DEFAULT_IMPORTANCE; paintStars(selectedImportance);
    inlineForm.classList.add('active'); uiEls.formUrl.focus();
  });

  function closeInlineForm() {
    inlineForm.classList.remove('active'); addNodeBtn.classList.remove('blinking');
    document.querySelectorAll('.ai-node').forEach(node => node.classList.remove('faded'));
  }

  function submitBookmarkForm() {
    const labelInput = uiEls.formLabel; const urlInput = uiEls.formUrl;
    const label = labelInput.value.trim(); let url = urlInput.value.trim();
    const description = uiEls.formDescription.value.trim();
    labelInput.classList.remove('invalid'); urlInput.classList.remove('invalid');

    const activeDataForCheck = hubData(currentHubIndex);
    const isEditingCore = editingNodeIndex !== null && editingNodeIndex < 4 && !!activeDataForCheck[editingNodeIndex];
    if (isEditingCore && !label && !url) {
      activeDataForCheck[editingNodeIndex] = { label: '', url: '', description: '', importance: DEFAULT_IMPORTANCE };
      editingNodeIndex = null; saveLinksAll(); renderSpiral(); closeTree();
      showToastNotification(t('toastDeleted'), true); return;
    }

    if (!label) { labelInput.classList.add('invalid'); labelInput.focus(); return; }
    if (!url) { urlInput.classList.add('invalid'); urlInput.focus(); return; }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try { new URL(url); } catch (err) { urlInput.classList.add('invalid'); urlInput.focus(); showToastNotification(t('toastInvalidUrl'), true); return; }

    const activeData = hubData(currentHubIndex);
    const isEditing = editingNodeIndex !== null && !!activeData[editingNodeIndex];

    if (isDuplicateNodeAll(url, label, isEditing ? editingNodeIndex : null, currentHubIndex)) { showToastNotification(t('toastExists'), true); return; }

    if (isEditing) {
        if (editingNodeIndex >= 4 && selectedGalaxy && selectedGalaxy !== currentHubIndex) {
          const movedItem = activeData.splice(editingNodeIndex, 1)[0];
          movedItem.label = label; movedItem.url = url; movedItem.importance = selectedImportance; movedItem.description = description;
          hubData(selectedGalaxy).push(movedItem);
          const destGalaxy = selectedGalaxy;
          editingNodeIndex = null; saveLinksAll(); closeTree();
          switchHub(destGalaxy, true);
          showToastNotification(t('toastGalaxyMoved').replace('{n}', destGalaxy));
          return;
        }
        activeData[editingNodeIndex].label = label; activeData[editingNodeIndex].url = url; activeData[editingNodeIndex].importance = selectedImportance; activeData[editingNodeIndex].description = description;
        editingNodeIndex = null; showToastNotification(t('toastUpdated')); saveLinksAll(); renderSpiral(); closeTree(); return;
    }

    const { ring, targetHub } = findTargetHubForImportance(selectedImportance, currentHubIndex);

    if (targetHub > HUB_COUNT) {
        showToastNotification(t('toastTierFullEverywhere').replace('{tier}', ring.label), true);
        return;
    }

    hubData(targetHub).push({ label, url, description, isCore: false, importance: selectedImportance });

    if (targetHub !== currentHubIndex) {
        showToastNotification(t('toastOverflowed').replace('{tier}', ring.label).replace('{hub}', targetHub - 1));
        currentLayerMode = RING_CONFIG.indexOf(ring);
        switchHub(targetHub, true); 
        saveLinksAll(); closeTree(); return;
    }

    showToastNotification(t('toastPlanted')); saveLinksAll(); renderSpiral(); closeTree();
  }

  function quickAddCurrentTab(importance) {
    importance = importance || DEFAULT_IMPORTANCE;
    let homeUrl, label;
    try {
      homeUrl = `${location.protocol}//${location.hostname}`;
      label = extractDomainName(homeUrl) || location.hostname;
    } catch (e) { return; }
    
    if (!homeUrl || !label) return;

    if (isDuplicateNodeAll(homeUrl, label, null, null)) { showToastNotification(t('toastExists'), true); return; }

    const startHub = isOpen ? currentHubIndex : 1;
    const { ring, targetHub } = findTargetHubForImportance(importance, startHub);
    if (targetHub > HUB_COUNT) { showToastNotification(t('toastTierFullEverywhere').replace('{tier}', ring.label), true); return; }

    hubData(targetHub).push({ label, url: homeUrl, isCore: false, importance });
    saveLinksAll();
    
    closeAllPanelsExcept(''); 
    isOpen = true;
    root.classList.add('open');
    currentHubIndex = targetHub;
    
    const ringIndex = RING_CONFIG.indexOf(ring);
    currentLayerMode = ringIndex > 0 ? ringIndex : 1; 
    
    setHubLabel(RING_CONFIG[currentLayerMode].label);
    renderSpiral(); renderTierDots();
    
    showToastNotification(t('toastQuickAdded').replace('{label}', label).replace('{stars}', '★'.repeat(importance)));
  }

  uiEls.formSave.addEventListener('click', (e) => { e.stopPropagation(); submitBookmarkForm(); });
  uiEls.formCancel.addEventListener('click', (e) => { e.stopPropagation(); closeTree(); });
  uiEls.formDelete.addEventListener('click', (e) => {
    e.stopPropagation();
    if (editingNodeIndex === null) return;
    const activeData = hubData(currentHubIndex);
    if (!activeData[editingNodeIndex]) return;
    if (editingNodeIndex < 4) {
      activeData[editingNodeIndex] = { label: '', url: '', description: '', importance: DEFAULT_IMPORTANCE };
      saveLinksAll(); renderSpiral(); showToastNotification(t('toastCoreCleared'));
      closeTree();
      return;
    }
    const deletedItem = activeData.splice(editingNodeIndex, 1)[0]; deletedItem._hub = currentHubIndex;
    try { chrome.storage.sync.set({ lastDeletedLink: deletedItem }); } catch (err) {}
    saveLinksAll(); renderSpiral(); showToastNotification(t('toastDeleted'), true); setUndoState('bookmark', deletedItem, currentHubIndex);
    closeTree();
  });
  inlineForm.querySelector('#ai-form-close').addEventListener('click', (e) => { e.stopPropagation(); closeTree(); });

  uiEls.formUrl.addEventListener('input', function() {
    if (!isLabelManuallyEdited) { const autoName = extractDomainName(this.value); if (autoName) uiEls.formLabel.value = autoName; else if (this.value.trim() === '') uiEls.formLabel.value = ''; }
  });
  uiEls.formLabel.addEventListener('input', function() { isLabelManuallyEdited = true; });

  [uiEls.formLabel, uiEls.formUrl].forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
    el.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); submitBookmarkForm(); } else if (e.key === 'Escape') { e.preventDefault(); closeTree(); } });
  });
  document.addEventListener('mousedown', (e) => { if (!inlineForm.classList.contains('active')) return; if (inlineForm.contains(e.target) || e.target === addNodeBtn) return; closeInlineForm(); });

  function closeTree() {
    isOpen = false; showAllOverride = false; currentLayerMode = 0; editingNodeIndex = null; 
    root.classList.remove('open', 'show-all-active'); inlineForm.classList.remove('active'); addNodeBtn.classList.remove('blinking');
    setHubLabel('AI');
    document.querySelectorAll('.ai-node').forEach(node => { node.classList.remove('faded'); node.style.transitionDelay = '0s'; }); resetToggleTimeout();
    if (typeof renderTierDots === 'function') renderTierDots();
    if (typeof renderHubDots === 'function') renderHubDots();
  }

  collapseToggleDot.addEventListener('click', (e) => { if (!chrome.runtime?.id) return; e.stopPropagation(); closeTree(); closeAllPanelsExcept(''); hub.classList.add('hub-collapsed'); });

  let clickTimeout = null;
  let quickAddFired = false; let quickAddActive = false; let quickAddStars = 0;
  let holdGraceTimer = null;
  const QUICKADD_REVEAL_MS = 450; 

  function updateQuickAddStarsFromX(clientX) {
    const starEls = starEditorPopup.querySelectorAll('.ai-star-edit');
    let n = 0;
    starEls.forEach((el, i) => { const r = el.getBoundingClientRect(); if (clientX >= r.left + r.width * 0.35) n = i + 1; });
    if (n !== quickAddStars) { quickAddStars = n; paintStarEditor(quickAddStars); }
  }

  function commitQuickAddHold() {
    clearTimeout(holdGraceTimer);
    if (!quickAddActive) return;
    
    const stars = quickAddStars;

    if (stars === 0) {
      quickAddFired = true; 
      starEditorPopup.classList.remove('quickadd-mode');
      return; 
    }

    quickAddCurrentTab(stars);
    closeStarEditor(); 
    quickAddFired = true; 
    hub.classList.add('quickadd-flash'); setTimeout(() => hub.classList.remove('quickadd-flash'), 450);
  }

  hub.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (quickAddFired) { quickAddFired = false; return; } 
    if (hub.classList.contains('hub-collapsed')) { hub.classList.remove('hub-collapsed'); resetAutoCollapseTimer(); return; }
    if (dragMoved) { dragMoved = false; return; } 
    if (uiToggles.includes(e.target.id)) return;
    if (e.detail === 1) {
      clickTimeout = setTimeout(() => {
        if (!isOpen) { closeAllPanelsExcept(''); isOpen = true; currentLayerMode = 0; root.classList.add('open'); renderSpiral(); } 
        else { cycleLayer(); }
        resetToggleTimeout(); resetAutoCollapseTimer(); 
      }, 220); 
    }
  });

  hub.addEventListener('dblclick', (e) => { e.stopPropagation(); if (uiToggles.includes(e.target.id)) return; clearTimeout(clickTimeout); if (isOpen) closeTree(); });

  let startDragX, startDragY, startLeft, startTop;
  hub.addEventListener('mousedown', (e) => {
    if (uiToggles.includes(e.target.id)) return;
    isDragging = true; dragMoved = false; root.classList.add('dragging'); 
    const rect = root.getBoundingClientRect(); 
    startDragX = e.clientX; startDragY = e.clientY; 
    startLeft = rect.left + (rect.width/2); startTop = rect.top + (rect.height/2); 
    // موقعیت اولیه یادداشت برای جابه‌جایی هم‌زمان با هاب
    if (quickNoteForm.classList.contains('active')) {
      const nr = quickNoteForm.getBoundingClientRect();
      noteLinkedStartLeft = nr.left;
      noteLinkedStartTop = nr.top;
    } else {
      noteLinkedStartLeft = undefined;
      noteLinkedStartTop = undefined;
    }
    e.preventDefault();

    quickAddFired = false; quickAddActive = false; quickAddStars = 0;
    if (!hub.classList.contains('hub-collapsed')) {
      clearTimeout(holdGraceTimer);
      const contextRing = (isOpen && currentLayerMode > 0 && !showAllOverride) ? RING_CONFIG[currentLayerMode] : null;
      holdGraceTimer = setTimeout(() => {
        if (!isDragging || dragMoved) return;
        if (contextRing) {
          quickAddFired = true;
          const importance = contextRing.importance !== undefined ? contextRing.importance : contextRing.importanceMax;
          quickAddCurrentTab(importance);
          hub.classList.add('quickadd-flash'); setTimeout(() => hub.classList.remove('quickadd-flash'), 450);
        } else {
          quickAddActive = true;
          positionStarPopupAtHub(); starEditorPopup.classList.add('active', 'quickadd-mode');
          quickAddStars = 0; paintStarEditor(0); 
        }
      }, QUICKADD_REVEAL_MS);
    }
  });

  let rafId = null;
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return; 
    if (quickAddActive) { updateQuickAddStarsFromX(e.clientX); return; } 
    const dx = e.clientX - startDragX; const dy = e.clientY - startDragY; 
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      if (!dragMoved) clearTimeout(holdGraceTimer); 
      dragMoved = true;
    }
    if (!rafId) {
        rafId = requestAnimationFrame(() => {
            root.style.left = (startLeft + dx) + 'px'; root.style.top = (startTop + dy) + 'px'; root.style.bottom = 'auto'; 
            if (isOpen) repositionSpiralNodes();
            // اگر یادداشت باز است و دستی جابه‌جا شده، همان delta را روی آن هم اعمال کن
            if (quickNoteForm.classList.contains('active') && noteManuallyPositioned && typeof noteLinkedStartLeft === 'number') {
              quickNoteForm.style.left = (noteLinkedStartLeft + dx) + 'px';
              quickNoteForm.style.top = (noteLinkedStartTop + dy) + 'px';
            } else {
              adjustNotepadPosition();
            }
            adjustCalcPosition(); adjustClockPosition(); adjustTodoPosition(); adjustSearchPosition(); adjustDotsNavPosition(); adjustHubDotsPosition();
            rafId = null;
        });
    }
  });
  
  document.addEventListener('mouseup', () => { 
    commitQuickAddHold(); 
    if (!isDragging) return; isDragging = false; root.classList.remove('dragging'); 
    try { if (chrome.runtime?.id) { chrome.storage.sync.set({ orbitX: parseInt(root.style.left), orbitY: parseInt(root.style.top) }); } } catch(err) {} 
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "resetFloatingMenuPositionAnly") { 
      root.style.display = ''; root.style.left = WIDGET1_DEFAULT_LEFT; root.style.top = 'auto'; root.style.bottom = WIDGET1_DEFAULT_BOTTOM; 
      clockManuallyPositioned = false; // کادر ساعت هم به حالت لنگرشده روی هاب برمی‌گردد
      try { if (chrome.runtime?.id) chrome.storage.sync.remove(['clockCustomX', 'clockCustomY']); } catch (err) {}
      if (isOpen) renderSpiral(); adjustNotepadPosition(); adjustCalcPosition(); adjustClockPosition(); adjustTodoPosition(); adjustSearchPosition(); adjustDotsNavPosition(); adjustHubDotsPosition();
    }
    if (message.action === "refreshSpiralUI") { loadDataAndRender(); }
    if (message.action === "hideLauncherAnly") { root.style.display = 'none'; }
    if (message.action === "getBookmarkBackups") {
      try { chrome.storage.local.get(['aiTreeBookmarkBackups'], (data) => sendResponse({ backups: data.aiTreeBookmarkBackups || [] })); return true; } catch (e) { sendResponse({ backups: [] }); }
    }
    if (message.action === "restoreBookmarkBackup" && message.ts) {
      try {
        chrome.storage.local.get(['aiTreeBookmarkBackups'], (data) => {
          const backups = data.aiTreeBookmarkBackups || []; const found = backups.find(b => b.ts === message.ts);
          if (found) {
            linksData = JSON.parse(JSON.stringify(found.main || found.data || []));
            linksData2 = JSON.parse(JSON.stringify(found.w2 || []));
            linksData3 = JSON.parse(JSON.stringify(found.w3 || []));
            saveLinksAll(); currentHubIndex = 1; renderSpiral(); renderTierDots(); showToastNotification(t('toastRestored')); sendResponse({ ok: true });
          } else sendResponse({ ok: false });
        });
        return true;
      } catch (e) { sendResponse({ ok: false }); }
    }
  });

  function mainAIIcon() { return `<svg class="hub-main-icon" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="4" stroke="rgba(156,163,175,0.6)"></rect><text id="ai-hub-text" class="is-default-ai" x="12" y="16.5" font-family="sans-serif" font-size="11" font-weight="900" text-anchor="middle" fill="#E5E7EB" stroke="none">AI</text></svg>`; }
  function setHubLabel(text) {
    const el = document.getElementById('ai-hub-text'); if (!el) return;
    let displayText = text;
    if (currentHubIndex > 1 && text === 'AI') displayText = `∞${currentHubIndex}`;
    else if (currentHubIndex > 1 && text === t('hubCore')) displayText = `∞${currentHubIndex} Core`;
    el.textContent = displayText;
    el.classList.toggle('is-default-ai', text === 'AI' && currentHubIndex === 1);
    el.setAttribute('font-size', displayText.length > 3 ? '7.5' : (displayText.length > 2 ? '9' : '11'));
  }

})();