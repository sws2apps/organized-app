/**
 * Everything the app needs to know about installing itself.
 *
 * `beforeinstallprompt` is the only way to install without leaving the page,
 * and also the least dependable signal there is: Chromium fires it once per
 * page load, never when the app is already installed, and not at all in
 * Firefox or Safari on the desktop. Relying on it alone leaves the button
 * invisible with nothing to explain why, so it is treated here as an
 * improvement over telling the user where the browser keeps its own command.
 */

type NavigatorWithInstall = Navigator & {
  /** Safari on iOS and iPadOS: true when launched from the home screen */
  standalone?: boolean;
  getInstalledRelatedApps?: () => Promise<unknown[]>;
};

/** How the user installs the app when the browser offers no prompt. */
export type PwaInstallGuide =
  | 'ios-safari'
  | 'ios-other-browser'
  | 'safari-desktop'
  | 'chromium-mobile'
  | 'chromium-desktop'
  | 'unsupported';

const DISPLAY_MODES = [
  'standalone',
  'fullscreen',
  'minimal-ui',
  'window-controls-overlay',
];

const userAgent = () => navigator.userAgent;

/**
 * iPadOS asks for desktop pages and only the touch points give it away. The
 * user agent is read rather than `navigator.platform`, which is deprecated
 * and still answers `MacIntel` on a Mac that is emulating a phone.
 */
export const isIOS = () => {
  const ua = userAgent();

  if (/iPhone|iPad|iPod/i.test(ua)) return true;

  // Chrome on a Mac is a desktop browser, however many touch points it claims
  return (
    /Macintosh/i.test(ua) &&
    !/Chrome\//i.test(ua) &&
    navigator.maxTouchPoints > 1
  );
};

export const isAndroid = () => /Android/i.test(userAgent());

export const isSafari = () =>
  /Safari/i.test(userAgent()) &&
  !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg|OPR|SamsungBrowser/i.test(
    userAgent()
  );

export const isChromium = () =>
  /Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|SamsungBrowser/i.test(userAgent());

/**
 * Whether the page is being displayed as an installed app. This is the only
 * check every browser agrees on, so it comes first everywhere.
 */
export const isRunningStandalone = () => {
  if (typeof window === 'undefined') return false;

  const displayMode =
    typeof window.matchMedia === 'function' &&
    DISPLAY_MODES.some(
      (mode) => window.matchMedia(`(display-mode: ${mode})`).matches
    );

  const iosStandalone = (navigator as NavigatorWithInstall).standalone === true;

  // an Android app wrapping the site opens it through its own scheme
  const trustedWebActivity = document.referrer.startsWith('android-app://');

  return displayMode || iosStandalone || trustedWebActivity;
};

/**
 * Whether this app is installed while the user looks at it in a browser tab.
 * Only Chromium answers this, and only because the manifest points at itself
 * under `related_applications`.
 */
export const isInstalledAsRelatedApp = async () => {
  const nav = navigator as NavigatorWithInstall;

  if (typeof nav.getInstalledRelatedApps !== 'function') return false;

  try {
    const apps = await nav.getInstalledRelatedApps();

    return apps.length > 0;
  } catch {
    return false;
  }
};

/** The steps to show when the browser cannot install the app on its own. */
export const pwaInstallGuide = (): PwaInstallGuide => {
  if (isIOS()) {
    // iOS only lets Safari add an app to the home screen
    return isSafari() ? 'ios-safari' : 'ios-other-browser';
  }

  if (isSafari()) return 'safari-desktop';

  if (isChromium()) {
    return isAndroid() ? 'chromium-mobile' : 'chromium-desktop';
  }

  // Firefox on the desktop installs no web apps at all
  return 'unsupported';
};
