// ============================================================================
// AI Tree Launcher — Zen Toolbar Icon Library (shared)
// ----------------------------------------------------------------------------
// یک منبع واحد برای همهٔ آیکون‌های SVG تولبار — هم برای ویجت توکار (content.js)
// هم برای صفحهٔ نوت‌پد مستقل (notepad.html) استفاده می‌شود تا آیکون‌ها بین این
// دو سطح دقیقاً یکسان و هم‌زمان به‌روزرسانی بمانند.
//
// استروک ۱.۸px، rounded cap/join، بدون fill — طبق مشخصات قفل‌شدهٔ طراحی.
// استفاده: <span data-zen-icon="translate"></span> و سپس صدا زدن mountZenIcons(root)
// ============================================================================

const AITreeToolbarIcons = {
  prompts: '<svg viewBox="0 0 24 24" class="zt-svg"><rect x="4" y="4" width="12" height="16" rx="2.5"/><path d="M8 8h4M8 12h4M16 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8"/></svg>',

  emoji: '<svg viewBox="0 0 24 24" class="zt-svg"><circle cx="12" cy="12" r="9"/><path d="M8.5 9.5h.01M15.5 9.5h.01M8 14.5c1.2 1.5 6.8 1.5 8 0"/></svg>',

  emojiOnline: '<svg viewBox="0 0 24 24" class="zt-svg"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>',

  translate: '<svg viewBox="0 0 24 24" class="zt-svg"><path d="m4 6 5 12M9 6l-5 12M2.5 14.5h8"/><path d="M14 6h7M17.5 6v3M14 18c2.5-1 4.5-3 5.5-6M15 11.5c1.5 2 3.5 4 6.5 5"/></svg>',

  spellcheck: '<svg viewBox="0 0 24 24" class="zt-svg"><path d="M18 2l4 4-13 13H5v-4L18 2zM15 5l4 4M3 21h18"/><path d="M19 13l1.5-1.5M17.5 17.5l2 2" stroke-opacity="0.5"/></svg>',

  tts: '<svg viewBox="0 0 24 24" class="zt-svg"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path class="zt-sound-wave" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',

  extractDoc: '<svg viewBox="0 0 24 24" class="zt-svg"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6M9 9h2"/></svg>',

  send: '<svg viewBox="0 0 24 24" class="zt-svg"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',

  // میکروفون — یک SVG واحد، چهار حالت مورف‌شونده صرفاً با CSS (data-state روی دکمه)
  mic:
    '<svg viewBox="0 0 24 24" class="zt-svg zt-mic-svg">' +
    '<path class="zt-mic-orbit" d="M12 2a10 10 0 0 1 10 10"/>' +
    '<rect class="zt-mic-body" x="9" y="3.5" width="6" height="10" rx="3"/>' +
    '<path class="zt-mic-cradle" d="M5 10.5a7 7 0 0 0 14 0"/>' +
    '<path class="zt-mic-base" d="M12 17.5v3.5M9 21h6"/>' +
    '<g class="zt-mic-bars">' +
    '<line x1="10" y1="7" x2="10" y2="10" class="zt-bar zt-b1"/>' +
    '<line x1="12" y1="5.5" x2="12" y2="11.5" class="zt-bar zt-b2"/>' +
    '<line x1="14" y1="7" x2="14" y2="10" class="zt-bar zt-b3"/>' +
    '</g></svg>'
};

/**
 * هر عنصر داخل root که data-zen-icon="کلید" دارد را با SVG متناظرش پر می‌کند.
 * ایمن برای صدازدن چندباره (اگر svg از قبل هست، دوباره تزریق نمی‌کند).
 */
function mountZenIcons(root) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('[data-zen-icon]').forEach((el) => {
    const key = el.getAttribute('data-zen-icon');
    if (AITreeToolbarIcons[key] && !el.querySelector('svg')) {
      el.insertAdjacentHTML('afterbegin', AITreeToolbarIcons[key]);
    }
  });
}
