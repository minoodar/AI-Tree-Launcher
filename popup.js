document.addEventListener('DOMContentLoaded', () => {

    const i18nPopup = {
      en: {
        tabCore: "⚙️ Core", tabBackup: "🛡️ Backup", tabVault: "✨ Vault",
        lblLanguage: "App Language:", lblBirth: "Birth Year (for Clock Age):",
        btnSave: "Save Settings", btnExport: "📤 Export Backup (JSON)", btnImport: "📥 Import Backup (Restore)",
        toastSaved: "Settings saved successfully!", toastExported: "JSON file downloaded!", toastImported: "Data imported successfully!", toastRestored: "Data restored successfully!",
        invalidFile: "Invalid file format.", errRead: "Error reading JSON file.",
        btnHide: "Hide", btnShow: "Show (Reset)",
        backupHint: "🟢 Export saves everything — bookmarks, todos, calendar events & marks, settings, notepad &nbsp;·&nbsp; 🟠 Import restores it all from a file",
        contactTitle: "✉︎ Contact Us", contactEmail: "Email:",
        holidaysTitle: "Official Public Holidays", holidaysEnable: "Show official holidays on the calendar",
        holidayAuto: "Auto — follow app language", holidayIran: "Iran (offline, curated list)", holidayCustom: "Other country (enter code)",
        holidayHintAuto: "Currently resolves to Iran when the app language is Persian, otherwise a country guessed from your system locale.",
        holidayHintIran: "Uses the built-in offline Iran holiday list — no network request needed.",
        holidayHintCustom: "Enter a 2-letter country code (ISO 3166-1, e.g. US, DE, GB, FR). Fetched from a public international holiday source.",
        quotesTitle: "Daily Wisdom Quotes", religionSource: "Spiritual verse source", poetrySource: "Poetry & literature source",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judaism", religionChristianity: "✝️ Christianity", religionEastern: "☸️ Eastern (Buddhism & Hindu wisdom)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Western Literature",
        vaultLiveSaved: "✓ Saved instantly — no need to press Save"
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
        poetryRumi: "🌙 مولانا", poetryWestern: "🖋️ ادبیات غرب",
        vaultLiveSaved: "✓ همین الان ذخیره شد — نیازی به زدن «ذخیره تنظیمات» نیست"
      },
      es: {
        tabCore: "⚙️ Principal", tabBackup: "🛡️ Respaldo", tabVault: "✨ Bóveda",
        lblLanguage: "Idioma de la app:", lblBirth: "Año de nacimiento (para la edad del reloj):",
        btnSave: "Guardar ajustes", btnExport: "📤 Exportar respaldo (JSON)", btnImport: "📥 Importar respaldo (Restaurar)",
        toastSaved: "¡Ajustes guardados correctamente!", toastExported: "¡Archivo JSON descargado!", toastImported: "¡Datos importados correctamente!", toastRestored: "¡Datos restaurados correctamente!",
        invalidFile: "Formato de archivo no válido.", errRead: "Error al leer el archivo JSON.",
        btnHide: "Ocultar", btnShow: "Mostrar (Restablecer)",
        backupHint: "🟢 Exportar guarda todo — marcadores, tareas, eventos y días marcados del calendario, ajustes, notas &nbsp;·&nbsp; 🟠 Importar restaura todo desde un archivo",
        contactTitle: "✉︎ Contáctanos", contactEmail: "Correo:",
        holidaysTitle: "Días festivos oficiales", holidaysEnable: "Mostrar días festivos oficiales en el calendario",
        holidayAuto: "Automático — según el idioma de la app", holidayIran: "Irán (sin conexión, lista curada)", holidayCustom: "Otro país (ingresa el código)",
        holidayHintAuto: "Actualmente usa Irán cuando el idioma de la app es persa; en caso contrario, un país estimado según la configuración regional del sistema.",
        holidayHintIran: "Usa la lista interna sin conexión de días festivos de Irán — no requiere red.",
        holidayHintCustom: "Ingresa un código de país de 2 letras (ISO 3166-1, p. ej. US, DE, GB, FR). Se obtiene de una fuente pública internacional de días festivos.",
        quotesTitle: "Citas de sabiduría diaria", religionSource: "Fuente del versículo espiritual", poetrySource: "Fuente de poesía y literatura",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judaísmo", religionChristianity: "✝️ Cristianismo", religionEastern: "☸️ Oriental (sabiduría budista e hindú)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Literatura occidental",
        vaultLiveSaved: "✓ Guardado al instante — no hace falta pulsar «Guardar»"
      },
      de: {
        tabCore: "⚙️ Allgemein", tabBackup: "🛡️ Sicherung", tabVault: "✨ Schatzkammer",
        lblLanguage: "App-Sprache:", lblBirth: "Geburtsjahr (für das Alter der Uhr):",
        btnSave: "Einstellungen speichern", btnExport: "📤 Sicherung exportieren (JSON)", btnImport: "📥 Sicherung importieren (Wiederherstellen)",
        toastSaved: "Einstellungen erfolgreich gespeichert!", toastExported: "JSON-Datei heruntergeladen!", toastImported: "Daten erfolgreich importiert!", toastRestored: "Daten erfolgreich wiederhergestellt!",
        invalidFile: "Ungültiges Dateiformat.", errRead: "Fehler beim Lesen der JSON-Datei.",
        btnHide: "Ausblenden", btnShow: "Anzeigen (Zurücksetzen)",
        backupHint: "🟢 Export sichert alles — Lesezeichen, Aufgaben, Kalendertermine & -markierungen, Einstellungen, Notizen &nbsp;·&nbsp; 🟠 Import stellt alles aus einer Datei wieder her",
        contactTitle: "✉︎ Kontakt", contactEmail: "E-Mail:",
        holidaysTitle: "Offizielle Feiertage", holidaysEnable: "Offizielle Feiertage im Kalender anzeigen",
        holidayAuto: "Automatisch — nach App-Sprache", holidayIran: "Iran (offline, kuratierte Liste)", holidayCustom: "Anderes Land (Code eingeben)",
        holidayHintAuto: "Verwendet derzeit den Iran, wenn die App-Sprache Persisch ist, sonst ein anhand der Systemregion geschätztes Land.",
        holidayHintIran: "Verwendet die integrierte Offline-Liste der iranischen Feiertage — keine Internetverbindung nötig.",
        holidayHintCustom: "Gib einen zweibuchstabigen Ländercode ein (ISO 3166-1, z. B. US, DE, GB, FR). Wird aus einer öffentlichen internationalen Feiertagsquelle abgerufen.",
        quotesTitle: "Tägliche Weisheitszitate", religionSource: "Quelle des spirituellen Verses", poetrySource: "Quelle für Poesie & Literatur",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judentum", religionChristianity: "✝️ Christentum", religionEastern: "☸️ Östlich (buddhistische & hinduistische Weisheit)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Westliche Literatur",
        vaultLiveSaved: "✓ Sofort gespeichert — kein Klick auf „Speichern” nötig"
      },
      fr: {
        tabCore: "⚙️ Général", tabBackup: "🛡️ Sauvegarde", tabVault: "✨ Coffre",
        lblLanguage: "Langue de l'application :", lblBirth: "Année de naissance (pour l'âge de l'horloge) :",
        btnSave: "Enregistrer les paramètres", btnExport: "📤 Exporter la sauvegarde (JSON)", btnImport: "📥 Importer une sauvegarde (Restaurer)",
        toastSaved: "Paramètres enregistrés avec succès !", toastExported: "Fichier JSON téléchargé !", toastImported: "Données importées avec succès !", toastRestored: "Données restaurées avec succès !",
        invalidFile: "Format de fichier invalide.", errRead: "Erreur lors de la lecture du fichier JSON.",
        btnHide: "Masquer", btnShow: "Afficher (Réinitialiser)",
        backupHint: "🟢 L'export sauvegarde tout — favoris, tâches, événements et jours marqués du calendrier, paramètres, notes &nbsp;·&nbsp; 🟠 L'import restaure tout depuis un fichier",
        contactTitle: "✉︎ Nous contacter", contactEmail: "E-mail :",
        holidaysTitle: "Jours fériés officiels", holidaysEnable: "Afficher les jours fériés officiels sur le calendrier",
        holidayAuto: "Automatique — selon la langue de l'application", holidayIran: "Iran (hors ligne, liste sélectionnée)", holidayCustom: "Autre pays (saisir le code)",
        holidayHintAuto: "Utilise actuellement l'Iran lorsque la langue de l'application est le persan, sinon un pays estimé d'après les paramètres régionaux du système.",
        holidayHintIran: "Utilise la liste hors ligne intégrée des jours fériés iraniens — aucune connexion requise.",
        holidayHintCustom: "Saisissez un code pays à 2 lettres (ISO 3166-1, p. ex. US, DE, GB, FR). Récupéré depuis une source internationale publique de jours fériés.",
        quotesTitle: "Citations de sagesse quotidiennes", religionSource: "Source du verset spirituel", poetrySource: "Source de poésie et littérature",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judaïsme", religionChristianity: "✝️ Christianisme", religionEastern: "☸️ Orientale (sagesse bouddhiste et hindoue)",
        poetryRumi: "🌙 Rûmî", poetryWestern: "🖋️ Littérature occidentale",
        vaultLiveSaved: "✓ Enregistré instantanément — pas besoin de cliquer sur « Enregistrer »"
      }
    };

    let currentLang = 'en';

    function applyTranslation() {
      // اگر زبانی به هر دلیل هنوز دیکشنری کامل ندارد، به انگلیسی برمی‌گردیم — تا
      // پاپ‌آپ هرگز به‌خاطر یک زبان ناقص کرش نکند (شبیه fallback خودِ t() در content.js)
      const t = i18nPopup[currentLang] || i18nPopup.en;
      document.body.className = currentLang === 'fa' ? 'rtl' : '';

      document.getElementById('tab-core').textContent = t.tabCore;
      document.getElementById('tab-backup').textContent = t.tabBackup;
      document.getElementById('tab-vault').textContent = t.tabVault;
      document.getElementById('lbl-language').textContent = t.lblLanguage;
      document.getElementById('lbl-birth').textContent = t.lblBirth;
      document.getElementById('userBirthYear').placeholder = currentLang === 'fa' ? "مثال: 1375 یا 1990" : currentLang === 'es' ? "p. ej., 1990 o 1375" : currentLang === 'de' ? "z. B. 1990 oder 1375" : currentLang === 'fr' ? "p. ex. 1990 ou 1375" : "e.g., 1990 or 1375";
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
      const t = i18nPopup[currentLang] || i18nPopup.en;
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

    // منوهای «گنجینه» (Vault) روی تب جدایی از دکمهٔ «ذخیره تنظیمات» (که فقط
    // در تب Core است) نشسته‌اند — قبلاً کاربر باید بعد از تعویض این‌دو، به تب
    // Core برمی‌گشت و آن دکمهٔ دوردست را می‌زد، وگرنه فکر می‌کرد چیزی ذخیره
    // نشده. حالا این دو مستقیماً و آنی روی تغییر ذخیره می‌شوند (content.js از
    // قبل chrome.storage.onChanged را برای همین دو کلید گوش می‌دهد، پس اثرش
    // فوری روی صفحهٔ باز هم دیده می‌شود)، به‌اضافهٔ یک تأییدِ کوچکِ همان‌جا.
    let vaultHintTimer = null;
    function flashVaultLiveHint() {
      const hint = document.getElementById('vault-live-hint');
      if (!hint) return;
      hint.textContent = (i18nPopup[currentLang] || i18nPopup.en).vaultLiveSaved;
      hint.classList.add('show');
      if (vaultHintTimer) clearTimeout(vaultHintTimer);
      vaultHintTimer = setTimeout(() => hint.classList.remove('show'), 1800);
    }
    if (quoteReligionSelect) {
      quoteReligionSelect.addEventListener('change', () => {
        chrome.storage.local.set({ quoteReligionSource: quoteReligionSelect.value }, () => {
          flashVaultLiveHint();
          broadcastRefresh();
        });
      });
    }
    if (quotePoetrySelect) {
      quotePoetrySelect.addEventListener('change', () => {
        chrome.storage.local.set({ quotePoetrySource: quotePoetrySelect.value }, () => {
          flashVaultLiveHint();
          broadcastRefresh();
        });
      });
    }

    // اگر همزمان با باز بودن این پاپ‌آپ، کاربر از همان تب‌های کوچکِ سوییچِ منبع
    // که حالا روی خودِ ویجت (آیهٔ روز / شعر روز) اضافه شده استفاده کند، این دو
    // منو هم باید بدون نیاز به بستن‌وبازکردنِ پاپ‌آپ خودشان را به‌روز کنند.
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.quoteReligionSource && quoteReligionSelect && document.activeElement !== quoteReligionSelect) {
        quoteReligionSelect.value = changes.quoteReligionSource.newValue || 'islam';
      }
      if (changes.quotePoetrySource && quotePoetrySelect && document.activeElement !== quotePoetrySelect) {
        quotePoetrySelect.value = changes.quotePoetrySource.newValue || 'rumi';
      }
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
          showToast((i18nPopup[currentLang] || i18nPopup.en).toastSaved);
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
          showToast((i18nPopup[currentLang] || i18nPopup.en).toastExported);
        });
      });
    });

    const fileInput = document.getElementById('fileInput');
    document.getElementById('importJsonBtn').addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      const t = i18nPopup[currentLang] || i18nPopup.en;
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