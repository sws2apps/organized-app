import { useRecoilValue } from 'recoil';
import { congAccountConnectedState, isAppDataSyncingState } from '@states/app';
import { setIsAppDataSyncing } from '@services/recoil/app';
import { delay } from '@utils/dev';
import { useEffect } from 'react';

const useAssignments = () => {
  const isSyncing = useRecoilValue(isAppDataSyncingState);
  const isConnected = useRecoilValue(congAccountConnectedState);

  const handleManualRefresh = async () => {
    try {
      await setIsAppDataSyncing(true);

      await delay(5000);

      await setIsAppDataSyncing(false);
    } catch (err) {
      await setIsAppDataSyncing(false);
    }
  };

  useEffect(() => {
    if (isSyncing) {
      const svgIcon = document.querySelector<SVGElement>('#organized-icon-sync');
      svgIcon.style.animation = 'rotate 2s linear infinite';
    }
  }, [isSyncing]);

  useEffect(() => {
    if (!isSyncing && isConnected) {
      const svgIcon = document.querySelector<SVGElement>('#organized-icon-sync');
      if (svgIcon) svgIcon.style.animation = '';
    }
  }, [isSyncing, isConnected]);

  return { isSyncing, handleManualRefresh, isConnected };
};

export default useAssignments;
