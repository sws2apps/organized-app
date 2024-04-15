import { useEffect } from 'react';
import worker from '@services/worker/backupWorker';
import { setIsAppDataSyncing, setLastAppDataSync } from '@services/recoil/app';

const useWebWorker = () => {
  useEffect(() => {
    if (window.Worker) {
      worker.onmessage = async function (event) {
        if (event.data === 'Syncing') {
          await setIsAppDataSyncing(true);
        }

        if (event.data === 'Done') {
          await setIsAppDataSyncing(false);
        }

        if (event.data.lastBackup) {
          await setLastAppDataSync(event.data.lastBackup);
        }
      };
    }
  }, []);

  return {};
};

export default useWebWorker;
