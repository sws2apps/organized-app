import { useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import { useAtomValue } from 'jotai';
import {
  appSnackOpenState,
  congAccountConnectedState,
  isDarkThemeState,
} from '@states/app';
import { disconnectCongAccount, setIsOnline } from '@services/states/app';
import {
  adminRoleState,
  coordinatorRoleState,
  secretaryRoleState,
} from '@states/settings';
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
