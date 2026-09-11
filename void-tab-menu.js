// ============================================================================
// AI Tree Launcher — void-tab.html NTP menu logic
// ----------------------------------------------------------------------------
// این کد قبلاً به‌صورت inline <script> داخل void-tab.html بود؛ CSP افزونه
// (script-src 'self') اجرای اسکریپت inline را کاملاً مسدود می‌کند، پس مثل
// همهٔ اسکریپت‌های دیگر باید در یک فایل جدا باشد و با <script src="..."> لود شود.
// ============================================================================
(function () {
  const menu = document.getElementById('ai-ntp-menu');
  const menuBtn = document.getElementById('ai-ntp-menu-btn');
  const topsitesEl = document.getElementById('ai-ntp-topsites');
  const itemTopsites = document.getElementById('ai-ntp-menu-topsites');
  const itemFocus = document.getElementById('ai-ntp-menu-focus');
  const itemSettings = document.getElementById('ai-ntp-menu-settings');
  const itemStdTab = document.getElementById('ai-ntp-menu-stdtab');

  // برچسب‌ها — از سیستم ترجمهٔ مشترکِ افزونه (i18n.js/content.js که تا اینجا
  // بار شده‌اند) استفاده می‌کنیم؛ اگر به هر دلیلی در دسترس نبود، همان متنِ
  // انگلیسیِ استاتیکِ داخل HTML باقی می‌ماند (fallback امن).
  try {
    if (typeof t === 'function') {
      document.getElementById('ai-ntp-menu-focus-label').textContent = t('ntpMenuFocus') || 'Focus Mode';
      document.getElementById('ai-ntp-menu-topsites-label').textContent = t('ntpMenuTopsites') || 'Frequent Links';
      document.getElementById('ai-ntp-menu-settings-label').textContent = t('ntpMenuSettings') || 'Settings';
      document.getElementById('ai-ntp-menu-stdtab-label').textContent = t('ntpMenuStdTab') || 'Use Standard New Tab';
      if (typeof isRTL === 'function' && typeof currentLang !== 'undefined' && isRTL(currentLang)) {
        document.getElementById('ai-ntp-menu-panel').style.direction = 'rtl';
        document.getElementById('ai-ntp-menu-panel').style.textAlign = 'right';
      }
    }
  } catch (e) {}

  // باز/بسته‌کردنِ کرکره
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) menu.classList.remove('open');
  });

  // ---- حالت تمرکز — فقط برای همین جلسه، ذخیره نمی‌شود (یک نگاهِ موقتِ تمیز) ----
  itemFocus.addEventListener('click', () => {
    const on = document.body.classList.toggle('ai-focus-mode');
    itemFocus.setAttribute('data-on', on ? '1' : '0');
  });

  // ---- نمایش/عدم‌نمایشِ سایت‌های پرکاربرد — این یکی ذخیره می‌شود ----
  function applyTopsitesVisibility(show) {
    topsitesEl.classList.toggle('hidden', !show);
    itemTopsites.setAttribute('data-on', show ? '1' : '0');
  }
  chrome.storage.local.get(['showTopSites'], (res) => {
    applyTopsitesVisibility(res.showTopSites !== false); // پیش‌فرض: روشن
  });
  itemTopsites.addEventListener('click', () => {
    const nowOn = itemTopsites.getAttribute('data-on') !== '1';
    applyTopsitesVisibility(nowOn);
    chrome.storage.local.set({ showTopSites: nowOn });
  });

  // ---- بارگذاری/رندرِ واقعیِ ردیفِ لینک‌های پرکاربرد اکنون کاملاً به عهدهٔ
  // void-tab-topsites.js است (ترکیبِ لینک‌های سنجاق‌شدهٔ قابل‌ویرایش کاربر +
  // پیشنهادهای خودکارِ chrome.topSites با امکانِ حذف/تبدیل)؛ اینجا فقط دکمهٔ
  // نمایش/عدم‌نمایشِ همان ردیف را کنترل می‌کنیم، بدونِ دخالت در محتوایش. ----

  // ---- تنظیمات — همان الگوی fallback‌دارِ قبلی ----
  itemSettings.addEventListener('click', () => {
    try {
      if (chrome.action && chrome.action.openPopup) {
        chrome.action.openPopup().catch(() => {
          window.open(chrome.runtime.getURL('popup.html'), '_blank');
        });
      } else {
        window.open(chrome.runtime.getURL('popup.html'), '_blank');
      }
    } catch (e) {
      window.open(chrome.runtime.getURL('popup.html'), '_blank');
    }
  });

  // ---- «استفاده از تب جدیدِ استاندارد» — همان کلیدِ useDefaultNtp که در
  // popup هم قابل تنظیم است؛ اینجا فقط یک میان‌بُرِ مستقیم است. فعال‌کردنش از
  // همینجا فوراً هم اعمال می‌شود (نه فقط برای دفعهٔ بعد) — با ریدایرکتِ آنی. ----
  itemStdTab.addEventListener('click', () => {
    chrome.storage.local.set({ useDefaultNtp: true }, () => {
      window.location.replace('https://www.google.com');
    });
  });
})();
