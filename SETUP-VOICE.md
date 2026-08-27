# راه‌اندازی موتور صدا (Whisper / Transformers.js)

## این بار آماده و کامل است
فایل‌های `vendor/` (کتابخانهٔ Transformers.js + باینری‌های WASM موتور
onnxruntime) این‌بار مستقیماً همراه این پکیج تحویل داده شده‌اند — دیگر نیازی
به اجرای `npm install` یا کپی دستی نیست. فقط پوشهٔ `vendor/` رو همراه بقیهٔ
فایل‌ها داخل افزونه بذارید.

## مراحل نصب

1. تمام فایل‌های این پکیج (`manifest.json`, `background.js`, `offscreen.html`,
   `offscreen.js`, `voice-engine.js`, `toolbar-icons.js`, `toolbar-dock.js`,
   `toolbar-zen.css`, `notepad.html`, `content.js`, و پوشهٔ `vendor/`) رو در
   ریشهٔ افزونهٔ خودتون جایگزین/اضافه کنید (هم‌سطح با فایل‌های فعلی).

2. فایل‌هایی که تغییری نکردن رو دست نزنید: `i18n.js`, `calendar-engine.js`,
   `quote-engine.js`, `notepad.js`, `popup.html`, `popup.js`, `styles.css`
   (styles.css فقط دستکاری نشده؛ `toolbar-zen.css` کنارش اضافه می‌شود، جایگزینش نمی‌کند).

3. برید به `chrome://extensions`، مطمئن بشید حالت Developer mode روشنه، و
   دکمهٔ **Reload** (⟳) رو دقیقاً روی کارت این افزونه بزنید — نه فقط رفرش تب.
   این قدم اجباریه چون `background.js` (Service Worker) و `manifest.json`
   تغییر کردن.

4. صفحه‌ای که ویجت روش بازه رو هم رفرش کنید.

## ساختار نهایی افزونه
```
/manifest.json
/background.js
/offscreen.html
/offscreen.js
/voice-engine.js
/toolbar-icons.js
/toolbar-dock.js
/toolbar-zen.css
/content.js
/notepad.html
/notepad.js          ← دست‌نخورده
/i18n.js              ← دست‌نخورده
/calendar-engine.js   ← دست‌نخورده
/quote-engine.js      ← دست‌نخورده
/styles.css           ← دست‌نخورده
/popup.html /popup.js ← دست‌نخورده
/vendor/
    transformers.min.js
    ort-wasm.wasm
    ort-wasm-simd.wasm
    ort-wasm-threaded.wasm
    ort-wasm-simd-threaded.wasm
```

## اولین اجرا
اولین باری که روی دکمهٔ میکروفون بزنید، Chrome یک پرامپت مجوز میکروفون نشون
می‌ده — این پرامپت مربوط به origin خودِ افزونه‌ست، فقط همون یک‌بار پرسیده
می‌شه، نه به‌ازای هر سایتی که ویجت توش بازه. همون لحظه دانلود وزن‌های مدل
`Xenova/whisper-tiny` هم شروع می‌شه (حدود ۴۰ مگابایت، این یکی همیشه از
اینترنت میاد چون داده‌ست نه کد) و در Cache Storage مرورگر ذخیره می‌مونه؛
دفعات بعد آنی و کاملاً آفلاین.

## اگه بازم خطا داد
- **`offscreen_unavailable`**: یعنی `background.js` جدید جایگزین نشده یا
  extension کامل Reload نشده.
- **خطا هنگام رونویسی (نه هنگام شروع ضبط)**: یعنی پوشهٔ `vendor/` سرجاش
  نیست یا اسم فایل‌هاش عوض شده — باید دقیقاً همین ۵ فایل با همین اسم‌ها کنار
  `offscreen.js` باشن.
- **پرامپت مجوز میکروفون اصلاً ظاهر نمی‌شه**: کنسول همون Offscreen Document
  رو چک کنید (`chrome://extensions` → افزونه → "Inspect views: offscreen.html").

## نکات برای فاز بعدی (رابط بصری)
`AITreeVoiceEngine` این متدها را در اختیار می‌گذارد تا دکمهٔ میکروفون در
تولبار به آن وصل شود:
- `AITreeVoiceEngine.toggle()` — شروع/توقف ضبط
- `AITreeVoiceEngine.on('state', cb)` — تغییر بین `idle` / `listening` /
  `processing` / `loading-model` / `error`
- `AITreeVoiceEngine.on('progress', cb)` — درصد دانلود مدل (فقط اولین بار)
- `AITreeVoiceEngine.on('result', cb)` — متن نهایی رونویسی‌شده، آماده برای
  append کردن به `<textarea id="ai-note-text">`
- `AITreeVoiceEngine.on('error', cb)` — پیام خطا (رد مجوز میکروفون، نبود
  پشتیبانی مرورگر، خطای مدل و غیره)
- `AITreeVoiceEngine.isSupported()` — بولی، برای مخفی‌کردن دکمهٔ میکروفون در
  مرورگرهایی که MediaRecorder/getUserMedia ندارند

