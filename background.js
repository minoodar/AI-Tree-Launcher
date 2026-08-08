// AI Tree Launcher — background service worker (MV3)
// Two jobs:
// 1) Open the standalone notepad page in a new browser tab, remembering which
//    tab/window asked for it (so the notepad can offer a "back to widget" button).
// 2) On request, refocus that original tab/window and close the notepad tab.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action === 'openNotepadTab') {
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
    return true; // keep the message channel open for the async sendResponse above
  }

  if (message && message.action === 'returnToParentTab') {
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
      } catch (e) {
        // Original tab/window no longer exists — nothing to focus, still close the notepad tab.
      }
      if (notepadTabId != null) {
        try { await chrome.tabs.remove(notepadTabId); } catch (e) {}
      }
      sendResponse({ ok: true, focused });
    })();
    return true;
  }
});
