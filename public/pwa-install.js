/**
 * Catches the browser's install prompt before the app is running.
 *
 * Chromium fires `beforeinstallprompt` as soon as it decides the app can be
 * installed, which for a returning visitor - one whose service worker is
 * already in place - happens well before React mounts and adds its own
 * listener. The event is never fired twice, so whatever misses it loses the
 * prompt for the whole visit.
 *
 * This lives in its own file rather than inline in the document, because the
 * app is served with a strict `script-src 'self'` policy.
 */
(function () {
  window.deferredInstallPrompt = null;

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    window.deferredInstallPrompt = event;
  });

  window.addEventListener('appinstalled', function () {
    window.deferredInstallPrompt = null;
  });
})();
