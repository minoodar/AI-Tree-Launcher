// engine-boot.js — sync last engine mark before paint-heavy work
(function () {
  try {
    var id = localStorage.getItem('aiv:lastEngine');
    if (!id) return;
    var host = document.querySelector('.ai-void-search-brand-mark');
    if (host) host.dataset.engine = id;
  } catch (e) {}
})();
