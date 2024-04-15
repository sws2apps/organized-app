import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { isOnlineState } from '../../states/main';
import { congAccountConnectedState } from '../../states/congregation';
import backupWorkerInstance from '../../workers/backupWorker';

const InternetChecker = () => {
  const setIsOnline = useSetRecoilState(isOnlineState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);

  const setOnline = useCallback(() => {
    setIsOnline(true);
    setCongAccountConnected(false);
    backupWorkerInstance.setIsOnline(true);
  }, [setIsOnline, setCongAccountConnected]);

  const setOffline = useCallback(() => {
    setIsOnline(false);
    backupWorkerInstance.setIsOnline(false);
  }, [setIsOnline]);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
  }, [setOnline, setOffline]);

  return <></>;
};

export default InternetChecker;
