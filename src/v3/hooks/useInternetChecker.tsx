import { useEffect, useState } from 'react';

const useInternetChecker = () => {
  const [isNavigatorOnline, setIsNavigatorOnline] = useState(navigator.onLine);

  const handleSwitchOnline = () => {
    setIsNavigatorOnline(true);
  };

  const handleSwitchOffline = () => {
    setIsNavigatorOnline(false);
  };

  useEffect(() => {
    window.addEventListener('online', handleSwitchOnline);
    window.addEventListener('offline', handleSwitchOffline);

    return () => {
      window.removeEventListener('online', handleSwitchOnline);
      window.removeEventListener('offline', handleSwitchOffline);
    };
  }, []);

  return { isNavigatorOnline };
};

export default useInternetChecker;
