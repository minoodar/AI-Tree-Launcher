document.addEventListener('DOMContentLoaded', () => {
    
    // === فرهنگ لغت دوزبانه ===
    const i18nPopup = {
      en: {
        tabSettings: "Settings", tabBackups: "Backup & Restore",
        lblLanguage: "App Language:", lblBirth: "Birth Year (for Clock Age):",
        btnSave: "Save Settings", btnExport: "📤 Export Backup (JSON)", btnImport: "📥 Import Backup (Restore)",
        toastSaved: "Settings saved successfully!", toastExported: "JSON file downloaded!", toastImported: "Data imported successfully!", toastRestored: "Data restored successfully!",
        invalidFile: "Invalid file format.", errRead: "Error reading JSON file.",
        btnHide: "Hide", btnShow: "Show (Reset)",
        backupHint: "🟢 Export saves bookmarks (incl. News) + notepad prompts &nbsp;·&nbsp; 🟠 Import restores both from a file",
        contactTitle: "✉︎ Contact Us", contactEmail: "Email:",
        holidaysTitle: "Official Public Holidays", holidaysEnable: "Show official holidays on the calendar",
        holidayAuto: "Auto — follow app language", holidayIran: "Iran (offline, curated list)", holidayCustom: "Other country (enter code)",
        holidayHintAuto: "Currently resolves to Iran when the app language is Persian, otherwise a country guessed from your system locale.",
        holidayHintIran: "Uses the built-in offline Iran holiday list — no network request needed.",
        holidayHintCustom: "Enter a 2-letter country code (ISO 3166-1, e.g. US, DE, GB, FR). Fetched from a public international holiday source."
      },
      fa: {
        tabSettings: "تنظیمات اصلی", tabBackups: "بکاپ",
        lblLanguage: "زبان افزونه:", lblBirth: "سال تولد (محاسبه سن):",
        btnSave: "ذخیره تنظیمات", btnExport: "📤 دریافت بکاپ (JSON)", btnImport: "📥 بازیابی از بکاپ",
        toastSaved: "تنظیمات با موفقیت ذخیره شد!", toastExported: "فایل خروجی دانلود شد!", toastImported: "اطلاعات فایل با موفقیت وارد شد!", toastRestored: "بکاپ با موفقیت بازیابی شد!",
        invalidFile: "فایل نامعتبر است.", errRead: "خطا در خواندن فایل JSON.",
        btnHide: "پنهان کردن", btnShow: "نمایش مجدد (ریست)",
        backupHint: "🟢 دریافت بکاپ، بوک‌مارک‌ها (شامل اخبار) و پرامپت‌های دفترچه را ذخیره می‌کند &nbsp;·&nbsp; 🟠 بازیابی، هر دو را از فایل برمی‌گرداند",
        contactTitle: "✉︎ ارتباط با ما", contactEmail: "ایمیل:",
        holidaysTitle: "تعطیلات رسمی", holidaysEnable: "نمایش تعطیلات رسمی روی تقویم",
        holidayAuto: "خودکار — بر اساس زبان افزونه", holidayIran: "ایران (آفلاین، فهرست دقیق)", holidayCustom: "کشور دیگر (کد را وارد کنید)",
        holidayHintAuto: "با انتخاب زبان فارسی روی ایران و در غیر این صورت بر اساس حدس از تنظیمات سیستم عمل می‌کند.",
        holidayHintIran: "از فهرست آفلاین داخلیِ تعطیلات ایران استفاده می‌کند — بدون نیاز به اینترنت.",
        holidayHintCustom: "کد دو حرفی کشور را وارد کنید (مثل US، DE، GB، FR). از یک منبع بین‌المللیِ تعطیلات دریافت می‌شود."
      }
    };

    let currentLang = 'en';

    function applyTranslation() {
      const t = i18nPopup[currentLang];
      document.body.className = currentLang === 'fa' ? 'rtl' : '';
      
      document.getElementById('tab-settings').textContent = t.tabSettings;
      document.getElementById('tab-backups').textContent = t.tabBackups;
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

    chrome.storage.local.get(['showPublicHolidays', 'holidayRegionMode', 'holidayCustomCountry'], (data) => {
      // Default to true if undefined (feature ships enabled by default)
      if (holidaysEnabledCb) holidaysEnabledCb.checked = data.showPublicHolidays !== undefined ? !!data.showPublicHolidays : true;
      if (holidayRegionSelect) holidayRegionSelect.value = data.holidayRegionMode || 'auto';
      if (holidayCustomCountry) holidayCustomCountry.value = data.holidayCustomCountry || '';
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
        const holidayLocalData = {
          showPublicHolidays: holidaysEnabledCb ? !!holidaysEnabledCb.checked : false,
          holidayRegionMode: holidayRegionSelect ? holidayRegionSelect.value : 'auto',
          holidayCustomCountry: holidayCustomCountry ? holidayCustomCountry.value.trim().toUpperCase().slice(0, 2) : ''
        };
        chrome.storage.local.set(holidayLocalData, () => {
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
  
    function countOf(arr) { return Array.isArray(arr) ? arr.length : 0; }

    const PROMPT_KEYS = {
      custom: 'aiTreeCustomPrompts',
      overrides: 'aiTreePromptOverrides',
      hidden: 'aiTreePromptHidden',
      history: 'aiTreePromptHistory'
    };
  
    document.getElementById('exportJsonBtn').addEventListener('click', () => {
      chrome.storage.local.get([
        'linksData', 'linksData2', 'linksData3', 'linksData4',
        PROMPT_KEYS.custom, PROMPT_KEYS.overrides, PROMPT_KEYS.hidden, PROMPT_KEYS.history
      ], (data) => {
        const payload = {
          version: 3,
          exportedAt: new Date().toISOString(),
          main: data.linksData || [],
          w2: data.linksData2 || [],
          w3: data.linksData3 || [],
          w4: data.linksData4 || [],
          prompts: {
            custom: Array.isArray(data[PROMPT_KEYS.custom]) ? data[PROMPT_KEYS.custom] : [],
            overrides: (data[PROMPT_KEYS.overrides] && typeof data[PROMPT_KEYS.overrides] === 'object')
              ? data[PROMPT_KEYS.overrides] : {},
            hidden: Array.isArray(data[PROMPT_KEYS.hidden]) ? data[PROMPT_KEYS.hidden] : [],
            history: Array.isArray(data[PROMPT_KEYS.history]) ? data[PROMPT_KEYS.history] : []
          }
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AITree_Backup_${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(i18nPopup[currentLang].toastExported);
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
          let updateObj = null;

          if (Array.isArray(importedData)) {
            updateObj = { linksData: importedData };
          } else if (importedData && Array.isArray(importedData.main)) {
            updateObj = { linksData: importedData.main };
            if (Array.isArray(importedData.w2)) updateObj.linksData2 = importedData.w2;
            if (Array.isArray(importedData.w3)) updateObj.linksData3 = importedData.w3;
            if (Array.isArray(importedData.w4)) updateObj.linksData4 = importedData.w4;
            else if (Array.isArray(importedData.news)) updateObj.linksData4 = importedData.news;

            const p = importedData.prompts;
            if (p && typeof p === 'object') {
              if (Array.isArray(p.custom)) {
                updateObj[PROMPT_KEYS.custom] = p.custom
                  .filter(item => item && typeof item.title === 'string' && typeof item.text === 'string')
                  .slice(0, 12)
                  .map(item => ({
                    id: item.id || ('c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
                    title: String(item.title).slice(0, 40),
                    text: String(item.text)
                  }));
              }
              if (p.overrides && typeof p.overrides === 'object' && !Array.isArray(p.overrides)) {
                updateObj[PROMPT_KEYS.overrides] = p.overrides;
              }
              if (Array.isArray(p.hidden)) {
                updateObj[PROMPT_KEYS.hidden] = p.hidden.filter(id => typeof id === 'string');
              }
              if (Array.isArray(p.history)) {
                updateObj[PROMPT_KEYS.history] = p.history
                  .filter(h => h && typeof h.text === 'string')
                  .slice(0, 10)
                  .map(h => ({ ts: typeof h.ts === 'number' ? h.ts : Date.now(), text: String(h.text) }));
              }
            }
          }

          if (updateObj) {
            chrome.storage.local.set(updateObj, () => {
              showToast(t.toastImported);
              broadcastRefresh();
              fileInput.value = ''; 
            });
          } else { alert(t.invalidFile); }
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
