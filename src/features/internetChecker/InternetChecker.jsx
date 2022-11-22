import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { isOnlineState } from '../../states/main';

const InternetChecker = () => {
  const setIsOnline = useSetRecoilState(isOnlineState);

  const setOnline = useCallback(() => {
    setIsOnline(true);
  }, [setIsOnline]);

  const setOffline = useCallback(() => {
    setIsOnline(false);
  }, [setIsOnline]);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
  }, [setOnline, setOffline]);

  return <></>;
};

export default InternetChecker;
