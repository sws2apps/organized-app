import { useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import { useRecoilValue } from 'recoil';
import {
  appSnackOpenState,
  congAccountConnectedState,
  isDarkThemeState,
} from '@states/app';
import { disconnectCongAccount, setIsOnline } from '@services/recoil/app';
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

  const isLight = useRecoilValue(isDarkThemeState);
  const appSnackOpen = useRecoilValue(appSnackOpenState);
  const adminRole = useRecoilValue(adminRoleState);
  const coordinatorRole = useRecoilValue(coordinatorRoleState);
  const secretaryRole = useRecoilValue(secretaryRoleState);
  const isCongAccountConnected = useRecoilValue(congAccountConnectedState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const updateNetworkStatus = async () => {
      await setIsOnline(isNavigatorOnline);

      if (!isNavigatorOnline) {
        await disconnectCongAccount();
      }
    };

    updateNetworkStatus();
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
