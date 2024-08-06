import { useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import { useRecoilValue } from 'recoil';
import {
  appSnackOpenState,
  congAccountConnectedState,
  isDarkThemeState,
} from '@states/app';
import {
  disconnectCongAccount,
  setApiHost,
  setIsOnline,
} from '@services/recoil/app';
import {
  adminRoleState,
  coordinatorRoleState,
  elderLocalRoleState,
  lmmoRoleState,
  publicTalkCoordinatorRoleState,
  publisherRoleState,
  secretaryRoleState,
} from '@states/settings';
import logger from '@services/logger/index';
import worker from '@services/worker/backupWorker';
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
  const elderLocalRole = useRecoilValue(elderLocalRoleState);
  const lmmoRole = useRecoilValue(lmmoRoleState);
  const publicTalkCoordinatorRole = useRecoilValue(
    publicTalkCoordinatorRoleState
  );
  const publisherRole = useRecoilValue(publisherRoleState);
  const secretaryRole = useRecoilValue(secretaryRoleState);
  const weekendEditorRole = coordinatorRole || publicTalkCoordinatorRole;
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
    const loadApi = async () => {
      let apiHost;

      if (import.meta.env.VITE_BACKEND_API) {
        apiHost = import.meta.env.VITE_BACKEND_API;
      } else {
        if (
          import.meta.env.DEV ||
          window.location.host.indexOf('localhost') !== -1
        ) {
          apiHost = 'http://localhost:8000/';
        } else {
          apiHost = 'https://api.organized-app.com/';
        }
      }

      await setApiHost(apiHost);
      worker.postMessage({ field: 'apiHost', value: apiHost });

      logger.info('app', `the client API is set to: ${apiHost}`);
    };

    loadApi();
  }, []);

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
    elderLocalRole,
    lmmoRole,
    publicTalkCoordinatorRole,
    publisherRole,
    secretaryRole,
    isCongAccountConnected,
    weekendEditorRole,
  };
};

export default useGlobal;
