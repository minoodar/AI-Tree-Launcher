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
        holidayHintAuto: "Currently resolves to Iran when the app language is Persian, Russia when it's Russian, otherwise a country guessed from your system locale.",
        holidayHintIran: "Uses the built-in offline Iran holiday list — no network request needed.",
        holidayHintCustom: "Enter a 2-letter country code (ISO 3166-1, e.g. US, DE, GB, FR). Fetched from a public international holiday source.",
        quotesTitle: "Daily Wisdom Quotes", religionSource: "Spiritual verse source", poetrySource: "Poetry & literature source",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judaism", religionChristianity: "✝️ Christianity", religionEastern: "☸️ Eastern (Buddhism & Hindu wisdom)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Western Literature",
        vaultLiveSaved: "✓ Saved instantly — no need to press Save",
        btnVoidTab: "⬛ Blank Offline Tab"
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
        holidayHintAuto: "با انتخاب زبان فارسی روی ایران، با انتخاب زبان روسی روی روسیه، و در غیر این صورت بر اساس حدس از تنظیمات سیستم عمل می‌کند.",
        holidayHintIran: "از فهرست آفلاین داخلیِ تعطیلات ایران استفاده می‌کند — بدون نیاز به اینترنت.",
        holidayHintCustom: "کد دو حرفی کشور را وارد کنید (مثل US، DE، GB، FR). از یک منبع بین‌المللیِ تعطیلات دریافت می‌شود.",
        quotesTitle: "فرازهای الهام‌بخش روزانه", religionSource: "منبع فراز مذهبی", poetrySource: "منبع شعر و ادبیات",
        religionIslam: "☪️ اسلام", religionJudaism: "✡️ یهودیت", religionChristianity: "✝️ مسیحیت", religionEastern: "☸️ شرقی (حکمت بودایی و هندو)",
        poetryRumi: "🌙 مولانا", poetryWestern: "🖋️ ادبیات غرب",
        vaultLiveSaved: "✓ همین الان ذخیره شد — نیازی به زدن «ذخیره تنظیمات» نیست",
        btnVoidTab: "⬛ تب خالی آفلاین"
      },
      ar: {
        tabCore: "⚙️ النواة", tabBackup: "🛡️ النسخ الاحتياطي", tabVault: "✨ الخزنة",
        lblLanguage: "لغة الإضافة:", lblBirth: "سنة الميلاد (لحساب العمر):",
        btnSave: "حفظ الإعدادات", btnExport: "📤 تصدير نسخة احتياطية (JSON)", btnImport: "📥 استيراد نسخة احتياطية (استعادة)",
        toastSaved: "تم حفظ الإعدادات بنجاح!", toastExported: "تم تنزيل ملف JSON!", toastImported: "تم استيراد البيانات بنجاح!", toastRestored: "تمت استعادة البيانات بنجاح!",
        invalidFile: "تنسيق الملف غير صالح.", errRead: "خطأ في قراءة ملف JSON.",
        btnHide: "إخفاء", btnShow: "إظهار (إعادة تعيين)",
        backupHint: "🟢 التصدير يحفظ كل شيء — العلامات المرجعية، المهام، أحداث التقويم، الإعدادات، المفكرة &nbsp;·&nbsp; 🟠 الاستيراد يستعيد كل شيء من ملف",
        contactTitle: "✉︎ اتصل بنا", contactEmail: "البريد الإلكتروني:",
        holidaysTitle: "العطلات الرسمية", holidaysEnable: "إظهار العطلات الرسمية على التقويم",
        holidayAuto: "تلقائي — حسب لغة التطبيق", holidayIran: "إيران (بدون إنترنت، قائمة دقيقة)", holidayCustom: "دولة أخرى (أدخل الرمز)",
        holidayHintAuto: "يستخدم إيران حاليًا عندما تكون لغة التطبيق فارسية، وروسيا عندما تكون روسية، وإلا يتم تقدير الدولة بناءً على إعدادات النظام.",
        holidayHintIran: "يستخدم القائمة المدمجة للعطلات الإيرانية بدون إنترنت — لا يحتاج لاتصال.",
        holidayHintCustom: "أدخل رمز الدولة المكون من حرفين (ISO 3166-1، مثل US، DE، GB، FR). يتم جلبه من مصدر دولي عام للعطلات.",
        quotesTitle: "اقتباسات الحكمة اليومية", religionSource: "مصدر الآيات الروحانية", poetrySource: "مصدر الشعر والأدب",
        religionIslam: "☪️ الإسلام", religionJudaism: "✡️ اليهودية", religionChristianity: "✝️ المسيحية", religionEastern: "☸️ الشرق (الحكمة البوذية والهندوسية)",
        poetryRumi: "🌙 جلال الدين الرومي", poetryWestern: "🖋️ الأدب الغربي",
        vaultLiveSaved: "✓ تم الحفظ فوراً — لا حاجة للضغط على «حفظ الإعدادات»",
        btnVoidTab: "⬛ علامة تبويب فارغة دون اتصال"
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
        holidayHintAuto: "Actualmente usa Irán cuando el idioma de la app es persa, Rusia cuando es ruso; en caso contrario, un país estimado según la configuración regional del sistema.",
        holidayHintIran: "Usa la lista interna sin conexión de días festivos de Irán — no requiere red.",
        holidayHintCustom: "Ingresa un código de país de 2 letras (ISO 3166-1, p. ej. US, DE, GB, FR). Se obtiene de una fuente pública internacional de días festivos.",
        quotesTitle: "Citas de sabiduría diaria", religionSource: "Fuente del versículo espiritual", poetrySource: "Fuente de poesía y literatura",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judaísmo", religionChristianity: "✝️ Cristianismo", religionEastern: "☸️ Oriental (sabiduría budista e hindú)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Literatura occidental",
        vaultLiveSaved: "✓ Guardado al instante — no hace falta pulsar «Guardar»",
        btnVoidTab: "⬛ Pestaña sin conexión en blanco"
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
        holidayHintAuto: "Verwendet derzeit den Iran, wenn die App-Sprache Persisch ist, Russland bei Russisch, sonst ein anhand der Systemregion geschätztes Land.",
        holidayHintIran: "Verwendet die integrierte Offline-Liste der iranischen Feiertage — keine Internetverbindung nötig.",
        holidayHintCustom: "Gib einen zweibuchstabigen Ländercode ein (ISO 3166-1, z. B. US, DE, GB, FR). Wird aus einer öffentlichen internationalen Feiertagsquelle abgerufen.",
        quotesTitle: "Tägliche Weisheitszitate", religionSource: "Quelle des spirituellen Verses", poetrySource: "Quelle für Poesie & Literatur",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judentum", religionChristianity: "✝️ Christentum", religionEastern: "☸️ Östlich (buddhistische & hinduistische Weisheit)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Westliche Literatur",
        vaultLiveSaved: "✓ Sofort gespeichert — kein Klick auf „Speichern” nötig",
        btnVoidTab: "⬛ Leere Offline-Registerkarte"
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
        holidayHintAuto: "Utilise actuellement l'Iran lorsque la langue de l'application est le persan, la Russie lorsqu'elle est le russe, sinon un pays estimé d'après les paramètres régionaux du système.",
        holidayHintIran: "Utilise la liste hors ligne intégrée des jours fériés iraniens — aucune connexion requise.",
        holidayHintCustom: "Saisissez un code pays à 2 lettres (ISO 3166-1, p. ex. US, DE, GB, FR). Récupéré depuis une source internationale publique de jours fériés.",
        quotesTitle: "Citations de sagesse quotidiennes", religionSource: "Source du verset spirituel", poetrySource: "Source de poésie et littérature",
        religionIslam: "☪️ Islam", religionJudaism: "✡️ Judaïsme", religionChristianity: "✝️ Christianisme", religionEastern: "☸️ Orientale (sagesse bouddhiste et hindoue)",
        poetryRumi: "🌙 Rûmî", poetryWestern: "🖋️ Littérature occidentale",
        vaultLiveSaved: "✓ Enregistré instantanément — pas besoin de cliquer sur « Enregistrer »",
        btnVoidTab: "⬛ Onglet hors ligne vierge"
      },
      ja: {
        tabCore: "⚙️ 全般", tabBackup: "🛡️ バックアップ", tabVault: "✨ ヴォールト",
        lblLanguage: "アプリの言語:", lblBirth: "生年（時計の年齢表示用）:",
        btnSave: "設定を保存", btnExport: "📤 バックアップを書き出す（JSON）", btnImport: "📥 バックアップを読み込む（復元）",
        toastSaved: "設定を保存しました！", toastExported: "JSONファイルをダウンロードしました！", toastImported: "データを読み込みました！", toastRestored: "データを復元しました！",
        invalidFile: "無効なファイル形式です。", errRead: "JSONファイルの読み込みに失敗しました。",
        btnHide: "非表示", btnShow: "表示する（リセット）",
        backupHint: "🟢 書き出しはすべて保存します — ブックマーク、タスク、カレンダーの予定と記念日、設定、メモ &nbsp;·&nbsp; 🟠 読み込みはファイルからすべて復元します",
        contactTitle: "✉︎ お問い合わせ", contactEmail: "メール:",
        holidaysTitle: "公式の祝日", holidaysEnable: "カレンダーに公式の祝日を表示",
        holidayAuto: "自動 — アプリの言語に従う", holidayIran: "イラン（オフライン、精選リスト）", holidayCustom: "他の国（コードを入力）",
        holidayHintAuto: "アプリの言語がペルシャ語の場合は現在イランを、ロシア語の場合はロシアを使用し、それ以外はシステムの地域設定から推定した国を使用します。",
        holidayHintIran: "内蔵のオフライン・イラン祝日リストを使用します — ネット接続は不要です。",
        holidayHintCustom: "2文字の国コードを入力してください（ISO 3166-1、例：US、DE、GB、FR）。公開の国際祝日ソースから取得します。",
        quotesTitle: "毎日の名言・格言", religionSource: "宗教的な一節のソース", poetrySource: "詩・文学のソース",
        religionIslam: "☪️ イスラム教", religionJudaism: "✡️ ユダヤ教", religionChristianity: "✝️ キリスト教", religionEastern: "☸️ 東洋（仏教・ヒンドゥーの知恵）",
        poetryRumi: "🌙 ルーミー", poetryWestern: "🖋️ 西洋文学",
        vaultLiveSaved: "✓ 即座に保存されました — 「保存」を押す必要はありません",
        btnVoidTab: "⬛ オフラインの空白タブ"
      },
      ru: {
        tabCore: "⚙️ Основное", tabBackup: "🛡️ Резервная копия", tabVault: "✨ Хранилище",
        lblLanguage: "Язык приложения:", lblBirth: "Год рождения (для возраста на часах):",
        btnSave: "Сохранить настройки", btnExport: "📤 Экспорт резервной копии (JSON)", btnImport: "📥 Импорт резервной копии (восстановление)",
        toastSaved: "Настройки успешно сохранены!", toastExported: "Файл JSON скачан!", toastImported: "Данные успешно импортированы!", toastRestored: "Данные успешно восстановлены!",
        invalidFile: "Неверный формат файла.", errRead: "Ошибка при чтении файла JSON.",
        btnHide: "Скрыть", btnShow: "Показать (сбросить)",
        backupHint: "🟢 Экспорт сохраняет всё — закладки, задачи, события и отметки календаря, настройки, блокнот &nbsp;·&nbsp; 🟠 Импорт восстанавливает всё из файла",
        contactTitle: "✉︎ Связаться с нами", contactEmail: "Эл. почта:",
        holidaysTitle: "Официальные праздники", holidaysEnable: "Показывать официальные праздники в календаре",
        holidayAuto: "Авто — по языку приложения", holidayIran: "Иран (офлайн, проверенный список)", holidayCustom: "Другая страна (введите код)",
        holidayHintAuto: "Сейчас использует Иран, если язык приложения персидский, Россию — если русский, иначе страну, определённую по региональным настройкам системы.",
        holidayHintIran: "Использует встроенный офлайн-список иранских праздников — подключение к интернету не требуется.",
        holidayHintCustom: "Введите двухбуквенный код страны (ISO 3166-1, напр. US, DE, GB, FR). Данные берутся из открытого международного источника праздников.",
        quotesTitle: "Ежедневные мудрые цитаты", religionSource: "Источник духовного стиха", poetrySource: "Источник поэзии и литературы",
        religionIslam: "☪️ Ислам", religionJudaism: "✡️ Иудаизм", religionChristianity: "✝️ Христианство", religionEastern: "☸️ Восточная (буддийская и индуистская мудрость)",
        poetryRumi: "🌙 Руми", poetryWestern: "🖋️ Западная литература",
        vaultLiveSaved: "✓ Сохранено мгновенно — нажимать «Сохранить» не нужно",
        btnVoidTab: "⬛ Пустая офлайн-вкладка"
      },
      tr: {
        tabCore: "⚙️ Genel", tabBackup: "🛡️ Yedekleme", tabVault: "✨ Hazine",
        lblLanguage: "Uygulama Dili:", lblBirth: "Doğum Yılı (saat yaşı için):",
        btnSave: "Ayarları Kaydet", btnExport: "📤 Yedeği Dışa Aktar (JSON)", btnImport: "📥 Yedeği İçe Aktar (Geri Yükle)",
        toastSaved: "Ayarlar başarıyla kaydedildi!", toastExported: "JSON dosyası indirildi!", toastImported: "Veriler başarıyla içe aktarıldı!", toastRestored: "Veriler başarıyla geri yüklendi!",
        invalidFile: "Geçersiz dosya biçimi.", errRead: "JSON dosyası okunurken hata oluştu.",
        btnHide: "Gizle", btnShow: "Göster (Sıfırla)",
        backupHint: "🟢 Dışa aktarma her şeyi kaydeder — yer imleri, görevler, takvim etkinlikleri ve özel günler, ayarlar, not defteri &nbsp;·&nbsp; 🟠 İçe aktarma her şeyi bir dosyadan geri yükler",
        contactTitle: "✉︎ Bize Ulaşın", contactEmail: "E-posta:",
        holidaysTitle: "Resmi Tatiller", holidaysEnable: "Takvimde resmi tatilleri göster",
        holidayAuto: "Otomatik — uygulama diline göre", holidayIran: "İran (çevrimdışı, düzenlenmiş liste)", holidayCustom: "Diğer ülke (kod girin)",
        holidayHintAuto: "Uygulama dili Farsça olduğunda İran'ı, Rusça olduğunda Rusya'yı; aksi hâlde sistem bölge ayarınızdan tahmin edilen bir ülkeyi kullanır.",
        holidayHintIran: "Yerleşik çevrimdışı İran tatil listesini kullanır — internet bağlantısı gerekmez.",
        holidayHintCustom: "2 harfli bir ülke kodu girin (ISO 3166-1, ör. US, DE, GB, FR). Genel bir uluslararası tatil kaynağından alınır.",
        quotesTitle: "Günlük Bilgelik Sözleri", religionSource: "Manevi ayet kaynağı", poetrySource: "Şiir ve edebiyat kaynağı",
        religionIslam: "☪️ İslam", religionJudaism: "✡️ Yahudilik", religionChristianity: "✝️ Hristiyanlık", religionEastern: "☸️ Doğu (Budist ve Hindu bilgeliği)",
        poetryRumi: "🌙 Mevlana", poetryWestern: "🖋️ Batı Edebiyatı",
        vaultLiveSaved: "✓ Anında kaydedildi — «Kaydet»e basmaya gerek yok",
        btnVoidTab: "⬛ Boş Çevrimdışı Sekme"
      },
      'zh-Hans': {
        tabCore: "⚙️ 核心", tabBackup: "🛡️ 备份", tabVault: "✨ 宝藏",
        lblLanguage: "应用语言：", lblBirth: "出生年份（用于时钟年龄）：",
        btnSave: "保存设置", btnExport: "📤 导出备份 (JSON)", btnImport: "📥 导入备份（恢复）",
        toastSaved: "设置已成功保存！", toastExported: "JSON 文件已下载！", toastImported: "数据已成功导入！", toastRestored: "备份已成功恢复！",
        invalidFile: "文件格式无效。", errRead: "读取 JSON 文件时出错。",
        btnHide: "隐藏", btnShow: "显示（重置）",
        backupHint: "🟢 导出会保存全部内容——书签、待办事项、日历事件与纪念日、设置、记事本 &nbsp;·&nbsp; 🟠 导入会从文件恢复全部内容",
        contactTitle: "✉︎ 联系我们", contactEmail: "邮箱：",
        holidaysTitle: "法定节假日", holidaysEnable: "在日历上显示法定节假日",
        holidayAuto: "自动——跟随应用语言", holidayIran: "伊朗（离线、精选列表）", holidayCustom: "其他国家（输入代码）",
        holidayHintAuto: "应用语言为波斯语时使用伊朗，为俄语时使用俄罗斯；否则会根据系统区域设置猜测国家。",
        holidayHintIran: "使用内置的离线伊朗节假日列表——无需联网。",
        holidayHintCustom: "输入两位国家代码（ISO 3166-1，例如 US、DE、GB、FR）。数据来自通用的国际节假日源。",
        quotesTitle: "每日箴言", religionSource: "灵性经文来源", poetrySource: "诗歌与文学来源",
        religionIslam: "☪️ 伊斯兰教", religionJudaism: "✡️ 犹太教", religionChristianity: "✝️ 基督教", religionEastern: "☸️ 东方（佛教与印度教智慧）",
        poetryRumi: "🌙 鲁米", poetryWestern: "🖋️ 西方文学",
        vaultLiveSaved: "✓ 已即时保存——无需点击「保存」",
        btnVoidTab: "⬛ 离线空白标签页"
      },
      'zh-Hant': {
        tabCore: "⚙️ 核心", tabBackup: "🛡️ 備份", tabVault: "✨ 寶藏",
        lblLanguage: "應用程式語言：", lblBirth: "出生年份（用於時鐘年齡）：",
        btnSave: "儲存設定", btnExport: "📤 匯出備份 (JSON)", btnImport: "📥 匯入備份（還原）",
        toastSaved: "設定已成功儲存！", toastExported: "JSON 檔案已下載！", toastImported: "資料已成功匯入！", toastRestored: "備份已成功還原！",
        invalidFile: "檔案格式無效。", errRead: "讀取 JSON 檔案時發生錯誤。",
        btnHide: "隱藏", btnShow: "顯示（重置）",
        backupHint: "🟢 匯出會儲存全部內容——書籤、待辦事項、行事曆活動與紀念日、設定、記事本 &nbsp;·&nbsp; 🟠 匯入會從檔案還原全部內容",
        contactTitle: "✉︎ 聯絡我們", contactEmail: "電子郵件：",
        holidaysTitle: "法定假日", holidaysEnable: "在行事曆上顯示法定假日",
        holidayAuto: "自動——跟隨應用程式語言", holidayIran: "伊朗（離線、精選清單）", holidayCustom: "其他國家（輸入代碼）",
        holidayHintAuto: "應用程式語言為波斯語時使用伊朗，為俄語時使用俄羅斯；否則會依系統地區設定猜測國家。",
        holidayHintIran: "使用內建的離線伊朗假日清單——不需要網路連線。",
        holidayHintCustom: "輸入兩位國家代碼（ISO 3166-1，例如 US、DE、GB、FR）。資料來自通用的國際假日來源。",
        quotesTitle: "每日箴言", religionSource: "靈性經文來源", poetrySource: "詩歌與文學來源",
        religionIslam: "☪️ 伊斯蘭教", religionJudaism: "✡️ 猶太教", religionChristianity: "✝️ 基督教", religionEastern: "☸️ 東方（佛教與印度教智慧）",
        poetryRumi: "🌙 魯米", poetryWestern: "🖋️ 西方文學",
        vaultLiveSaved: "✓ 已即時儲存——無需點擊「儲存」",
        btnVoidTab: "⬛ 離線空白標籤頁"
      },
      'pt-BR': {
        tabCore: "⚙️ Principal", tabBackup: "🛡️ Backup", tabVault: "✨ Tesouro",
        lblLanguage: "Idioma do aplicativo:", lblBirth: "Ano de nascimento (para a idade no relógio):",
        btnSave: "Salvar Configurações", btnExport: "📤 Exportar Backup (JSON)", btnImport: "📥 Importar Backup (Restaurar)",
        toastSaved: "Configurações salvas com sucesso!", toastExported: "Arquivo JSON baixado!", toastImported: "Dados importados com sucesso!", toastRestored: "Backup restaurado com sucesso!",
        invalidFile: "Formato de arquivo inválido.", errRead: "Erro ao ler o arquivo JSON.",
        btnHide: "Ocultar", btnShow: "Mostrar (Redefinir)",
        backupHint: "🟢 A exportação salva tudo — favoritos, tarefas, eventos e datas do calendário, configurações, bloco de notas &nbsp;·&nbsp; 🟠 A importação restaura tudo a partir de um arquivo",
        contactTitle: "✉︎ Fale Conosco", contactEmail: "E-mail:",
        holidaysTitle: "Feriados Oficiais", holidaysEnable: "Mostrar feriados oficiais no calendário",
        holidayAuto: "Automático — seguir o idioma do aplicativo", holidayIran: "Irã (offline, lista selecionada)", holidayCustom: "Outro país (digite o código)",
        holidayHintAuto: "Usa o Irã quando o idioma do app é persa, a Rússia quando é russo; caso contrário, tenta adivinhar o país pela configuração regional do sistema.",
        holidayHintIran: "Usa a lista offline embutida de feriados do Irã — não precisa de internet.",
        holidayHintCustom: "Digite um código de país de 2 letras (ISO 3166-1, ex.: US, DE, GB, FR). Os dados vêm de uma fonte internacional geral de feriados.",
        quotesTitle: "Sabedoria Diária", religionSource: "Fonte de versículos espirituais", poetrySource: "Fonte de poesia e literatura",
        religionIslam: "☪️ Islamismo", religionJudaism: "✡️ Judaísmo", religionChristianity: "✝️ Cristianismo", religionEastern: "☸️ Oriental (sabedoria budista e hindu)",
        poetryRumi: "🌙 Rumi", poetryWestern: "🖋️ Literatura Ocidental",
        vaultLiveSaved: "✓ Salvo instantaneamente — não é preciso clicar em Salvar",
        btnVoidTab: "⬛ Aba Vazia Offline"
      }
    };

    let currentLang = 'en';

    function applyTranslation() {
      // اگر زبانی به هر دلیل هنوز دیکشنری کامل ندارد، به انگلیسی برمی‌گردیم — تا
      // پاپ‌آپ هرگز به‌خاطر یک زبان ناقص کرش نکند (شبیه fallback خودِ t() در content.js)
      const t = i18nPopup[currentLang] || i18nPopup.en;
      document.body.className = (currentLang === 'fa' || currentLang === 'ar') ? 'rtl' : '';

      document.getElementById('tab-core').textContent = t.tabCore;
      document.getElementById('tab-backup').textContent = t.tabBackup;
      document.getElementById('tab-vault').textContent = t.tabVault;
      document.getElementById('lbl-language').textContent = t.lblLanguage;
      document.getElementById('lbl-birth').textContent = t.lblBirth;
      document.getElementById('userBirthYear').placeholder = currentLang === 'fa' ? "مثال: 1375 یا 1990" : currentLang === 'ar' ? "مثال: 1990 أو 1375" : currentLang === 'es' ? "p. ej., 1990 o 1375" : currentLang === 'de' ? "z. B. 1990 oder 1375" : currentLang === 'fr' ? "p. ex. 1990 ou 1375" : currentLang === 'ja' ? "例：1990 または 1375" : currentLang === 'ru' ? "напр., 1990 или 1375" : currentLang === 'tr' ? "örn. 1990 veya 1375" : (currentLang === 'zh-Hans' || currentLang === 'zh-Hant') ? "例如：1990" : currentLang === 'pt-BR' ? "ex.: 1990" : "e.g., 1990 or 1375";
      document.getElementById('saveSettingsBtn').textContent = t.btnSave;
      if (document.getElementById('voidTabBtn')) document.getElementById('voidTabBtn').textContent = t.btnVoidTab;
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
            // ماندگار کردن مخفی‌بودن برای همین دامنه، تا در هر زیرصفحه‌ی دیگرِ همان
            // سایت هم (نه فقط همین تب) تا اطلاع ثانوی مخفی بماند.
            let hostname = '';
            try { hostname = new URL(tabs[0].url).hostname; } catch (e) {}
            if (hostname) {
              chrome.storage.local.get(['aiTreeHiddenDomains'], (res) => {
                const list = Array.isArray(res.aiTreeHiddenDomains) ? res.aiTreeHiddenDomains : [];
                if (!list.includes(hostname)) {
                  list.push(hostname);
                  chrome.storage.local.set({ aiTreeHiddenDomains: list });
                }
              });
            }
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
            let hostname = '';
            try { hostname = new URL(tabs[0].url).hostname; } catch (e) {}
            if (hostname) {
              chrome.storage.local.get(['aiTreeHiddenDomains'], (res) => {
                const list = Array.isArray(res.aiTreeHiddenDomains) ? res.aiTreeHiddenDomains : [];
                const next = list.filter(d => d !== hostname);
                if (next.length !== list.length) chrome.storage.local.set({ aiTreeHiddenDomains: next });
              });
            }
            window.close();
          }
        });
      });
    }

    // «تب خالی آفلاین»: وقتی اینترنت نیست، یک تب مشکیِ ساده (بدون هیچ محتوای
    // وبی) باز می‌شود که خودِ افزونه رویش کاملاً کار می‌کند — چون content.js
    // مستقیم به‌عنوان اسکریپت همان صفحه لود می‌شود، نه به‌عنوان content script
    // تزریق‌شده روی یک سایت واقعی.
    // «تب خالی آفلاین»: باز کردن یا سوئیچ به تب موجود (تک‌نسخه‌ای)
    const voidTabBtn = document.getElementById('voidTabBtn');
    if (voidTabBtn) {
      voidTabBtn.addEventListener('click', () => {
        const voidTabUrl = chrome.runtime.getURL('void-tab.html');
        
        // جستجو در تمام تب‌های باز
        chrome.tabs.query({ url: voidTabUrl }, (tabs) => {
          if (tabs && tabs.length > 0) {
            // اگر تب از قبل باز است، به همان منتقل می‌شویم
            const existingTab = tabs[0];
            chrome.tabs.update(existingTab.id, { active: true });
            if (existingTab.windowId) {
              chrome.windows.update(existingTab.windowId, { focused: true });
            }
          } else {
            // اگر باز نیست، تب جدید می‌سازیم
            chrome.tabs.create({ url: voidTabUrl });
          }
          window.close();
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
        'activeNoteAIIndex',
        'webSearchEngine', 'webSearchEngineOverrides', 'webSearchCustomEngines'
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