document.addEventListener('DOMContentLoaded', () => {

    const i18nPopup = {
      en: {
        tabCore: "⚙️ Core", tabBackup: "🛡️ Backup", tabVault: "✨ Vault",
        lblLanguage: "App Language:", lblBirth: "Birth Year (for Clock Age):",
        btnSave: "Save Settings", btnExport: "📤 Export Backup (JSON)", btnImport: "📥 Import Backup (Restore)",
        toastSaved: "Settings saved successfully!", toastExported: "JSON file downloaded!", toastImported: "Data imported successfully!", toastRestored: "Data restored successfully!",
        invalidFile: "Invalid file format.", errRead: "Error reading JSON file.",
        btnHide: "Hide", btnShow: "Show (Reset)",
        backupHint: "🟢 Export saves everything — bookmarks, todos, calendar events &amp; marks, settings, notepad &nbsp;·&nbsp; 🟠 Import restores it all from a file",
        contactTitle: "✉︎ Contact Us", contactEmail: "Email:",
        holidaysTitle: "Official Public Holidays", holidaysEnable: "Show official holidays on the calendar",
        holidayAuto: "Auto — follow app language", holidayIran: "Iran (offline, curated list)", holidayCustom: "Other country (enter code)",
        holidayHintAuto: "Currently resolves to Iran when the app language is Persian, otherwise a country guessed from your system locale.",
        holidayHintIran: "Uses the built-in offline Iran holiday list — no network request needed.",
        holidayHintCustom: "Enter a 2-letter country code (ISO 3166-1, e.g. US, DE, GB, FR). Fetched from a public international holiday source.",
        quotesTitle: "Daily Wisdom Quotes", religionSource: "Spiritual verse source", poetrySource: "Poetry & literature source",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judaism", religionChristianity: "✝️ Christianity", religionEastern: "☸️ Eastern (Buddhism & Hindu wisdom)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Western Literature"
      },
      fa: {
        tabCore: "⚙️ هسته", tabBackup: "🛡️ پشتیبان", tabVault: "✨ گنجینه",
        lblLanguage: "زبان افزونه:", lblBirth: "سال تولد (محاسبه سن):",
        btnSave: "ذخیره تنظیمات", btnExport: "📤 دریافت بکاپ (JSON)", btnImport: "📥 بازیابی از بکاپ",
        toastSaved: "تنظیمات با موفقیت ذخیره شد!", toastExported: "فایل خروجی دانلود شد!", toastImported: "اطلاعات فایل با موفقیت وارد شد!", toastRestored: "بکاپ با موفقیت بازیابی شد!",
        invalidFile: "فایل نامعتبر است.", errRead: "خطا در خواندن فایل JSON.",
        btnHide: "پنهان کردن", btnShow: "نمایش مجدد (ریست)",
        backupHint: "🟢 دریافت بکاپ، همه‌چیز را ذخیره می‌کند — بوک‌مارک‌ها، کارها، رویدادها و مناسبت‌های تقویم، تنظیمات، دفترچه &nbsp;·&nbsp; 🟠 بازیابی، همه را از فایل برمی‌گرداند",
        contactTitle: "✉︎ ارتباط با ما", contactEmail: "ایمیل:",
        holidaysTitle: "تعطیلات رسمی", holidaysEnable: "نمایش تعطیلات رسمی روی تقویم",
        holidayAuto: "خودکار — بر اساس زبان افزونه", holidayIran: "ایران (آفلاین، فهرست دقیق)", holidayCustom: "کشور دیگر (کد را وارد کنید)",
        holidayHintAuto: "با انتخاب زبان فارسی روی ایران و در غیر این صورت بر اساس حدس از تنظیمات سیستم عمل می‌کند.",
        holidayHintIran: "از فهرست آفلاین داخلیِ تعطیلات ایران استفاده می‌کند — بدون نیاز به اینترنت.",
        holidayHintCustom: "کد دو حرفی کشور را وارد کنید (مثل US، DE، GB، FR). از یک منبع بین‌المللیِ تعطیلات دریافت می‌شود.",
        quotesTitle: "فرازهای الهام‌بخش روزانه", religionSource: "منبع فراز مذهبی", poetrySource: "منبع شعر و ادبیات",
        religionIslam: "☪️ اسلام", religionJudaism: "✡️ یهودیت", religionChristianity: "✝️ مسیحیت", religionEastern: "☸️ شرقی (حکمت بودایی و هندو)",
        poetryRumi: "🌙 مولانا", poetryWestern: "🖋️ ادبیات غرب"
      }
    };

    let currentLang = 'en';

    function applyTranslation() {
      const t = i18nPopup[currentLang];
      document.body.className = currentLang === 'fa' ? 'rtl' : '';

      document.getElementById('tab-core').textContent = t.tabCore;
      document.getElementById('tab-backup').textContent = t.tabBackup;
      document.getElementById('tab-vault').textContent = t.tabVault;
      document.getElementById('lbl-language').textContent = t.lblLanguage;
      document.getElementById('lbl-birth').textContent = t.lblBirth;
      document.getElementById('userBirthYear').placeholder = currentLang === 'fa' ? "مثال: 1375 یا 1990" : "e.g., 1990 or 1375";
      document.getElementById('saveSettingsBtn').textContent = t.btnSave;
      document.getElementById('exportJsonBtn').textContent = t.btnExport;
      document.getElementById('importJsonBtn').textContent = t.btnImport;

      const hideBtn = document.getElementById('hideOnPageBtn');
      if (hideBtn) hideBtn.textContent = t.btnHide;

      const showBtn = document.getElementById('showOnPageBtn');
      if (showBtn) showBtn.textContent = t.btnShow;

      const backupHint = document.getElementById('backup-hint');
      if (backupHint) backupHint.innerHTML = t.backupHint;

      const contactTitle = document.getElementById('lbl-contact-title');
      if (contactTitle) contactTitle.textContent = t.contactTitle;

      const contactEmail = document.getElementById('lbl-contact-email');
      if (contactEmail) contactEmail.textContent = t.contactEmail;

      const hTitle = document.getElementById('lbl-holidays-title');
      if (hTitle) hTitle.textContent = t.holidaysTitle;
      const hEnable = document.getElementById('lbl-holidays-enable');
      if (hEnable) hEnable.textContent = t.holidaysEnable;
      const optAuto = document.getElementById('opt-holiday-auto');
      if (optAuto) optAuto.textContent = t.holidayAuto;
      const optIran = document.getElementById('opt-holiday-ir');
      if (optIran) optIran.textContent = t.holidayIran;
      const optCustom = document.getElementById('opt-holiday-custom');
      if (optCustom) optCustom.textContent = t.holidayCustom;
      updateHolidayRegionHint();

      const qTitle = document.getElementById('lbl-quotes-title');
      if (qTitle) qTitle.textContent = t.quotesTitle;
      const rLbl = document.getElementById('lbl-religion-source');
      if (rLbl) rLbl.textContent = t.religionSource;
      const pLbl = document.getElementById('lbl-poetry-source');
      if (pLbl) pLbl.textContent = t.poetrySource;

      const optIslam = document.getElementById('opt-religion-islam');
      if (optIslam) optIslam.textContent = t.religionIslam;
      const optJudaism = document.getElementById('opt-religion-judaism');
      if (optJudaism) optJudaism.textContent = t.religionJudaism;
      const optChristianity = document.getElementById('opt-religion-christianity');
      if (optChristianity) optChristianity.textContent = t.religionChristianity;
      const optEastern = document.getElementById('opt-religion-eastern');
      if (optEastern) optEastern.textContent = t.religionEastern;

      const optRumi = document.getElementById('opt-poetry-rumi');
      if (optRumi) optRumi.textContent = t.poetryRumi;
      const optWestern = document.getElementById('opt-poetry-western');
      if (optWestern) optWestern.textContent = t.poetryWestern;
    }

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
      });
    });

    const userBirthYearInput = document.getElementById('userBirthYear');
    const langSelect = document.getElementById('appLanguage');
    const holidaysEnabledCb = document.getElementById('holidaysEnabledCb');
    const holidayRegionSelect = document.getElementById('holidayRegionSelect');
    const holidayCustomCountry = document.getElementById('holidayCustomCountry');
    const quoteReligionSelect = document.getElementById('quoteReligionSelect');
    const quotePoetrySelect = document.getElementById('quotePoetrySelect');

    function updateHolidayRegionHint() {
      const hint = document.getElementById('holiday-region-hint');
      if (!hint) return;
      const t = i18nPopup[currentLang];
      const mode = holidayRegionSelect ? holidayRegionSelect.value : 'auto';
      hint.textContent = mode === 'IR' ? t.holidayHintIran : (mode === 'custom' ? t.holidayHintCustom : t.holidayHintAuto);
    }

    function syncHolidayCustomVisibility() {
      if (!holidayRegionSelect || !holidayCustomCountry) return;
      holidayCustomCountry.style.display = holidayRegionSelect.value === 'custom' ? 'block' : 'none';
    }

    if (holidayRegionSelect) {
      holidayRegionSelect.addEventListener('change', () => {
        syncHolidayCustomVisibility();
        updateHolidayRegionHint();
      });
    }

    chrome.storage.sync.get(['userBirthYear', 'appLanguage'], (data) => {
      if (data.appLanguage) { currentLang = data.appLanguage; langSelect.value = currentLang; }
      if (data.userBirthYear) userBirthYearInput.value = data.userBirthYear;
      applyTranslation();
    });

    chrome.storage.local.get(['showPublicHolidays', 'holidayRegionMode', 'holidayCustomCountry', 'quoteReligionSource', 'quotePoetrySource', 'voiceRecognitionLang'], (data) => {
      if (holidaysEnabledCb) holidaysEnabledCb.checked = data.showPublicHolidays !== undefined ? !!data.showPublicHolidays : true;
      if (holidayRegionSelect) holidayRegionSelect.value = data.holidayRegionMode || 'auto';
      if (holidayCustomCountry) holidayCustomCountry.value = data.holidayCustomCountry || '';
      if (quoteReligionSelect) quoteReligionSelect.value = data.quoteReligionSource || 'islam';
      if (quotePoetrySelect) quotePoetrySelect.value = data.quotePoetrySource || 'rumi';
      // منوی زبان میکروفون حذف شد چون تشخیص خودکار Whisper همیشه به‌صورت
      // پیش‌فرض فعال است و نیازی به تنظیم دستی ندارد. اگر قبلاً مقداری دستی
      // (مثلاً از تست‌های قبلی) ذخیره شده بود، همین یک‌بار پاکش می‌کنیم تا
      // رفتار واقعاً به‌طور کامل به auto-detect برگردد.
      if (data.voiceRecognitionLang) {
        chrome.storage.local.remove('voiceRecognitionLang');
      }
      syncHolidayCustomVisibility();
      updateHolidayRegionHint();
    });

    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      applyTranslation();
    });

    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
      const newData = {
        appLanguage: langSelect.value,
        userBirthYear: userBirthYearInput.value
      };
      chrome.storage.sync.set(newData, () => {
        const localData = {
          showPublicHolidays: holidaysEnabledCb ? !!holidaysEnabledCb.checked : false,
          holidayRegionMode: holidayRegionSelect ? holidayRegionSelect.value : 'auto',
          holidayCustomCountry: holidayCustomCountry ? holidayCustomCountry.value.trim().toUpperCase().slice(0, 2) : '',
          quoteReligionSource: quoteReligionSelect ? quoteReligionSelect.value : 'islam',
          quotePoetrySource: quotePoetrySelect ? quotePoetrySelect.value : 'rumi'
        };
        chrome.storage.local.set(localData, () => {
          showToast(i18nPopup[currentLang].toastSaved);
          broadcastRefresh();
        });
      });
    });

    const hideOnPageBtn = document.getElementById('hideOnPageBtn');
    if (hideOnPageBtn) {
      hideOnPageBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "hideLauncherAnly" }).catch(() => {});
            window.close();
          }
        });
      });
    }

    const showOnPageBtn = document.getElementById('showOnPageBtn');
    if (showOnPageBtn) {
      showOnPageBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "resetFloatingMenuPositionAnly" }).catch(() => {});
            window.close();
          }
        });
      });
    }

    const PROMPT_KEYS = {
      custom: 'aiTreeCustomPrompts',
      overrides: 'aiTreePromptOverrides',
      hidden: 'aiTreePromptHidden',
      history: 'aiTreePromptHistory'
    };

    const STORAGE_KEYS = {
      local: [
        'linksData', 'linksData2', 'linksData3', 'linksData4',
        PROMPT_KEYS.custom, PROMPT_KEYS.overrides, PROMPT_KEYS.hidden, PROMPT_KEYS.history,
        'aiTreeTimeEvents',
        'aiTreeEmojiMemory', 'aiTreeNotepadHistory',
        'showPublicHolidays', 'holidayRegionMode', 'holidayCustomCountry',
        'quoteReligionSource', 'quotePoetrySource',
        'noteTextAlign', 'noteFontSize',
        'activeNoteAIIndex'
      ],
      sync: [
        'aiTreeTodos', 'aiTreeMarkedDays',
        'appLanguage', 'userBirthYear', 'nodeSpacing',
        'clockCustomX', 'clockCustomY', 'orbitX', 'orbitY',
        'coreAIConfig'
      ]
    };

    function pad2(n) { return String(n).padStart(2, '0'); }

    document.getElementById('exportJsonBtn').addEventListener('click', () => {
      chrome.storage.local.get(STORAGE_KEYS.local, (localData) => {
        chrome.storage.sync.get(STORAGE_KEYS.sync, (syncData) => {
          const payload = {
            version: 4,
            exportedAt: new Date().toISOString(),
            local: localData,
            sync: syncData
          };

          const now = new Date();
          const dateStr = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
          const timeStr = `${pad2(now.getHours())}-${pad2(now.getMinutes())}-${pad2(now.getSeconds())}`;
          const filename = `AITree_Backup_${dateStr}_${timeStr}.json`;

          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
          showToast(i18nPopup[currentLang].toastExported);
        });
      });
    });

    const fileInput = document.getElementById('fileInput');
    document.getElementById('importJsonBtn').addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      const t = i18nPopup[currentLang];
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          let localUpdates = null;
          let syncUpdates = {};

          if (importedData && importedData.version >= 4 && importedData.local && typeof importedData.local === 'object') {
            localUpdates = importedData.local;
            syncUpdates = (importedData.sync && typeof importedData.sync === 'object') ? importedData.sync : {};
          } else if (Array.isArray(importedData)) {
            localUpdates = { linksData: importedData };
          } else if (importedData && Array.isArray(importedData.main)) {
            localUpdates = { linksData: importedData.main };
            if (Array.isArray(importedData.w2)) localUpdates.linksData2 = importedData.w2;
            if (Array.isArray(importedData.w3)) localUpdates.linksData3 = importedData.w3;
            if (Array.isArray(importedData.w4)) localUpdates.linksData4 = importedData.w4;
            else if (Array.isArray(importedData.news)) localUpdates.linksData4 = importedData.news;

            const p = importedData.prompts;
            if (p && typeof p === 'object') {
              if (Array.isArray(p.custom)) {
                localUpdates[PROMPT_KEYS.custom] = p.custom
                  .filter(item => item && typeof item.title === 'string' && typeof item.text === 'string')
                  .slice(0, 300)
                  .map(item => ({
                    id: item.id || ('c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
                    title: String(item.title).slice(0, 40),
                    text: String(item.text),
                    category: typeof item.category === 'string' ? item.category : 'general'
                  }));
              }
              if (p.overrides && typeof p.overrides === 'object' && !Array.isArray(p.overrides)) {
                localUpdates[PROMPT_KEYS.overrides] = p.overrides;
              }
              if (Array.isArray(p.hidden)) {
                localUpdates[PROMPT_KEYS.hidden] = p.hidden.filter(id => typeof id === 'string');
              }
              if (Array.isArray(p.history)) {
                localUpdates[PROMPT_KEYS.history] = p.history
                  .filter(h => h && typeof h.text === 'string')
                  .slice(0, 10)
                  .map(h => ({ ts: typeof h.ts === 'number' ? h.ts : Date.now(), text: String(h.text) }));
              }
            }
          }

          if (!localUpdates) { alert(t.invalidFile); return; }

          chrome.storage.local.set(localUpdates, () => {
            const finalize = () => {
              showToast(t.toastImported);
              broadcastRefresh();
              fileInput.value = '';
            };
            if (Object.keys(syncUpdates).length > 0) {
              chrome.storage.sync.set(syncUpdates, finalize);
            } else {
              finalize();
            }
          });
        } catch (err) { alert(t.errRead); }
      };
      reader.readAsText(file);
    });

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function broadcastRefresh() {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: "refreshSpiralUI" }).catch(() => {});
        });
      });
    }
});
