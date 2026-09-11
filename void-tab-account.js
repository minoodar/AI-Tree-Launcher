// ============================================================================
// AI Tree Launcher — Void Tab account indicator (top-right quickbar)
// ----------------------------------------------------------------------------
// جایگزینِ ایموجیِ ثابتِ 👤 با یک آواتارِ واقعی: حرفِ اولِ ایمیلِ پروفایلِ
// جاریِ کروم (در صورت وجودِ حساب و مجوزِ "identity")، تا این نشانگر واقعاً
// حسابِ درحال‌استفاده را نشان بدهد، نه فقط یک لینکِ عمومیِ ثابت به
// AccountChooser. اگر پروفایلی در دسترس نباشد (مثلاً پروفایلِ مهمان یا کروم
// بدونِ ورود)، به همان حالتِ قبلی (ایموجیِ خنثی) برمی‌گردد — بدونِ خطا.
// ============================================================================
(function () {
  const btn = document.getElementById('ai-ntp-account');
  if (!btn) return;

  const DEFAULT_TITLE = 'Google account';

  function applyGuestState() {
    btn.textContent = '\uD83D\uDC64'; // 👤
    btn.title = DEFAULT_TITLE;
    btn.removeAttribute('aria-label');
  }

  function applyAccount(email) {
    const initial = (email || '').trim().charAt(0).toUpperCase();
    btn.textContent = '';
    const span = document.createElement('span');
    span.className = 'ai-ntp-avatar';
    span.textContent = initial || '\uD83D\uDC64';
    span.setAttribute('aria-hidden', 'true');
    btn.appendChild(span);
    btn.title = email;
    btn.setAttribute('aria-label', DEFAULT_TITLE + ': ' + email);
  }

  try {
    if (chrome.identity && chrome.identity.getProfileUserInfo) {
      chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, (info) => {
        if (chrome.runtime.lastError || !info || !info.email) { applyGuestState(); return; }
        applyAccount(info.email);
      });
    } else {
      applyGuestState();
    }
  } catch (e) {
    applyGuestState();
  }
})();
