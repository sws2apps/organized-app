import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { setLastAppDataSync } from '@services/states/app';
import { isTest, LANGUAGE_LIST } from '@constants/index';
import {
  congAccountConnectedState,
  isAppDataSyncingState,
  isOnlineState,
} from '@states/app';
import {
  backupAutoState,
  backupIntervalState,
  JWLangState,
} from '@states/settings';
import { useCurrentUser, useFirebaseAuth } from '@hooks/index';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { setAssignmentsHistory } from '@services/states/schedules';
import { refreshLocalesResources } from '@services/i18n';
import worker from '@services/worker/backupWorker';
import logger from '@services/logger';

const useWebWorker = () => {
  const location = useLocation();

  const { user } = useFirebaseAuth();

  const { isMeetingEditor } = useCurrentUser();

  const setIsAppDataSyncing = useSetAtom(isAppDataSyncingState);

  const isOnline = useAtomValue(isOnlineState);
  const isConnected = useAtomValue(congAccountConnectedState);
  const backupAuto = useAtomValue(backupAutoState);
  const backupInterval = useAtomValue(backupIntervalState);
  const jwLang = useAtomValue(JWLangState);

  const [lastBackup, setLastBackup] = useState('');

  const backupEnabled = isOnline && isConnected && backupAuto;
  const interval = backupInterval * 60 * 1000;

  const sourceLang =
    LANGUAGE_LIST.find((record) => record.code.toUpperCase() === jwLang)
      ?.threeLettersCode || 'eng';

  useEffect(() => {
    if (!isTest && window.Worker) {
      worker.onmessage = async function (event) {
        if (event.data === 'Syncing') {
          setIsAppDataSyncing(true);
        }

        if (event.data === 'Done') {
          setIsAppDataSyncing(false);

          // sync complete -> refresh app data

          await refreshLocalesResources();

          // load assignment history
          const history = schedulesBuildHistoryList();
          setAssignmentsHistory(history);
        }

        if (event.data.error === 'BACKUP_FAILED') {
          setIsAppDataSyncing(false);
          setLastBackup('error');
        }

        if (event.data.lastBackup) {
          setLastBackup(event.data.lastBackup);
        }
      };
    }
  }, [isMeetingEditor, sourceLang, setIsAppDataSyncing]);

  useEffect(() => {
    const runBackupTimer = setInterval(async () => {
      if (location.pathname.includes('/persons')) {
        logger.info('app', 'synchronization paused - persons page open');
        return;
      }

      if (backupEnabled) {
        if (user) {
          const idToken = await user.getIdToken(true);

          if (idToken?.length > 0) {
            worker.postMessage({
              field: 'idToken',
              value: idToken,
            });
          }
        }

        worker.postMessage('startWorker');
      }
    }, interval);

    return () => {
      clearInterval(runBackupTimer);
    };
  }, [backupEnabled, interval, user, location]);

  useEffect(() => {
    const runCheckLastBackup = setInterval(() => {
      let result: string | number = 0;

      if (lastBackup.length === 0 || lastBackup === 'error') {
        result = lastBackup;
      }

      if (lastBackup.length > 0 && lastBackup !== 'error') {
        const lastDate = new Date(lastBackup).getTime();
        const currentDate = new Date().getTime();

        const msDifference = currentDate - lastDate;
        const resultS = Math.floor(msDifference / 1000);
        const resultM = Math.floor(resultS / 60);

        if (resultS <= 30) {
          result = 'now';
        }

        if (resultS > 30 && resultS < 60) {
          result = 'recently';
        }

        if (resultS >= 60) {
          result = resultM;
        }
      }

      setLastAppDataSync(result);
    }, 1000);

    return () => {
      clearInterval(runCheckLastBackup);
    };
  }, [lastBackup]);

  return {};
};

export default useWebWorker;
