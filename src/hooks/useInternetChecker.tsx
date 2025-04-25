import { useCallback, useEffect, useState } from 'react';
import { displaySnackNotification } from '@services/states/app';
import useAppTranslation from './useAppTranslation';
import { IconNoConnection } from '@components/icons';

const useInternetChecker = () => {
  const { t } = useAppTranslation();

  const [isNavigatorOnline, setIsNavigatorOnline] = useState(navigator.onLine);

  const handleSwitchOnline = () => {
    setIsNavigatorOnline(true);
  };

  const handleSwitchOffline = useCallback(async () => {
    setIsNavigatorOnline(false);

    displaySnackNotification({
      header: t('tr_noInternetConnection'),
      message: t('tr_noInternetConnectionDesc'),
      icon: <IconNoConnection color="var(--always-white)" />,
      severity: 'error',
    });
  }, [t]);

  useEffect(() => {
    window.addEventListener('online', handleSwitchOnline);
    window.addEventListener('offline', handleSwitchOffline);

    return () => {
      window.removeEventListener('online', handleSwitchOnline);
      window.removeEventListener('offline', handleSwitchOffline);
    };
  }, [handleSwitchOffline]);

  return { isNavigatorOnline };
};

export default useInternetChecker;
