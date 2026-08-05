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
        backupHint: "🟢 Export saves bookmarks + notepad prompts &nbsp;·&nbsp; 🟠 Import restores both from a file",
        contactTitle: "✉︎ Contact Us", contactEmail: "Email:"
      },
      fa: {
        tabSettings: "تنظیمات اصلی", tabBackups: "بکاپ",
        lblLanguage: "زبان افزونه:", lblBirth: "سال تولد (محاسبه سن):",
        btnSave: "ذخیره تنظیمات", btnExport: "📤 دریافت بکاپ (JSON)", btnImport: "📥 بازیابی از بکاپ",
        toastSaved: "تنظیمات با موفقیت ذخیره شد!", toastExported: "فایل خروجی دانلود شد!", toastImported: "اطلاعات فایل با موفقیت وارد شد!", toastRestored: "بکاپ با موفقیت بازیابی شد!",
        invalidFile: "فایل نامعتبر است.", errRead: "خطا در خواندن فایل JSON.",
        btnHide: "پنهان کردن", btnShow: "نمایش مجدد (ریست)",
        backupHint: "🟢 دریافت بکاپ، بوک‌مارک‌ها و پرامپت‌های دفترچه را ذخیره می‌کند &nbsp;·&nbsp; 🟠 بازیابی، هر دو را از فایل برمی‌گرداند",
        contactTitle: "✉︎ ارتباط با ما", contactEmail: "ایمیل:"
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
  
    chrome.storage.sync.get(['userBirthYear', 'appLanguage'], (data) => {
      if (data.appLanguage) { currentLang = data.appLanguage; langSelect.value = currentLang; }
      if (data.userBirthYear) userBirthYearInput.value = data.userBirthYear;
      applyTranslation();
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
        showToast(i18nPopup[currentLang].toastSaved);
        broadcastRefresh(); 
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

    // کلیدهای پرامپت دفترچه (هم‌نام با content.js)
    const PROMPT_KEYS = {
      custom: 'aiTreeCustomPrompts',
      overrides: 'aiTreePromptOverrides',
      hidden: 'aiTreePromptHidden',
      history: 'aiTreePromptHistory'
    };
  
    document.getElementById('exportJsonBtn').addEventListener('click', () => {
      chrome.storage.local.get([
        'linksData', 'linksData2', 'linksData3',
        PROMPT_KEYS.custom, PROMPT_KEYS.overrides, PROMPT_KEYS.hidden, PROMPT_KEYS.history
      ], (data) => {
        const payload = {
          version: 2,
          exportedAt: new Date().toISOString(),
          main: data.linksData || [],
          w2: data.linksData2 || [],
          w3: data.linksData3 || [],
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

          // فرمت قدیمی: آرایهٔ خام بوک‌مارک
          if (Array.isArray(importedData)) {
            updateObj = { linksData: importedData };
          }
          // فرمت object با main (نسخه ۱ یا ۲)
          else if (importedData && Array.isArray(importedData.main)) {
            updateObj = { linksData: importedData.main };
            if (Array.isArray(importedData.w2)) updateObj.linksData2 = importedData.w2;
            if (Array.isArray(importedData.w3)) updateObj.linksData3 = importedData.w3;

            // پرامپت‌ها (نسخه ۲ یا هر فایلی که فیلد prompts داشته باشد)
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
