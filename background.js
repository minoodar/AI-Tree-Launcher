// AI Tree Launcher — background service worker (MV3)
// 1) Open standalone notepad tab (with return-to-widget context)
// 2) Refocus parent tab and close notepad tab
// 3) Inline translation (CSP-safe for content scripts + notepad)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) return;

  if (message.action === 'openNotepadTab') {
    const fromTabId = sender.tab && typeof sender.tab.id === 'number' ? sender.tab.id : null;
    const fromWindowId = sender.tab && typeof sender.tab.windowId === 'number' ? sender.tab.windowId : null;
    let url = chrome.runtime.getURL('notepad.html');
    if (fromTabId != null) {
      const qp = new URLSearchParams();
      qp.set('fromTab', String(fromTabId));
      if (fromWindowId != null) qp.set('fromWindow', String(fromWindowId));
      url += '?' + qp.toString();
    }
    chrome.tabs.create({ url })
      .then((tab) => sendResponse({ ok: true, tabId: tab && tab.id }))
      .catch((err) => sendResponse({ ok: false, error: String(err && err.message || err) }));
    return true;
  }

  if (message.action === 'returnToParentTab') {
    const targetTabId = Number(message.tabId);
    const targetWindowId = message.windowId != null ? Number(message.windowId) : null;
    const notepadTabId = sender.tab && typeof sender.tab.id === 'number' ? sender.tab.id : null;

    (async () => {
      let focused = false;
      try {
        if (!Number.isNaN(targetTabId)) {
          if (targetWindowId != null && !Number.isNaN(targetWindowId)) {
            await chrome.windows.update(targetWindowId, { focused: true });
          }
          await chrome.tabs.update(targetTabId, { active: true });
          focused = true;
        }
      } catch (e) {}
      if (notepadTabId != null) {
        try { await chrome.tabs.remove(notepadTabId); } catch (e) {}
      }
      sendResponse({ ok: true, focused });
    })();
    return true;
  }

  if (message.action === 'translateText') {
    const targetLang = String(message.targetLang || 'en').slice(0, 8);
    const text = String(message.text || '');
    if (!text) {
      sendResponse({ success: false, error: 'empty' });
      return;
    }
    if (text.length > 4500) {
      sendResponse({ success: false, error: 'too_long' });
      return;
    }

    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
      encodeURIComponent(targetLang) +
      '&dt=t&q=' +
      encodeURIComponent(text);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        let translatedText = '';
        if (Array.isArray(data) && Array.isArray(data[0])) {
          data[0].forEach((item) => {
            if (item && item[0]) translatedText += item[0];
          });
        }
        if (!translatedText) throw new Error('empty_translation');
        sendResponse({ success: true, text: translatedText });
      })
      .catch((error) => {
        sendResponse({ success: false, error: String((error && error.message) || error) });
      });

    return true;
  }

  if (message.action === 'checkSpelling') {
    const text = String(message.text || '');
    if (!text) {
      sendResponse({ success: false, error: 'empty' });
      return;
    }
    // LanguageTool public API soft limit; keep payload modest
    if (text.length > 20000) {
      sendResponse({ success: false, error: 'too_long' });
      return;
    }
    const lang = String(message.lang || 'auto').slice(0, 16);

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('language', lang);

    fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        const matches = (data && Array.isArray(data.matches)) ? data.matches : [];
        sendResponse({ success: true, matches: matches });
      })
      .catch((error) => {
        sendResponse({ success: false, error: String((error && error.message) || error) });
      });

    return true;
  }
});
