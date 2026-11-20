import { useCallback, useEffect, useRef, useState } from 'react';
import { displaySnackNotification } from '@services/states/app';
import useAppTranslation from './useAppTranslation';
import { IconNoConnection } from '@components/icons';

const useInternetChecker = () => {
  const { t } = useAppTranslation();

  const [isNavigatorOnline, setIsNavigatorOnline] = useState(navigator.onLine);

  // Phones report very short network losses (switching between Wi-Fi and
  // mobile data, waking up). Only a loss that lasts is treated as offline.
  const offlineTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSwitchOnline = () => {
    clearTimeout(offlineTimer.current);
    setIsNavigatorOnline(true);
  };

  const handleSwitchOffline = useCallback(async () => {
    clearTimeout(offlineTimer.current);

    offlineTimer.current = setTimeout(() => {
      if (navigator.onLine) return;

      setIsNavigatorOnline(false);

      displaySnackNotification({
        header: t('tr_noInternetConnection'),
        message: t('tr_noInternetConnectionDesc'),
        icon: <IconNoConnection color="var(--always-white)" />,
        severity: 'error',
      });
    }, 2000);
  }, [t]);

  useEffect(() => {
    window.addEventListener('online', handleSwitchOnline);
    window.addEventListener('offline', handleSwitchOffline);

    return () => {
      clearTimeout(offlineTimer.current);
      window.removeEventListener('online', handleSwitchOnline);
      window.removeEventListener('offline', handleSwitchOffline);
    };
  }, [handleSwitchOffline]);

  return { isNavigatorOnline };
};

export default useInternetChecker;
