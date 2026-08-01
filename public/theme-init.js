/**
 * Applies the saved theme before first paint (no flash). Must run as an
 * external, same-origin file — the site's CSP (vercel.json) has no
 * 'unsafe-inline' or nonce for script-src, so an inline <script> here would
 * be silently blocked and the saved preference would never be restored.
 */
(function () {
  try {
    var t = localStorage.getItem('forge-vault-theme');
    document.documentElement.dataset.theme = t === 'light' ? 'light' : 'dark';
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
