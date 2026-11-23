import { useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import { useAtomValue } from 'jotai';
import {
  appLangState,
  appSnackOpenState,
  colorSchemeState,
  congAccountConnectedState,
  isDarkThemeState,
} from '@states/app';
import { store } from '@states/index';
import { disconnectCongAccount, setIsOnline } from '@services/states/app';
import {
  accountAppLanguageState,
  accountColorSchemeState,
  adminRoleState,
  coordinatorRoleState,
  secretaryRoleState,
} from '@states/settings';
import {
  accountAppearanceSave,
  appColorSchemeApply,
  appLanguageApply,
  isAppLanguage,
  isColorScheme,
} from '@services/app/appearance';
import logger from '@services/logger/index';
import useInternetChecker from '@hooks/useInternetChecker';

// creating theme
const lightTheme = createTheme({ palette: { mode: 'light' } });

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const useGlobal = () => {
  const { isNavigatorOnline } = useInternetChecker();

  const isLight = useAtomValue(isDarkThemeState);
  const appSnackOpen = useAtomValue(appSnackOpenState);
  const adminRole = useAtomValue(adminRoleState);
  const coordinatorRole = useAtomValue(coordinatorRoleState);
  const secretaryRole = useAtomValue(secretaryRoleState);
  const isCongAccountConnected = useAtomValue(congAccountConnectedState);
  const accountLanguage = useAtomValue(accountAppLanguageState);
  const accountColorScheme = useAtomValue(accountColorSchemeState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsOnline(isNavigatorOnline);

    if (!isNavigatorOnline) {
      disconnectCongAccount();
    }
  }, [isNavigatorOnline]);

  useEffect(() => {
    if (accountLanguage === '') {
      accountAppearanceSave('app_language', store.get(appLangState), '');
      return;
    }

    if (!isAppLanguage(accountLanguage)) return;
    if (accountLanguage === store.get(appLangState)) return;

    appLanguageApply(accountLanguage);
  }, [accountLanguage]);

  useEffect(() => {
    if (accountColorScheme === '') {
      accountAppearanceSave('color_scheme', store.get(colorSchemeState), '');
      return;
    }

    if (!isColorScheme(accountColorScheme)) return;
    if (accountColorScheme === store.get(colorSchemeState)) return;

    appColorSchemeApply(accountColorScheme);
  }, [accountColorScheme]);

  useEffect(() => {
    if (isLight) {
      setActiveTheme(lightTheme);
    } else {
      setActiveTheme(darkTheme);
    }
  }, [isLight]);

  useEffect(() => {
    const checkBrowser = () => {
      if (!('Worker' in window)) {
        setIsSupported(false);
        logger.error('app', `Web Worker is not supported in this device`);
        return;
      }

      if (!('crypto' in window)) {
        setIsSupported(false);
        logger.error('app', `Web Crypto is not supported in this device`);
        return;
      }

      if (!crypto.randomUUID || typeof crypto.randomUUID !== 'function') {
        setIsSupported(false);
        logger.error(
          'app',
          `Web Crypto RandomUUID is not supported in this device`
        );
        return;
      }

      if (!indexedDB) {
        setIsSupported(false);
        logger.error('app', `IndexedDb is not supported in this device`);
        return;
      }

      if (!('serviceWorker' in navigator)) {
        setIsSupported(false);
        logger.error('app', `Service Worker is not supported in this device`);
      }
    };

    checkBrowser();
    setIsLoading(false);
  }, []);

  // PWA shortcut redirect: the app uses hash routing (createHashRouter),
  // but manifest shortcut URLs use clean paths for cross-platform compatibility.
  // This script converts clean paths to their hash equivalents before React loads.
  useEffect(() => {
    const p = location.pathname;
    const s = location.search;

    if (p !== '/') {
      location.replace('/#' + p + s);
    } else if (s && !location.hash) {
      location.replace('/#/' + s);
    }
  }, []);

  return {
    isLoading,
    isSupported,
    activeTheme,
    appSnackOpen,
    adminRole,
    coordinatorRole,
    secretaryRole,
    isCongAccountConnected,
  };
};

export default useGlobal;
