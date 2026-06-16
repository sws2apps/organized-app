export {};

declare global {
  // Set by the inline script in index.html to capture beforeinstallprompt
  // before React hydrates.
  // eslint-disable-next-line no-var
  var deferredPrompt: Event | undefined;
}
