// AI Orbit Launcher — Core (V26.0 - Quantum Seed visual system)
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
      searchMatchedInDesc: "desc",
      noteTitle: "Notepad & AI",
      allTitle: "Show All Bookmarks",
      collapseTitle: "Collapse Menu",
      calcTitle: "Calculator",
      clockTitle: "Clock & Date",
      undoTitle: "Recover",
      undoAria: "Recover last item or restore launcher",
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
      noteClearBtn: "Clear / Close",
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
      toastCleared: "Cleared & closed.",
      toastCopied: "Copied!",
      toastDownloaded: "TXT Downloaded!",
      toastStorageErr: "Storage Error!",
      toastStarUpdated: "Importance Updated ⭐",
      toastInvalidUrl: "Invalid URL",
      toastExists: "Already in Galaxy {n}!",
      toastUpdated: "Bookmark Updated! ✏️",
      toastPlanted: "Bookmark Planted! 🌱",
      toastDeleted: "Deleted! Use Undo to restore it.",
      toastCoreCleared: "Reset to empty",
      toastRestored: "Restored!",
      toastRevived: "Launcher recovered ⚡",
      toastTodoDeleted: "Task deleted! Use Undo to restore it.",
      toastTodoCopied: "Copied to clipboard",
      hubAll: "All",
      bookmarkCount: "{n} Bookmarks",
      coreCount: "{n} Core",
      hubCore: "Core",
      portalForward: "Extended Network {n}",
      portalHome: "Home",
      portalNews: "News",
      hubDotTitle: "Galaxy {n}",
      hubDotHome: "Home",
      hubDotNews: "News",
      hubNews: "News",
      toastOverflowed: "{tier} tier is full — saved to Extended Network {hub} instead.",
      toastTierFullEverywhere: "{tier} tier is full across all networks!",
      toastQuickAdded: "Bookmarked: {label} {stars}",
      hubHoldHint: "Hold to bookmark this page\nRelease at the star you want",
      markToggleTitle: "Special Days",
      markAddPlaceholder: "Title (e.g. Child's Birthday)",
      markAddBtn: "Add",
      markGoldenTitle: "Golden — keep every year",
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
      noteTplSong: "Songwriter",
      noteTplLogo: "Logo Maker",
      noteTplAdd: "Add prompt",
      noteTplEdit: "Manage prompts",
      noteTplDone: "Done",
      noteTplFormTitleNew: "New Prompt",
      noteTplFormTitleEdit: "Edit Prompt",
      noteTplFormName: "Title",
      noteTplFormBody: "Prompt text",
      noteTplFormBodyHint: "Any language works — English tends to get the most consistent results across AI services.",
      noteTplFormUseNote: "Use notepad text",
      noteTplFormSave: "Save",
      noteTplFormCancel: "Cancel",
      noteTplFormDelete: "Delete",
      noteTplFormReset: "Reset default",
      noteTplToastSaved: "Prompt saved",
      noteTplToastReset: "Prompt restored to default",
      noteTplToastDeleted: "Prompt deleted",
      noteTplToastNeedFields: "Title and prompt text required",
      noteTplToastLimit: "Custom prompt limit reached (12)",
      noteTokenMeter: "{chars} chars · ~{tokens} tokens",
      noteTokenEmpty: "0 chars · 0 tokens",
      noteHistoryTitle: "Recent prompts",
      noteHistoryEmpty: "No recent prompts",
      emojiTrayTitle: "Favorite emojis",
      emojiMoreTitle: "More emojis",
      shareBtn: "Share",
      shareTitle: "Share note to social",
      shareEmpty: "Type something first",
      shareOpened: "Opened {name} ⚡",
      shareTruncated: "Text was too long, trimmed for sharing",
      shareX: "X (Twitter)",
      shareWhatsApp: "WhatsApp",
      shareLinkedIn: "LinkedIn",
      shareFacebook: "Facebook",
      emojiOnlineBtn: "Online vault",
      emojiOnlineTitle: "Online emoji vault",
      emojiOnlineSearch: "Search… fire, heart, book",
      emojiOnlineLoading: "Loading vault…",
      emojiOnlineEmpty: "No emoji found",
      emojiOnlineError: "Could not load online emojis",
      quoteCopyTitle: "Copy full text",
      quoteCopied: "Copied!",
      noteExtractBtn: "Extract page",
      noteExtractTitle: "Convert current page to LLM-ready Markdown",
      toastExtracted: "Page extracted as Markdown 📄",
      toastExtractEmpty: "No readable content found on this page",
      noteNewTabTitle: "Open notepad in new tab"
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
      searchMatchedInDesc: "توضیحات",
      noteTitle: "یادداشت و هوش مصنوعی",
      allTitle: "نمایش تمام بوک‌مارک‌ها",
      collapseTitle: "بستن منو",
      calcTitle: "ماشین حساب",
      clockTitle: "ساعت و تاریخ",
      undoTitle: "بازیابی",
      undoAria: "بازیابی آخرین مورد یا احیای لانچر",
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
      noteClearBtn: "پاک / بستن",
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
      toastCleared: "پاک و بسته شد.",
      toastCopied: "کپی شد!",
      toastDownloaded: "فایل متنی دانلود شد!",
      toastStorageErr: "خطای فضای ذخیره‌سازی!",
      toastStarUpdated: "میزان اهمیت بروز شد ⭐",
      toastInvalidUrl: "لینک نامعتبر است",
      toastExists: "از قبل در کهکشان {n} هست!",
      toastUpdated: "بوک‌مارک به‌روزرسانی شد! ✏️",
      toastPlanted: "بوک‌مارک افزوده شد! 🌱",
      toastDeleted: "حذف شد؛ با Undo بازگردانید.",
      toastCoreCleared: "به حالت خالی بازنشانی شد",
      toastRestored: "بازیابی شد!",
      toastRevived: "لانچر بازیابی شد ⚡",
      toastTodoDeleted: "وظیفه حذف شد؛ با Undo بازگردانید.",
      toastTodoCopied: "متن کپی شد",
      hubAll: "همه",
      bookmarkCount: "{n} بوک‌مارک",
      coreCount: "{n} هسته",
      hubCore: "هسته",
      portalForward: "منظومه‌ی فرعی {n}",
      portalHome: "خانه",
      portalNews: "اخبار",
      hubDotTitle: "کهکشان {n}",
      hubDotHome: "خانه",
      hubDotNews: "اخبار",
      hubNews: "اخبار",
      toastOverflowed: "رده‌ی {tier} پر شد؛ در منظومه‌ی فرعی {hub} ذخیره شد.",
      toastTierFullEverywhere: "رده‌ی {tier} در همه‌ی منظومه‌ها پر است!",
      toastQuickAdded: "بوک‌مارک شد: {label} {stars}",
      hubHoldHint: "نگه دارید تا بوک‌مارک شود\nدر ستاره‌ی دلخواه رها کنید",
      markToggleTitle: "مناسبت‌ها",
      markAddPlaceholder: "عنوان (مثلاً تولد فرزند)",
      markAddBtn: "افزودن",
      markGoldenTitle: "طلایی — هر سال نگه دار",
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
      noteTplSong: "ترانه‌ساز",
      noteTplLogo: "لوگوساز",
      noteTplAdd: "افزودن پرامپت",
      noteTplEdit: "مدیریت پرامپت‌ها",
      noteTplDone: "تمام",
      noteTplFormTitleNew: "پرامپت جدید",
      noteTplFormTitleEdit: "ویرایش پرامپت",
      noteTplFormName: "عنوان",
      noteTplFormBody: "متن پرامپت",
      noteTplFormBodyHint: "هر زبانی مناسب است — انگلیسی معمولاً نتیجهٔ یکدست‌تری در همهٔ سرویس‌های هوش مصنوعی می‌دهد.",
      noteTplFormUseNote: "متن دفترچه",
      noteTplFormSave: "ذخیره",
      noteTplFormCancel: "لغو",
      noteTplFormDelete: "حذف",
      noteTplFormReset: "بازگردانی پیش‌فرض",
      noteTplToastSaved: "پرامپت ذخیره شد",
      noteTplToastReset: "پرامپت به پیش‌فرض برگشت",
      noteTplToastDeleted: "پرامپت حذف شد",
      noteTplToastNeedFields: "عنوان و متن پرامپت لازم است",
      noteTplToastLimit: "حداکثر ۱۲ پرامپت سفارشی",
      noteTokenMeter: "{chars} نویسه · ≈{tokens} توکن",
      noteTokenEmpty: "۰ نویسه · ۰ توکن",
      noteHistoryTitle: "پرامپت‌های اخیر",
      noteHistoryEmpty: "پرامپتی ذخیره نشده",
      emojiTrayTitle: "ایموجی‌های موردعلاقه",
      emojiMoreTitle: "ایموجی‌های بیشتر",
      shareBtn: "اشتراک",
      shareTitle: "اشتراک‌گذاری یادداشت",
      shareEmpty: "اول یه متن بنویس",
      shareOpened: "{name} باز شد ⚡",
      shareTruncated: "متن خیلی بلند بود، برای اشتراک‌گذاری کوتاه شد",
      shareX: "شبکه X",
      shareWhatsApp: "واتساپ",
      shareLinkedIn: "لینکدین",
      shareFacebook: "فیسبوک",
      emojiOnlineBtn: "گنجینه آنلاین",
      emojiOnlineTitle: "گنجینه آنلاین ایموجی",
      emojiOnlineSearch: "جستجو… آتش، قلب، کتاب",
      emojiOnlineLoading: "در حال بارگذاری گنجینه…",
      emojiOnlineEmpty: "ایموجی یافت نشد",
      emojiOnlineError: "بارگذاری آنلاین ناموفق بود",
      quoteCopyTitle: "کپی متن کامل",
      quoteCopied: "کپی شد!",
      noteExtractBtn: "استخراج صفحه",
      noteExtractTitle: "تبدیل صفحهٔ فعلی به Markdown مناسب LLM",
      toastExtracted: "صفحه به‌صورت Markdown استخراج شد 📄",
      toastExtractEmpty: "محتوای قابل‌خواندن در این صفحه پیدا نشد",
      noteNewTabTitle: "باز کردن دفترچه در تب جدید"
    }
  };

  function t(key) { return i18n[currentLang] && i18n[currentLang][key] ? i18n[currentLang][key] : i18n['en'][key]; }

  let linksData = []; 
  let linksData2 = []; 
  let linksData3 = [];
  let linksData4 = []; // کهکشان NEWS — فقط با انتخاب کاربر پر می‌شود
  const HUB_COUNT = 4;
  const OVERFLOW_HUB_MAX = 3; // سرریز خودکار فقط بین کهکشان‌های ۱–۳
  const NEWS_HUB_INDEX = 4;
  function isNewsHub(hubIdx) { return hubIdx === NEWS_HUB_INDEX; }
  function hubData(hubIdx) {
    if (hubIdx === 1) return linksData;
    if (hubIdx === 2) return linksData2;
    if (hubIdx === 3) return linksData3;
    if (hubIdx === 4) return linksData4;
    return linksData;
  }
  let currentHubIndex = 1; 
  let hubNavDirection = 'forward'; // remembers last portal click direction so a "return trip" keeps showing 🌍 in the same slot
  let todosData = [];
  let activeTodoTab = 'daily';
  let addForTomorrow = false;
  const TODO_DAILY_TTL_MS = 24 * 60 * 60 * 1000;
  let userBirthYear = null; 
  let markedDays = []; // مناسبت‌های نشانه‌گذاری‌شده: [{ id, label, day, month }]
  let isNotePinned = false;
  // ایموجی‌های موردعلاقه — باید قبل از هر renderEmojiTray مقداردهی شود (جلوگیری از TDZ)
  const DEFAULT_FAVORITE_EMOJIS = ['✨', '📌', '🔥', '💡', '🌱', '🎯', '🚀', '⭐'];
  let favoriteEmojis = DEFAULT_FAVORITE_EMOJIS.slice();

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
    { 
        text: "إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ", 
        ref: "شعراء: 62", 
        refEn: "Ash-Shu'ara: 62",
        fa: "بی‌گمان پروردگارم با من است و مرا هدایت خواهد کرد.",
        en: "Indeed, with me is my Lord; He will guide me." 
    },
    { 
        text: "هُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", 
        ref: "حدید: 4", 
        refEn: "Al-Hadid: 4",
        fa: "و او با شماست هر جا که باشید.",
        en: "And He is with you wherever you are." 
    },
    { 
        text: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ", 
        ref: "ق: 16", 
        refEn: "Qaf: 16",
        fa: "و ما از رگ گردن به او نزدیک‌تریم.",
        en: "And We are closer to him than [his] jugular vein." 
    },
    { 
        text: "وَاللَّهُ خَيْرٌ حَافِظًا", 
        ref: "یوسف: 64", 
        refEn: "Yusuf: 64",
        fa: "و خداوند بهترین نگهبان است.",
        en: "But Allah is the best guardian." 
    },
    { 
        text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", 
        ref: "آل‌عمران: 173", 
        refEn: "Ali 'Imran: 173",
        fa: "خداوند ما را بس است و او بهترین حامی و کارگزار است.",
        en: "Sufficient for us is Allah, and [He is] the best Disposer of affairs." 
    },
    { 
        text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", 
        ref: "رعد: 28", 
        refEn: "Ar-Ra'd: 28",
        fa: "آگاه باشید که تنها با یاد خدا دل‌ها آرام می‌گیرد.",
        en: "Unquestionably, by the remembrance of Allah hearts are assured." 
    },
    { 
        text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", 
        ref: "شرح: 5", 
        refEn: "Ash-Sharh: 5",
        fa: "پس یقیناً با هر سختی، آسانی است.",
        en: "For indeed, with hardship [will be] ease." 
    },
    { 
        text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", 
        ref: "شرح: 6", 
        refEn: "Ash-Sharh: 6",
        fa: "قطعاً با هر سختی، آسانی است.",
        en: "Indeed, with hardship [will be] ease." 
    },
    { 
        text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", 
        ref: "بقره: 153", 
        refEn: "Al-Baqarah: 153",
        fa: "همانا خداوند با شکیبایان است.",
        en: "Indeed, Allah is with the patient." 
    },
    { 
        text: "لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ", 
        ref: "بقره: 62", 
        refEn: "Al-Baqarah: 62",
        fa: "نه ترسی بر آنان است و نه اندوهگین می‌شوند.",
        en: "No fear will there be concerning them, nor will they grieve." 
    },
    { 
        text: "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ", 
        ref: "زمر: 53", 
        refEn: "Az-Zumar: 53",
        fa: "از رحمت خداوند ناامید نشوید.",
        en: "Do not despair of the mercy of Allah." 
    },
    { 
        text: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", 
        ref: "اعراف: 156", 
        refEn: "Al-A'raf: 156",
        fa: "و رحمت من همه چیز را فرا گرفته است.",
        en: "But My mercy encompasses all things." 
    },
    { 
        text: "إِنَّ رَبِّي رَحِيمٌ وَدُودٌ", 
        ref: "هود: 90", 
        refEn: "Hud: 90",
        fa: "همانا پروردگار من مهربان و بسیار دوستدار (بندگان) است.",
        en: "Indeed, my Lord is Merciful and Affectionate." 
    },
    { 
        text: "إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ", 
        ref: "بقره: 37", 
        refEn: "Al-Baqarah: 37",
        fa: "همانا اوست بسیار توبه‌پذیر و مهربان.",
        en: "Indeed, it is He who is the Accepting of repentance, the Merciful." 
    },
    { 
        text: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", 
        ref: "ده‌ها آیه", 
        refEn: "Multiple Verses",
        fa: "همانا خداوند بسیار آمرزنده و مهربان است.",
        en: "Indeed, Allah is Forgiving and Merciful." 
    },
    { 
        text: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ", 
        ref: "ذاریات: 58", 
        refEn: "Adh-Dhariyat: 58",
        fa: "همانا خداوند است که بسیار روزی‌دهنده است.",
        en: "Indeed, it is Allah who is the [continual] Provider." 
    },
    { 
        text: "وَاللَّهُ خَيْرُ الرَّازِقِينَ", 
        ref: "حج: 58", 
        refEn: "Al-Hajj: 58",
        fa: "و خداوند بهترین روزی‌دهندگان است.",
        en: "And indeed, Allah is the best of providers." 
    },
    { 
        text: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", 
        ref: "طلاق: 3", 
        refEn: "At-Talaq: 3",
        fa: "و او را از جایی که گمان نمی‌برد روزی می‌دهد.",
        en: "And He will provide for him from where he does not expect." 
    },
    { 
        text: "وَمَا بِكُم مِّن نِّعْمَةٍ فَمِنَ اللَّهِ", 
        ref: "نحل: 53", 
        refEn: "An-Nahl: 53",
        fa: "و هر نعمتی که دارید، از سوی خداست.",
        en: "And whatever you have of favor - it is from Allah." 
    },
    { 
        text: "وَاللَّهُ ذُو الْفَضْلِ الْعَظِيمِ", 
        ref: "بقره: 105", 
        refEn: "Al-Baqarah: 105",
        fa: "و خداوند صاحب فضل و بخشش بزرگ است.",
        en: "And Allah is the possessor of great bounty." 
    },
    { 
        text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", 
        ref: "طلاق: 3", 
        refEn: "At-Talaq: 3",
        fa: "و هر کس بر خدا توکل کند، خدا او را بس است.",
        en: "And whoever relies upon Allah - then He is sufficient for him." 
    },
    { 
        text: "وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ", 
        ref: "آل‌عمران: 122", 
        refEn: "Ali 'Imran: 122",
        fa: "و مؤمنان باید تنها بر خداوند توکل کنند.",
        en: "And upon Allah let the believers rely." 
    },
    { 
        text: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ", 
        ref: "آل‌عمران: 159", 
        refEn: "Ali 'Imran: 159",
        fa: "همانا خداوند توکل‌کنندگان را دوست می‌دارد.",
        en: "Indeed, Allah loves those who rely [upon Him]." 
    },
    { 
        text: "إِلَى اللَّهِ تُرْجَعُ الْأُمُورُ", 
        ref: "آل‌عمران: 109", 
        refEn: "Ali 'Imran: 109",
        fa: "و همه کارها به سوی خدا بازگردانده می‌شود.",
        en: "And to Allah all matters are returned." 
    },
    { 
        text: "إِلَى اللَّهِ الْمَصِيرُ", 
        ref: "نور: 42 و آیات دیگر", 
        refEn: "An-Nur: 42 & Other Verses",
        fa: "و بازگشت [همه] به سوی خداست.",
        en: "And to Allah is the final destination." 
    },
    { 
        text: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", 
        ref: "نور: 35", 
        refEn: "An-Nur: 35",
        fa: "خداوند نور آسمان‌ها و زمین است.",
        en: "Allah is the Light of the heavens and the earth." 
    },
    { 
        text: "وَاللَّهُ يَهْدِي مَن يَشَاءُ", 
        ref: "نور: 46", 
        refEn: "An-Nur: 46",
        fa: "و خداوند هر کس را بخواهد هدایت می‌کند.",
        en: "And Allah guides whom He wills." 
    },
    { 
        text: "إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ", 
        ref: "هود: 61", 
        refEn: "Hud: 61",
        fa: "همانا پروردگار من نزدیک و اجابت‌کننده است.",
        en: "Indeed, my Lord is near and responsive." 
    },
    { 
        text: "رَبِّ زِدْنِي عِلْمًا", 
        ref: "طه: 114", 
        refEn: "Taha: 114",
        fa: "پروردگارا، بر دانشم بیفزای.",
        en: "My Lord, increase me in knowledge." 
    },
    { 
        text: "وَقُل رَّبِّ ارْحَمْهُمَا", 
        ref: "اسراء: 24", 
        refEn: "Al-Isra: 24",
        fa: "و بگو: پروردگارا، بر آن دو (پدر و مادر) رحمت آور.",
        en: "And say: 'My Lord, have mercy upon them.'" 
    },
    { 
        text: "وَهُوَ أَرْحَمُ الرَّاحِمِينَ", 
        ref: "یوسف: 64", 
        refEn: "Yusuf: 64",
        fa: "و او مهربان‌ترین مهربانان است.",
        en: "And He is the most merciful of the merciful." 
    },
    { 
        text: "إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", 
        ref: "بقره: 20", 
        refEn: "Al-Baqarah: 20",
        fa: "همانا خداوند بر هر چیزی تواناست.",
        en: "Indeed, Allah is over all things competent." 
    },
    { 
        text: "إِنَّ اللَّهَ بِكُلِّ شَيْءٍ عَلِيمٌ", 
        ref: "بقره: 282", 
        refEn: "Al-Baqarah: 282",
        fa: "همانا خداوند به هر چیزی داناست.",
        en: "And Allah is Knowing of all things." 
    },
    { 
        text: "إِنَّ اللَّهَ لَطِيفٌ خَبِيرٌ", 
        ref: "لقمان: 16", 
        refEn: "Luqman: 16",
        fa: "همانا خداوند لطیف و آگاه است.",
        en: "Indeed, Allah is Subtle and Acquainted." 
    },
    { 
        text: "إِنَّ اللَّهَ عَزِيزٌ حَكِيمٌ", 
        ref: "ده‌ها آیه", 
        refEn: "Multiple Verses",
        fa: "همانا خداوند شکست‌ناپذیر و حکیم است.",
        en: "Indeed, Allah is Exalted in Might and Wise." 
    },
    { 
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", 
        ref: "فاتحه: 2", 
        refEn: "Al-Fatihah: 2",
        fa: "ستایش مخصوص خداوندی است که پروردگار جهانیان است.",
        en: "[All] praise is [due] to Allah, Lord of the worlds." 
    },
    { 
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", 
        ref: "فاتحه: 5", 
        refEn: "Al-Fatihah: 5",
        fa: "تنها تو را می‌پرستیم و تنها از تو یاری می‌جوییم.",
        en: "It is You we worship and You we ask for help." 
    },
    { 
        text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", 
        ref: "فاتحه: 6", 
        refEn: "Al-Fatihah: 6",
        fa: "ما را به راه راست هدایت فرما.",
        en: "Guide us to the straight path." 
    },
    { 
        text: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", 
        ref: "بقره: 156", 
        refEn: "Al-Baqarah: 156",
        fa: "ما از آنِ خداییم و به سوی او بازمی‌گردیم.",
        en: "Indeed we belong to Allah, and indeed to Him we will return." 
    },
    { 
        text: "فَاذْكُرُونِي أَذْكُرْكُمْ", 
        ref: "بقره: 152", 
        refEn: "Al-Baqarah: 152",
        fa: "پس مرا یاد کنید تا شما را یاد کنم.",
        en: "So remember Me; I will remember you." 
    }
];
  function getDailyQuoteIndex() {
    const today = new Date(); const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let hash = 0; for (let i = 0; i < dateStr.length; i++) { hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0; }
    return hash % DAILY_QUOTES.length;
  }

  const RUMI_QUOTES = [
    { fa: "بنمای رخ که باغ و گلستانم آرزوست\nبگشای لب که قند فراوانم آرزوست", en: "Show your face, for garden and rose-garden I long;\nOpen your lips, for abundant sugar I long.", ref: "مولانا #1" },
    { fa: "ای آفتاب حسن! برون آ دمی ز ابر\nکآن چهرهٔ مشعشع تابانم آرزوست", en: "O sun of beauty! Come out for a moment from the cloud,\nFor that radiant, shining face I long.", ref: "مولانا #2" },
    { fa: "بشنودم از هوای تو آواز طبل باز\nباز آمدم که ساعد سلطانم آرزوست", en: "I heard the drum of the falcon in your air;\nI came back, for the forearm of the Sultan I long.", ref: "مولانا #3" },
    { fa: "گفتی ز ناز «بیش مرنجان مرا، برو»\nآن گفتنت که «بیش مرنجانم» آرزوست", en: "You said coquettishly, \"Do not torment me more, go away\";\nThat saying of yours, \"Do not torment me more,\" is what I long for.", ref: "مولانا #4" },
    { fa: "وآن دفع گفتنت که «برو، شه به خانه نیست»\nوآن ناز و باز و تندی دربانم آرزوست", en: "And that repelling word of yours, \"Go, the King is not home\";\nAnd that coyness, return, and sharpness of the doorman I long for.", ref: "مولانا #5" },
    { fa: "در دست هر که هست ز خوبی قراضه‌هاست\nآن معدن مَلات و آن کانم آرزوست", en: "Whatever scraps of beauty are in everyone's hand,\nThat mine of molten gold, that treasure-mine I long for.", ref: "مولانا #6" },
    { fa: "این نان و آب چرخ، چو سیل است بی‌وفا\nمن ماهی‌ام، نهنگم، عُمّانم آرزوست", en: "This bread and water of the sphere are faithless like a flood;\nI am a fish, I am a whale, the deep ocean I long for.", ref: "مولانا #7" },
    { fa: "یعقوب‌وار «وا اَسَفا»ها همی زنم\nدیدار خوب یوسفِ کنعانم آرزوست", en: "Like Jacob, I cry out \"Alas, my grief!\";\nThe sight of beautiful Joseph of Canaan I long for.", ref: "مولانا #8" },
    { fa: "والله که شهر بیتو مرا حبس می‌شود\nآوارگی و کوه و بیابانم آرزوست", en: "By God, the city without you becomes a prison for me;\nWandering, the mountain, and the desert I long for.", ref: "مولانا #9" },
    { fa: "زین همرهان سست‌عناصر دلم گرفت\nشیر خدا و رستم دستانم آرزوست", en: "I am weary of these faint-hearted companions;\nThe Lion of God (Ali) and Rustam-e Dastan I long for.", ref: "مولانا #10" },
    { fa: "هر کسی از ظن خود شد یار من\nاز درون من نجست اسرار من", en: "Everyone became my friend according to their own fancy;\nThey did not seek my secrets from within me.", ref: "مولانا #11" },
    { fa: "عالم این خاک و هوا گوهر کفر است و فنا\nدر دل کفر آمدهام تا که به ایمان برسم", en: "This world of dust and air is the essence of disbelief and annihilation;\nI have come into the heart of disbelief so that I may reach faith.", ref: "مولانا #12" },
    { fa: "این جهان زندان و ما زندانیان\nحفره کن زندان و خود را وا رهان", en: "This world is a prison and we are the prisoners;\nDig a hole in the prison and free yourself!", ref: "مولانا #13" },
    { fa: "خنک آن قمار بازی، که بباخت آنچه بودش\nبنماند هیچش الّا، هوس قمار دیگر", en: "Blessed is that gambler who lost all that he had;\nNothing remained for him except the desire for another gamble.", ref: "مولانا #14" },
    { fa: "ساعتی میزان اینی، ساعتی میزان آن\nیک نفس میزان خود شو، تاشوی موزون خویش", en: "One moment you are the measure of this, another moment the measure of that;\nFor one breath, become your own measure, so that you may become your harmonious self.", ref: "مولانا #15" },
    { fa: "هر خون که ز من روید با خاک تو می‌گوید\nبا مهر تو همرنگم با عشق تو هنبازم", en: "Every blood that flows from me speaks with your soil;\nI am the same color as your love, I gamble with your love.", ref: "مولانا #16" },
    { fa: "بیا تا قدر همدیگر بدانیم\nکه تا ناگه ز یکدیگر نمانیم", en: "Come, let us know each other's worth,\nSo that we do not suddenly remain apart from one another.", ref: "مولانا #17" },
    { fa: "عید آمد و عید آمد یاری که رمید آمد\nعیدانه فراوان شد تا باد چنین بادا", en: "The feast has come, the feast has come, the Beloved who had fled has come;\nThe feast-gifts are abundant, may it always be so!", ref: "مولانا #18" },
    { fa: "زهی عشق، زهی عشق که ماراست خدایا\nچه نغز است و چه خوب است و چه زیباست خدایا", en: "Hail to love, hail to love that is ours, O God!\nHow delicate it is, how good it is, and how beautiful it is, O God!", ref: "مولانا #19" },
    { fa: "من که حیران ز ملاقات توام\nچون خیالی ز خیالات توام", en: "I who am bewildered by my encounter with you,\nI am like a phantom among your phantoms.", ref: "مولانا #20" },
    { fa: "من هم رباب عشقم و عشقم ربابیست\nوان لطف‌های زخمهٔ رحمانم آرزوست", en: "I too am the lute of love, and my love is lute-playing;\nAnd those gentle touches of the Merciful's plectrum I long for.", ref: "مولانا #21" },
    { fa: "تا از خود ببریدم من عشق تو بگزیدم\nخود را چو فنا دیدم، آهسته که سرمستم", en: "Since I was cut off from myself, I chose your love;\nWhen I saw myself annihilated, softly—for I am drunk.", ref: "مولانا #22" },
    { fa: "جفایی کز بر معشوق آید\nنثارش کن به شادی مرحبایی", en: "Whatever cruelty comes from the Beloved,\nScatter it joyfully with a welcome of \"Marhaba!\" (welcome).", ref: "مولانا #23" },
    { fa: "نیست آگه آن کشش از جرم و داد\nلیک بس جادوست عشق و اعتقاد", en: "That attraction (of love) is unaware of sin and justice;\nBut how magical love and faith are!", ref: "مولانا #24" },
    { fa: "مرغ باغ ملکوتم نیم از عالم خاک\nچند روزی قفسی ساخته‌ام از بدنم", en: "I am a bird of the heavenly garden, I am not of this world of dust;\nFor a few days, I have made a cage from my body.", ref: "مولانا #25" },
    { fa: "هر کجا عشق آید و ساکن شود\nهر چه نا ممکن بود ممکن شود", en: "Wherever love comes and settles down,\nWhatever was impossible becomes possible.", ref: "مولانا #26" },
    { fa: "مـــرده بدم زنده شدم، گـریه بـدم خنــده شدم\nدولت عشـق آمــد و مـــن دولت پـاینــــده شدم", en: "I was dead, I became alive; I was tears, I became laughter;\nThe fortune of love came, and I became lasting fortune.", ref: "مولانا #27" },
    { fa: "آب دریا را اگـــــــر نتوان کشـید\nهم به قدر تشنگی باید چشید", en: "If one cannot drink the entire sea water,\nOne must taste it to the extent of one's thirst.", ref: "مولانا #28" },
    { fa: "بی همگان به سر شود بیتو به سر نمی‌شود\nداغ تو دارد این دلم جای دگر نمی‌شود", en: "Life goes by without everyone, but without you it does not go by;\nMy heart carries your brand; it does not go elsewhere.", ref: "مولانا #29" },
    { fa: "ما چو ناییم و نوا در ما ز توست\nما چو کوهیم و صدا در ما ز توست", en: "We are like the reed, and the melody in us is from You;\nWe are like the mountain, and the echo in us is from You.", ref: "مولانا #30" },
    { fa: "دلا نزد کسی بنشین که او از دل خبر دارد\nبه زیر آن درختی رو که او گل‌های تر دارد", en: "O heart, sit with someone who has knowledge of the heart;\nGo under that tree that has fresh flowers.", ref: "مولانا #31" },
    { fa: "من آنِ توام مرا به من باز مده", en: "I am Yours, do not give me back to myself.", ref: "مولانا #32" },
    { fa: "همه را بیازمودم ز تو خوش‌ترم نیامد", en: "I tried everyone; none came sweeter to me than You.", ref: "مولانا #33" },
    { fa: "اندر دل بی‌وفا غــم و ماتم باد\nآن را که وفا نیست ز عالم کم باد", en: "In the unfaithful heart, may there be grief and mourning;\nMay one who has no loyalty be diminished from the world.", ref: "مولانا #34" },
    { fa: "آمد بهار جانها ای شاخ تر به رقص آ", en: "The spring of souls has come, O moist (living) branch, begin to dance!", ref: "مولانا #35" },
    { fa: "من از عالم تو را تنها گزیدم\nروا داری که من غمگین نشینم؟", en: "I chose only You from all the world;\nDo you deem it right that I remain sorrowful?", ref: "مولانا #36" },
    { fa: "صد نامه فرستادم و صد راه نشان دادم\nیا راه نمی‌دانی یا نامه نمی‌خوانی!", en: "I sent a hundred letters and showed a hundred paths;\nEither you don't know the way, or you don't read the letters!", ref: "مولانا #37" },
    { fa: "مرا عهدیست با شادی که شادی آن من باشد\nمرا قولیست با جانان که جانان جان من باشد", en: "I have a covenant with joy that joy is mine;\nI have a promise with the Beloved that the Beloved is the life of my soul.", ref: "مولانا #38" },
    { fa: "شاهیست که تو هرچه بپوشی داند\nبیکام و زبان گر بخروشی داند", en: "He is a King who knows whatever you conceal;\nIf you roar without mouth or tongue, He knows.", ref: "مولانا #39" },
    { fa: "گویاترم ز بلبل امّا از رَشکِ عام\nمُهر است بر دهانم و افغانم آرزوست", en: "I am more eloquent than the nightingale, but due to the envy of the common folk,\nA seal is on my mouth, and yet lamenting is what I long for.", ref: "مولانا #40" },
  ];
  function getDailyRumiIndex() {
    const today = new Date(); const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-rumi`;
    let hash = 0; for (let i = 0; i < dateStr.length; i++) { hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0; }
    return hash % RUMI_QUOTES.length;
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
    // کهکشان NEWS هرگز مقصد سرریز خودکار نیست و خودش هم سرریز نمی‌کند
    if (isNewsHub(startHub)) {
      const full = tierCountInHub(NEWS_HUB_INDEX, ring) >= ring.max || hubData(NEWS_HUB_INDEX).length >= MAX_NODES;
      return { ring, targetHub: full ? (HUB_COUNT + 1) : NEWS_HUB_INDEX };
    }
    let targetHub = Math.min(startHub, OVERFLOW_HUB_MAX);
    while (targetHub <= OVERFLOW_HUB_MAX && (tierCountInHub(targetHub, ring) >= ring.max || hubData(targetHub).length >= MAX_NODES)) {
      targetHub++;
    }
    if (targetHub > OVERFLOW_HUB_MAX) targetHub = HUB_COUNT + 1; // پر در همهٔ کهکشان‌های قابل‌سرریز
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
  const quantumBloom = document.createElement('div'); quantumBloom.className = 'ai-quantum-bloom'; quantumBloom.setAttribute('aria-hidden', 'true');
  quantumBloom.innerHTML = '<i></i><i></i><i></i><i></i>';
  
  const todoToggleDot = document.createElement('div'); todoToggleDot.id = 'ai-todo-toggle'; todoToggleDot.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`; hub.appendChild(todoToggleDot);
  const searchToggleDot = document.createElement('div'); searchToggleDot.id = 'ai-search-toggle'; searchToggleDot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`; hub.appendChild(searchToggleDot);
  // Consistent 24px Lucide-style SVGs keep the action particles legible at any zoom.
  // Inline paths avoid a network dependency and are MIT-compatible icon geometry.
  const noteToggleDot = document.createElement('div'); noteToggleDot.id = 'ai-note-toggle'; noteToggleDot.setAttribute('role', 'button'); noteToggleDot.tabIndex = 0; noteToggleDot.setAttribute('aria-label', 'Quick note'); noteToggleDot.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>`; hub.appendChild(noteToggleDot);
  const allToggleDot = document.createElement('div'); allToggleDot.id = 'ai-all-toggle'; allToggleDot.setAttribute('role', 'button'); allToggleDot.tabIndex = 0; allToggleDot.setAttribute('aria-label', 'Show all'); allToggleDot.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>`; hub.appendChild(allToggleDot);
  const collapseToggleDot = document.createElement('div'); collapseToggleDot.id = 'ai-collapse-toggle'; collapseToggleDot.setAttribute('role', 'button'); collapseToggleDot.tabIndex = 0; collapseToggleDot.setAttribute('aria-label', 'Collapse launcher'); collapseToggleDot.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`; hub.appendChild(collapseToggleDot);
  [noteToggleDot, allToggleDot, collapseToggleDot].forEach((control) => {
    control.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); control.click(); }
    });
  });
  const calcToggleDot = document.createElement('div'); calcToggleDot.id = 'ai-calc-hub-toggle'; calcToggleDot.innerHTML = `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="8" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="16" y2="14"></line><line x1="8" y1="18" x2="16" y2="18"></line></svg>`; hub.appendChild(calcToggleDot);
  const clockToggleDot = document.createElement('div'); clockToggleDot.id = 'ai-clock-toggle'; clockToggleDot.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`; hub.appendChild(clockToggleDot);
  const undoToggleDot = document.createElement('div'); undoToggleDot.id = 'ai-undo-toggle';
  undoToggleDot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/><path d="M16.2 5.2l0.7 1.5 1.5 0.7-1.5 0.7-0.7 1.5-0.7-1.5-1.5-0.7 1.5-0.7z" fill="#FBBF24" stroke="none"/></svg>`;
  undoToggleDot.setAttribute('aria-label', 'Undo last edit or deletion');
  hub.appendChild(undoToggleDot);

  const spacingArc = document.createElement('div'); spacingArc.id = 'ai-spacing-arc';
  spacingArc.innerHTML = `
    <svg viewBox="0 0 104 104" width="104" height="104">
      <path id="ai-spacing-track" d="M94,52 A42,42 0 0 0 52,10" fill="none"></path>
      <path id="ai-spacing-fill" d="M94,52 A42,42 0 0 0 52,10" fill="none"></path>
    </svg>
    <div id="ai-spacing-thumb"></div>
    <div id="ai-spacing-value">42</div>`;
  hub.appendChild(spacingArc);

  const bookmarkCountEl = document.createElement('div');
  bookmarkCountEl.id = 'ai-bookmark-count';
  bookmarkCountEl.setAttribute('aria-live', 'polite');
  root.appendChild(bookmarkCountEl);

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
        <div class="ai-galaxy-stop" data-hub="4">📰<b>N</b></div>
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
      <div class="ai-note-header-actions">
        <button type="button" id="ai-note-newtab-btn" class="ai-note-newtab-btn" title="Open in new tab">⧉</button>
        <button type="button" id="ai-note-split-btn" class="ai-note-split-btn" title="Split view">▦</button>
        <button type="button" id="ai-note-pin-btn" class="ai-note-pin-btn" title="Pin Window">📌</button>
      </div>
    </div>
    <div class="ai-note-format-bar" id="ai-note-format-bar">
      <button type="button" id="ai-align-left-btn" class="ai-format-btn ai-align-icon ai-align-icon-left" title="Left"><span></span><span></span><span></span></button>
      <button type="button" id="ai-align-center-btn" class="ai-format-btn ai-align-icon ai-align-icon-center" title="Center"><span></span><span></span><span></span></button>
      <button type="button" id="ai-align-right-btn" class="ai-format-btn ai-align-icon ai-align-icon-right" title="Right"><span></span><span></span><span></span></button>
      <div class="ai-note-fontsize-wrap" id="ai-note-fontsize-wrap" title="Font size">
        <button type="button" id="ai-font-dec-btn" class="ai-format-btn ai-font-btn" aria-label="Decrease font size">A-</button>
        <span class="ai-font-size-label" id="ai-font-size-label">14</span>
        <button type="button" id="ai-font-inc-btn" class="ai-format-btn ai-font-btn" aria-label="Increase font size">A+</button>
      </div>
      <div class="ai-note-emoji-wrap" id="ai-note-emoji-wrap">
        <button type="button" id="ai-emoji-toggle-btn" class="ai-emoji-toggle-btn" title="Emojis">😀</button>
        <button type="button" id="ai-emoji-online-btn" class="ai-emoji-online-btn" title="Online">🌐</button>
        <div id="ai-emoji-popover" class="ai-emoji-popover" role="dialog"></div>
      </div>
      <button type="button" id="ai-note-extract-doc-btn" class="ai-format-btn ai-extract-doc-btn" title="Extract page to Markdown" aria-label="Extract page to Markdown">📄</button>
    </div>
    <div class="ai-note-tpl-bar" id="ai-note-tpl-bar"></div>
    <div class="ai-note-text-wrap" id="ai-note-text-wrap">
      <textarea id="ai-note-text" rows="2" dir="auto"></textarea>
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
      <div id="ai-social-share-wrap" class="ai-social-share-wrap">
        <button type="button" id="ai-social-toggle-btn" class="ai-social-toggle-btn" title="Share" aria-haspopup="menu" aria-expanded="false">
          <span id="ai-social-toggle-label">Share</span>
          <span class="ai-social-icon" aria-hidden="true">🔗</span>
        </button>
        <div id="ai-social-popover" class="ai-social-popover" role="menu"></div>
      </div>
      <div id="ai-smart-send-wrapper" class="ai-smart-send-wrapper" tabindex="0" role="listbox" aria-label="Ask AI">
        <button type="button" id="ai-send-action-btn" class="ai-send-action-btn">
          <span class="ai-send-dot" id="ai-send-dot"></span>
          <span class="ai-send-label" id="ai-send-label"></span>
          <span class="ai-send-method" id="ai-send-method"></span>
          <span class="ai-send-chevron" aria-hidden="true">⌄</span>
        </button>
        <div class="ai-wheel-popover" id="ai-wheel-popover">
          <div class="ai-wheel-viewport" id="ai-wheel-viewport">
            <div class="ai-wheel-list" id="ai-wheel-list"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="ai-note-resize-handle ai-note-resize-l" id="ai-note-resize-l" title="Resize width"></div>
    <div class="ai-note-resize-handle ai-note-resize-r" id="ai-note-resize-r" title="Resize width"></div>
    <div class="ai-note-resize-handle ai-note-resize-t" id="ai-note-resize-t" title="Resize height"></div>
    <div class="ai-note-resize-handle ai-note-resize-b" id="ai-note-resize-b" title="Resize height"></div>
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
    <div class="ai-mark-event-sheet is-collapsed" id="ai-mark-event-sheet">
      <div class="ai-mark-event-body" id="ai-mark-event-body">
        <div class="ai-mark-event-inner">
          <div class="ai-mark-event-paper">
            <div class="ai-mark-event-badge" id="ai-mark-event-badge"></div>
            <div class="ai-mark-event-text" id="ai-mark-event-text"></div>
            <div class="ai-mark-event-meta" id="ai-mark-event-meta"></div>
          </div>
        </div>
      </div>
      <button type="button" class="ai-mark-event-tab" id="ai-mark-event-tab" title="Event">
        <span class="ai-mark-event-tab-label" id="ai-mark-event-tab-label">📌</span>
        <span class="ai-mark-event-tab-chevron">▲</span>
      </button>
    </div>
    <div class="ai-clock-kicker"><span></span><span id="ai-clock-kicker-text">اکنون</span><span></span></div>
    <div class="ai-clock-time" id="ai-time">--:--</div>
    <div class="ai-clock-date-fa" id="ai-date-fa">...</div>
    <div class="ai-clock-date-en" id="ai-date-en">...</div>
    <div class="ai-mark-dots-row" id="ai-mark-dots-row" style="display:none;"></div>
    <button type="button" class="ai-clock-marks-toggle-btn" id="ai-clock-marks-toggle" aria-label="Special days" aria-expanded="false"></button>
    <div class="ai-clock-marks-panel" id="ai-clock-marks-panel">
      <section class="ai-season-context" aria-live="polite">
        <div class="ai-season-context-head"><span class="ai-season-context-dot" aria-hidden="true"></span><strong id="ai-season-name"></strong><span id="ai-season-hemisphere"></span></div>
        <div class="ai-season-range" id="ai-season-range"></div>
        <p class="ai-season-lesson" id="ai-season-lesson"></p>
      </section>
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
        <label class="ai-mark-golden-row" id="ai-mark-golden-row" title="">
          <input type="checkbox" id="ai-mark-golden-cb" class="ai-mark-golden-cb" />
          <span class="ai-mark-golden-box" aria-hidden="true"></span>
          <span class="ai-mark-golden-label" id="ai-mark-golden-label">★</span>
        </label>
        <button type="button" id="ai-mark-add-btn"></button>
      </div>
    </div>
    <div class="ai-life-journey" id="ai-life-journey" style="display: none;">
      <div class="ai-life-horizon"><span class="ai-life-origin"></span><span class="ai-life-path"></span><span class="ai-life-now"></span></div>
      <div class="ai-life-copy"><span id="ai-life-start">آغاز</span><span id="ai-life-caption"></span><span id="ai-life-now-label">اکنون</span></div>
    </div>
    <div class="ai-clock-age" id="ai-age" style="display: none;"></div>
    <div class="ai-clock-quote" id="ai-clock-quote">
      <button type="button" class="ai-rumi-tab" id="ai-rumi-tab" title="شعر روز">
        <span class="ai-rumi-tab-chevron" id="ai-rumi-tab-chevron">▼</span>
        <span class="ai-rumi-tab-label" id="ai-rumi-tab-label">🌙</span>
      </button>
      <div class="ai-clock-quote-body" id="ai-clock-quote-body">
        <div class="ai-clock-quote-inner">
          <div class="ai-clock-quote-paper">
            <button type="button" class="ai-quote-copy-btn" id="ai-rumi-copy-btn" title="Copy full text" aria-label="Copy full text">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <div class="ai-clock-quote-text" id="ai-clock-quote-text"></div>
            <div class="ai-clock-quote-title" id="ai-clock-quote-title"></div>
            <svg class="ai-torn-edge" viewBox="0 0 500 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M0,0 L0,6 L14,12 L31,5 L52,14 L73,4 L91,15 L118,6 L139,13 L162,3 L185,11 L209,4 L231,14 L258,7 L284,15 L312,5 L337,12 L361,4 L389,14 L413,6 L438,13 L464,5 L485,11 L500,4 L500,0 Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
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
        <button type="button" class="ai-quote-copy-btn" id="ai-quote-copy-btn" title="Copy full text" aria-label="Copy full text">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
        <div class="ai-todo-quote-fa" id="ai-todo-quote-fa"></div>
        <div class="ai-todo-quote-translation" id="ai-todo-quote-translation"></div>
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
  root.appendChild(quantumBloom);
  addNodeBtn.classList.add('orbit-add-node'); inlineForm.classList.add('orbit-inline-form');
  starEditorPopup.classList.add('orbit-star-editor');

  root.appendChild(hub); root.appendChild(addNodeBtn);

  const mountFragment = document.createDocumentFragment();
  mountFragment.append(root, inlineForm, quickNoteForm, calcPanel, clockPanel, todoPanel, searchPanel, tierDotsNav, hubDotsNav, toastBox, starEditorPopup);

  function getProtectedMountTarget() {
    // Prefer <html> so React/Next route swaps of <body> children cannot wipe the launcher.
    return document.documentElement || document.body;
  }
  function mountWidget() {
    const target = getProtectedMountTarget();
    if (target) target.appendChild(mountFragment);
  }
  if (document.body || document.documentElement) { mountWidget(); }
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
    noteNewTabBtn: quickNoteForm.querySelector('#ai-note-newtab-btn'),
    noteClearBtn: quickNoteForm.querySelector('#ai-note-clear-btn'),
    noteCopyBtn: quickNoteForm.querySelector('#ai-note-copy-btn'),
    saveTxtBtn: quickNoteForm.querySelector('#ai-save-txt-btn'),
    alignRightBtn: quickNoteForm.querySelector('#ai-align-right-btn'),
    alignCenterBtn: quickNoteForm.querySelector('#ai-align-center-btn'),
    alignLeftBtn: quickNoteForm.querySelector('#ai-align-left-btn'),
    fontDecBtn: quickNoteForm.querySelector('#ai-font-dec-btn'),
    fontIncBtn: quickNoteForm.querySelector('#ai-font-inc-btn'),
    fontSizeLabel: quickNoteForm.querySelector('#ai-font-size-label'),
    emojiWrap: quickNoteForm.querySelector('#ai-note-emoji-wrap'),
    emojiToggleBtn: quickNoteForm.querySelector('#ai-emoji-toggle-btn'),
    emojiOnlineBtn: quickNoteForm.querySelector('#ai-emoji-online-btn'),
    emojiPopover: quickNoteForm.querySelector('#ai-emoji-popover'),
    extractDocBtn: quickNoteForm.querySelector('#ai-note-extract-doc-btn'),
    socialWrap: quickNoteForm.querySelector('#ai-social-share-wrap'),
    socialToggleBtn: quickNoteForm.querySelector('#ai-social-toggle-btn'),
    socialToggleLabel: quickNoteForm.querySelector('#ai-social-toggle-label'),
    socialPopover: quickNoteForm.querySelector('#ai-social-popover'),
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
    todoQuoteTranslation: todoPanel.querySelector('#ai-todo-quote-translation'),
    todoQuoteBody: todoPanel.querySelector('#ai-todo-quote-body'),
    todoQuoteCopy: todoPanel.querySelector('#ai-quote-copy-btn'),
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
    markGoldenCb: clockPanel.querySelector('#ai-mark-golden-cb'),
    markGoldenRow: clockPanel.querySelector('#ai-mark-golden-row'),
    markGoldenLabel: clockPanel.querySelector('#ai-mark-golden-label'),
    markEventSheet: clockPanel.querySelector('#ai-mark-event-sheet'),
    markEventTab: clockPanel.querySelector('#ai-mark-event-tab'),
    markEventBadge: clockPanel.querySelector('#ai-mark-event-badge'),
    markEventText: clockPanel.querySelector('#ai-mark-event-text'),
    markEventMeta: clockPanel.querySelector('#ai-mark-event-meta'),
    clockQuote: clockPanel.querySelector('#ai-clock-quote'),
    clockQuoteTab: clockPanel.querySelector('#ai-rumi-tab'),
    clockQuoteChevron: clockPanel.querySelector('#ai-rumi-tab-chevron'),
    clockQuoteLabel: clockPanel.querySelector('#ai-rumi-tab-label'),
    clockQuoteBody: clockPanel.querySelector('#ai-clock-quote-body'),
    clockQuoteText: clockPanel.querySelector('#ai-clock-quote-text'),
    clockQuoteTitle: clockPanel.querySelector('#ai-clock-quote-title'),
    clockQuoteCopy: clockPanel.querySelector('#ai-rumi-copy-btn'),
  };


  // --- Galactic Constellation tooltips (replaces native title on hub toggles) ---
  const GALAXY_ICONS = {
    note: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3.5l4.5 4.5-9.2 9.2-5.1 1.3 1.3-5.1L14 3.5z" stroke-opacity="0.75"/><path d="M13.2 4.3l4.5 4.5" stroke-opacity="0.45"/><circle cx="7.2" cy="16.8" r="1.6" fill="#10B981" stroke="none"/><circle cx="14" cy="3.5" r="1.35" fill="currentColor" stroke="none"/><circle cx="18.5" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="10.2" cy="12.2" r="1.1" fill="currentColor" stroke-opacity="0.7"/></svg>`,
    todo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="4.5" width="15" height="15" rx="2.5" stroke-opacity="0.55"/><path d="M8 12.2l2.2 2.2 5-5.2" stroke-opacity="0.85"/><circle cx="8" cy="12.2" r="1.35" fill="#818CF8" stroke="none"/><circle cx="10.2" cy="14.4" r="1.15" fill="currentColor" stroke="none"/><circle cx="15.2" cy="9.2" r="1.15" fill="currentColor" stroke="none"/><circle cx="12" cy="4.5" r="1.1" fill="currentColor" stroke-opacity="0.7"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.2" stroke-opacity="0.7"/><path d="M16 16l4.2 4.2" stroke-opacity="0.75"/><path d="M11 6.5v1.2M11 14.3v1.2M6.5 11h1.2M14.3 11h1.2" stroke-opacity="0.45"/><circle cx="11" cy="11" r="1.7" fill="#00D2FF" stroke="none"/><circle cx="20.2" cy="20.2" r="1.2" fill="currentColor" stroke="none"/><circle cx="7.2" cy="7.2" r="1.05" fill="currentColor" stroke-opacity="0.7"/></svg>`,
    all: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.2" fill="#94A3B8" stroke="none"/><circle cx="12" cy="4.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="18.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="18.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="19.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="5.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="5.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><path d="M12 6.7v2.6M16.4 9.7l-2.2 1.3M16.4 14.3l-2.2-1.3M12 14.7v2.6M7.6 14.3l2.2-1.3M7.6 9.7l2.2 1.3" stroke-opacity="0.55"/></svg>`,
    calc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h12M6 12h12M6 18h12M8 6v12M16 6v12" stroke-opacity="0.55"/><circle cx="8" cy="6" r="1.45" fill="currentColor" stroke="none"/><circle cx="16" cy="6" r="1.45" fill="currentColor" stroke="none"/><circle cx="8" cy="12" r="1.7" fill="#FA8072" stroke="none"/><circle cx="16" cy="12" r="1.45" fill="currentColor" stroke="none"/><circle cx="8" cy="18" r="1.45" fill="currentColor" stroke="none"/><circle cx="16" cy="18" r="1.45" fill="currentColor" stroke="none"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8" stroke-opacity="0.55"/><path d="M12 12l3.2-2.4" stroke-opacity="0.85"/><path d="M12 4.5v1.4M19.5 12h-1.4M12 19.5v-1.4M4.5 12h1.4" stroke-opacity="0.4"/><circle cx="12" cy="12" r="1.55" fill="#3B82F6" stroke="none"/><circle cx="15.2" cy="9.6" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="4.5" r="1.1" fill="currentColor" stroke-opacity="0.7"/></svg>`,
    undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 8.2L5 11.7l3.5 3.5" stroke-opacity="0.85"/><path d="M5 11.7h9.2a5 5 0 0 1 0 10H11" stroke-opacity="0.55"/><circle cx="5" cy="11.7" r="1.55" fill="#FBBF24" stroke="none"/><path d="M17.2 5.4l0.85 1.75 1.75 0.85-1.75 0.85-0.85 1.75-0.85-1.75-1.75-0.85 1.75-0.85z" fill="#FBBF24" stroke="none"/><circle cx="14.2" cy="11.7" r="1.05" fill="currentColor" stroke="none"/><circle cx="19" cy="16.5" r="1" fill="currentColor" stroke-opacity="0.7"/></svg>`,
    collapse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.5" stroke-opacity="0.5"/><circle cx="12" cy="12" r="3.2" stroke-opacity="0.75"/><circle cx="12" cy="12" r="1.5" fill="#BAE6FD" stroke="none"/><circle cx="12" cy="4.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="19.5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="19.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none"/></svg>`
  };

  function setGalaxyTooltip(toggleEl, titleText, svgIconHtml, side) {
    if (!toggleEl) return;
    toggleEl.removeAttribute('title');

    // Remove legacy text tooltip if present
    const oldTip = toggleEl.querySelector('.ai-galaxy-tooltip');
    if (oldTip) oldTip.remove();

    // Side constellation badge: icon + compact text label (outward of hub) — no colored dots
    const sideClass = side === 'left' || side === 'right' || side === 'top' || side === 'bottom' ? side : 'right';
    let badge = toggleEl.querySelector('.ai-constellation-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'ai-constellation-badge';
      badge.innerHTML = `
        <div class="ai-constellation-icon-col">
          <div class="ai-constellation-icon"></div>
          <span class="ai-constellation-label"></span>
        </div>
      `;
      toggleEl.appendChild(badge);
    } else {
      // Remove legacy colored dots if present
      badge.querySelectorAll('.ai-constellation-dot').forEach(d => d.remove());
    }
    badge.className = 'ai-constellation-badge side-' + sideClass;
    if (titleText) badge.setAttribute('aria-label', titleText);
    const iconWrap = badge.querySelector('.ai-constellation-icon');
    if (iconWrap && svgIconHtml) iconWrap.innerHTML = svgIconHtml;
    let labelEl = badge.querySelector('.ai-constellation-label');
    if (!labelEl) {
      // Migrate older badge markup (icon-only) to include a text label under the icon
      const oldIcon = badge.querySelector('.ai-constellation-icon');
      const col = document.createElement('div');
      col.className = 'ai-constellation-icon-col';
      labelEl = document.createElement('span');
      labelEl.className = 'ai-constellation-label';
      if (oldIcon) {
        oldIcon.replaceWith(col);
        col.appendChild(oldIcon);
      } else {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'ai-constellation-icon';
        col.appendChild(iconDiv);
        badge.appendChild(col);
      }
      col.appendChild(labelEl);
    }
    if (titleText) {
      // Strip leading emoji for a cleaner micro-label under the icon
      labelEl.textContent = String(titleText).replace(/^\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, '').trim() || titleText;
    }
  }

  // Hub-center hold hint: only after ~3s hover on the hub body (not on toggle dots)
  let hubHoldHintTimer = null;
  let hubHoldHintEl = null;
  function ensureHubHoldHintEl() {
    if (hubHoldHintEl && hubHoldHintEl.isConnected) return hubHoldHintEl;
    hubHoldHintEl = document.createElement('div');
    hubHoldHintEl.id = 'ai-hub-hold-hint';
    hubHoldHintEl.className = 'ai-hub-hold-hint';
    hubHoldHintEl.setAttribute('role', 'tooltip');
    root.appendChild(hubHoldHintEl);
    return hubHoldHintEl;
  }
  function hideHubHoldHint() {
    clearTimeout(hubHoldHintTimer);
    hubHoldHintTimer = null;
    if (hubHoldHintEl) hubHoldHintEl.classList.remove('visible');
  }
  function scheduleHubHoldHint() {
    clearTimeout(hubHoldHintTimer);
    hubHoldHintTimer = setTimeout(() => {
      if (hub.classList.contains('hub-collapsed') || isDragging || quickAddActive) return;
      const el = ensureHubHoldHintEl();
      el.textContent = t('hubHoldHint');
      el.classList.add('visible');
    }, 3000);
  }
  function isHubCenterTarget(target) {
    if (!target || !hub.contains(target)) return false;
    // Toggles / spacing arc should not trigger the hold-to-bookmark hint
    if (target.closest && (
      target.closest('#ai-todo-toggle, #ai-search-toggle, #ai-note-toggle, #ai-all-toggle, #ai-collapse-toggle, #ai-calc-hub-toggle, #ai-clock-toggle, #ai-undo-toggle, #ai-spacing-arc')
    )) return false;
    return true;
  }
  hub.addEventListener('mouseenter', (e) => {
    if (isHubCenterTarget(e.target)) scheduleHubHoldHint();
  });
  hub.addEventListener('mousemove', (e) => {
    if (isHubCenterTarget(e.target)) {
      if (!hubHoldHintTimer && !(hubHoldHintEl && hubHoldHintEl.classList.contains('visible'))) scheduleHubHoldHint();
    } else {
      hideHubHoldHint();
    }
  });
  hub.addEventListener('mouseleave', hideHubHoldHint);
  hub.addEventListener('mousedown', hideHubHoldHint);



  function updateUITexts() {
    setGalaxyTooltip(noteToggleDot, t('noteTitle'), GALAXY_ICONS.note, 'left');
    setGalaxyTooltip(todoToggleDot, t('todoTitle'), GALAXY_ICONS.todo, 'left');
    setGalaxyTooltip(clockToggleDot, t('clockTitle'), GALAXY_ICONS.clock, 'left');
    setGalaxyTooltip(allToggleDot, t('allTitle'), GALAXY_ICONS.all, 'right');
    setGalaxyTooltip(searchToggleDot, t('searchTitle'), GALAXY_ICONS.search, 'right');
    setGalaxyTooltip(calcToggleDot, t('calcTitle'), GALAXY_ICONS.calc, 'right');
    setGalaxyTooltip(undoToggleDot, t('undoTitle'), GALAXY_ICONS.undo, 'top');
    if (undoToggleDot) undoToggleDot.setAttribute('aria-label', t('undoAria'));
    setGalaxyTooltip(collapseToggleDot, t('collapseTitle'), GALAXY_ICONS.collapse, 'bottom');
    spacingArc.title = t('spacingTitle');
    addNodeBtn.title = t('addNodeTitle');
    if (typeof renderRumiQuote === 'function') renderRumiQuote();
    if (typeof renderDailyQuote === 'function') renderDailyQuote();
    if (typeof adjustClockPosition === 'function') adjustClockPosition();
    if (typeof adjustTodoPosition === 'function') adjustTodoPosition();
    hub.removeAttribute('title');
    hideHubHoldHint();

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
    if (uiEls.socialToggleLabel) uiEls.socialToggleLabel.textContent = t('shareBtn');
    if (uiEls.socialToggleBtn) uiEls.socialToggleBtn.title = t('shareTitle');
    if (uiEls.emojiToggleBtn) uiEls.emojiToggleBtn.title = t('emojiMoreTitle');
    if (uiEls.emojiOnlineBtn) uiEls.emojiOnlineBtn.title = t('emojiOnlineBtn');
    if (uiEls.extractDocBtn) {
      uiEls.extractDocBtn.title = t('noteExtractTitle');
      uiEls.extractDocBtn.setAttribute('aria-label', t('noteExtractTitle'));
    }
    if (uiEls.noteNewTabBtn) {
      uiEls.noteNewTabBtn.title = t('noteNewTabTitle');
      uiEls.noteNewTabBtn.setAttribute('aria-label', t('noteNewTabTitle'));
    }
    if (typeof renderEmojiTray === 'function' && Array.isArray(favoriteEmojis)) renderEmojiTray();
    if (typeof renderSocialPopover === 'function') renderSocialPopover();
    if (typeof syncNoteSplitBtn === 'function') syncNoteSplitBtn();

    uiEls.todoMainTitle.textContent = t('todoTitle');
    uiEls.todoInput.placeholder = activeTodoTab === 'daily' ? t('todoDailyInput') : t('todoGoalInput');
    uiEls.todoAddBtn.textContent = t('todoAddBtn');
    uiEls.todoTabDaily.textContent = t('todoTabDaily');
    uiEls.todoTabGoal.textContent = t('todoTabGoals');

    uiEls.searchInput.placeholder = t('searchPlaceholder');
    uiEls.todoWhenToday.textContent = t('todoWhenToday');
    uiEls.todoWhenTomorrow.textContent = t('todoWhenTomorrow');

    uiEls.markToggle.title = t('markToggleTitle');
    uiEls.markToggle.setAttribute('aria-label', t('markToggleTitle'));
    uiEls.markLabelInput.placeholder = t('markAddPlaceholder');
    uiEls.markAddBtn.textContent = t('markAddBtn');
    if (uiEls.markGoldenRow) uiEls.markGoldenRow.title = t('markGoldenTitle');
    if (uiEls.markGoldenLabel) uiEls.markGoldenLabel.textContent = '★';
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
    
    if (uiEls.todoQuoteCopy) {
      uiEls.todoQuoteCopy.title = t('quoteCopyTitle');
      uiEls.todoQuoteCopy.setAttribute('aria-label', t('quoteCopyTitle'));
    }
    if (uiEls.clockQuoteCopy) {
      uiEls.clockQuoteCopy.title = t('quoteCopyTitle');
      uiEls.clockQuoteCopy.setAttribute('aria-label', t('quoteCopyTitle'));
    }
    if(todoPanel.classList.contains('active')) renderTodos();
    if(clockPanel.classList.contains('active')) { updateClockAge(); renderMarkedDays(); if (typeof renderRumiQuote === 'function') renderRumiQuote(); }
    if(searchPanel.classList.contains('active')) renderSearchResults(uiEls.searchInput.value);
    renderTierDots();
    if(isOpen) setHubLabel(currentLayerMode === 0 ? t('hubCore') : RING_CONFIG[currentLayerMode].label);
    updateBookmarkCount();
  }

  function updateClockAge() {
      const timeEl = document.getElementById('ai-time'); if (!timeEl) return; 
      const now = new Date();
      // Northern hemisphere is the default audience. This is a visual theme only;
      // dates and calendar calculations remain locale-accurate.
      const monthDay = (now.getMonth() + 1) * 100 + now.getDate();
      const season = monthDay >= 321 && monthDay <= 620 ? 'spring'
        : monthDay <= 922 ? 'summer' : monthDay <= 1220 ? 'autumn' : 'winter';
      const seasonCopy = currentLang === 'fa'
        ? {
            spring: ['بهار', 'نیم‌کرهٔ شمالی', '۱ فروردین تا ۳۱ خرداد · تقریباً 21 Mar–20 Jun', 'بهار در نیم‌کرهٔ شمالی از حوالی ۲۱ مارس آغاز می‌شود.'],
            summer: ['تابستان', 'نیم‌کرهٔ شمالی', '۱ تیر تا ۳۱ شهریور · تقریباً 21 Jun–22 Sep', 'تابستان تا حوالی ۲۲ سپتامبر ادامه دارد.'],
            autumn: ['پاییز', 'نیم‌کرهٔ شمالی', '۱ مهر تا ۳۰ آذر · تقریباً 23 Sep–20 Dec', 'پاییز از حوالی ۲۳ سپتامبر آغاز می‌شود.'],
            winter: ['زمستان', 'نیم‌کرهٔ شمالی', '۱ دی تا پایان اسفند · تقریباً 21 Dec–20 Mar', 'زمستان از حوالی ۲۱ دسامبر آغاز می‌شود.']
          }
        : {
            spring: ['Spring', 'Northern Hemisphere', '21 Mar–20 Jun · Farvardin–Khordad', 'Spring begins around 21 March in the Northern Hemisphere.'],
            summer: ['Summer', 'Northern Hemisphere', '21 Jun–22 Sep · Tir–Shahrivar', 'Summer lasts until around 22 September.'],
            autumn: ['Autumn', 'Northern Hemisphere', '23 Sep–20 Dec · Mehr–Azar', 'Autumn begins around 23 September.'],
            winter: ['Winter', 'Northern Hemisphere', '21 Dec–20 Mar · Dey–Esfand', 'Winter begins around 21 December.']
          };
      const copy = seasonCopy[season];
      if (clockPanel.dataset.season !== season || clockPanel.dataset.seasonLang !== currentLang) {
        clockPanel.dataset.season = season;
        clockPanel.dataset.seasonLang = currentLang;
        const [nameEl, hemisphereEl, rangeEl, lessonEl] = ['ai-season-name', 'ai-season-hemisphere', 'ai-season-range', 'ai-season-lesson']
          .map(id => clockPanel.querySelector('#' + id));
        if (nameEl) nameEl.textContent = copy[0];
        if (hemisphereEl) hemisphereEl.textContent = copy[1];
        if (rangeEl) rangeEl.textContent = copy[2];
        if (lessonEl) lessonEl.textContent = copy[3];
      }
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
  // Registered with lifecycle controller once it is constructed (see below).
  let clockAgeIntervalId = setInterval(updateClockAge, 1000);

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

  // Occurrence date for the current year (does NOT roll to next year).
  // Used to expire one-shot marks the day after they pass.
  function markedOccurrenceThisYear(day, month, cal) {
    const now = new Date();
    const useJalali = cal === 'j' || cal === 'jalali';
    try {
      if (useJalali) {
        const jToday = gregorianToJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
        const g = jalaaliToGregorian(jToday.jy, month, day);
        return new Date(g.gy, g.gm - 1, g.gd);
      }
      return new Date(now.getFullYear(), month - 1, day);
    } catch (e) {
      return null;
    }
  }

  function isMarkedDayPast(day, month, cal) {
    const occ = markedOccurrenceThisYear(day, month, cal);
    if (!occ || isNaN(occ.getTime())) return false;
    const now = new Date();
    const todayStripped = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Keep through the event day; remove starting the next calendar day
    return occ < todayStripped;
  }

  function pruneExpiredMarkedDays() {
    if (!Array.isArray(markedDays) || markedDays.length === 0) return false;
    const kept = markedDays.filter(m => m.golden || !isMarkedDayPast(m.day, m.month, m.cal));
    if (kept.length === markedDays.length) return false;
    markedDays = kept;
    saveMarkedDays();
    return true;
  }

  function openMarkEventSheet(m) {
    if (!uiEls.markEventSheet || !m) return;
    const dd = String(m.day).padStart(2, '0');
    const mm = String(m.month).padStart(2, '0');
    const isJ = m.cal === 'j' || m.cal === 'jalali';
    const dateStr = (isJ && currentLang === 'fa') ? toPersianDigits(`${dd}/${mm}`) : `${dd}/${mm}`;
    const calHint = isJ ? (currentLang === 'fa' ? 'شمسی' : 'Jalali') : (currentLang === 'fa' ? 'میلادی' : 'Gregorian');
    if (uiEls.markEventBadge) {
      uiEls.markEventBadge.textContent = m.days === 0 ? '🎉' : (m.golden ? '★' : '📌');
    }
    if (uiEls.markEventText) uiEls.markEventText.textContent = m.label;
    if (uiEls.markEventMeta) {
      uiEls.markEventMeta.textContent = m.days === 0
        ? (currentLang === 'fa' ? `امروز · ${dateStr} · ${calHint}` : `Today · ${dateStr} · ${calHint}`)
        : (currentLang === 'fa'
            ? `${m.days} روز مانده · ${dateStr} · ${calHint}`
            : `in ${m.days}d · ${dateStr} · ${calHint}`);
    }
    uiEls.markEventSheet.classList.remove('is-collapsed');
  }

  function closeMarkEventSheet() {
    if (!uiEls.markEventSheet) return;
    uiEls.markEventSheet.classList.add('is-collapsed');
    if (uiEls.markDotsRow) {
      uiEls.markDotsRow.querySelectorAll('.ai-mark-dot.is-active').forEach(d => d.classList.remove('is-active'));
    }
  }

  function renderMarkedDays() {
    pruneExpiredMarkedDays();
    if (!uiEls.markDotsRow) return;
    // تا ۵ مناسبت نزدیک — کلیک → کشوی کاغذی بالای تقویم
    uiEls.markDotsRow.innerHTML = '';
    if (markedDays.length === 0) {
      uiEls.markDotsRow.style.display = 'none';
      closeMarkEventSheet();
    } else {
      const nearestMarks = markedDays
        .map(m => ({ ...m, days: daysUntilNext(m.day, m.month, m.cal) }))
        .sort((a, b) => a.days - b.days)
        .slice(0, 5);

      nearestMarks.forEach((m, idx) => {
        const wrap = document.createElement('div'); wrap.className = 'ai-mark-dot-wrap';
        const dot = document.createElement('button'); dot.type = 'button';
        dot.className = 'ai-mark-dot' + (m.days === 0 ? ' is-today' : '') + (m.golden ? ' is-golden' : '');
        dot.textContent = String(idx + 1);
        dot.title = m.label;
        dot.addEventListener('mousedown', (e) => e.stopPropagation());
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const already = dot.classList.contains('is-active');
          uiEls.markDotsRow.querySelectorAll('.ai-mark-dot.is-active').forEach(d => d.classList.remove('is-active'));
          if (already) {
            closeMarkEventSheet();
          } else {
            dot.classList.add('is-active');
            openMarkEventSheet(m);
          }
        });
        wrap.appendChild(dot);
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
      const li = document.createElement('li'); li.className = 'ai-mark-item' + (m.golden ? ' is-golden' : '');
      const span = document.createElement('span'); span.className = 'ai-mark-item-label';
      const dd = String(m.day).padStart(2, '0'); const mm = String(m.month).padStart(2, '0');
      const isJ = m.cal === 'j' || m.cal === 'jalali';
      const dateStr = (isJ && currentLang === 'fa') ? toPersianDigits(`${dd}/${mm}`) : `${dd}/${mm}`;
      span.textContent = `${m.golden ? '★ ' : ''}${m.label}  ·  ${dateStr}`;
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
    const panelW = (uiEls.markPanel.offsetWidth || 320) + 36; // gap so opener toggle never collides with page-2
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
    clockPanel.classList.toggle('marks-open-left', openLeft);

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
    uiEls.markToggle.setAttribute('aria-expanded', String(isOpen));
    if (!isOpen) {
      closeDualPicker();
      uiEls.markPanel.classList.remove('side-left');
      clockPanel.classList.remove('marks-open-left');
    } else {
      positionMarksPanelSide();
    }
  });

  if (uiEls.markEventTab) {
    uiEls.markEventTab.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMarkEventSheet();
    });
  }

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
    const GREG_MONTHS_SHORT_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function dayHoverTip(gy, gm, gd) {
      // Line 1 — Gregorian English, no year
      const gregLine = `${gd} ${GREG_MONTHS_SHORT_EN[gm - 1]}`;
      // Line 2 — secondary calendar (day + month only)
      let secLine = '';
      try {
        const dt = new Date(gy, gm - 1, gd);
        const secOpts = { day: 'numeric', month: 'short' };
        if (currentLang === 'fa') {
          secLine = dt.toLocaleDateString('fa-IR-u-ca-persian', secOpts);
        } else {
          let usedSystemAlt = false;
          try {
            const cal = new Intl.DateTimeFormat(systemLocale).resolvedOptions().calendar;
            if (cal && cal !== 'gregory') {
              secLine = dt.toLocaleDateString(systemLocale, { ...secOpts, calendar: cal });
              usedSystemAlt = true;
            }
          } catch (e1) {}
          if (!usedSystemAlt) {
            secLine = dt.toLocaleDateString('en-US-u-ca-persian', secOpts);
          }
        }
      } catch (e) {
        try {
          const j2 = gregorianToJalaali(gy, gm, gd);
          secLine = currentLang === 'fa'
            ? `${toPersianDigits(j2.jd)} ${JALALI_MONTHS_FA[j2.jm - 1]}`
            : `${j2.jd}/${j2.jm}`;
        } catch (e2) {}
      }
      // Line 3 — Hijri (lunar/Qamari) calendar, day + month name
      let hijriLine = '';
      try {
        const dt = new Date(gy, gm - 1, gd);
        const hijriOpts = { day: 'numeric', month: 'long' };
        const hijriLocale = currentLang === 'fa' ? 'fa-IR-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura';
        hijriLine = dt.toLocaleDateString(hijriLocale, hijriOpts);
      } catch (e3) {}
      return { gregLine, secLine: (secLine || '').trim(), hijriLine: (hijriLine || '').trim() };
    }

    for (let d = 1; d <= totalDays; d++) {
      const iso = isoFromYMD(y, m, d);
      const j = gregorianToJalaali(y, m, d);
      const isToday = iso === todayISO;
      const isSelected = iso === smartDateISO;
      const isMarked = isMarkedDay(y, m, d, j.jy, j.jm, j.jd);
      const primary = preferJalali ? toPersianDigits(j.jd) : String(d);
      const sub = preferJalali ? String(d) : String(j.jd);
      const tip = dayHoverTip(y, m, d);
      let tipAttr = ` data-tip-greg="${tip.gregLine}"`;
      if (tip.secLine) tipAttr += ` data-tip-sec="${tip.secLine}"`;
      if (tip.hijriLine) tipAttr += ` data-tip-hijri="${tip.hijriLine}"`;
      const cls = ['day-cell'];
      if (isToday) cls.push('is-today');
      if (isMarked) cls.push('is-marked');
      if (isSelected) cls.push('is-selected');
      html += `<div class="${cls.join(' ')}" data-iso="${iso}" role="button" tabindex="0"${tipAttr}>
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

 [uiEls.markToggle, uiEls.markLabelInput, uiEls.smartDateInput, uiEls.smartDatePickerBtn, uiEls.markAddBtn, uiEls.markGoldenRow, uiEls.markPanel, uiEls.markList, uiEls.dualPicker].forEach(el => {
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
    const isGolden = !!(uiEls.markGoldenCb && uiEls.markGoldenCb.checked);
    markedDays.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), label, day, month, cal, golden: isGolden });
    saveMarkedDays(); renderMarkedDays();
    uiEls.markLabelInput.value = '';
    if (uiEls.markGoldenCb) uiEls.markGoldenCb.checked = false;
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
      if (typeof collapseMotivationalQuotes === 'function') collapseMotivationalQuotes();
      if (!isActive) {
        // هر بار باز شدن: مثل یادداشت کنار هاب لنگر شود (موقعیت ذخیره‌شدهٔ دور قبلی نادیده)
        clockManuallyPositioned = false;
        try { if (chrome.runtime?.id) chrome.storage.sync.remove(['clockCustomX', 'clockCustomY']); } catch (err) {}
        clockPanel.classList.add('active');
        root.classList.add('show-clock');
        updateClockAge();
        renderMarkedDays();
        renderRumiQuote();
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
    const isFa = currentLang === 'fa';
    if (uiEls.todoQuoteFa) {
      uiEls.todoQuoteFa.textContent = q.text || '';
      uiEls.todoQuoteFa.dir = 'rtl';
    }
    // Bilingual translation line — Arabic verse above always stays as-is (the original text),
    // only the translation underneath switches with the app language, same idea as the Rumi drawer.
    if (uiEls.todoQuoteTranslation) {
      const translation = isFa ? (q.fa || '') : (q.en || '');
      uiEls.todoQuoteTranslation.textContent = translation;
      uiEls.todoQuoteTranslation.dir = isFa ? 'rtl' : 'ltr';
      uiEls.todoQuoteTranslation.classList.toggle('is-fa', isFa);
      uiEls.todoQuoteTranslation.classList.toggle('is-en', !isFa);
      uiEls.todoQuoteTranslation.style.display = translation ? '' : 'none';
    }
    if (uiEls.todoQuoteTitle) {
      const ref = isFa ? (q.ref || '') : (q.refEn || q.ref || '');
      uiEls.todoQuoteTitle.textContent = ref;
      uiEls.todoQuoteTitle.dir = isFa ? 'rtl' : 'ltr';
      uiEls.todoQuoteTitle.style.display = ref ? '' : 'none';
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

  function buildDailyQuoteCopyText() {
    const idx = manualQuoteIndex !== null ? manualQuoteIndex : getDailyQuoteIndex();
    const q = DAILY_QUOTES[idx];
    if (!q) return '';
    const isFa = currentLang === 'fa';
    const lines = [];
    if (q.text) lines.push(q.text);
    const translation = isFa ? (q.fa || '') : (q.en || '');
    if (translation) lines.push(translation);
    const ref = isFa ? (q.ref || '') : (q.refEn || q.ref || '');
    if (ref) lines.push(ref);
    return lines.join('\n\n');
  }

  function copyQuoteText(text, btn) {
    if (!text || !String(text).trim()) return;
    const finish = () => {
      showToastNotification(t('quoteCopied') || t('toastCopied'));
      if (btn) {
        btn.classList.add('is-copied');
        setTimeout(() => btn.classList.remove('is-copied'), 1200);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(finish).catch(() => {
        try { fallbackCopyText(text); } catch (e) { finish(); }
      });
    } else {
      try { fallbackCopyText(text); } catch (e) { finish(); }
    }
  }

  if (uiEls.todoQuoteCopy) {
    uiEls.todoQuoteCopy.title = t('quoteCopyTitle');
    uiEls.todoQuoteCopy.setAttribute('aria-label', t('quoteCopyTitle'));
    uiEls.todoQuoteCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      copyQuoteText(buildDailyQuoteCopyText(), uiEls.todoQuoteCopy);
    });
  }

  // === Rumi couplet toggle for the clock/calendar panel — same sun/moon pattern as the Quran ===
  // Difference: the Quran quote is single-language (Arabic) always; this one is bilingual —
  // only the Persian text shows in fa mode, only the English translation shows in en mode.
  let manualRumiIndex = null;
  let isRumiCollapsed = true; // Hidden by default, same as the Quran tab

  function renderRumiQuote() {
    const idx = manualRumiIndex !== null ? manualRumiIndex : getDailyRumiIndex();
    const q = RUMI_QUOTES[idx];
    const isFa = currentLang === 'fa';
    if (uiEls.clockQuoteText) {
      uiEls.clockQuoteText.textContent = isFa ? (q.fa || '') : (q.en || '');
      uiEls.clockQuoteText.dir = isFa ? 'rtl' : 'ltr';
      uiEls.clockQuoteText.classList.toggle('is-fa', isFa);
      uiEls.clockQuoteText.classList.toggle('is-en', !isFa);
    }
    if (uiEls.clockQuoteTitle) {
      uiEls.clockQuoteTitle.textContent = isFa ? 'مولانا' : 'Rumi';
      uiEls.clockQuoteTitle.dir = isFa ? 'rtl' : 'ltr';
    }
    if (uiEls.clockQuote) uiEls.clockQuote.classList.toggle('is-collapsed', isRumiCollapsed);
    if (uiEls.clockQuoteChevron) uiEls.clockQuoteChevron.textContent = isRumiCollapsed ? '▼' : '▲';

    if (uiEls.clockQuoteLabel) {
      uiEls.clockQuoteLabel.textContent = isRumiCollapsed ? '🌙' : '☀️';
    }
    if (uiEls.clockQuoteTab) {
      uiEls.clockQuoteTab.title = isRumiCollapsed
        ? (isFa ? 'نمایش شعر' : 'Show poem')
        : (isFa ? 'جمع کردن شعر' : 'Hide poem');
    }
  }

  function toggleRumiQuoteCollapse(e) {
    if (e) e.stopPropagation();
    isRumiCollapsed = !isRumiCollapsed;
    renderRumiQuote();
    if (typeof adjustClockPosition === 'function') adjustClockPosition();
  }

  function cycleToRandomRumiQuote(e) {
    if (e) e.stopPropagation();
    if (isRumiCollapsed) return;
    const currentIdx = manualRumiIndex !== null ? manualRumiIndex : getDailyRumiIndex();
    let next = currentIdx;
    if (RUMI_QUOTES.length > 1) {
      while (next === currentIdx) next = Math.floor(Math.random() * RUMI_QUOTES.length);
    }
    manualRumiIndex = next;
    uiEls.clockQuote.classList.remove('pulse');
    void uiEls.clockQuote.offsetWidth;
    uiEls.clockQuote.classList.add('pulse');
    renderRumiQuote();
    if (typeof adjustClockPosition === 'function') adjustClockPosition();
  }

  if (uiEls.clockQuoteTab) {
    uiEls.clockQuoteTab.addEventListener('click', toggleRumiQuoteCollapse);
  }
  if (uiEls.clockQuoteBody) {
    uiEls.clockQuoteBody.addEventListener('click', cycleToRandomRumiQuote);
  }

  function buildRumiQuoteCopyText() {
    const idx = manualRumiIndex !== null ? manualRumiIndex : getDailyRumiIndex();
    const q = RUMI_QUOTES[idx];
    if (!q) return '';
    const isFa = currentLang === 'fa';
    const lines = [];
    const body = isFa ? (q.fa || '') : (q.en || '');
    if (body) lines.push(body);
    // Include the other language when available for a complete shareable block
    const other = isFa ? (q.en || '') : (q.fa || '');
    if (other && other !== body) lines.push(other);
    const attr = isFa ? 'مولانا' : 'Rumi';
    if (q.ref) lines.push(q.ref);
    else lines.push(attr);
    return lines.join('\n\n');
  }

  if (uiEls.clockQuoteCopy) {
    uiEls.clockQuoteCopy.title = t('quoteCopyTitle');
    uiEls.clockQuoteCopy.setAttribute('aria-label', t('quoteCopyTitle'));
    uiEls.clockQuoteCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      copyQuoteText(buildRumiQuoteCopyText(), uiEls.clockQuoteCopy);
    });
  }
  renderRumiQuote();

  // Both motivational drawers (Quran verse / Rumi couplet) keep their own open/closed
  // state independent of the panels that host them, so if the user leaves one expanded
  // and its panel then closes (via its own toggle, switching to another panel, or the
  // whole widget collapsing), it would silently stay "open" underneath and reappear
  // expanded next time. These force each one back to its default collapsed/hidden state.
  function collapseDailyQuote() {
    if (!isQuoteCollapsed) { isQuoteCollapsed = true; renderDailyQuote(); }
  }
  function collapseRumiQuote() {
    if (!isRumiCollapsed) { isRumiCollapsed = true; renderRumiQuote(); }
  }
  function collapseMotivationalQuotes() {
    collapseDailyQuote();
    collapseRumiQuote();
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
      const rect = hub.getBoundingClientRect();
      const panelWidth = todoPanel.offsetWidth || 280;
      const panelHeight = todoPanel.offsetHeight || 300;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const hubCenterX = rect.left + rect.width / 2;
      const hubCenterY = rect.top + rect.height / 2;
      const GAP = 14;
      const EDGE = 12;
      let leftPos, topPos;
      if (hubCenterX > vw * 0.55) {
        leftPos = rect.left - panelWidth - GAP;
        topPos = hubCenterY - panelHeight / 2;
      } else if (hubCenterX < vw * 0.35) {
        leftPos = rect.right + GAP;
        topPos = hubCenterY - panelHeight / 2;
      } else {
        leftPos = rect.left - panelWidth - GAP;
        topPos = hubCenterY - panelHeight / 2;
        if (leftPos < EDGE) leftPos = rect.right + GAP;
      }
      if (leftPos < EDGE) leftPos = rect.right + GAP;
      if (leftPos + panelWidth > vw - EDGE) leftPos = rect.left - panelWidth - GAP;
      if (leftPos < EDGE) leftPos = EDGE;
      if (leftPos + panelWidth > vw - EDGE) leftPos = vw - panelWidth - EDGE;
      if (topPos < EDGE) topPos = EDGE;
      if (topPos + panelHeight > vh - EDGE) topPos = vh - panelHeight - EDGE;
      todoPanel.style.left = `${leftPos}px`;
      todoPanel.style.top = `${topPos}px`;
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
    [linksData, linksData2, linksData3, linksData4].forEach((arr, hubIdx) => {
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
      .map(({ link, hub, idx }) => {
        const titleScore = fuzzyScore(link.label, query);
        const descScore = fuzzyScore(link.description, query);
        // مچ در عنوان همیشه بالاتر از مچ در توضیحات رتبه‌بندی می‌شود
        let score = -1;
        if (titleScore > -1) score = titleScore;
        else if (descScore > -1) score = descScore - 2000;
        return { link, hub, idx, score, matchedDesc: titleScore === -1 && descScore > -1 };
      })
      .filter(x => x.score > -1 || x.matchedDesc)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    if (matches.length === 0) {
      const empty = document.createElement('li'); empty.className = 'ai-search-empty'; empty.textContent = t('searchNoResults');
      list.appendChild(empty);
    } else {
      matches.forEach(({ link, hub, idx, matchedDesc }) => {
        const li = document.createElement('li'); li.className = 'ai-search-result';

        // رنگ همان تیرِ بوک‌مارک در چرخ - همیشه محاسبه می‌شود، هرگز خالی نمی‌ماند
        const colorDot = document.createElement('span'); colorDot.className = 'ai-search-result-color';
        const colorSet = colorSetForBookmark(link, idx);
        colorDot.style.background = colorSet.border; colorDot.style.boxShadow = `0 0 5px ${colorSet.glow}`;

        const fav = document.createElement('img'); fav.className = 'ai-search-result-favicon'; fav.src = getFaviconUrl(link.url);
        fav.addEventListener('error', () => fav.style.display = 'none');

        // عنوان و توضیحات هر دو در یک خط — توضیحات داخل پرانتز و کم‌رنگ‌تر، بدون برچسبِ اضافه
        const labelWrap = document.createElement('span'); labelWrap.className = 'ai-search-result-label';
        const span = document.createElement('span'); span.className = 'ai-search-result-label-title'; span.textContent = link.label;
        labelWrap.appendChild(span);
        if (link.description) {
          const descSpan = document.createElement('span'); descSpan.className = 'ai-search-result-desc-inline';
          descSpan.textContent = ` (${link.description})`;
          labelWrap.appendChild(descSpan);
        }

        // بج کهکشان همیشه و جدا از بج ستاره نشان داده می‌شود تا هیچ‌وقت گم نشود
        const badges = document.createElement('span'); badges.className = 'ai-search-result-badges';
        const hubStr = isNewsHub(hub)
          ? t('hubNews')
          : (currentLang === 'fa' ? toPersianDigits(hub) : String(hub));
        const galaxyBadge = document.createElement('span'); galaxyBadge.className = 'ai-search-result-galaxy';
        galaxyBadge.textContent = isNewsHub(hub) ? hubStr : t('searchMetaHubOnly').replace('{hub}', hubStr);
        badges.appendChild(galaxyBadge);
        if (link.importance != null) {
          const starBadge = document.createElement('span'); starBadge.className = 'ai-search-result-stars';
          starBadge.textContent = '★'.repeat(Math.max(1, Math.min(5, link.importance)));
          badges.appendChild(starBadge);
        }

        li.appendChild(colorDot); li.appendChild(fav); li.appendChild(labelWrap); li.appendChild(badges);

        // ویرایش همیشه در دسترس است. برای ۴ اسلوت ثابت (هوش مصنوعی در کهکشان ۱،
        // یا جایگاه‌های خالی پیش‌فرض در کهکشان ۲ و ۳) دکمهٔ حذف به‌جای برداشتنِ کامل آیتم،
        // آن را به‌همان روشی که فرم ویرایش انجام می‌دهد خالی می‌کند.
        const isFixedSlot = idx < 4;
        const actions = document.createElement('span'); actions.className = 'ai-search-result-actions';
        const editBtn = document.createElement('button'); editBtn.type = 'button'; editBtn.className = 'ai-search-action-btn ai-search-action-edit';
        editBtn.title = t('searchEditBtn'); editBtn.setAttribute('aria-label', t('searchEditBtn')); editBtn.textContent = '✎';
        editBtn.addEventListener('click', (e) => { e.stopPropagation(); editBookmarkFromSearch(link, hub, idx); });
        const delBtn = document.createElement('button'); delBtn.type = 'button'; delBtn.className = 'ai-search-action-btn ai-search-action-delete';
        const delTitle = isFixedSlot ? t('formClearCoreBtn') : t('searchDeleteBtn');
        delBtn.title = delTitle; delBtn.setAttribute('aria-label', delTitle); delBtn.textContent = '✕';
        delBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteBookmarkFromSearch(link, hub); });
        actions.appendChild(editBtn); actions.appendChild(delBtn);
        li.appendChild(actions);

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
    if (pos < 4) {
      // اسلوت ثابت — مثل فرم ویرایش، به‌جای حذف از آرایه، خالی می‌شود
      arr[pos] = { label: '', url: '', description: '', importance: DEFAULT_IMPORTANCE };
      saveLinksAll();
      if (currentHubIndex === hubIdx) renderSpiral();
      if (typeof renderTierDots === 'function') renderTierDots();
      showToastNotification(t('toastCoreCleared'));
      renderSearchResults(uiEls.searchInput.value);
      return;
    }
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
      const rect = hub.getBoundingClientRect(); const panelWidth = 380; const panelHeight = searchPanel.offsetHeight || 260; const vw = window.innerWidth; const vh = window.innerHeight;
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
        const dot = document.createElement('div');
        dot.className = 'hub-dot' + (i === currentHubIndex ? ' active' : '') + (isNewsHub(i) ? ' hub-dot-news' : '');
        dot.title = i === 1 ? t('hubDotHome') : (isNewsHub(i) ? t('hubDotNews') : t('hubDotTitle').replace('{n}', i - 1));
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
      // فاصله از ۲۶ به ۳۸ افزایش یافت: هندل فاصله‌گذاری (ai-spacing-arc) وقتی در حال کشیده‌شدن است
      // برچسب مقدار را تا حدود ۳۰px بالاتر از لبهٔ هاب نشان می‌دهد؛ با ۳۸px همیشه فاصلهٔ امن دارد.
      let topPos = rect.top - 38;
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
  /**
   * Global (TTL) undo is ONLY for bookmark / todo / storage recovery.
   * Notepad text uses NotepadUndoManager (multi-step, zero-TTL, session-persisted).
   * Calling setUndoState('text', ...) is kept as a thin compatibility shim that
   * routes into the notepad stack when the manager exists.
   */
  function setUndoState(type, data, targetHub = currentHubIndex, duration = 10000) {
      if (type === 'text') {
        // Compatibility bridge → dedicated multi-step notepad memory (no TTL).
        try {
          if (typeof notepadUndo !== 'undefined' && notepadUndo && data) {
            notepadUndo.pushExternal(data);
            syncUndoToggleVisual();
            return;
          }
        } catch (err) {}
        // Fallback if manager not ready yet: still avoid expiring text history.
        pendingUndoState = { type: 'text', data, hub: targetHub };
        root.classList.remove('hide-toggles');
        undoToggleDot.classList.add('active-undo');
        clearTimeout(globalUndoTimeout);
        return;
      }
      const previousType = pendingUndoState.type;
      pendingUndoState = { type, data, hub: targetHub };
      root.classList.remove('hide-toggles');
      undoToggleDot.classList.add('active-undo');
      clearTimeout(globalUndoTimeout);
      if ((previousType === 'bookmark' || previousType === 'storage') && type !== previousType) {
        try { chrome.storage.sync.remove('lastDeletedLink'); } catch (err) {}
      }
      globalUndoTimeout = setTimeout(() => {
          // Only clear TTL-backed states; never touch notepad multi-step memory.
          if (pendingUndoState.type === type) {
            undoToggleDot.classList.remove('active-undo');
            pendingUndoState = { type: null, data: null, hub: 1 };
          }
          if (type === 'bookmark' || type === 'storage') {
            try { chrome.storage.sync.remove('lastDeletedLink'); } catch (err) {}
          }
          syncUndoToggleVisual();
      }, duration);
  }

  function syncUndoToggleVisual() {
    try {
      const ttlActive = !!(pendingUndoState && pendingUndoState.type && pendingUndoState.type !== 'text');
      const noteActive = (typeof notepadUndo !== 'undefined' && notepadUndo && notepadUndo.canUndo());
      const legacyText = !!(pendingUndoState && pendingUndoState.type === 'text');
      if (ttlActive || noteActive || legacyText) {
        root.classList.remove('hide-toggles');
        undoToggleDot.classList.add('active-undo');
      } else if (!ttlActive) {
        // Keep active-undo only when something is actually recoverable.
        if (!noteActive && !legacyText) undoToggleDot.classList.remove('active-undo');
      }
    } catch (err) {}
  }
  // =========================================================================
  // ExtensionLifecycleController — Zero-Page-Reload Soft Relaunch
  // Teardown → Hydrate from chrome.storage → Protected remount + watchdog
  // Undo toggle is dual-purpose: active-undo = restore last action;
  // idle click = soft relaunch (no location.reload).
  // =========================================================================
  const EXTENSION_ROOT_IDS = [
    'ai-orbit-root',
    'ai-inline-form',
    'ai-quick-note-form',
    'ai-calc-panel',
    'ai-clock-panel',
    'ai-todo-panel',
    'ai-search-panel',
    'ai-tier-dots',
    'ai-hub-dots',
    'ai-star-editor-popup'
  ];

  class ExtensionLifecycleController {
    constructor() {
      this.activeTimers = new Set();
      this.activeIntervals = new Set();
      this.domWatchdog = null;
      this.isRelaunching = false;
      this._clockRegistered = false;
    }

    registerTimer(id) {
      if (typeof id === 'number') this.activeTimers.add(id);
      return id;
    }
    registerInterval(id) {
      if (typeof id === 'number') this.activeIntervals.add(id);
      return id;
    }
    clearTrackedTimers() {
      this.activeTimers.forEach((id) => { try { clearTimeout(id); } catch (e) {} });
      this.activeIntervals.forEach((id) => { try { clearInterval(id); } catch (e) {} });
      this.activeTimers.clear();
      this.activeIntervals.clear();
    }

    getMountTarget() {
      return document.documentElement || document.body;
    }

    /**
     * Soft detach of extension DOM from whatever parent currently holds them.
     * Does NOT destroy in-memory element references or event listeners —
     * listeners stay bound on the same Element nodes across relaunches.
     */
    detachDomArtifacts() {
      const nodes = [
        root, inlineForm, quickNoteForm, calcPanel, clockPanel,
        todoPanel, searchPanel, tierDotsNav, hubDotsNav, toastBox, starEditorPopup
      ];
      nodes.forEach((el) => {
        try {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        } catch (err) {}
      });
      // Sweep any orphaned duplicates left by SPA clones / prior bugs
      EXTENSION_ROOT_IDS.forEach((id) => {
        try {
          const el = document.getElementById(id);
          if (el && el.parentNode) el.parentNode.removeChild(el);
        } catch (err) {}
      });
      try {
        document.querySelectorAll('.ai-toast-notification').forEach((el) => {
          if (el !== toastBox && el.parentNode) el.parentNode.removeChild(el);
        });
      } catch (err) {}
    }

    attachDomArtifacts() {
      const target = this.getMountTarget();
      if (!target) return;
      const nodes = [
        root, inlineForm, quickNoteForm, calcPanel, clockPanel,
        todoPanel, searchPanel, tierDotsNav, hubDotsNav, toastBox, starEditorPopup
      ];
      nodes.forEach((el) => {
        try {
          if (el && !target.contains(el)) target.appendChild(el);
        } catch (err) {}
      });
    }

    stopWatchdog() {
      if (this.domWatchdog) {
        try { this.domWatchdog.disconnect(); } catch (err) {}
        this.domWatchdog = null;
      }
    }

    startWatchdog() {
      this.stopWatchdog();
      const self = this;
      try {
        this.domWatchdog = new MutationObserver(() => {
          if (self.isRelaunching) return;
          if (!document.getElementById('ai-orbit-root')) {
            // SPA wiped our root — soft re-attach without full storage round-trip
            try { self.attachDomArtifacts(); } catch (err) {}
            try {
              root.style.display = '';
              hub.classList.remove('hub-collapsed');
              root.classList.remove('hide-toggles');
              if (typeof resetAutoCollapseTimer === 'function') resetAutoCollapseTimer();
              if (typeof resetToggleTimeout === 'function') resetToggleTimeout();
            } catch (err) {}
          }
        });
        const observeTarget = document.body || document.documentElement;
        if (observeTarget) {
          this.domWatchdog.observe(observeTarget, { childList: true, subtree: false });
        }
        // Also watch documentElement when body is the primary observe target
        if (document.documentElement && observeTarget !== document.documentElement) {
          try {
            this.domWatchdog.observe(document.documentElement, { childList: true, subtree: false });
          } catch (err) {}
        }
      } catch (err) {}
    }

    /** Clear transient UI interaction state without destroying data. */
    resetTransientUi() {
      try {
        isDragging = false;
        dragMoved = false;
        quickAddActive = false;
        quickAddFired = false;
        if (typeof closeStarEditor === 'function') closeStarEditor();
        if (typeof closeInlineForm === 'function') closeInlineForm();
        if (typeof abortNoteClosing === 'function') abortNoteClosing();
        hub.classList.remove('hub-collapsed', 'quickadd-flash');
        root.classList.remove('hide-toggles', 'dragging');
        root.style.display = '';
        if (!root.style.left && !root.style.bottom) {
          root.style.left = WIDGET1_DEFAULT_LEFT;
          root.style.top = 'auto';
          root.style.bottom = WIDGET1_DEFAULT_BOTTOM;
        }
      } catch (err) {}
    }

    /**
     * PHASE 1 — Idempotent teardown of timers + DOM placement.
     * Event listeners remain on live Element objects (no re-bind needed).
     */
    teardown() {
      // Transient interaction timers (auto-collapse, toggle hide, undo expiry, etc.)
      try { clearTimeout(globalUndoTimeout); } catch (e) {}
      try { if (typeof autoCollapseTimeout !== 'undefined') clearTimeout(autoCollapseTimeout); } catch (e) {}
      try { if (typeof toggleHideTimeout !== 'undefined') clearTimeout(toggleHideTimeout); } catch (e) {}
      try { if (typeof treeAutoHideTimeout !== 'undefined') clearTimeout(treeAutoHideTimeout); } catch (e) {}
      try { if (typeof holdGraceTimer !== 'undefined') clearTimeout(holdGraceTimer); } catch (e) {}
      try { if (typeof noteCollapseInterval !== 'undefined') clearInterval(noteCollapseInterval); } catch (e) {}
      try { if (typeof notepadIdleTimer !== 'undefined') clearTimeout(notepadIdleTimer); } catch (e) {}
      try { if (typeof noteEditSessionTimer !== 'undefined') clearTimeout(noteEditSessionTimer); } catch (e) {}
      try { if (typeof noteDraftSaveTimer !== 'undefined') clearTimeout(noteDraftSaveTimer); } catch (e) {}
      this.clearTrackedTimers();
      this.stopWatchdog();
      this.detachDomArtifacts();
    }

    /**
     * PHASE 2 — Authoritative hydration from chrome.storage via existing loader.
     */
    async hydrateState() {
      try {
        if (typeof loadDataAndRender === 'function') {
          await Promise.resolve(loadDataAndRender());
        }
        if (typeof restoreNoteDraft === 'function') {
          await Promise.resolve(restoreNoteDraft());
        }
        // Re-load multi-step notepad history after soft relaunch
        try {
          if (typeof notepadUndo !== 'undefined' && notepadUndo && chrome.runtime?.id) {
            await new Promise((resolve) => {
              try {
                chrome.storage.local.get(['aiTreeNotepadHistory'], (res) => {
                  try {
                    if (res && res.aiTreeNotepadHistory) notepadUndo.loadFromStorage(res.aiTreeNotepadHistory);
                  } catch (e) {}
                  resolve();
                });
              } catch (e) { resolve(); }
            });
          }
        } catch (e) {}
      } catch (err) {
        console.warn('[AI Tree] hydrateState:', err);
      }
    }

    /**
     * PHASE 3 — Protected mount + restart essential intervals + watchdog.
     */
    mountProtected() {
      this.attachDomArtifacts();
      this.resetTransientUi();
      try {
        adjustNotepadPosition(); adjustCalcPosition(); adjustClockPosition();
        adjustTodoPosition(); adjustSearchPosition(); adjustDotsNavPosition(); adjustHubDotsPosition();
      } catch (err) {}
      try {
        if (typeof renderSpiral === 'function' && isOpen) renderSpiral();
        if (typeof renderTierDots === 'function') renderTierDots();
        if (typeof renderHubDots === 'function') renderHubDots();
        if (typeof updateBookmarkCount === 'function') updateBookmarkCount();
      } catch (err) {}
      // Restart clock age tick if the previous interval was cleared
      try {
        if (typeof clockAgeIntervalId === 'number') {
          clearInterval(clockAgeIntervalId);
        }
        clockAgeIntervalId = setInterval(updateClockAge, 1000);
        this.registerInterval(clockAgeIntervalId);
      } catch (err) {}
      try {
        if (typeof resetAutoCollapseTimer === 'function') resetAutoCollapseTimer();
        if (typeof resetToggleTimeout === 'function') resetToggleTimeout();
      } catch (err) {}
      this.startWatchdog();
    }

    /**
     * Complete Zero-Reload Hot Restart (typically <80ms).
     */
    async relaunchSilently(reason, opts) {
      const silent = !!(opts && opts.silent);
      if (this.isRelaunching) return;
      this.isRelaunching = true;
      try {
        this.teardown();
        await this.hydrateState();
        this.mountProtected();
        if (!silent) {
          try {
            hub.classList.add('quickadd-flash');
            setTimeout(() => hub.classList.remove('quickadd-flash'), 450);
            showToastNotification(t('toastRevived'));
          } catch (err) {}
        }
      } catch (error) {
        console.error('[AI Tree] Soft relaunch failed:', error, reason || '');
        // Best-effort recovery: ensure DOM is at least visible
        try { this.attachDomArtifacts(); this.resetTransientUi(); this.startWatchdog(); } catch (e) {}
      } finally {
        this.isRelaunching = false;
      }
    }
  }

  const lifecycle = new ExtensionLifecycleController();
  // Register the initial clock interval created at boot
  try {
    if (typeof clockAgeIntervalId === 'number') lifecycle.registerInterval(clockAgeIntervalId);
  } catch (err) {}
  lifecycle.startWatchdog();

  /** @deprecated Prefer lifecycle.relaunchSilently — kept as stable call site for watchdog & messages */
  function reviveLauncher(opts) {
    const silent = !!(opts && opts.silent);
    lifecycle.relaunchSilently(opts && opts.reason ? opts.reason : 'reviveLauncher', { silent });
  }

  undoToggleDot.addEventListener('click', (e) => {
      e.stopPropagation();
      // Hybrid priority:
      //  1) TTL-backed bookmark / todo / storage recovery (existing 10s behaviour)
      //  2) Multi-step notepad undo (zero-TTL, survives for the session)
      //  3) Idle → soft relaunch
      const undoneType = pendingUndoState && pendingUndoState.type;
      const hasTtlUndo = undoneType === 'bookmark' || undoneType === 'storage' || undoneType === 'todo';
      const hasNoteUndo = (typeof notepadUndo !== 'undefined' && notepadUndo && notepadUndo.canUndo());
      const hasLegacyText = undoneType === 'text';

      if (!hasTtlUndo && !hasNoteUndo && !hasLegacyText) {
        lifecycle.relaunchSilently('undo_idle_click', { silent: false });
        return;
      }

      if (hasTtlUndo) {
        if (undoneType === 'bookmark' || undoneType === 'storage') {
          let linkToRestore = pendingUndoState.data; let targetHub = pendingUndoState.hub;
          if (!linkToRestore) {
            chrome.storage.sync.get(['lastDeletedLink'], (res) => {
              if (res.lastDeletedLink) restoreBookmark(res.lastDeletedLink, res.lastDeletedLink._hub || targetHub);
            });
          } else {
            restoreBookmark(linkToRestore, targetHub);
          }
        } else if (undoneType === 'todo') {
          const { item, index } = pendingUndoState.data || {};
          if (item) {
            const insertAt = Math.min(index ?? todosData.length, todosData.length);
            todosData.splice(insertAt, 0, item);
            saveTodos();
            if ((item.type || 'daily') !== activeTodoTab) switchTodoTab(item.type || 'daily');
            else if (todoPanel.classList.contains('active')) renderTodos();
            showToastNotification(t('toastRestored'));
          }
        }
        clearTimeout(globalUndoTimeout);
        pendingUndoState = { type: null, data: null, hub: 1 };
        if (undoneType === 'bookmark' || undoneType === 'storage') {
          try { chrome.storage.sync.remove('lastDeletedLink'); } catch (err) {}
        }
        syncUndoToggleVisual();
        return;
      }

      // Notepad multi-step (preferred) or legacy single text snapshot
      if (hasNoteUndo) {
        notepadUndo.undo();
        return;
      }
      if (hasLegacyText) {
        if (typeof endNoteEditSession === 'function') endNoteEditSession();
        const textState = pendingUndoState.data;
        const restoredText = typeof textState === 'string' ? textState : (textState && textState.value) || '';
        if (noteTextarea) {
          noteTextarea.value = restoredText;
          if (typeof textState === 'object' && textState) {
            if (textState.prevWidth) { quickNoteForm.style.width = textState.prevWidth; noteManuallyPositioned = true; }
            if (textState.prevHeight) { quickNoteForm.style.height = textState.prevHeight; noteManuallyPositioned = true; }
            const caret = Math.min(textState.selectionStart ?? restoredText.length, restoredText.length);
            const caretEnd = Math.min(textState.selectionEnd ?? caret, restoredText.length);
            noteTextarea.focus();
            try { noteTextarea.setSelectionRange(caret, caretEnd); } catch (err) {}
          }
        }
        quickNoteForm.classList.add('active'); root.classList.add('show-notepad');
        if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
        if (typeof saveNoteDraftDebounced === 'function') saveNoteDraftDebounced();
        adjustNotepadPosition();
        showToastNotification(t('toastRestored'));
        pendingUndoState = { type: null, data: null, hub: 1 };
        syncUndoToggleVisual();
      }
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
          if (typeof exitNoteSplit === 'function') exitNoteSplit(false);
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
          if (uiEls.markToggle) uiEls.markToggle.setAttribute('aria-expanded', 'false');
          clockPanel.classList.remove('marks-open-left');
        }
        if (typeof closeDualPicker === 'function') { try { closeDualPicker(); } catch (_) {} }
        if (typeof collapseRumiQuote === 'function') collapseRumiQuote();
      }
      if (exceptStr !== 'todo') {
        todoPanel.classList.remove('active');
        root.classList.remove('show-todo');
        if (typeof collapseDailyQuote === 'function') collapseDailyQuote();
      }
      if (exceptStr !== 'search') { searchPanel.classList.remove('active'); root.classList.remove('show-search'); }
  }

  let autoCollapseTimeout = null; const AUTO_COLLAPSE_DELAY = 5200; let isInitialReveal = true;
  let isHoveringWidget = false;
  function triggerAutoCollapse() {
    if (isNotePinned) return;
    if (!isHoveringWidget && !isDragging && !inlineForm.classList.contains('active') && !quickNoteForm.classList.contains('active') && !calcPanel.classList.contains('active') && !clockPanel.classList.contains('active') && !todoPanel.classList.contains('active') && !searchPanel.classList.contains('active')) {
      isInitialReveal = false; root.classList.remove('initial-reveal'); closeTree(); hub.classList.add('hub-collapsed');
      if (typeof collapseMotivationalQuotes === 'function') collapseMotivationalQuotes();
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
  let isNoteDragging = false, noteDragMoved = false;
  let noteStartX, noteStartY, noteStartLeft, noteStartTop;
  let noteSplitSide = null; // null | 'left' | 'right' | 'top' | 'bottom'
  const NOTE_SPLIT_EDGE_PX = 48;
  const NOTE_SPLIT_TOP = 0;
  const NOTE_SPLIT_BOTTOM_GAP = 48; // keep toolbar above Windows taskbar
  const NOTE_SPLIT_EDGE_GAP = 20; // fixed breathing room on BOTH sides, always — same fixed-size idea as the bottom gap.
  // Sites like X/Twitter use virtualized, custom-scrolled layouts where the page's real
  // scrollbar gutter can't be reliably measured from documentElement/body/scrollingElement
  // (their scroll container is some inner div, not the page root). Rather than trying to
  // detect the exact scrollbar width per site, just always keep a comfortably large fixed
  // gap from both edges — simple, and correct everywhere regardless of the host page's
  // internal layout quirks.
  const NOTE_SPLIT_WIDTH_DEFAULT = 380;
  let noteSplitWidth = NOTE_SPLIT_WIDTH_DEFAULT; // user-adjustable while split left/right
  // Horizontal dock (top/bottom): full width, adjustable height instead of adjustable width.
  const NOTE_HDOCK_HEIGHT_DEFAULT = 340; // "acceptable" default height requested
  const NOTE_HDOCK_MIN_H = 200;
  let noteDockHeight = NOTE_HDOCK_HEIGHT_DEFAULT; // user-adjustable while docked top/bottom

  function isNoteHDock(side) { return side === 'top' || side === 'bottom'; }

  function getNoteSplitLeftPos(side, vw, width) {
    if (side === 'left') return NOTE_SPLIT_EDGE_GAP;
    if (side === 'right') return vw - width - NOTE_SPLIT_EDGE_GAP;
    return NOTE_SPLIT_EDGE_GAP; // top/bottom: always flush to the fixed side gap
  }

  function getNoteDockTopPos(side, vh, height) {
    if (side === 'top') return NOTE_SPLIT_TOP;
    return vh - height - NOTE_SPLIT_BOTTOM_GAP; // bottom: keep the bottom edge fixed
  }

  function getNoteSplitMetrics(side) {
    const s = side || noteSplitSide;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (isNoteHDock(s)) {
      const maxH = Math.max(NOTE_HDOCK_MIN_H, Math.round(vh * 0.85));
      const height = Math.max(NOTE_HDOCK_MIN_H, Math.min(maxH, noteDockHeight || NOTE_HDOCK_HEIGHT_DEFAULT));
      const width = Math.max(NOTE_MIN_W || NOTE_SPLIT_WIDTH_DEFAULT, vw - NOTE_SPLIT_EDGE_GAP * 2);
      return { vw, vh, width, height, minH: NOTE_HDOCK_MIN_H, maxH };
    }
    const minW = (typeof NOTE_MIN_W === 'number' ? NOTE_MIN_W : NOTE_SPLIT_WIDTH_DEFAULT);
    const maxW = Math.max(minW, Math.round(vw * 0.7));
    const width = Math.max(minW, Math.min(maxW, noteSplitWidth || minW));
    const height = Math.max(280, vh - NOTE_SPLIT_TOP - NOTE_SPLIT_BOTTOM_GAP);
    return { vw, vh, width, height, minW, maxW };
  }


  function syncNoteSplitBtn() {
    const btn = document.getElementById('ai-note-split-btn');
    if (!btn) return;
    const on = !!noteSplitSide;
    btn.classList.toggle('is-active', on);
    btn.title = on
      ? (currentLang === 'fa' ? 'خروج از اسپلیت' : 'Exit split view')
      : (currentLang === 'fa' ? 'اسپلیت / داک به نزدیک‌ترین لبه' : 'Split / dock to nearest edge');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function exitNoteSplit(keepSize) {
    if (!noteSplitSide) { syncNoteSplitBtn(); return; }
    noteSplitSide = null;
    quickNoteForm.classList.remove(
      'split-docked', 'split-left', 'split-right', 'split-top', 'split-bottom',
      'split-preview-left', 'split-preview-right', 'split-preview-top', 'split-preview-bottom'
    );
    // Return to normal open state: unpin (same as first open)
    isNotePinned = false;
    quickNoteForm.classList.remove('is-pinned');
    if (typeof applyPinVisual === 'function') applyPinVisual(false);
    if (!keepSize) {
      // Restore compact floating size near hub
      noteManuallyPositioned = false;
      if (typeof resetNoteSizeToDefault === 'function') resetNoteSizeToDefault();
      else { quickNoteForm.style.width = ''; quickNoteForm.style.height = ''; }
      if (typeof adjustNotepadPosition === 'function') adjustNotepadPosition();
      if (typeof startNotepadIdleTimer === 'function') startNotepadIdleTimer();
    }
    syncNoteSplitBtn();
  }

  function enterNoteSplit(side) {
    const isH = isNoteHDock(side);
    const { vw, vh, width, height } = getNoteSplitMetrics(side);
    noteSplitSide = side;
    if (isH) noteDockHeight = height; else noteSplitWidth = width;
    noteManuallyPositioned = true;
    // Prevent autoGrowNotepad from collapsing split height back to content size
    if (typeof noteUserResized !== 'undefined') noteUserResized = true;
    isNotePinned = true;
    if (typeof applyPinVisual === 'function') applyPinVisual(true);
    quickNoteForm.classList.add('is-pinned', 'split-docked');
    quickNoteForm.classList.toggle('split-left', side === 'left');
    quickNoteForm.classList.toggle('split-right', side === 'right');
    quickNoteForm.classList.toggle('split-top', side === 'top');
    quickNoteForm.classList.toggle('split-bottom', side === 'bottom');
    quickNoteForm.classList.remove('split-preview-left', 'split-preview-right', 'split-preview-top', 'split-preview-bottom');
    quickNoteForm.style.width = width + 'px';
    quickNoteForm.style.height = height + 'px';
    if (isH) {
      quickNoteForm.style.left = NOTE_SPLIT_EDGE_GAP + 'px';
      quickNoteForm.style.top = getNoteDockTopPos(side, vh, height) + 'px';
    } else {
      quickNoteForm.style.top = NOTE_SPLIT_TOP + 'px';
      quickNoteForm.style.left = getNoteSplitLeftPos(side, vw, width) + 'px';
    }
    syncNoteSplitBtn();
  }

  function toggleNoteSplit() {
    if (!quickNoteForm.classList.contains('active')) return;
    if (noteSplitSide) {
      exitNoteSplit(false);
      return;
    }
    // Pick whichever edge (left/right/top/bottom) the notepad currently sits closest to,
    // measured as a fraction of the viewport so top/bottom aren't unfairly favored — this way
    // a notepad parked centrally (e.g. near a centered hub) can still reach a top/bottom dock
    // with one click, not just by dragging all the way to that exact edge.
    const r = quickNoteForm.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const candidates = [
      { side: 'left', d: cx / vw },
      { side: 'right', d: 1 - cx / vw },
      { side: 'top', d: cy / vh },
      { side: 'bottom', d: 1 - cy / vh }
    ];
    candidates.sort((a, b) => a.d - b.d);
    enterNoteSplit(candidates[0].side);
  }

  function detectNoteSplitSide(rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const candidates = [
      { side: 'left', d: rect.left },
      { side: 'right', d: vw - rect.right },
      { side: 'top', d: rect.top },
      { side: 'bottom', d: vh - rect.bottom }
    ].filter(c => c.d <= NOTE_SPLIT_EDGE_PX);
    if (!candidates.length) return null;
    candidates.sort((a, b) => a.d - b.d);
    return candidates[0].side;
  }

  const noteHeaderEl = quickNoteForm.querySelector('#ai-note-header');
  if (noteHeaderEl) {
    noteHeaderEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('#ai-note-pin-btn') || e.target.closest('#ai-note-split-btn') || e.target.closest('#ai-note-newtab-btn')) return;
      e.stopPropagation(); e.preventDefault();
      // Leaving split mode when user starts dragging again
      if (noteSplitSide) {
        exitNoteSplit(true);
      }
      isNoteDragging = true; noteDragMoved = false;
      noteStartX = e.clientX; noteStartY = e.clientY;
      const r = quickNoteForm.getBoundingClientRect();
      noteStartLeft = r.left; noteStartTop = r.top;
      noteHeaderEl.style.cursor = 'grabbing';
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
      // Edge preview while dragging
      const r = quickNoteForm.getBoundingClientRect();
      const side = detectNoteSplitSide(r);
      quickNoteForm.classList.toggle('split-preview-left', side === 'left');
      quickNoteForm.classList.toggle('split-preview-right', side === 'right');
      quickNoteForm.classList.toggle('split-preview-top', side === 'top');
      quickNoteForm.classList.toggle('split-preview-bottom', side === 'bottom');
    }
  });
  document.addEventListener('mouseup', () => {
    if (!isNoteDragging) return;
    isNoteDragging = false;
    if (noteHeaderEl) noteHeaderEl.style.cursor = 'grab';
    if (noteDragMoved && quickNoteForm.classList.contains('active')) {
      const r = quickNoteForm.getBoundingClientRect();
      const side = detectNoteSplitSide(r);
      if (side) enterNoteSplit(side);
      else {
        quickNoteForm.classList.remove('split-preview-left', 'split-preview-right', 'split-preview-top', 'split-preview-bottom');
      }
    } else {
      quickNoteForm.classList.remove('split-preview-left', 'split-preview-right', 'split-preview-top', 'split-preview-bottom');
    }
  });

  window.addEventListener('resize', () => {
    if (noteSplitSide && quickNoteForm.classList.contains('active')) {
      enterNoteSplit(noteSplitSide);
    }
  });

  // Pin button
  // --- Smart Notepad State & Timers ---
  let noteCollapseInterval = null;
  let noteCollapseSeconds = 5;
  let notepadIdleTimer = null;
  const IDLE_GRACE_PERIOD = 5000;
  const pinBtn = quickNoteForm.querySelector('#ai-note-pin-btn');
  const splitBtn = quickNoteForm.querySelector('#ai-note-split-btn');
  const newTabBtn = quickNoteForm.querySelector('#ai-note-newtab-btn');
  if (newTabBtn) {
    newTabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        if (!chrome.runtime?.id) return;
        const flush = { savedPromptDraft: noteTextarea ? noteTextarea.value : '' };
        chrome.storage.local.set(flush, () => {
          chrome.runtime.sendMessage({ action: 'openNotepadTab' }, () => {
            // No response handler needed; swallow "no receiver" errors when SW is asleep/waking.
            void chrome.runtime.lastError;
          });
        });
      } catch (err) {}
    });
  }
  if (splitBtn) {
    splitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleNoteSplit();
    });
  }
  syncNoteSplitBtn();

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
        if (typeof collapseMotivationalQuotes === 'function') collapseMotivationalQuotes();
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
  // Chrome resyncs :hover state with a synthetic mouseleave/mouseenter pair when a tab
  // regains visibility (e.g. returning from the standalone notepad tab, or just alt-tabbing
  // back) — this has nothing to do with the user's real cursor, so it must not start the
  // idle-close countdown. Cancel any timer it may have started and briefly ignore mouseleave.
  let noteSuppressIdleUntil = 0;
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      stopNotepadIdleTimer();
      noteSuppressIdleUntil = Date.now() + 500;
    }
  });
  quickNoteForm.addEventListener('mouseleave', () => {
    if (Date.now() < noteSuppressIdleUntil) return;
    startNotepadIdleTimer();
  });

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
      exitNoteSplit(false);
      closeAllPanelsExcept('', true);
      abortNoteClosing();
    } else {
      closeAllPanelsExcept('note');
      quickNoteForm.classList.add('active');
      root.classList.add('show-notepad');
      noteManuallyPositioned = false;
      if (typeof resetNoteSizeToDefault === 'function') resetNoteSizeToDefault();
      else { quickNoteForm.style.width = ''; quickNoteForm.style.height = ''; }
      if (noteTextarea) {
        adjustNotepadPosition();
        setTimeout(() => {
          noteTextarea.focus();
          if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
          adjustNotepadPosition();
        }, 50);
      }
      startNotepadIdleTimer();
    }
    resetToggleTimeout();
  });

  // ========== اندازه یادداشت ==========
  // باز شدن: ارتفاعِ پیش‌فرض از روی «۴ خط مرجع» محاسبه می‌شود (نه یک عدد ثابتِ حدسی)
  // تا اگر فونت/line-height بعداً عوض شد خودش هماهنگ بماند؛ عرضِ پیش‌فرض هم به‌اندازه‌ای
  // بزرگ است که ردیف دکمه‌های پایین (پاک‌کردن/کپی/متنی/اشتراک/ارسال) در یک خط جا شوند.
  // تایپ: اول ارتفاع رشد می‌کند؛ اگر محتوا حتی در حداکثر ارتفاع هم جا نشد،
  // عرض هم متناسب با میزان سرریز رشد می‌کند.
  const NOTE_MIN_W = 380;
  const NOTE_MIN_H = 360; // enough for header + templates + full bottom toolbar
  const NOTE_DEFAULT_W = 500;
  const NOTE_TA_MIN_LINES = 4; // ارتفاع پیش‌فرضِ باز شدن، معادل ۴ خط تایپ
  const NOTE_TA_MAX_LINES = 10;
  // هر خط سرریزِ فراتر از حداکثر ارتفاع، عرض کادر را همین‌قدر پیکسل بیشتر می‌کند
  const NOTE_WIDTH_PER_OVERFLOW_LINE = 26;
  // کفِ chrome (هدر+فرمت+قالب+وضعیت+تولبار+gap+padding) — اگر DOM در دسترس باشد دقیق‌تر اندازه گرفته می‌شود
  const NOTE_CHROME_H = 230;
  let noteUserResized = false;

  function noteMaxW() { return Math.round(window.innerWidth * 0.9); }
  function noteMaxH() { return Math.round(window.innerHeight * 0.9); }

  function resetNoteSizeToDefault() {
    noteUserResized = false;
    quickNoteForm.style.width = '';
    quickNoteForm.style.height = '';
    if (noteTextarea) {
      noteTextarea.style.height = '';
      noteTextarea.style.minHeight = '';
    }
  }

  function measureNoteLineMetrics() {
    if (!noteTextarea) return { lineH: 21, padY: 16 };
    const cs = window.getComputedStyle(noteTextarea);
    let lineH = parseFloat(cs.lineHeight);
    if (!lineH || Number.isNaN(lineH)) lineH = (parseFloat(cs.fontSize) || 13.5) * 1.55;
    const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    return { lineH, padY };
  }

  // Measure real chrome so bottom toolbar is never clipped
  function measureNoteChromeH() {
    if (!quickNoteForm) return NOTE_CHROME_H;
    const selectors = [
      '.ai-note-header',
      '.ai-note-format-bar',
      '.ai-note-tpl-bar',
      '#ai-note-tpl-editor',
      '.ai-note-status-row',
      '.ai-note-toolbar'
    ];
    let sum = 0;
    let visible = 0;
    selectors.forEach((sel) => {
      const el = quickNoteForm.querySelector(sel);
      if (!el || el.hidden) return;
      const h = el.offsetHeight || 0;
      if (h > 0) { sum += h; visible += 1; }
    });
    // form padding (~28) + flex gaps between sections
    const extras = 28 + Math.max(0, visible - 1) * 6;
    const measured = sum + extras;
    return Math.max(NOTE_CHROME_H, measured);
  }

  // ارتفاع پیش‌فرض = chrome واقعی + جای ۴ خط تایپ
  function computeNoteDefaultH() {
    const { lineH, padY } = measureNoteLineMetrics();
    const chrome = measureNoteChromeH();
    return Math.max(NOTE_MIN_H, Math.round(chrome + NOTE_TA_MIN_LINES * lineH + padY));
  }
  let NOTE_DEFAULT_H = computeNoteDefaultH();

  function autoGrowNotepad() {
    if (!noteTextarea || !quickNoteForm.classList.contains('active')) return;
    if (noteSplitSide) return; // split mode manages its own full height
    if (noteUserResized) return;

    const { lineH, padY } = measureNoteLineMetrics();
    const minTaH = Math.ceil(NOTE_TA_MIN_LINES * lineH + padY);
    const maxTaH = Math.ceil(NOTE_TA_MAX_LINES * lineH + padY);

    const measureScrollH = () => {
      const prevMin = noteTextarea.style.minHeight;
      const prevH = noteTextarea.style.height;
      noteTextarea.style.minHeight = minTaH + 'px';
      noteTextarea.style.height = 'auto';
      const h = noteTextarea.scrollHeight || minTaH;
      noteTextarea.style.height = prevH;
      noteTextarea.style.minHeight = prevMin;
      return h;
    };

    // فقط ارتفاع محتوا — عرض را دست نزن (جلوگیری از بزرگ شدن با چند کلمه)
    let scrollH = measureScrollH();

    const plain = (noteTextarea.value || '').replace(/\s+/g, '');
    const newlineCount = (noteTextarea.value.match(/\n/g) || []).length;

    // عرض فقط وقتی رشد می‌کند که حتی در حداکثر ارتفاعِ مجاز هم محتوا جا نشود —
    // یعنی اول کادر عمودی کشیده می‌شود، و تنها اگر باز هم کم بود، عرض هم متناسب با
    // میزان سرریز رشد می‌کند. چون عرض بیشتر یعنی متن در خط‌های کمتری می‌شکند،
    // بعد از تغییر عرض، ارتفاعِ لازم را دوباره در همان عرض جدید اندازه می‌گیریم.
    let targetFormW = NOTE_DEFAULT_W;
    if (plain && scrollH > maxTaH) {
      const overflowLines = (scrollH - maxTaH) / lineH;
      targetFormW = Math.round(NOTE_DEFAULT_W + overflowLines * NOTE_WIDTH_PER_OVERFLOW_LINE);
      targetFormW = Math.max(NOTE_DEFAULT_W, Math.min(noteMaxW(), targetFormW));
      quickNoteForm.style.width = targetFormW + 'px';
      scrollH = measureScrollH();
    }

    const contentTaH = Math.max(minTaH, Math.min(maxTaH, scrollH));
    NOTE_DEFAULT_H = computeNoteDefaultH();
    const chrome = measureNoteChromeH();
    let targetFormH = Math.round(chrome + contentTaH);
    // کف: حداقل پیش‌فرض باز شدن (با تولبار کامل)؛ سقف: max viewport
    targetFormH = Math.max(NOTE_DEFAULT_H, NOTE_MIN_H, Math.min(noteMaxH(), targetFormH));

    // اگر متن خالی یا فقط ۱–۲ خط واقعی → ارتفاع/عرض پیش‌فرض، بدون رشد اضافه
    if (!plain) {
      targetFormH = NOTE_DEFAULT_H;
      targetFormW = NOTE_DEFAULT_W;
    } else if (newlineCount === 0 && scrollH <= minTaH + 4) {
      // چند کلمه در یک خط → رشد نکن
      targetFormH = NOTE_DEFAULT_H;
    }

    const prevTrans = quickNoteForm.style.transition;
    quickNoteForm.style.transition = 'none';
    quickNoteForm.style.width = targetFormW + 'px';
    quickNoteForm.style.height = targetFormH + 'px';
    noteTextarea.style.minHeight = minTaH + 'px';
    requestAnimationFrame(() => {
      quickNoteForm.style.transition = prevTrans;
      if (!noteManuallyPositioned) adjustNotepadPosition();
    });
  }

  function setupNoteResizeHandle(handleEl, corner) {
    if (!handleEl) return;
    let dragging = false, startX, startY, startW, startH, startLeft, startTop;
    handleEl.addEventListener('mousedown', (e) => {
      e.stopPropagation(); e.preventDefault();
      dragging = true;
      quickNoteForm.style.transition = 'none';
      const r = quickNoteForm.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      startW = r.width; startH = r.height; startLeft = r.left; startTop = r.top;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      const minW = NOTE_MIN_W;
      const maxW = noteSplitSide ? Math.max(minW, Math.round(window.innerWidth * 0.7)) : noteMaxW();
      let newW = startW;
      let newH = startH;
      let newLeft = startLeft;
      let newTop = startTop;

      if (corner === 'br') {
        newW = startW + dx;
        newH = startH + dy;
      } else if (corner === 'bl') {
        newW = startW - dx;
        newH = startH + dy;
        newLeft = startLeft + (startW - Math.max(minW, Math.min(maxW, newW)));
      } else if (corner === 'r') {
        newW = startW + dx;
      } else if (corner === 'l') {
        newW = startW - dx;
        newLeft = startLeft + (startW - Math.max(minW, Math.min(maxW, newW)));
      } else if (corner === 'b') {
        newH = startH + dy;
      } else if (corner === 't') {
        newH = startH - dy;
        newTop = startTop + dy;
      }

      newW = Math.max(minW, Math.min(maxW, newW));
      if (corner === 'br' || corner === 'bl') {
        newH = Math.max(NOTE_MIN_H, Math.min(noteMaxH(), newH));
      } else if (corner === 't' || corner === 'b') {
        const maxHD = Math.max(NOTE_HDOCK_MIN_H, Math.round(window.innerHeight * 0.85));
        newH = Math.max(NOTE_HDOCK_MIN_H, Math.min(maxHD, newH));
      }

      // While docked: one axis is locked to the edge(s), only the other is user-adjustable
      if (noteSplitSide === 'left' || noteSplitSide === 'right') {
        // Vertical dock: full height, adjustable width
        newH = Math.max(280, window.innerHeight - NOTE_SPLIT_TOP - NOTE_SPLIT_BOTTOM_GAP);
        newLeft = getNoteSplitLeftPos(noteSplitSide, window.innerWidth, newW);
        newTop = NOTE_SPLIT_TOP;
        noteSplitWidth = newW;
      } else if (isNoteHDock(noteSplitSide)) {
        // Horizontal dock: full width, adjustable height
        newW = Math.max(NOTE_MIN_W, window.innerWidth - NOTE_SPLIT_EDGE_GAP * 2);
        newLeft = NOTE_SPLIT_EDGE_GAP;
        newTop = getNoteDockTopPos(noteSplitSide, window.innerHeight, newH);
        noteDockHeight = newH;
      }

      noteManuallyPositioned = true;
      noteUserResized = true;
      quickNoteForm.style.width = `${newW}px`;
      quickNoteForm.style.height = `${newH}px`;
      quickNoteForm.style.left = `${newLeft}px`;
      quickNoteForm.style.top = `${newTop}px`;
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = '';
      requestAnimationFrame(() => { quickNoteForm.style.transition = ''; });
    });
  }
  setupNoteResizeHandle(quickNoteForm.querySelector('#ai-note-resize-l'), 'l');
  setupNoteResizeHandle(quickNoteForm.querySelector('#ai-note-resize-r'), 'r');
  setupNoteResizeHandle(quickNoteForm.querySelector('#ai-note-resize-t'), 't');
  setupNoteResizeHandle(quickNoteForm.querySelector('#ai-note-resize-b'), 'b');
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

  // --- Notepad font size (persisted, clamped, drives autoGrow via computed style) ---
  const NOTE_FONT_MIN = 11;
  const NOTE_FONT_MAX = 24;
  const NOTE_FONT_DEFAULT = 14;
  const NOTE_FONT_STEP = 1;
  let noteFontSize = NOTE_FONT_DEFAULT;
  function applyNoteFontSize(size, opts) {
    const silent = opts && opts.silent;
    noteFontSize = Math.min(NOTE_FONT_MAX, Math.max(NOTE_FONT_MIN, Math.round(size)));
    if (noteTextarea) noteTextarea.style.fontSize = noteFontSize + 'px';
    if (uiEls.fontSizeLabel) uiEls.fontSizeLabel.textContent = String(noteFontSize);
    if (uiEls.fontDecBtn) uiEls.fontDecBtn.disabled = noteFontSize <= NOTE_FONT_MIN;
    if (uiEls.fontIncBtn) uiEls.fontIncBtn.disabled = noteFontSize >= NOTE_FONT_MAX;
    if (!silent) {
      try { if (chrome.runtime?.id) chrome.storage.local.set({ noteFontSize: noteFontSize }); } catch (e) {}
    }
    if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
    else if (typeof adjustNotepadPosition === 'function') adjustNotepadPosition();
  }
  if (uiEls.fontIncBtn) uiEls.fontIncBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    applyNoteFontSize(noteFontSize + NOTE_FONT_STEP);
  });
  if (uiEls.fontDecBtn) uiEls.fontDecBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    applyNoteFontSize(noteFontSize - NOTE_FONT_STEP);
  });
  try {
    chrome.storage.local.get(['noteFontSize'], (data) => {
      applyNoteFontSize((data && data.noteFontSize) ? data.noteFontSize : NOTE_FONT_DEFAULT, { silent: true });
    });
  } catch (e) { applyNoteFontSize(NOTE_FONT_DEFAULT, { silent: true }); }

  // =========================================================================
  // NotepadUndoManager — multi-step LIFO memory (5–15 snapshots), zero-TTL.
  // Bookmark/todo recovery stays on pendingUndoState + 10s globalUndoTimeout.
  // Session grouping: continuous typing shares one snapshot (pushed at start);
  // paste / cut / bulk delete / clear each force a new boundary.
  // =========================================================================
  const NOTE_UNDO_MAX = 15;
  const NOTE_UNDO_MIN_KEEP = 5;
  const NOTE_EDIT_SESSION_IDLE_MS = 1200;
  const NOTE_HISTORY_STORAGE_KEY = 'aiTreeNotepadHistory';

  class NotepadUndoManager {
    constructor(textarea, opts) {
      this.ta = textarea;
      this.max = (opts && opts.max) || NOTE_UNDO_MAX;
      this.undoStack = [];
      this.redoStack = [];
      this.sessionOpen = false;
      this.sessionTimer = null;
      this.applying = false; // suppress push while restoring
      this.persistTimer = null;
      this._lastPushedValue = null;
    }

    snapshot(extra) {
      if (!this.ta) return null;
      return Object.assign({
        value: this.ta.value,
        selectionStart: this.ta.selectionStart,
        selectionEnd: this.ta.selectionEnd,
        prevWidth: quickNoteForm.style.width || '',
        prevHeight: quickNoteForm.style.height || '',
        ts: Date.now()
      }, extra || {});
    }

    _sameAsTop(snap) {
      if (!snap || !this.undoStack.length) return false;
      const top = this.undoStack[this.undoStack.length - 1];
      return top && top.value === snap.value;
    }

    push(snap) {
      if (!snap || this.applying) return false;
      if (this._sameAsTop(snap)) return false;
      this.undoStack.push(snap);
      while (this.undoStack.length > this.max) this.undoStack.shift();
      this.redoStack = [];
      this._lastPushedValue = snap.value;
      this.schedulePersist();
      syncUndoToggleVisual();
      return true;
    }

    /** External bridge used by setUndoState('text', data) compatibility path. */
    pushExternal(data) {
      if (!data) return;
      const snap = typeof data === 'string'
        ? { value: data, selectionStart: data.length, selectionEnd: data.length, prevWidth: '', prevHeight: '', ts: Date.now() }
        : Object.assign({ ts: Date.now() }, data);
      // Opening a new edit boundary
      this.sessionOpen = true;
      this._armSessionTimer();
      this.push(snap);
    }

    canUndo() { return this.undoStack.length > 0; }
    canRedo() { return this.redoStack.length > 0; }

    applySnapshot(snap) {
      if (!this.ta || !snap) return;
      this.applying = true;
      try {
        this.ta.value = snap.value != null ? snap.value : '';
        if (snap.prevWidth) { quickNoteForm.style.width = snap.prevWidth; noteManuallyPositioned = true; }
        if (snap.prevHeight) { quickNoteForm.style.height = snap.prevHeight; noteManuallyPositioned = true; }
        const len = this.ta.value.length;
        const a = Math.min(Math.max(0, snap.selectionStart ?? len), len);
        const b = Math.min(Math.max(0, snap.selectionEnd ?? a), len);
        try { this.ta.focus(); this.ta.setSelectionRange(a, b); } catch (err) {}
        quickNoteForm.classList.add('active');
        root.classList.add('show-notepad');
        // Restoring text means the user is back in the note — kill close countdown/idle.
        if (typeof abortNoteClosing === 'function') abortNoteClosing();
        if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
        if (typeof saveNoteDraftDebounced === 'function') saveNoteDraftDebounced();
        if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
        else if (typeof adjustNotepadPosition === 'function') adjustNotepadPosition();
      } finally {
        this.applying = false;
      }
    }

    undo() {
      if (!this.canUndo()) return false;
      this.endSession();
      const current = this.snapshot();
      const prev = this.undoStack.pop();
      if (current) this.redoStack.push(current);
      this.applySnapshot(prev);
      this.schedulePersist();
      syncUndoToggleVisual();
      showToastNotification(t('toastRestored'));
      return true;
    }

    redo() {
      if (!this.canRedo()) return false;
      this.endSession();
      const current = this.snapshot();
      const next = this.redoStack.pop();
      if (current) this.undoStack.push(current);
      this.applySnapshot(next);
      this.schedulePersist();
      syncUndoToggleVisual();
      showToastNotification(t('toastRestored'));
      return true;
    }

    beginSessionIfNeeded() {
      if (!this.ta || this.applying) return;
      if (!this.ta.value) return; // nothing meaningful to restore to
      if (this.sessionOpen) {
        this._armSessionTimer();
        return;
      }
      this.sessionOpen = true;
      this.push(this.snapshot());
      this._armSessionTimer();
    }

    forceBoundary() {
      if (!this.ta || this.applying) return;
      // Always capture current state as a recoverable step (even if empty → clear recovery)
      this.sessionOpen = true;
      this.push(this.snapshot());
      this._armSessionTimer();
    }

    endSession() {
      this.sessionOpen = false;
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    _armSessionTimer() {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = setTimeout(() => this.endSession(), NOTE_EDIT_SESSION_IDLE_MS);
    }

    schedulePersist() {
      clearTimeout(this.persistTimer);
      this.persistTimer = setTimeout(() => this.persist(), 400);
    }

    persist() {
      try {
        if (!chrome.runtime?.id) return;
        const payload = {
          undo: this.undoStack.slice(-NOTE_UNDO_MAX),
          redo: this.redoStack.slice(-NOTE_UNDO_MAX),
          savedAt: Date.now()
        };
        chrome.storage.local.set({ [NOTE_HISTORY_STORAGE_KEY]: payload });
      } catch (err) {}
    }

    loadFromStorage(data) {
      try {
        if (!data || !Array.isArray(data.undo)) return;
        this.undoStack = data.undo.slice(-NOTE_UNDO_MAX).filter(s => s && typeof s.value === 'string');
        this.redoStack = Array.isArray(data.redo)
          ? data.redo.slice(-NOTE_UNDO_MAX).filter(s => s && typeof s.value === 'string')
          : [];
        syncUndoToggleVisual();
      } catch (err) {}
    }

    clear() {
      this.undoStack = [];
      this.redoStack = [];
      this.endSession();
      clearTimeout(this.persistTimer);
      this.persistTimer = null;
      try {
        if (chrome.runtime?.id) {
          chrome.storage.local.remove([NOTE_HISTORY_STORAGE_KEY]);
        }
      } catch (err) {}
      syncUndoToggleVisual();
    }
  }

  let noteEditSessionOpen = false; // legacy alias kept for external callers
  let noteEditSessionTimer = null;
  let notepadUndo = null;

  function snapshotNoteText(extra) {
    if (notepadUndo) return notepadUndo.snapshot(extra);
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
    if (notepadUndo) notepadUndo.beginSessionIfNeeded();
    noteEditSessionOpen = !!(notepadUndo && notepadUndo.sessionOpen);
  }

  function endNoteEditSession() {
    if (notepadUndo) notepadUndo.endSession();
    noteEditSessionOpen = false;
    clearTimeout(noteEditSessionTimer);
    noteEditSessionTimer = null;
  }

  function captureNoteUndoForBigChange(inputType, data) {
    if (!notepadUndo || !noteTextarea) return;
    const isDelete = inputType && inputType.startsWith('delete');
    const isInsert = inputType && (inputType.startsWith('insert') || inputType === 'historyUndo' || inputType === 'historyRedo');
    const selLen = Math.abs((noteTextarea.selectionEnd || 0) - (noteTextarea.selectionStart || 0));
    const incomingLen = (data && data.length) || 0;
    const significant =
      (isDelete && (selLen > 1 || noteTextarea.value.length > 0)) ||
      (isInsert && (selLen > 0 || incomingLen > 20));
    if (!significant && !(isDelete && noteTextarea.value.length > 0)) return;
    if (!notepadUndo.sessionOpen) notepadUndo.forceBoundary();
    else notepadUndo._armSessionTimer();
    noteEditSessionOpen = notepadUndo.sessionOpen;
  }

  if (noteTextarea) {
    notepadUndo = new NotepadUndoManager(noteTextarea, { max: NOTE_UNDO_MAX });
    // Hydrate multi-step history from local storage (survives soft relaunch)
    try {
      if (chrome.runtime?.id) {
        chrome.storage.local.get([NOTE_HISTORY_STORAGE_KEY], (res) => {
          if (res && res[NOTE_HISTORY_STORAGE_KEY]) notepadUndo.loadFromStorage(res[NOTE_HISTORY_STORAGE_KEY]);
        });
      }
    } catch (err) {}

    noteTextarea.addEventListener('beforeinput', function (e) {
      if (!e.inputType || !notepadUndo || notepadUndo.applying) return;
      if (e.inputType.startsWith('delete') || e.inputType.startsWith('insert') || e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
        const selLen = Math.abs((this.selectionEnd || 0) - (this.selectionStart || 0));
        if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop' || (e.inputType.startsWith('delete') && selLen > 1)) {
          if (this.value || selLen > 0) notepadUndo.forceBoundary();
        } else if (e.inputType.startsWith('delete') || e.inputType.startsWith('insertText') || e.inputType === 'insertLineBreak') {
          beginNoteEditSessionIfNeeded();
        }
        noteEditSessionOpen = notepadUndo.sessionOpen;
      }
    });
    noteTextarea.addEventListener('keydown', function (e) {
      if (typeof abortNoteClosing === 'function') abortNoteClosing();
      const mod = e.ctrlKey || e.metaKey;
      // Multi-step undo / redo shortcuts (do not interfere with native when manager empty)
      if (mod && !e.altKey && (e.key === 'z' || e.key === 'Z')) {
        if (e.shiftKey) {
          if (notepadUndo && notepadUndo.canRedo()) {
            e.preventDefault(); e.stopPropagation();
            notepadUndo.redo();
            return;
          }
        } else if (notepadUndo && notepadUndo.canUndo()) {
          e.preventDefault(); e.stopPropagation();
          notepadUndo.undo();
          return;
        }
      }
      if (mod && !e.altKey && (e.key === 'y' || e.key === 'Y')) {
        if (notepadUndo && notepadUndo.canRedo()) {
          e.preventDefault(); e.stopPropagation();
          notepadUndo.redo();
          return;
        }
      }
      // Ctrl/Cmd+A سپس Delete/Backspace — اسنپ‌شات قبل از پاک شدن کل متن
      if ((e.key === 'Backspace' || e.key === 'Delete') && this.selectionStart === 0 && this.selectionEnd === this.value.length && this.value.length > 0) {
        if (notepadUndo && !notepadUndo.sessionOpen) notepadUndo.forceBoundary();
        noteEditSessionOpen = !!(notepadUndo && notepadUndo.sessionOpen);
      }
    });
    let lastNoteValueForEmoji = noteTextarea ? noteTextarea.value : '';
    noteTextarea.addEventListener('input', function () {
      if (typeof harvestTypedEmoji === 'function') harvestTypedEmoji(lastNoteValueForEmoji, this.value);
      lastNoteValueForEmoji = this.value;
      if (typeof abortNoteClosing === 'function') abortNoteClosing();
      if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
      if (typeof saveNoteDraftDebounced === 'function') saveNoteDraftDebounced();
      if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
      else adjustNotepadPosition();
      resetToggleTimeout();
      if (notepadUndo && notepadUndo.sessionOpen) notepadUndo._armSessionTimer();
    });
    noteTextarea.addEventListener('blur', function () {
      endNoteEditSession();
    });
  }

  
  // --- Prompt Studio: templates, token meter, autosave, history ---
  // این ۶ پرامپتِ پیش‌فرض به‌عنوان محتوای اپ به انگلیسی نوشته شده‌اند، اما این یک قانون نیست:
  // عنوان و متن پرامپت‌های سفارشیِ کاربر (customPrompts) و بازنویسی‌های او (promptOverrides)
  // می‌توانند به هر زبانی باشند — هیچ‌جای این فایل زبان ورودی کاربر را بررسی/محدود نمی‌کند.
  const BUILTIN_PROMPTS = [
    {
      id: 'builtin-refactor',
      title: 'Code Review',
      text: 'Act as a Principal Software Architect. Review the following code for efficiency, security, and edge-case resilience:\n\n',
      builtIn: true
    },
    {
      id: 'builtin-summary',
      title: 'Summarize',
      text: 'Analyze the text below and provide a structured comparative table and bullet-point executive summary:\n\n',
      builtIn: true
    },
    {
      id: 'builtin-critic',
      title: 'Critique',
      text: 'Critique the following thesis from first principles. Identify logical fallacies and hidden assumptions:\n\n',
      builtIn: true
    },
    {
      id: 'builtin-translate',
      title: 'Translate',
      text: 'Translate the following text into clear, natural English while preserving technical meaning:\n\n',
      builtIn: true
    },
    {
      id: 'builtin-song',
      title: 'Songwriter',
      text: 'Turn the following text into a beautiful song.\nThe song must not be a mere rewrite of the text; it should transform its feeling, meaning, and imagery into a musical work.\nUse rhyme and flowing words, and write the lyrics so a listener can easily remember them.\n\nText:\n',
      builtIn: true
    },
    {
      id: 'builtin-logo',
      title: 'Logo Maker',
      text: 'Act as an elite brand designer. Create a logo for [brand name] that captures [core value] and speaks directly to [audience]. Make it sophisticated, timeless, and instantly recognizable.\n\n',
      builtIn: true
    }
  ];

  const CUSTOM_PROMPT_MAX = 12;
  const CUSTOM_PROMPT_KEY = 'aiTreeCustomPrompts';
  const PROMPT_OVERRIDE_KEY = 'aiTreePromptOverrides';
  const PROMPT_HIDDEN_KEY = 'aiTreePromptHidden';
  let customPrompts = []; // [{ id, title, text }]
  let promptOverrides = {}; // { [builtinId]: { title, text } }
  let promptHiddenIds = []; // builtin ids removed by user
  let tplEditMode = false;
  let tplEditingId = null; // id being edited, or null for new
  let tplEditingBuiltIn = false;

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
      chrome.storage.local.get(['savedPromptDraft', 'aiTreePromptHistory', CUSTOM_PROMPT_KEY, PROMPT_OVERRIDE_KEY, PROMPT_HIDDEN_KEY], (res) => {
        if (res && typeof res.savedPromptDraft === 'string' && noteTextarea && !noteTextarea.value) {
          noteTextarea.value = res.savedPromptDraft;
        }
        if (res && Array.isArray(res.aiTreePromptHistory)) {
          promptHistory = res.aiTreePromptHistory.slice(0, 10);
        }
        if (res && Array.isArray(res[CUSTOM_PROMPT_KEY])) {
          customPrompts = res[CUSTOM_PROMPT_KEY]
            .filter(p => p && typeof p.title === 'string' && typeof p.text === 'string')
            .slice(0, CUSTOM_PROMPT_MAX)
            .map(p => ({
              id: p.id || ('c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
              title: String(p.title).slice(0, 40),
              text: String(p.text)
            }));
        }
        if (res && res[PROMPT_OVERRIDE_KEY] && typeof res[PROMPT_OVERRIDE_KEY] === 'object') {
          promptOverrides = res[PROMPT_OVERRIDE_KEY];
        }
        if (res && Array.isArray(res[PROMPT_HIDDEN_KEY])) {
          promptHiddenIds = res[PROMPT_HIDDEN_KEY].filter(id => typeof id === 'string');
        }
        updateNoteTokenMeter();
        renderNoteTemplates();
      });
    } catch (e) {}
  }

  function saveCustomPrompts() {
    try {
      if (chrome.runtime?.id) chrome.storage.local.set({ [CUSTOM_PROMPT_KEY]: customPrompts });
    } catch (e) {}
  }
  function savePromptOverrides() {
    try {
      if (chrome.runtime?.id) chrome.storage.local.set({ [PROMPT_OVERRIDE_KEY]: promptOverrides });
    } catch (e) {}
  }
  function savePromptHidden() {
    try {
      if (chrome.runtime?.id) chrome.storage.local.set({ [PROMPT_HIDDEN_KEY]: promptHiddenIds });
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

  function allPrompts() {
    const hidden = new Set(promptHiddenIds || []);
    const builtins = BUILTIN_PROMPTS
      .filter((p) => !hidden.has(p.id))
      .map((p) => {
        const ov = promptOverrides && promptOverrides[p.id];
        if (ov && (ov.title || ov.text)) {
          return {
            ...p,
            title: (ov.title != null ? String(ov.title) : p.title).slice(0, 40),
            text: ov.text != null ? String(ov.text) : p.text,
            overridden: true
          };
        }
        return { ...p, overridden: false };
      });
    return builtins.concat(customPrompts.map(p => ({ ...p, builtIn: false, overridden: false })));
  }

  function ensureTplEditorDom() {
    if (!quickNoteForm) return null;
    let ed = quickNoteForm.querySelector('#ai-note-tpl-editor');
    if (ed) return ed;
    ed = document.createElement('div');
    ed.id = 'ai-note-tpl-editor';
    ed.className = 'ai-note-tpl-editor';
    ed.hidden = true;
    ed.innerHTML = `
      <div class="ai-tpl-ed-head">
        <span class="ai-tpl-ed-title" id="ai-tpl-ed-title"></span>
        <button type="button" class="ai-tpl-ed-close" id="ai-tpl-ed-close" aria-label="Close">✕</button>
      </div>
      <input type="text" id="ai-tpl-ed-name" class="ai-tpl-ed-input" dir="auto" maxlength="40" autocomplete="off" />
      <textarea id="ai-tpl-ed-body" class="ai-tpl-ed-textarea" dir="auto" rows="5"></textarea>
      <div class="ai-tpl-ed-actions">
        <button type="button" id="ai-tpl-ed-use-note" class="ai-tpl-ed-btn ghost"></button>
        <span class="ai-tpl-ed-spacer"></span>
        <button type="button" id="ai-tpl-ed-delete" class="ai-tpl-ed-btn danger" hidden></button>
        <button type="button" id="ai-tpl-ed-cancel" class="ai-tpl-ed-btn ghost"></button>
        <button type="button" id="ai-tpl-ed-save" class="ai-tpl-ed-btn primary"></button>
      </div>`;
    // mount near tpl bar
    if (uiEls.tplBar && uiEls.tplBar.parentNode) {
      uiEls.tplBar.parentNode.insertBefore(ed, uiEls.tplBar.nextSibling);
    } else {
      quickNoteForm.appendChild(ed);
    }
    ed.querySelector('#ai-tpl-ed-close').addEventListener('click', (e) => { e.stopPropagation(); closeTplEditor(); });
    ed.querySelector('#ai-tpl-ed-cancel').addEventListener('click', (e) => { e.stopPropagation(); closeTplEditor(); });
    ed.querySelector('#ai-tpl-ed-save').addEventListener('click', (e) => { e.stopPropagation(); saveTplEditor(); });
    ed.querySelector('#ai-tpl-ed-delete').addEventListener('click', (e) => { e.stopPropagation(); deleteFromTplEditor(); });
    ed.querySelector('#ai-tpl-ed-use-note').addEventListener('click', (e) => {
      e.stopPropagation();
      const body = ed.querySelector('#ai-tpl-ed-body');
      if (!body || !noteTextarea) return;
      const selStart = noteTextarea.selectionStart;
      const selEnd = noteTextarea.selectionEnd;
      let chunk = '';
      if (typeof selStart === 'number' && typeof selEnd === 'number' && selEnd > selStart) {
        chunk = noteTextarea.value.slice(selStart, selEnd);
      } else {
        chunk = noteTextarea.value || '';
      }
      body.value = chunk;
      body.focus();
    });
    ['mousedown', 'click', 'keydown', 'keyup'].forEach(ev => {
      ed.addEventListener(ev, (e) => e.stopPropagation());
    });
    return ed;
  }

  function openTplEditor(promptOrNull) {
    const ed = ensureTplEditorDom();
    if (!ed) return;
    tplEditingId = promptOrNull ? promptOrNull.id : null;
    tplEditingBuiltIn = !!(promptOrNull && promptOrNull.builtIn);
    const isNew = !tplEditingId;
    ed.querySelector('#ai-tpl-ed-title').textContent = isNew ? t('noteTplFormTitleNew') : t('noteTplFormTitleEdit');
    const nameEl = ed.querySelector('#ai-tpl-ed-name');
    const bodyEl = ed.querySelector('#ai-tpl-ed-body');
    nameEl.placeholder = t('noteTplFormName');
    bodyEl.placeholder = t('noteTplFormBody');
    // راهنمای نرم (فقط با هاور) نه محدودیت: عنوان و متن پرامپت هر دو می‌توانند به هر زبانی باشند
    bodyEl.title = t('noteTplFormBodyHint');
    nameEl.value = promptOrNull ? (promptOrNull.title || '') : '';
    bodyEl.value = promptOrNull ? (promptOrNull.text || '') : '';
    ed.querySelector('#ai-tpl-ed-use-note').textContent = t('noteTplFormUseNote');
    ed.querySelector('#ai-tpl-ed-cancel').textContent = t('noteTplFormCancel');
    ed.querySelector('#ai-tpl-ed-save').textContent = t('noteTplFormSave');
    const delBtn = ed.querySelector('#ai-tpl-ed-delete');
    if (isNew) {
      delBtn.hidden = true;
    } else {
      delBtn.hidden = false;
      delBtn.textContent = t('noteTplFormDelete');
    }
    ed.hidden = false;
    ed.classList.add('active');
    nameEl.focus();
    // The editor adds a chunk of height inside the panel (name + textarea + actions row) —
    // grow the notepad now so the Save/Cancel/Delete buttons are visible without a manual resize.
    if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
  }

  function closeTplEditor() {
    const ed = quickNoteForm && quickNoteForm.querySelector('#ai-note-tpl-editor');
    if (!ed) return;
    ed.hidden = true;
    ed.classList.remove('active');
    tplEditingId = null;
    tplEditingBuiltIn = false;
    if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
  }

  function saveTplEditor() {
    const ed = quickNoteForm && quickNoteForm.querySelector('#ai-note-tpl-editor');
    if (!ed) return;
    const title = (ed.querySelector('#ai-tpl-ed-name').value || '').trim().slice(0, 40);
    const body = (ed.querySelector('#ai-tpl-ed-body').value || '').trim();
    if (!title || !body) {
      showToastNotification(t('noteTplToastNeedFields'), true);
      return;
    }
    if (tplEditingId && tplEditingBuiltIn) {
      promptOverrides[tplEditingId] = { title, text: body };
      savePromptOverrides();
    } else if (tplEditingId) {
      const idx = customPrompts.findIndex(p => p.id === tplEditingId);
      if (idx >= 0) {
        customPrompts[idx] = { ...customPrompts[idx], title, text: body };
      } else {
        customPrompts.push({ id: tplEditingId, title, text: body });
      }
      saveCustomPrompts();
    } else {
      if (customPrompts.length >= CUSTOM_PROMPT_MAX) {
        showToastNotification(t('noteTplToastLimit'), true);
        return;
      }
      customPrompts.push({
        id: 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title,
        text: body
      });
      saveCustomPrompts();
    }
    closeTplEditor();
    renderNoteTemplates();
    showToastNotification(t('noteTplToastSaved'));
  }

  function deleteFromTplEditor() {
    if (!tplEditingId) return;
    if (tplEditingBuiltIn) {
      if (!promptHiddenIds.includes(tplEditingId)) {
        promptHiddenIds.push(tplEditingId);
        savePromptHidden();
      }
      if (promptOverrides[tplEditingId]) {
        delete promptOverrides[tplEditingId];
        savePromptOverrides();
      }
      closeTplEditor();
      renderNoteTemplates();
      showToastNotification(t('noteTplToastDeleted'));
      return;
    }
    customPrompts = customPrompts.filter(p => p.id !== tplEditingId);
    saveCustomPrompts();
    closeTplEditor();
    renderNoteTemplates();
    showToastNotification(t('noteTplToastDeleted'));
  }

  function renderNoteTemplates() {
    if (!uiEls.tplBar) return;
    uiEls.tplBar.innerHTML = '';
    uiEls.tplBar.classList.toggle('is-editing', tplEditMode);

    allPrompts().forEach((tpl) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ai-note-tpl-chip' + (tpl.builtIn ? ' is-builtin' : ' is-custom');
      if (tpl.overridden) chip.classList.add('is-overridden');
      if (tplEditMode) chip.classList.add('is-editable');
      chip.dir = 'auto'; // عنوان پرامپت ممکن است با زبان رابط کاربری فرق داشته باشد
      chip.textContent = tpl.title;
      chip.title = tplEditMode ? t('noteTplFormTitleEdit') : tpl.title;
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tplEditMode) {
          openTplEditor(tpl);
          return;
        }
        insertNoteTemplate(tpl.text);
      });
      uiEls.tplBar.appendChild(chip);
    });

    // + add
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'ai-note-tpl-action ai-note-tpl-add';
    addBtn.textContent = '+';
    addBtn.title = t('noteTplAdd');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (customPrompts.length >= CUSTOM_PROMPT_MAX) {
        showToastNotification(t('noteTplToastLimit'), true);
        return;
      }
      openTplEditor(null);
    });
    uiEls.tplBar.appendChild(addBtn);

    // edit toggle
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'ai-note-tpl-action ai-note-tpl-edit' + (tplEditMode ? ' is-active' : '');
    editBtn.textContent = tplEditMode ? '✓' : '✎';
    editBtn.title = tplEditMode ? t('noteTplDone') : t('noteTplEdit');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tplEditMode = !tplEditMode;
      if (!tplEditMode) closeTplEditor();
      renderNoteTemplates();
    });
    uiEls.tplBar.appendChild(editBtn);

    // Keep bottom toolbar fully visible after template bar height changes
    if (quickNoteForm.classList.contains('active') && !noteUserResized && !noteSplitSide) {
      requestAnimationFrame(() => {
        if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
      });
    }
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
      row.dir = 'auto'; // متن پرامپت ممکن است هر زبانی باشد، جدا از زبان رابط کاربری
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

  /**
   * DOM-to-LLM-Ready-Markdown Extractor
   *
   * Lightweight client-side parser: strips noise and converts structural HTML
   * (headings, code, lists, tables, paragraphs) to Markdown suitable for LLMs.
   *
   * Acknowledgment & Attribution:
   * The DOM cleaning and Markdown conversion logic in this module is inspired by
   * and adapted from the 'anydoc' open-source project by Firecrawl.
   *
   * @source https://github.com/firecrawl/anydoc
   * @license MIT (or applicable open-source license of the original repository)
   */
  function extractPageToLLMMarkdown() {
    // 1. Target the primary content container (fallback to body)
    const candidateSelectors = ['article', 'main', '[role="main"]', '.post-content', '.article-body', '#content', '.entry-content', '.markdown-body'];
    let rootElement = null;
    for (const sel of candidateSelectors) {
      const found = document.querySelector(sel);
      if (found && found.innerText && found.innerText.trim().length > 300) {
        rootElement = found;
        break;
      }
    }
    if (!rootElement) rootElement = document.body;

    // 2. Clone DOM to avoid mutating the live web page
    const clone = rootElement.cloneNode(true);

    // 3. Strip noise & extension artifacts
    const removeSelectors = [
      'script', 'style', 'noscript', 'iframe', 'svg', 'canvas', 'video', 'audio',
      'nav', 'footer', 'aside', 'header', '[role="banner"]', '[role="navigation"]', '[role="complementary"]',
      '#ai-orbit-root', '.ai-toast-notification', '.orbit-root',
      '.advertisement', '.ads', '.ad', '[class*="cookie"]', '[id*="cookie"]'
    ];
    try {
      clone.querySelectorAll(removeSelectors.join(', ')).forEach(el => el.remove());
    } catch (err) {}

    // 4. Recursive DOM to Markdown converter
    function parseNode(node) {
      if (!node) return '';
      if (node.nodeType === Node.TEXT_NODE) {
        return (node.textContent || '').replace(/\s+/g, ' ');
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const tag = node.tagName.toLowerCase();
      // Skip hidden nodes
      try {
        const style = node.getAttribute && node.getAttribute('style');
        if (style && /display\s*:\s*none|visibility\s*:\s*hidden/i.test(style)) return '';
        if (node.getAttribute && node.getAttribute('hidden') != null) return '';
        if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') return '';
      } catch (err) {}

      if (tag === 'pre') {
        const codeEl = node.querySelector && node.querySelector('code');
        const raw = (codeEl ? codeEl.textContent : node.textContent) || '';
        return `\n\n\`\`\`\n${raw.trim()}\n\`\`\`\n\n`;
      }

      const childrenMarkdown = Array.from(node.childNodes).map(parseNode).join('');

      switch (tag) {
        case 'h1': return `\n\n# ${childrenMarkdown.trim()}\n\n`;
        case 'h2': return `\n\n## ${childrenMarkdown.trim()}\n\n`;
        case 'h3': return `\n\n### ${childrenMarkdown.trim()}\n\n`;
        case 'h4': case 'h5': case 'h6':
          return `\n\n#### ${childrenMarkdown.trim()}\n\n`;
        case 'p': return `\n\n${childrenMarkdown.trim()}\n\n`;
        case 'strong': case 'b':
          return childrenMarkdown.trim() ? ` **${childrenMarkdown.trim()}** ` : '';
        case 'em': case 'i':
          return childrenMarkdown.trim() ? ` *${childrenMarkdown.trim()}* ` : '';
        case 'a': {
          const href = node.getAttribute('href');
          const linkText = childrenMarkdown.trim();
          if (href && linkText && !/^javascript:/i.test(href)) {
            return ` [${linkText}](${href}) `;
          }
          return linkText ? ` ${linkText} ` : '';
        }
        case 'code':
          // Inline code only when not inside pre (pre handled above)
          return childrenMarkdown.trim() ? ` \`${childrenMarkdown.trim()}\` ` : '';
        case 'ul': case 'ol':
          return `\n\n${childrenMarkdown.trim()}\n\n`;
        case 'li':
          return `\n* ${childrenMarkdown.trim()}`;
        case 'blockquote':
          return `\n\n> ${childrenMarkdown.trim().replace(/\n/g, '\n> ')}\n\n`;
        case 'br':
          return '\n';
        case 'hr':
          return '\n\n---\n\n';
        case 'img': {
          const alt = (node.getAttribute('alt') || '').trim();
          const src = node.getAttribute('src') || '';
          if (src && !src.startsWith('data:')) return alt ? ` ![${alt}](${src}) ` : ` ![](${src}) `;
          return alt ? ` ${alt} ` : '';
        }
        case 'table': {
          const rows = Array.from(node.querySelectorAll('tr'));
          if (!rows.length) return childrenMarkdown;
          const lines = [];
          rows.forEach((tr, ri) => {
            const cells = Array.from(tr.querySelectorAll('th, td')).map(c => (c.textContent || '').replace(/\s+/g, ' ').trim());
            if (!cells.length) return;
            lines.push('| ' + cells.join(' | ') + ' |');
            if (ri === 0) lines.push('| ' + cells.map(() => '---').join(' | ') + ' |');
          });
          return lines.length ? `\n\n${lines.join('\n')}\n\n` : childrenMarkdown;
        }
        case 'tr': case 'td': case 'th': case 'thead': case 'tbody': case 'tfoot':
          return childrenMarkdown;
        default:
          return childrenMarkdown;
      }
    }

    // 5. Clean and format metadata header
    const title = document.title || 'Untitled Document';
    const url = window.location.href;
    const rawMarkdown = parseNode(clone);

    // Normalize excessive line breaks and spaced punctuation
    const cleanMarkdown = rawMarkdown
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/[ \t]+$/gm, '')
      .trim();

    if (!cleanMarkdown) {
      return `### Document: ${title}\n**Source:** ${url}\n\n---\n\n`;
    }

    return `### Document: ${title}\n**Source:** ${url}\n\n---\n\n${cleanMarkdown}`;
  }

  function insertExtractedMarkdownToNotepad() {
    if (!noteTextarea) return;
    let md = '';
    try {
      md = extractPageToLLMMarkdown();
    } catch (err) {
      showToastNotification(t('toastExtractEmpty'), true);
      return;
    }
    const body = (md || '').split(/\n---\n/).slice(1).join('\n---\n').trim();
    if (!body) {
      showToastNotification(t('toastExtractEmpty'), true);
      return;
    }
    // Capture undo boundary so Ctrl+Z / Undo toggle can restore previous note
    if (notepadUndo) {
      try { notepadUndo.forceBoundary(); } catch (err) {}
    }
    noteTextarea.value = md;
    try {
      const end = noteTextarea.value.length;
      noteTextarea.setSelectionRange(end, end);
      noteTextarea.focus();
    } catch (err) {}
    if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
    if (typeof saveNoteDraftDebounced === 'function') saveNoteDraftDebounced();
    if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
    if (typeof syncUndoToggleVisual === 'function') syncUndoToggleVisual();
    showToastNotification(t('toastExtracted'));
  }

  function clearNoteWithUndo({ focus = true, notify = true } = {}) {
    const hadText = !!(noteTextarea && noteTextarea.value.trim() !== '');
    endNoteEditSession();
    // If currently split/docked, undock immediately — Clear/Close means "done with this
    // note", not "stay pinned to the edge". Drop the split state/classes first so the
    // size reset just below (which split-docked's CSS !important rules would otherwise
    // block) can actually take the panel back to its normal floating size. Non-split
    // states are untouched — they fall through to the same behavior as before.
    if (noteSplitSide) {
      noteSplitSide = null;
      quickNoteForm.classList.remove(
        'split-docked', 'split-left', 'split-right', 'split-top', 'split-bottom',
        'split-preview-left', 'split-preview-right', 'split-preview-top', 'split-preview-bottom'
      );
      if (typeof syncNoteSplitBtn === 'function') syncNoteSplitBtn();
    }
    // Snapshot the note BEFORE wiping so Clear is recoverable via the global Undo toggle
    // (and Ctrl/Cmd+Z). Do NOT call notepadUndo.clear() — that used to make recovery impossible.
    if (hadText) {
      try {
        if (notepadUndo) {
          notepadUndo.forceBoundary();
          notepadUndo.endSession();
        } else if (noteTextarea) {
          setUndoState('text', {
            value: noteTextarea.value,
            selectionStart: noteTextarea.selectionStart || 0,
            selectionEnd: noteTextarea.selectionEnd || 0,
            prevWidth: quickNoteForm.style.width || '',
            prevHeight: quickNoteForm.style.height || ''
          });
        }
      } catch (err) {}
    }
    try {
      if (chrome.runtime?.id) {
        // Clear only the live draft; keep aiTreeNotepadHistory so Undo can restore the text.
        chrome.storage.local.set({ savedPromptDraft: '' });
      }
    } catch (e) {}
    if (noteTextarea) {
      noteTextarea.value = '';
      if (focus && quickNoteForm.classList.contains('active')) noteTextarea.focus();
    }
    if (typeof resetNoteSizeToDefault === 'function') resetNoteSizeToDefault();
    else { quickNoteForm.style.width = ''; quickNoteForm.style.height = ''; }
    noteManuallyPositioned = false;
    if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
    adjustNotepadPosition();
    resetToggleTimeout();
    if (typeof syncUndoToggleVisual === 'function') syncUndoToggleVisual();
    if (notify && hadText) showToastNotification(t('toastCleared'));
    isNotePinned = false;
    if (typeof applyPinVisual === 'function') applyPinVisual(false);
    // Stop idle + visual close timers — Clear must not start a collapse countdown.
    // User can still close manually; Undo brings the text back with timers already aborted.
    if (typeof abortNoteClosing === 'function') abortNoteClosing();
    else {
      if (typeof stopNotepadIdleTimer === 'function') stopNotepadIdleTimer();
      if (typeof stopCollapseCountdown === 'function') stopCollapseCountdown();
    }
    return hadText;
  }
  if (uiEls.extractDocBtn) {
    uiEls.extractDocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      insertExtractedMarkdownToNotepad();
    });
  }
  document.getElementById('ai-note-clear-btn').addEventListener('click', (e) => { e.stopPropagation(); clearNoteWithUndo(); });
  document.getElementById('ai-note-copy-btn').addEventListener('click', (e) => { e.stopPropagation(); const textToCopy = noteTextarea ? noteTextarea.value : ''; if (!textToCopy.trim()) return; if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(textToCopy).then(() => { showToastNotification(t('toastCopied')); }).catch(() => { fallbackCopyText(textToCopy); }); } else fallbackCopyText(textToCopy); });
  document.getElementById('ai-save-txt-btn').addEventListener('click', (e) => { e.stopPropagation(); const textToSave = noteTextarea ? noteTextarea.value : ''; if (!textToSave.trim()) return; const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'AI_Note_' + new Date().getTime() + '.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); showToastNotification(t('toastDownloaded')); });

  // --- Smart Split Button + Ribbon Popover: pick which Core AI gets the prompt, remember the choice ---
  // Note: most AI chat sites do NOT reliably support prefilling via a "?q=" URL parameter
  // (only ChatGPT documents it; Claude/Gemini/DeepSeek ignore it or have removed it).
  // So instead we copy the prompt to the clipboard and open the chat — this works with 100% of sites.
  // Fixed catalog of popular AIs for notepad dispatch (independent of core bookmark slots)

  // ============================================================================
  // Emoji memory tray + Social share (X / Telegram / LinkedIn / Facebook)
  // ============================================================================
  // DEFAULT_FAVORITE_EMOJIS + favoriteEmojis بالاتر تعریف شده‌اند
  const EMOJI_PICKER_GRID = [
    '😀','😊','🥰','😎','🤔','😂','🙌','👏',
    '✨','🔥','💡','📌','✅','❌','⚠️','💬',
    '🌱','🎯','🚀','⭐','❤️','💙','💜','🖤',
    '📝','📚','🧠','⚡','🛠️','🎨','🎵','☕'
  ];

  function loadEmojiMemory() {
    try {
      if (!chrome.runtime?.id) return;
      chrome.storage.local.get(['aiTreeEmojiMemory'], (res) => {
        if (res && Array.isArray(res.aiTreeEmojiMemory) && res.aiTreeEmojiMemory.length) {
          favoriteEmojis = res.aiTreeEmojiMemory.filter(e => typeof e === 'string' && e).slice(0, 12);
          renderEmojiTray();
        }
      });
    } catch (e) {}
  }

  function saveEmojiMemory() {
    try {
      if (chrome.runtime?.id) chrome.storage.local.set({ aiTreeEmojiMemory: favoriteEmojis });
    } catch (e) {}
  }

  function pushEmojiToMemory(emoji) {
    if (!emoji) return;
    favoriteEmojis = [emoji, ...favoriteEmojis.filter(e => e !== emoji)].slice(0, 10);
    renderEmojiTray();
    saveEmojiMemory();
  }

  function insertEmojiAtCursor(emoji) {
    if (!noteTextarea || !emoji) return;
    if (typeof abortNoteClosing === 'function') abortNoteClosing();
    if (typeof beginNoteEditSessionIfNeeded === 'function') beginNoteEditSessionIfNeeded();
    const start = noteTextarea.selectionStart || 0;
    const end = noteTextarea.selectionEnd || 0;
    const val = noteTextarea.value;
    noteTextarea.value = val.slice(0, start) + emoji + val.slice(end);
    const pos = start + [...emoji].length; // code-point safe-ish
    noteTextarea.setSelectionRange(pos, pos);
    noteTextarea.focus();
    pushEmojiToMemory(emoji);
    if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
    if (typeof saveNoteDraftDebounced === 'function') saveNoteDraftDebounced();
    if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
  }

  function renderEmojiTray() {
    // Inline tray removed — curated memory is shown inside the "more" popover only.
    if (!Array.isArray(favoriteEmojis) || !favoriteEmojis.length) {
      favoriteEmojis = (typeof DEFAULT_FAVORITE_EMOJIS !== 'undefined' ? DEFAULT_FAVORITE_EMOJIS : ['✨','📌','🔥','💡']).slice();
    }
  }

  function renderEmojiPopover() {
    const pop = uiEls.emojiPopover || document.getElementById('ai-emoji-popover');
    if (!pop) return;
    pop.innerHTML = '';
    if (!Array.isArray(favoriteEmojis) || !favoriteEmojis.length) {
      favoriteEmojis = (typeof DEFAULT_FAVORITE_EMOJIS !== 'undefined' ? DEFAULT_FAVORITE_EMOJIS : ['✨','📌','🔥','💡']).slice();
    }

    const addGrid = (titleText, list, extraClass) => {
      if (!list || !list.length) return;
      const title = document.createElement('div');
      title.className = 'ai-emoji-popover-title';
      title.textContent = titleText;
      pop.appendChild(title);
      const grid = document.createElement('div');
      grid.className = 'ai-emoji-grid' + (extraClass ? ' ' + extraClass : '');
      list.forEach((emoji) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-emoji-item';
        btn.textContent = emoji;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          insertEmojiAtCursor(emoji);
          pop.classList.remove('active');
        });
        grid.appendChild(btn);
      });
      pop.appendChild(grid);
    };

    addGrid(t('emojiTrayTitle'), favoriteEmojis.slice(), 'is-memory');
    const seen = new Set(favoriteEmojis);
    const more = (typeof EMOJI_PICKER_GRID !== 'undefined' ? EMOJI_PICKER_GRID : []).filter((e) => {
      if (seen.has(e)) return false;
      seen.add(e);
      return true;
    });
    addGrid(t('emojiMoreTitle'), more, '');
  }

  function toggleEmojiPopover(force) {
    const pop = uiEls.emojiPopover;
    if (!pop) return;
    const open = force === true ? true : force === false ? false : !pop.classList.contains('active');
    if (open) {
      // Mutual exclusion: close online vault while "more" is open
      if (typeof closeOnlineEmojiModal === 'function') closeOnlineEmojiModal();
      renderEmojiPopover();
      pop.classList.add('active');
      if (uiEls.socialPopover) uiEls.socialPopover.classList.remove('active');
    } else {
      pop.classList.remove('active');
    }
  }

  // سبک: اگر کاربر ایموجی از کیبورد تایپ کرد، به حافظه اضافه شود
  const EMOJI_CHAR_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  function harvestTypedEmoji(prev, next) {
    if (!next || next.length <= (prev || '').length) return;
    // فقط کاراکترهای اضافه‌شده را بررسی کن
    let i = 0;
    while (i < (prev || '').length && i < next.length && prev[i] === next[i]) i++;
    const added = next.slice(i, i + 8);
    const m = added.match(EMOJI_CHAR_RE);
    if (m) pushEmojiToMemory(m[0]);
  }

  // --- Social share ---
  // سقف طول متن قبل از انکود شدن در URL؛ هم از رسیدن به محدودیت طول URL مرورگر/سیستم‌عامل
  // جلوگیری می‌کند و هم از برش خاموش و بی‌اطلاع‌کننده‌ی خودِ شبکه‌های اجتماعی
  const SHARE_MAX_LEN = 3800;
  // رنگ هر بج مطابق برند خودِ شبکه، اما با همان الگوی «پس‌زمینه‌ی کم‌رنگ + متن پررنگ» که دکمه‌های
  // toolbar (پاک‌کردن/کپی/ذخیره) از قبل استفاده می‌کنند — برای هم‌خوانی بصری با بقیه‌ی نوت‌پد
  const TEXT_SOCIAL_NETWORKS = [
    { id: 'x', labelKey: 'shareX', icon: '𝕏', bg: 'rgba(255,255,255,0.16)', fg: '#fff', buildUrl: (text) => 'https://x.com/intent/post?text=' + encodeURIComponent(text) },
    // واتساپ: wa.me پارامتر text را مستقیماً در باکس پیام پر می‌کند (بدون مشکل og:tags که فیسبوک/لینکدین
    // دارند)، پس نیازی به کلیپ‌بورد نیست. عمداً از web.whatsapp.com/send استفاده نکردیم چون آن آدرس
    // صفحه‌ی واسط را رد می‌کند و برای کاربری که از قبل در WhatsApp Web لاگین نیست می‌شکند؛ wa.me آدرس
    // رسمی و مطمئنی است که هم به وب و هم به اپ دسکتاپ/موبایل به‌درستی می‌رسد
    { id: 'wa', labelKey: 'shareWhatsApp', icon: 'W', bg: 'rgba(37,211,102,0.20)', fg: '#25D366', buildUrl: (text) => 'https://wa.me/?text=' + encodeURIComponent(text) },
    // لینکدین هم دقیقاً مثل فیسبوک از سال ۲۰۱۸ پارامترهای متنی (title/summary/text) را در sharer نادیده
    // می‌گیرد؛ endpoint فعلی‌اش (share-offsite) فقط url می‌گیرد و پیش‌نمایش را از og:tags همان صفحه
    // می‌سازد. پس مثل فیسبوک به الگوی کپی‌در‌کلیپ‌بورد + بازکردن فید سوییچ می‌کنیم
    { id: 'in', labelKey: 'shareLinkedIn', icon: 'in', bg: 'rgba(10,102,194,0.20)', fg: '#5B9BD5', needsClipboard: true, buildUrl: () => 'https://www.linkedin.com/feed/' },
    // فیسبوک از سال ۲۰۱۸ پارامتر quote/متن دلخواه را در sharer.php نادیده می‌گیرد و کارت اشتراک را فقط
    // از og:tags آدرس u می‌سازد. راه‌حل u=آدرس‌فعلی هم ریسک دارد: همیشه کارت/پیش‌نمایش صفحه‌ای که کاربر
    // در همان لحظه باز داشته پیوست می‌شود، نه یادداشتش — همان مشکل اطلاعات اضافه‌ی گزارش‌شده، فقط با یک
    // سایت دیگر به‌جای x.com. چون فیسبوک اصلاً از اشتراک متن خام پشتیبانی نمی‌کند، ساده‌ترین و
    // صادقانه‌ترین راه: کپی در کلیپ‌بورد + باز کردن فید تمیز فیسبوک بدون هیچ لینک ضمیمه‌ای
    { id: 'fb', labelKey: 'shareFacebook', icon: 'f', bg: 'rgba(24,119,242,0.20)', fg: '#1877F2', needsClipboard: true, buildUrl: () => 'https://www.facebook.com/' }
  ];

  function renderSocialPopover() {
    const pop = uiEls.socialPopover || document.getElementById('ai-social-popover');
    if (!pop) return;
    pop.innerHTML = '';
    const frag = document.createDocumentFragment();
    TEXT_SOCIAL_NETWORKS.forEach((net, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-social-item';
      btn.setAttribute('data-network', net.id);
      btn.setAttribute('role', 'menuitem');
      // roving tabindex: فقط اولین آیتم قابل tab است، بقیه با arrow key در دسترس‌اند (الگوی استاندارد منوها)
      btn.tabIndex = i === 0 ? 0 : -1;
      btn.innerHTML = '<span>' + t(net.labelKey) + '</span>' +
        '<span class="ai-social-item-icon" style="background:' + net.bg + ';color:' + net.fg + ';">' + net.icon + '</span>';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareToTextNetwork(net.id);
        closeSocialPopover(true);
      });
      frag.appendChild(btn);
    });
    pop.appendChild(frag);
  }

  // موقعیت‌دهی پاپ‌اور نسبت به فضای واقعی ویوپورت — همان الگویی که پنل‌های دیگر (تودو/تقویم/جستجو)
  // در این فایل استفاده می‌کنند، تا وقتی نوت‌پد نزدیک لبه‌ی بالا/کنار صفحه یا در حالت split-docked باز
  // است، منوی اشتراک بیرون از دید کاربر کلیپ نشود
  function positionSocialPopover() {
    const pop = uiEls.socialPopover;
    const btn = uiEls.socialToggleBtn;
    if (!pop || !btn) return;
    const btnRect = btn.getBoundingClientRect();
    const popW = pop.offsetWidth || 158;
    const popH = pop.offsetHeight || 180;
    const vw = window.innerWidth, vh = window.innerHeight;
    const opensUp = (btnRect.top - popH - 8) >= 0 || (btnRect.top - popH - 8) > (vh - btnRect.bottom - popH - 8);
    pop.classList.toggle('flip-down', !opensUp);
    const fitsEnd = (btnRect.right - popW) >= 0; // با inset-inline-end:0 یعنی لبه‌ی راست پاپ‌اور روی لبه‌ی راست دکمه است
    pop.classList.toggle('align-start', !fitsEnd && (btnRect.left + popW) <= vw);
    pop.style.transformOrigin = (opensUp ? 'bottom' : 'top') + ' ' + (fitsEnd ? 'right' : 'left');
  }

  function closeSocialPopover(returnFocus) {
    if (!uiEls.socialPopover || !uiEls.socialPopover.classList.contains('active')) return;
    uiEls.socialPopover.classList.remove('active', 'flip-down', 'align-start');
    if (uiEls.socialToggleBtn) {
      uiEls.socialToggleBtn.setAttribute('aria-expanded', 'false');
      if (returnFocus) uiEls.socialToggleBtn.focus();
    }
  }

  function socialPopoverKeydown(e) {
    const items = Array.from(uiEls.socialPopover ? uiEls.socialPopover.querySelectorAll('.ai-social-item') : []);
    if (!items.length) return;
    const currentIdx = Math.max(0, items.findIndex(el => el === document.activeElement));
    const focusIdx = (idx) => {
      items.forEach((el, i) => { el.tabIndex = i === idx ? 0 : -1; });
      items[idx].focus();
    };
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      focusIdx((currentIdx + dir + items.length) % items.length);
    } else if (e.key === 'Home') {
      e.preventDefault(); focusIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault(); focusIdx(items.length - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      closeSocialPopover(true);
    } else if (e.key === 'Tab') {
      closeSocialPopover(false);
    }
  }

  let lastShareAt = 0;
  function shareToTextNetwork(networkId) {
    // جلوگیری از باز شدن چند پنجره/کپی چندباره روی کلیک‌های پیاپی یا دوباره‌فراخوانی تصادفی؛
    // به‌جای شکست خاموش، دکمه‌ی toggle حالت "busy" می‌گیرد تا کاربر بفهمد کلیکش ثبت شده
    const now = Date.now();
    if (now - lastShareAt < 500) return;
    lastShareAt = now;
    if (uiEls.socialToggleBtn) {
      uiEls.socialToggleBtn.classList.add('is-busy');
      setTimeout(() => uiEls.socialToggleBtn.classList.remove('is-busy'), 500);
    }

    const raw = noteTextarea ? noteTextarea.value : '';
    // حذف کاراکترهای نامرئی (zero-width / BOM) پیش از بررسیِ خالی بودن، وگرنه trim() به‌تنهایی آن‌ها را نمی‌گیرد
    const text = raw.replace(/[\u200B\u200C\u200D\uFEFF]/g, '').trim();
    if (!text) {
      showToastNotification(t('shareEmpty'), true);
      return;
    }
    const net = TEXT_SOCIAL_NETWORKS.find(n => n.id === networkId);
    if (!net) return;

    const clipped = text.length > SHARE_MAX_LEN ? text.slice(0, SHARE_MAX_LEN) + '…' : text;
    if (clipped !== text) showToastNotification(t('shareTruncated'), true);

    const finish = () => {
      const url = net.buildUrl(clipped);
      window.open(url, '_blank', 'noopener,noreferrer');
      // برای شبکه‌هایی که فقط کپی می‌کنیم (لینکدین/فیسبوک) از همان کلید ترجمه‌ای استفاده می‌کنیم که
      // فیچر Ask-AI برای الگوی مشابهش دارد (dockCopiedOpen)، به‌جای تعریف پیام تکراری جدید
      showToastNotification(t(net.needsClipboard ? 'dockCopiedOpen' : 'shareOpened').replace('{name}', t(net.labelKey)));
    };

    if (net.needsClipboard) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(clipped).then(finish, () => {
          // اگر Clipboard API async شکست بخورد (دسترسی رد شده/کانتکست غیر امن)، از fallback همزمانِ
          // execCommand که همین‌الان برای دیسپچ Ask-AI در کدبیس وجود دارد استفاده می‌کنیم
          fallbackCopyTextForDispatch(clipped);
          finish();
        });
      } else {
        fallbackCopyTextForDispatch(clipped);
        finish();
      }
    } else {
      finish();
    }
    if (typeof abortNoteClosing === 'function') abortNoteClosing();
  }


  // ============================================================================
  // Online emoji vault — lazy fetch + chrome.storage.local cache (opt-in only)
  // نیاز به host_permissions برای CDN در manifest.json
  // ============================================================================
  const EMOJI_CDN_URLS = [
    'https://cdn.jsdelivr.net/npm/unicode-emoji-json@0.8.0/data-by-group.json',
    'https://unpkg.com/unicode-emoji-json@0.8.0/data-by-group.json'
  ];
  const EMOJI_CACHE_KEY = 'aiTreeOnlineEmojiCache_v2';
  const EMOJI_CACHE_MAX_ITEMS = 2500;
  let cachedOnlineEmojis = null; // [{ e, n }]
  let onlineEmojiLoadPromise = null;

  // نگاشت سبک فارسی → انگلیسی برای جستجو (اختیاری)
  const EMOJI_FA_HINTS = {
    'آتش': 'fire', 'شعله': 'fire', 'قلب': 'heart', 'عشق': 'heart',
    'خنده': 'grin', 'لبخند': 'smile', 'گریه': 'cry', 'کتاب': 'book',
    'ستاره': 'star', 'ماه': 'moon', 'خورشید': 'sun', 'گل': 'flower',
    'درخت': 'tree', 'ماشین': 'car', 'هواپیما': 'airplane', 'موشک': 'rocket',
    'کامپیوتر': 'computer', 'کد': 'laptop', 'تلفن': 'phone', 'موسیقی': 'music',
    'غذا': 'food', 'قهوه': 'coffee', 'چای': 'tea', 'کیک': 'cake',
    'ورزش': 'sport', 'فوتبال': 'soccer', 'برنده': 'trophy', 'هدیه': 'gift',
    'تیک': 'check', 'خطا': 'cross', 'هشدار': 'warning', 'ایده': 'bulb',
    'پین': 'pushpin', 'یادداشت': 'memo', 'چشم': 'eye', 'دست': 'hand'
  };

  function normalizeEmojiQuery(raw) {
    let q = String(raw || '').trim().toLowerCase();
    if (!q) return '';
    // اگر کلمه فارسی بود، معادل انگلیسی را هم اضافه کن
    Object.keys(EMOJI_FA_HINTS).forEach((fa) => {
      if (q.includes(fa)) q += ' ' + EMOJI_FA_HINTS[fa];
    });
    return q;
  }

  function flattenEmojiCdnData(data) {
    const out = [];
    const seen = new Set();
    const pushItem = (emoji, name) => {
      if (!emoji || seen.has(emoji)) return;
      seen.add(emoji);
      out.push({ e: emoji, n: String(name || '').toLowerCase() });
    };
    const walkGroup = (group) => {
      if (!group) return;
      const list = group.emojis || group.emoji || group;
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        if (typeof item === 'string') pushItem(item, '');
        else if (item && typeof item === 'object') {
          pushItem(item.emoji || item.char || item.e, item.name || item.slug || item.n || '');
        }
      });
    };
    if (Array.isArray(data)) {
      data.forEach(walkGroup);
    } else if (data && typeof data === 'object') {
      Object.keys(data).forEach((k) => walkGroup(data[k]));
    }
    return out.slice(0, EMOJI_CACHE_MAX_ITEMS);
  }

  function loadOnlineEmojisFromStorage() {
    return new Promise((resolve) => {
      try {
        if (!chrome.runtime?.id) { resolve(null); return; }
        chrome.storage.local.get([EMOJI_CACHE_KEY], (res) => {
          const pack = res && res[EMOJI_CACHE_KEY];
          if (pack && Array.isArray(pack.items) && pack.items.length > 50) {
            resolve(pack.items);
          } else resolve(null);
        });
      } catch (e) { resolve(null); }
    });
  }

  function saveOnlineEmojisToStorage(items) {
    try {
      if (chrome.runtime?.id) {
        chrome.storage.local.set({
          [EMOJI_CACHE_KEY]: { ts: Date.now(), items: items.slice(0, EMOJI_CACHE_MAX_ITEMS) }
        });
      }
    } catch (e) {}
  }

  async function fetchOnlineEmojis() {
    if (cachedOnlineEmojis && cachedOnlineEmojis.length) return cachedOnlineEmojis;
    if (onlineEmojiLoadPromise) return onlineEmojiLoadPromise;

    onlineEmojiLoadPromise = (async () => {
      const fromStore = await loadOnlineEmojisFromStorage();
      if (fromStore && fromStore.length) {
        cachedOnlineEmojis = fromStore;
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
        } catch (err) {
          lastErr = err;
        }
      }
      console.warn('[AI Tree] Online emoji fetch failed:', lastErr);
      // fallback: local picker grid only
      cachedOnlineEmojis = (typeof EMOJI_PICKER_GRID !== 'undefined' ? EMOJI_PICKER_GRID : []).map((e) => ({ e, n: '' }));
      return cachedOnlineEmojis;
    })();

    try {
      return await onlineEmojiLoadPromise;
    } finally {
      // allow retry later if completely empty
      if (!cachedOnlineEmojis || !cachedOnlineEmojis.length) onlineEmojiLoadPromise = null;
    }
  }

  function ensureOnlineEmojiModal() {
    let modal = document.getElementById('ai-emoji-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'ai-emoji-modal';
    modal.className = 'ai-emoji-modal';
    modal.innerHTML =
      '<div class="ai-emoji-modal-head">' +
        '<span class="ai-emoji-modal-title" id="ai-emoji-modal-title"></span>' +
        '<button type="button" class="ai-emoji-modal-close" id="ai-emoji-modal-close" aria-label="Close">✕</button>' +
      '</div>' +
      '<input type="text" id="ai-emoji-search-input" class="ai-emoji-search-input" autocomplete="off" dir="auto" />' +
      '<div id="ai-emoji-grid-wrap" class="ai-emoji-grid-wrap"></div>';
    quickNoteForm.appendChild(modal);

    const searchInput = modal.querySelector('#ai-emoji-search-input');
    let searchTimer = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => renderOnlineEmojiGrid(searchInput.value), 80);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeOnlineEmojiModal(); }
    });
    modal.querySelector('#ai-emoji-modal-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closeOnlineEmojiModal();
    });
    return modal;
  }

  function renderOnlineEmojiGrid(queryRaw) {
    const grid = document.getElementById('ai-emoji-grid-wrap');
    if (!grid) return;
    const q = normalizeEmojiQuery(queryRaw);
    const source = cachedOnlineEmojis || [];
    let filtered;
    if (!q) {
      filtered = source.slice(0, 160);
    } else {
      const parts = q.split(/\s+/).filter(Boolean);
      filtered = source.filter((item) => {
        const hay = (item.n || '') + ' ' + (item.e || '');
        return parts.every((p) => hay.includes(p) || (item.e && item.e.includes(p)));
      }).slice(0, 160);
    }

    grid.innerHTML = '';
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'ai-emoji-loading';
      empty.textContent = t('emojiOnlineEmpty');
      grid.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    filtered.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-emoji-cell';
      btn.textContent = item.e;
      btn.title = item.n || item.e;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        insertEmojiAtCursor(item.e);
        closeOnlineEmojiModal();
      });
      frag.appendChild(btn);
    });
    grid.appendChild(frag);
  }

  function closeOnlineEmojiModal() {
    const modal = document.getElementById('ai-emoji-modal');
    if (modal) modal.classList.remove('active');
  }

  async function openOnlineEmojiRepository() {
    if (typeof abortNoteClosing === 'function') abortNoteClosing();
    // Mutual exclusion: close local "more" popover while online vault is open
    if (uiEls.emojiPopover) uiEls.emojiPopover.classList.remove('active');
    if (uiEls.socialPopover) uiEls.socialPopover.classList.remove('active');
    const modal = ensureOnlineEmojiModal();
    const titleEl = modal.querySelector('#ai-emoji-modal-title');
    const searchInput = modal.querySelector('#ai-emoji-search-input');
    const grid = modal.querySelector('#ai-emoji-grid-wrap');
    if (titleEl) titleEl.textContent = t('emojiOnlineTitle');
    if (searchInput) {
      searchInput.placeholder = t('emojiOnlineSearch');
      searchInput.value = '';
    }
    if (grid) {
      grid.innerHTML = '<div class="ai-emoji-loading">' + t('emojiOnlineLoading') + '</div>';
    }
    modal.classList.add('active');

    try {
      await fetchOnlineEmojis();
      renderOnlineEmojiGrid('');
      if (searchInput) setTimeout(() => searchInput.focus(), 30);
    } catch (err) {
      if (grid) grid.innerHTML = '<div class="ai-emoji-loading">' + t('emojiOnlineError') + '</div>';
    }
  }

  function ensureOnlineEmojiButton() {
    const btn = (uiEls && uiEls.emojiOnlineBtn) || document.getElementById('ai-emoji-online-btn');
    if (!btn || btn.dataset.wired === '1') return;
    btn.dataset.wired = '1';
    btn.title = t('emojiOnlineBtn');
    if (!btn.textContent.trim()) btn.textContent = '🌐';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modal = document.getElementById('ai-emoji-modal');
      if (modal && modal.classList.contains('active')) closeOnlineEmojiModal();
      else openOnlineEmojiRepository();
    });
  }



  function setupEmojiAndShareUI() {
    loadEmojiMemory();
    renderEmojiTray();
    ensureOnlineEmojiButton();
    renderSocialPopover();
    if (uiEls.socialToggleLabel) uiEls.socialToggleLabel.textContent = t('shareBtn');
    if (uiEls.socialToggleBtn) uiEls.socialToggleBtn.title = t('shareTitle');
    if (uiEls.emojiToggleBtn) {
      uiEls.emojiToggleBtn.title = t('emojiMoreTitle');
      uiEls.emojiToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEmojiPopover();
      });
    }
    if (uiEls.socialToggleBtn && uiEls.socialPopover) {
      uiEls.socialToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = !uiEls.socialPopover.classList.contains('active');
        if (open) {
          if (uiEls.emojiPopover) uiEls.emojiPopover.classList.remove('active');
          uiEls.socialPopover.classList.add('active');
          uiEls.socialToggleBtn.setAttribute('aria-expanded', 'true');
          positionSocialPopover();
          // فوکوس روی اولین آیتم برای کاربران کیبورد/screen-reader؛ کلیک ماوس هم مشکلی ندارد چون
          // بلافاصله روی یک آیتم واقعی قرار می‌گیرد که قابل کلیک است
          const first = uiEls.socialPopover.querySelector('.ai-social-item');
          if (first) first.focus();
        } else {
          closeSocialPopover(false);
        }
      });
      uiEls.socialPopover.addEventListener('keydown', socialPopoverKeydown);
    }
    document.addEventListener('click', (e) => {
      if (uiEls.emojiPopover && uiEls.emojiWrap && !uiEls.emojiWrap.contains(e.target)) {
        uiEls.emojiPopover.classList.remove('active');
      }
      if (uiEls.socialPopover && uiEls.socialWrap && !uiEls.socialWrap.contains(e.target)) {
        closeSocialPopover(false);
      }
      const modal = document.getElementById('ai-emoji-modal');
      if (modal && modal.classList.contains('active')) {
        if (!modal.contains(e.target) && !e.target.closest('#ai-emoji-online-btn')) {
          closeOnlineEmojiModal();
        }
      }
    });
    // اگر پنجره ریسایز شود یا نوت‌پد جابه‌جا/تغییر اندازه شود، پاپ‌اور بازِ اشتراک باید یا موقعیتش
    // به‌روز شود یا (ساده و امن‌تر) بسته شود تا هیچ‌وقت خارج از دید یا روی محل اشتباه نماند
    window.addEventListener('resize', () => closeSocialPopover(false));
  }
  // بعد از تعریف ماژول ایموجی/اشتراک — جلوگیری از TDZ روی favoriteEmojis
  setupEmojiAndShareUI();



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
    { id: 'metaai',     label: 'Meta AI',    short: 'Meta',     url: 'https://www.meta.ai',              qParam: null, color: '#0668E1' },
    { id: 'poe',        label: 'Poe',        short: 'Poe',      url: 'https://poe.com',                  qParam: null, color: '#6F42F5' },
    { id: 'you',        label: 'You.com',    short: 'You',      url: 'https://you.com',                  qParam: null, color: '#4E5EF2' },
    { id: 'huggingchat',label: 'HuggingChat',short: 'Hugging',  url: 'https://huggingface.co/chat',      qParam: null, color: '#FF9D00' },
    { id: 'kimi',       label: 'Kimi',       short: 'Kimi',     url: 'https://www.kimi.com',             qParam: null, color: '#6C4EFF' }
  ];
  const AI_WHEEL_VISIBLE_ROWS = 5; // چند ردیف هم‌زمان دیده شود (با ۱۵ مدل، ۵ ردیف زمینهٔ بهتری می‌دهد)

  // آیتم‌هایی که پارامتر q دارند مستقیماً پرشده باز می‌شوند؛ بقیه فقط با کپی/پیست
  function aiMethodGlyph(node) { return node && node.qParam ? '⚡' : '📋'; }
  function aiMethodLabel(node) { return (node && node.qParam) ? t('dockMethodAuto') : t('dockMethodCopy'); }

  // پیش‌فرض: ChatGPT (ارسال مستقیم با ?q=)
  const DEFAULT_NOTE_AI_ID = 'chatgpt';
  function indexOfAiId(id) {
    const i = AI_DISPATCH_CATALOG.findIndex(n => n && n.id === id);
    return i >= 0 ? i : 0;
  }
  let activeNoteAIIndex = indexOfAiId(DEFAULT_NOTE_AI_ID); // index into AI_DISPATCH_CATALOG

  /**
   * Builds a platform-optimized target URL.
   * Injects the catalog's qParam (e.g. ?q=) when that service supports prompt auto-fill.
   * AI_DISPATCH_CATALOG.qParam is the single source of truth for this — every entry
   * declares it explicitly ('q' or null), so no hostname guessing happens here.
   */
  function buildAiDispatchUrl(baseUrl, promptText, qParam) {
    if (!baseUrl || !promptText || !qParam) return baseUrl || '';
    try {
      const parsedUrl = new URL(baseUrl);
      parsedUrl.searchParams.set(qParam, promptText.trim());
      return parsedUrl.toString();
    } catch (err) {
      console.warn('[AI Tree] URL parse failed, falling back to raw base URL:', err);
      return baseUrl;
    }
  }

  /**
   * Shared low-level execCommand('copy') fallback (used by both the dispatch
   * flow below and the generic copy button near line ~4480, so the temp
   * textarea creation/cleanup logic lives in exactly one place).
   */
  function copyTextViaHiddenTextarea(text) {
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
   * Lightweight clipboard fallback for dispatch only (does NOT clear notepad, no toast).
   */
  function fallbackCopyTextForDispatch(text) {
    copyTextViaHiddenTextarea(text);
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

  // محدودهٔ سخت [0 .. n-1] — بدون چرخش دایره‌ای تا در ابتدا/انتها پرش نکند
  function clampAiIndex(idx) {
    const n = AI_DISPATCH_CATALOG.length;
    if (n === 0) return 0;
    if (idx < 0) return 0;
    if (idx > n - 1) return n - 1;
    return idx | 0;
  }

  let persistAiIndexTimer = null;
  function setActiveAiIndex(idx, persist) {
    activeNoteAIIndex = clampAiIndex(idx);
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
    wheelScrubActive = false;
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

    // رنگ برند آیتم فعال را به کل ویجت (حاشیه/گلوی هاور + نوار هایلایت چرخ) تزریق می‌کند
    // تا انتخاب واقعاً «رنگی» به‌نظر برسد، نه یک سبز ثابت یکنواخت
    wrapper.style.setProperty('--ai-active-color', active.color || '#10B981');

    // دکمهٔ فشرده: نقطهٔ رنگی برند + نام + آیکن روش ارجاع (⚡ پرشونده خودکار / 📋 کپی-پیست)
    const actionLabelKey = active.verb === 'post' ? 'dockPostName' : 'dockAskName';
    if (uiEls.sendDot) {
      // هم background و هم color ست می‌شود چون گلوی CSS (box-shadow: 0 0 6px currentColor)
      // به‌جای رنگ زمینه، به «color» عنصر وابسته است — قبلاً فقط background ست می‌شد و گلو رنگ برند را نشان نمی‌داد
      uiEls.sendDot.style.background = active.color || '#fff';
      uiEls.sendDot.style.color = active.color || '#fff';
    }
    if (uiEls.sendLabelEl) uiEls.sendLabelEl.textContent = t(actionLabelKey).replace('{name}', active.short || active.label);
    if (uiEls.sendMethodEl) uiEls.sendMethodEl.textContent = aiMethodGlyph(active);
    actionBtn.title = t(actionLabelKey).replace('{name}', active.label) + ' · ' + aiMethodLabel(active);
    wrapper.title = actionBtn.title;

    list.innerHTML = '';
    const n = catalog.length;
    catalog.forEach((node, idx) => {
      // فاصلهٔ خطی تا مرکز (بدون wrap) تا در لبهٔ لیست پرش بصری نباشد
      const raw = idx - activeNoteAIIndex;
      const dist = Math.abs(raw);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-wheel-item' + (idx === activeNoteAIIndex ? ' is-active' : '');
      btn.dataset.index = String(idx);

      const dot = document.createElement('span'); dot.className = 'ai-wheel-item-dot'; dot.style.background = node.color || '#fff'; dot.style.color = node.color || '#fff';
      const label = document.createElement('span'); label.className = 'ai-wheel-item-label'; label.textContent = node.short || node.label;
      const method = document.createElement('span'); method.className = 'ai-wheel-item-method'; method.textContent = aiMethodGlyph(node);
      btn.appendChild(dot); btn.appendChild(label); btn.appendChild(method);
      btn.title = node.label + ' · ' + aiMethodLabel(node);

      // ذره‌بین: مرکز واضح، اطراف محو/کوچک — فقط برای آیتم‌های نزدیک به مرکز
      const scale = dist > 3 ? 0.72 : Math.max(0.78, 1 - dist * 0.08);
      const opacity = idx === activeNoteAIIndex ? 1 : (dist > 3 ? 0.12 : Math.max(0.22, 1 - dist * 0.28));
      const blur = idx === activeNoteAIIndex ? 0 : Math.min(1.6, dist * 0.4);
      const rotateX = Math.max(-28, Math.min(28, raw * 14));
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
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeNoteAIIndex > 0) setActiveAiIndex(activeNoteAIIndex - 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeNoteAIIndex < AI_DISPATCH_CATALOG.length - 1) setActiveAiIndex(activeNoteAIIndex + 1);
      } else if (e.key === 'PageUp') {
        // پرش ۵تایی — با ۱۵ مورد، رسیدن به انتهای لیست فقط با ArrowUp/Down کند است
        e.preventDefault();
        setActiveAiIndex(clampAiIndex(activeNoteAIIndex - 5));
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        setActiveAiIndex(clampAiIndex(activeNoteAIIndex + 5));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveAiIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveAiIndex(AI_DISPATCH_CATALOG.length - 1);
      }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const node = AI_DISPATCH_CATALOG[clampAiIndex(activeNoteAIIndex)];
        if (node && node.url) { closeAiWheel(); sendPromptToNode(node); }
      } else if (e.key === 'Escape') { e.preventDefault(); closeAiWheel(); }
      else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        // تایپ حرف اول اسم = جستجوی نوع‌ای (type-ahead)؛ به نزدیک‌ترین تطابق بعدی می‌پرد (چرخشی)
        e.preventDefault();
        const letter = e.key.toLowerCase();
        const n = AI_DISPATCH_CATALOG.length;
        for (let step = 1; step <= n; step++) {
          const idx = (activeNoteAIIndex + step) % n;
          if (AI_DISPATCH_CATALOG[idx].label.toLowerCase().startsWith(letter)) {
            setActiveAiIndex(idx);
            break;
          }
        }
      }
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

  // اسکرول روی چرخ = یک پلهٔ گسسته؛ در ابتدا/انتها متوقف می‌شود (بدون wrap)
  if (uiEls.wheelViewport) {
    let wheelLock = false;
    uiEls.wheelViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (wheelLock) return;
      const next = activeNoteAIIndex + (e.deltaY > 0 ? 1 : -1);
      const clamped = clampAiIndex(next);
      if (clamped === activeNoteAIIndex) return; // لبهٔ لیست — هیچ پرشی نباشد
      wheelLock = true;
      setActiveAiIndex(clamped);
      setTimeout(() => { wheelLock = false; }, 90);
    }, { passive: false });
  }

  // اسکراب فقط با «فشردن و کشیدنِ» موس فعال می‌شود، نه صرفِ عبور موس روی چرخ.
  // باگ قبلی: هر حرکتِ موس (حتی هنگام نزدیک شدن برای کلیک روی آیتم اول/آخر) لیست را
  // دوباره مرکزچین می‌کرد، پس دقیقاً همان آیتمی که کاربر می‌خواست کلیک کند زیر نشانگرش
  // جابه‌جا می‌شد — این «پرش» بیشترین اثر را روی لبه‌های لیست داشت چون بیشترین مسافتِ
  // حرکتِ موس (و در نتیجه بیشترین تعداد مرکزچینی‌های میانی) مربوط به رسیدن به همان لبه‌هاست.
  let wheelScrubActive = false, wheelScrubStartY = null, wheelScrubStartIndex = 0, wheelScrubRaf = null, wheelScrubLatestY = null;
  function endWheelScrub() {
    wheelScrubActive = false;
    wheelScrubStartY = null;
    if (wheelScrubRaf) { cancelAnimationFrame(wheelScrubRaf); wheelScrubRaf = null; }
  }
  if (uiEls.wheelViewport) {
    uiEls.wheelViewport.addEventListener('mousedown', (e) => {
      wheelScrubActive = true;
      wheelScrubStartY = e.clientY;
      wheelScrubLatestY = e.clientY;
      wheelScrubStartIndex = activeNoteAIIndex;
    });
    uiEls.wheelViewport.addEventListener('mousemove', (e) => {
      if (!wheelScrubActive || wheelScrubStartY === null) return;
      wheelScrubLatestY = e.clientY;
      if (wheelScrubRaf) return;
      wheelScrubRaf = requestAnimationFrame(() => {
        wheelScrubRaf = null;
        if (!wheelScrubActive || wheelScrubStartY === null) return;
        const deltaY = wheelScrubLatestY - wheelScrubStartY;
        const steps = Math.round(deltaY / AI_WHEEL_ITEM_H);
        const target = clampAiIndex(wheelScrubStartIndex + steps);
        if (target !== activeNoteAIIndex) {
          setActiveAiIndex(target, false);
          // اگر به لبه رسیدیم، مبدأ را به موقعیت فعلی بچسبان تا با برگشت موس پرش نکند
          if (target === 0 || target === AI_DISPATCH_CATALOG.length - 1) {
            wheelScrubStartY = wheelScrubLatestY;
            wheelScrubStartIndex = target;
          }
        }
      });
    });
    uiEls.wheelViewport.addEventListener('mouseup', endWheelScrub);
    uiEls.wheelViewport.addEventListener('mouseleave', endWheelScrub);
    // اگر دکمهٔ موس بیرون از چرخ رها شود هم اسکراب باید تمام شود
    document.addEventListener('mouseup', endWheelScrub);
  }

  // کلیک بیرون از ویجت، چرخ را می‌بندد
  document.addEventListener('click', (e) => {
    if (!isAiWheelOpen()) return;
    const wrap = uiEls.sendWrapper;
    if (wrap && wrap.contains(e.target)) return;
    closeAiWheel();
  });

  function fallbackCopyText(text) { copyTextViaHiddenTextarea(text); showToastNotification(t('toastCopied')); setTimeout(resetToggleTimeout, 100); }

  function getFaviconUrl(urlStr) { try { const domain = new URL(urlStr).hostname; return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`; } catch(e) { return ''; } }

  function isDuplicateNodeAll(newUrl, newLabel, skipIndex = null, skipHub = null) {
    const cleanUrl = newUrl.replace(/\/$/, '').toLowerCase(); const cleanLabel = newLabel.toLowerCase();
    const findInArr = (arr, hubId) => {
      for (let idx = 0; idx < arr.length; idx++) {
        if (hubId === skipHub && idx === skipIndex) continue;
        const link = arr[idx];
        if (!link || !link.url) continue;
        if (link.url.replace(/\/$/, '').toLowerCase() === cleanUrl || (link.label && link.label.toLowerCase() === cleanLabel)) {
          return hubId;
        }
      }
      return 0;
    };
    return findInArr(linksData, 1) || findInArr(linksData2, 2) || findInArr(linksData3, 3) || findInArr(linksData4, 4);
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
      if (area === 'local') {
        // Two-way live sync with the standalone notepad tab (see notepad.js).
        // Only overwrite when this widget's textarea isn't the one being typed in.
        if (changes.savedPromptDraft && noteTextarea && document.activeElement !== noteTextarea) {
          const newVal = changes.savedPromptDraft.newValue || '';
          if (newVal !== noteTextarea.value) {
            noteTextarea.value = newVal;
            if (typeof updateNoteTokenMeter === 'function') updateNoteTokenMeter();
            if (typeof autoGrowNotepad === 'function') autoGrowNotepad();
          }
        }
        if (changes.noteTextAlign && changes.noteTextAlign.newValue && typeof setNoteAlign === 'function') {
          setNoteAlign(changes.noteTextAlign.newValue);
        }
        if (changes.noteFontSize && changes.noteFontSize.newValue && typeof applyNoteFontSize === 'function') {
          applyNoteFontSize(changes.noteFontSize.newValue, { silent: true });
        }
        // Prompts / emoji memory can also be edited from the standalone notepad tab.
        if (changes[CUSTOM_PROMPT_KEY]) {
          customPrompts = Array.isArray(changes[CUSTOM_PROMPT_KEY].newValue) ? changes[CUSTOM_PROMPT_KEY].newValue : [];
          if (typeof renderNoteTemplates === 'function') renderNoteTemplates();
        }
        if (changes[PROMPT_OVERRIDE_KEY]) {
          promptOverrides = (changes[PROMPT_OVERRIDE_KEY].newValue && typeof changes[PROMPT_OVERRIDE_KEY].newValue === 'object') ? changes[PROMPT_OVERRIDE_KEY].newValue : {};
          if (typeof renderNoteTemplates === 'function') renderNoteTemplates();
        }
        if (changes[PROMPT_HIDDEN_KEY]) {
          promptHiddenIds = Array.isArray(changes[PROMPT_HIDDEN_KEY].newValue) ? changes[PROMPT_HIDDEN_KEY].newValue : [];
          if (typeof renderNoteTemplates === 'function') renderNoteTemplates();
        }
        if (changes.aiTreeEmojiMemory && Array.isArray(changes.aiTreeEmojiMemory.newValue)) {
          favoriteEmojis = changes.aiTreeEmojiMemory.newValue.filter(e => typeof e === 'string' && e).slice(0, 12);
          if (typeof renderEmojiTray === 'function') renderEmojiTray();
        }
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
      storageGet('local', ['linksData', 'linksData2', 'linksData3', 'linksData4', 'activeNoteAIIndex'])
    ]);

    if (typeof localData.activeNoteAIIndex === 'number') {
      activeNoteAIIndex = clampAiIndex(localData.activeNoteAIIndex);
    } else {
      activeNoteAIIndex = indexOfAiId(DEFAULT_NOTE_AI_ID);
      try { if (chrome.runtime?.id) chrome.storage.local.set({ activeNoteAIIndex }); } catch (err) {}
    }

    let resolvedLinksData = localData.linksData;
    if ((!resolvedLinksData || resolvedLinksData.length === 0) && syncData.linksData && syncData.linksData.length > 0) {
      resolvedLinksData = syncData.linksData;
      try { chrome.storage.local.set({ linksData: resolvedLinksData }); chrome.storage.sync.remove('linksData'); } catch (err) {}
    }

    if (syncData.appLanguage) currentLang = syncData.appLanguage;
    updateUITexts();

    if (syncData.orbitX !== undefined) { root.style.left = syncData.orbitX + 'px'; root.style.top = syncData.orbitY + 'px'; root.style.bottom = 'auto'; } else { root.style.left = WIDGET1_DEFAULT_LEFT; root.style.top = 'auto'; root.style.bottom = WIDGET1_DEFAULT_BOTTOM; }

    // هسته پیش‌فرض: ChatGPT اول (ارسال مستقیم با q)
    let defaultCore = [{ label: 'ChatGPT', url: 'https://chatgpt.com' }, { label: 'Claude', url: 'https://claude.ai' }, { label: 'Gemini', url: 'https://gemini.google.com' }, { label: 'DeepSeek', url: 'https://chat.deepseek.com' }];
    if (syncData.coreAIConfig && syncData.coreAIConfig.length === 4) defaultCore = syncData.coreAIConfig;

    linksData = (resolvedLinksData && resolvedLinksData.length >= 4) ? resolvedLinksData : defaultCore;

    const blankQuad = () => [ { label: '', url: '' }, { label: '', url: '' }, { label: '', url: '' }, { label: '', url: '' } ];
    linksData2 = (localData.linksData2 && localData.linksData2.length >= 4) ? localData.linksData2 : blankQuad();
    linksData3 = (localData.linksData3 && localData.linksData3.length >= 4) ? localData.linksData3 : blankQuad();
    linksData4 = (localData.linksData4 && localData.linksData4.length >= 4) ? localData.linksData4 : blankQuad();

    if(syncData.lastDeletedLink) setUndoState('storage', null);
    if(syncData.userBirthYear) userBirthYear = parseInt(syncData.userBirthYear, 10);
    if(syncData.aiTreeTodos) { todosData = syncData.aiTreeTodos; migrateTodos(); pruneExpiredDailyTodos(); }
    if(Array.isArray(syncData.aiTreeMarkedDays)) { markedDays = syncData.aiTreeMarkedDays; pruneExpiredMarkedDays(); }
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
      if (chrome.runtime?.id) { chrome.storage.local.set({ linksData: linksData, linksData2: linksData2, linksData3: linksData3, linksData4: linksData4 }); } 
      renderSmartRibbon();
      updateBookmarkCount();
    } catch (e) { showToastNotification(t('toastStorageErr'), true); } 
  }

  function countHubBookmarks(hubIdx) {
    const arr = hubData(hubIdx);
    let n = 0;
    for (let i = 4; i < arr.length; i++) {
      if (arr[i] && arr[i].url) n++;
    }
    return n;
  }

  function countHubCores(hubIdx) {
    const arr = hubData(hubIdx);
    let n = 0;
    for (let i = 0; i < 4 && i < arr.length; i++) {
      if (arr[i] && arr[i].url) n++;
    }
    return n;
  }

  function updateBookmarkCount() {
    if (!bookmarkCountEl) return;
    const bm = countHubBookmarks(currentHubIndex);
    const cores = countHubCores(currentHubIndex);
    bookmarkCountEl.innerHTML =
      `<span class="ai-count-bm">${t('bookmarkCount').replace('{n}', String(bm))}</span>` +
      `<span class="ai-count-core">${t('coreCount').replace('{n}', String(cores))}</span>`;
    bookmarkCountEl.classList.toggle('visible', !!showAllOverride);
  }

  // A short, compositor-friendly "seed blooming" signature whenever the orbit opens.
  function triggerQuantumBloom() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.querySelectorAll('.ai-node').forEach((node, index) => {
      node.style.setProperty('--quantum-bloom-delay', `${Math.min(index, 10) * 46}ms`);
    });
    root.classList.remove('quantum-blooming');
    void root.offsetWidth; // restart the one-shot animation without a timer race
    root.classList.add('quantum-blooming');
    clearTimeout(triggerQuantumBloom.timeout);
    triggerQuantumBloom.timeout = setTimeout(() => root.classList.remove('quantum-blooming'), 780);
  }

  allToggleDot.addEventListener('click', (e) => {
    if (!chrome.runtime?.id) return; e.stopPropagation(); 
    if (showAllOverride) { closeTree(); } else { closeAllPanelsExcept(''); isOpen = true; showAllOverride = true; root.classList.add('open', 'show-all-active'); setHubLabel(t('hubAll')); renderSpiral(); triggerQuantumBloom(); updateBookmarkCount(); resetToggleTimeout(); }
  });
  
  function cycleLayer() { 
      showAllOverride = false; root.classList.remove('show-all-active'); 
      currentLayerMode++; if (currentLayerMode >= MAX_LAYERS) currentLayerMode = 0; 
      let nextLabel = RING_CONFIG[currentLayerMode].label;
      if (RING_CONFIG[currentLayerMode].labelKey) nextLabel = t(RING_CONFIG[currentLayerMode].labelKey);
      setHubLabel(nextLabel); renderSpiral(); updateBookmarkCount();
  }

  function calculateSafePositions(countToGenerate) {
    const hubRect = hub.getBoundingClientRect(); const cx = hubRect.left + (hubRect.width / 2); const cy = hubRect.top + (hubRect.height / 2); const vw = window.innerWidth; const vh = window.innerHeight; const SAFE_W = 55; const SAFE_H = 24; const EDGE_PAD = 12; let validPositions = []; let attempt = 1; const MAX_ATTEMPTS = 900;
    const spaceLeft = cx - EDGE_PAD; const spaceRight = (vw - EDGE_PAD) - cx;
    const spaceTop = cy - EDGE_PAD; const spaceBottom = (vh - EDGE_PAD) - cy;
    const biasAngleDeg = Math.atan2(-(spaceBottom - spaceTop), (spaceRight - spaceLeft)) * (180 / Math.PI);
    const LEVER_ZONE_R = 88;
    // بوک‌مارک اول (attempt=1) در فرمول اصلی چون Math.sqrt(attempt-1)=0 بود، هیچ‌وقت با اسلایدر فاصله
    // جابه‌جا نمی‌شد و همیشه دقیقاً روی START_RADIUS+ثابت می‌ماند، بی‌ربط به SPACING.
    // فیکس: به‌جای صفر کردنِ کامل جملهٔ SPACING، از یک «نیم‌قدم» مارپیچ استفاده می‌کنیم — یعنی
    // بوک‌مارک اول هم دقیقاً روی همان منحنی مارپیچ طلایی می‌نشیند و با اسلایدر جابه‌جا می‌شود، فقط
    // نزدیک‌تر از بوک‌مارک دوم (attempt=2) به هاب می‌ماند. FIRST_NODE_RADIUS_BOOST و ضریب نیم‌قدم
    // طوری انتخاب شده‌اند که در کل بازهٔ MIN..MAX اسلایدر، ترتیبِ radius(اول) < radius(دوم) همیشه حفظ شود.
    const FIRST_NODE_RADIUS_BOOST = 6;
    const FIRST_NODE_SPIRAL_STEP = 0.5; // نصفِ فاصلهٔ بوک‌مارک دوم تا هاب — با MIN_SPACING=18 هم ترتیب را به‌هم نمی‌زند
    while (validPositions.length < countToGenerate && attempt < MAX_ATTEMPTS) { const angle = biasAngleDeg + (attempt * GOLDEN_ANGLE); const radius = attempt === 1 ? START_RADIUS + FIRST_NODE_RADIUS_BOOST + (SPACING * FIRST_NODE_SPIRAL_STEP) : START_RADIUS + (SPACING * Math.sqrt(attempt - 1)); const rad = angle * (Math.PI / 180); const x = Math.cos(rad) * radius; const y = -Math.sin(rad) * radius; const absX = cx + x; const absY = cy + y; const normAngle = ((angle % 360) + 360) % 360; const inLeverZone = radius < LEVER_ZONE_R && (normAngle <= 100 || normAngle >= 350); const isSafe = !inLeverZone && (absX - SAFE_W > EDGE_PAD && absX + SAFE_W < vw - EDGE_PAD && absY - SAFE_H > EDGE_PAD && absY + SAFE_H < vh - EDGE_PAD); if (isSafe) validPositions.push({ x, y }); attempt++; } return validPositions;
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
        // Show-all: only bookmarks of this galaxy — core AI slots stay on Core layer
        for (let i = 4; i < activeData.length; i++) visibleIndices.push(i);
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
        const nextHub = currentHubIndex + 1;
        const forwardLabel = isNewsHub(nextHub)
          ? t('portalNews')
          : t('portalForward').replace('{n}', currentHubIndex);
        const forwardIcon = isNewsHub(nextHub) ? '📰' : '🌌';
        const forwardPortal = (currentLayerMode === 0)
            ? (currentHubIndex < HUB_COUNT ? { isPortal: true, target: nextHub, label: forwardLabel, icon: forwardIcon } : null)
            : (currentHubIndex < HUB_COUNT && hubHasTierItems(nextHub, ring) ? { isPortal: true, target: nextHub, label: `${ring.label} · ${forwardLabel}`, icon: forwardIcon, keepLayer: true } : null);
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

    hub.classList.toggle('hub-infinity', currentHubIndex > 1 && !isNewsHub(currentHubIndex));
    hub.classList.toggle('hub-news', isNewsHub(currentHubIndex));
  }

  function switchHub(targetIndex, keepLayer) {
      currentHubIndex = targetIndex;
      if (!keepLayer) currentLayerMode = 0;
      setHubLabel(showAllOverride ? t('hubAll') : (currentLayerMode === 0 ? t('hubCore') : RING_CONFIG[currentLayerMode].label));
      renderSpiral(); renderTierDots();
      updateBookmarkCount();
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

    const dupHub = isDuplicateNodeAll(url, label, isEditing ? editingNodeIndex : null, currentHubIndex);
    if (dupHub) { showToastNotification(t('toastExists').replace('{n}', String(dupHub)), true); return; }

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

    const dupHub = isDuplicateNodeAll(homeUrl, label, null, null);
    if (dupHub) { showToastNotification(t('toastExists').replace('{n}', String(dupHub)), true); return; }

    const startHub = isOpen ? currentHubIndex : 1;
    const { ring, targetHub } = findTargetHubForImportance(importance, startHub);
    if (targetHub > HUB_COUNT) { showToastNotification(t('toastTierFullEverywhere').replace('{tier}', ring.label), true); return; }

    hubData(targetHub).push({ label, url: homeUrl, description: '', isCore: false, importance });
    const newNodeIndex = hubData(targetHub).length - 1;
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

    // ثبتِ خودکار بوک‌مارک بدون توضیح ذخیره می‌شود؛ برای این‌که کاربر مجبور نباشد جداگانه روی نود
    // کلیک کند تا توضیح اضافه کند، همان فرم ویرایش (که فیلد توضیحات را هم دارد) بلافاصله باز می‌شود
    // — فقط با فوکوس روی خودِ فیلد توضیحات، چون عنوان/آدرس از قبل درست پر شده‌اند.
    // بوک‌مارک از قبل با saveLinksAll() ذخیره شده؛ اگر کاربر این پنجره را لغو کند چیزی از دست نمی‌رود،
    // فقط توضیح خالی می‌ماند و می‌تواند بعداً از روی خودِ نود دوباره اضافه‌اش کند.
    openEditForm(newNodeIndex);
    if (uiEls.formDescription) uiEls.formDescription.focus();
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
    updateBookmarkCount();
  }

  collapseToggleDot.addEventListener('click', (e) => { if (!chrome.runtime?.id) return; e.stopPropagation(); closeTree(); closeAllPanelsExcept(''); hub.classList.add('hub-collapsed'); if (typeof collapseMotivationalQuotes === 'function') collapseMotivationalQuotes(); });

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
    if (hub.classList.contains('hub-collapsed')) { hub.classList.remove('hub-collapsed'); triggerQuantumBloom(); resetAutoCollapseTimer(); return; }
    if (dragMoved) { dragMoved = false; return; } 
    if (uiToggles.includes(e.target.id)) return;
    if (e.detail === 1) {
      clickTimeout = setTimeout(() => {
        if (!isOpen) { closeAllPanelsExcept(''); isOpen = true; currentLayerMode = 0; root.classList.add('open'); renderSpiral(); triggerQuantumBloom(); } 
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
            adjustNotepadPosition(); adjustCalcPosition(); adjustClockPosition(); adjustTodoPosition(); adjustSearchPosition(); adjustDotsNavPosition(); adjustHubDotsPosition();
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
    if (message.action === "refreshSpiralUI") {
      loadDataAndRender();
      if (typeof restoreNoteDraft === 'function') restoreNoteDraft();
    }
    if (message.action === "softRelaunchAnly" || message.action === "relaunchLauncher") {
      try {
        lifecycle.relaunchSilently(message.reason || message.action, { silent: !!message.silent });
        sendResponse({ ok: true });
      } catch (err) {
        sendResponse({ ok: false, error: String(err && err.message || err) });
      }
      return true;
    }
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
            linksData4 = JSON.parse(JSON.stringify(found.w4 || found.news || []));
            if (!linksData4 || linksData4.length < 4) linksData4 = [{ label: '', url: '' }, { label: '', url: '' }, { label: '', url: '' }, { label: '', url: '' }];
            saveLinksAll(); currentHubIndex = 1; renderSpiral(); renderTierDots(); showToastNotification(t('toastRestored')); sendResponse({ ok: true });
          } else sendResponse({ ok: false });
        });
        return true;
      } catch (e) { sendResponse({ ok: false }); }
    }
  });

  function mainAIIcon() { return `<svg class="hub-main-icon" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="4" stroke="rgba(156,163,175,0.6)"></rect><text id="ai-hub-text" class="is-default-ai" x="12" y="16.5" font-family="sans-serif" font-size="11" font-weight="800" text-anchor="middle" dominant-baseline="middle" fill="#E5E7EB" stroke="none">AI</text></svg>`; }

  /**
   * Hub center label — must stay legible inside a 28×28 SVG for both fa/en
   * and for short ("AI", "∞2") vs medium ("News", "اخبار", "5★") strings.
   * CSS must NOT force a fixed font-size on hub-infinity (that caused overflow).
   */
  function setHubLabel(text) {
    const el = document.getElementById('ai-hub-text'); if (!el) return;
    const coreWord = t('hubCore');
    const newsWord = t('hubNews');
    const allWord = t('hubAll');
    let displayText = text == null ? '' : String(text);

    if (isNewsHub(currentHubIndex)) {
      if (displayText === 'AI' || displayText === coreWord || displayText === 'Core') {
        displayText = newsWord;
      }
    } else if (currentHubIndex > 1) {
      // Compact galaxy id only — avoid "∞2 Core" / "∞2 هسته" which never fits the disc
      if (displayText === 'AI' || displayText === coreWord || displayText === 'Core') {
        displayText = `∞${currentHubIndex}`;
      }
    }

    el.textContent = displayText;
    el.classList.toggle('is-default-ai', displayText === 'AI' && currentHubIndex === 1);

    // Visual length: CJK/Arabic glyphs read wider than Latin of the same char count
    const rawLen = displayText.length;
    const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(displayText);
    const hasHeavy = /[★∞]/.test(displayText);
    let units = rawLen + (hasArabic ? rawLen * 0.35 : 0) + (hasHeavy ? 0.4 : 0);

    let size;
    if (units <= 1.2) size = 11;
    else if (units <= 2.2) size = 10;
    else if (units <= 3.2) size = 8.5;
    else if (units <= 4.2) size = 7.5;
    else if (units <= 5.5) size = 6.8;
    else size = 6.2;

    // Persian UI: slightly tighter so «اخبار» / «همه» stay inside the ring
    if (currentLang === 'fa') size = Math.max(6.2, size - 0.4);

    // Known short tokens — keep a confident size
    if (displayText === 'AI' || /^∞[1-9]$/.test(displayText)) {
      size = currentLang === 'fa' ? 10 : 11;
    } else if (displayText === newsWord || displayText === allWord) {
      size = Math.min(size, currentLang === 'fa' ? 7.2 : 8);
    } else if (/^[1-5]★$/.test(displayText) || displayText === '1-2★') {
      size = 8.5;
    }

    el.setAttribute('font-size', String(size));
    el.setAttribute('font-weight', units > 3.5 ? '700' : '800');
    // Keep baseline optically centered as size changes
    el.setAttribute('y', size >= 10 ? '16.5' : (size >= 8 ? '16.2' : '15.8'));
  }

})();
