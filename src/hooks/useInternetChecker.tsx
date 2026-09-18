import { useCallback, useEffect, useRef, useState } from 'react';
import {
  displaySnackNotification,
  retryConnectionNow,
} from '@services/states/app';
import useAppTranslation from './useAppTranslation';
import { IconCloudOff } from '@components/icons';
import { store } from '@states/index';
import { offlineConfirmedState } from '@states/app';

const useInternetChecker = () => {
  const { t } = useAppTranslation();

  const [isNavigatorOnline, setIsNavigatorOnline] = useState(navigator.onLine);

  // Phones report network losses that fix themselves: switching between
  // Wi-Fi and mobile data can take from a second to over a minute. A loss
  // shorter than 3 s changes nothing; after 3 s the badge shows Connecting;
  // only a loss that lasts 30 s is announced as offline.
  const quietTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const confirmTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSwitchOnline = useCallback(() => {
    clearTimeout(quietTimer.current);
    clearTimeout(confirmTimer.current);
    setIsNavigatorOnline(true);

    if (store.get(offlineConfirmedState) === 'network') {
      store.set(offlineConfirmedState, '');

      displaySnackNotification({
        header: t('tr_backOnline'),
        message: t('tr_backOnlineDesc'),
        severity: 'success',
      });
    }
  }, [t]);

  const handleSwitchOffline = useCallback(async () => {
    clearTimeout(quietTimer.current);
    clearTimeout(confirmTimer.current);

    quietTimer.current = setTimeout(() => {
      if (!navigator.onLine) setIsNavigatorOnline(false);
    }, 3000);

    confirmTimer.current = setTimeout(() => {
      if (navigator.onLine) return;

      store.set(offlineConfirmedState, 'network');

      displaySnackNotification({
        header: t('tr_noInternetConnection'),
        message: t('tr_noInternetConnectionDesc'),
        icon: <IconCloudOff color="var(--always-white)" />,
        action: { text: t('tr_tryAgain'), onClick: retryConnectionNow },
      });
    }, 30000);
  }, [t]);

  useEffect(() => {
    window.addEventListener('online', handleSwitchOnline);
    window.addEventListener('offline', handleSwitchOffline);

    return () => {
      clearTimeout(quietTimer.current);
      clearTimeout(confirmTimer.current);
      window.removeEventListener('online', handleSwitchOnline);
      window.removeEventListener('offline', handleSwitchOffline);
    };
  }, [handleSwitchOnline, handleSwitchOffline]);

  return { isNavigatorOnline };
};

export default useInternetChecker;
