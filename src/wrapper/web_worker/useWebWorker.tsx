import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { setIsAppDataSyncing, setLastAppDataSync } from '@services/recoil/app';
import { isTest, LANGUAGE_LIST } from '@constants/index';
import { congAccountConnectedState, isOnlineState } from '@states/app';
import {
  backupAutoState,
  backupIntervalState,
  JWLangState,
} from '@states/settings';
import { useCurrentUser, useFirebaseAuth } from '@hooks/index';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { setAssignmentsHistory } from '@services/recoil/schedules';
import { songsBuildList } from '@services/i18n/songs';
import { setSongs } from '@services/recoil/songs';
import { setPublicTalks } from '@services/recoil/publicTalks';
import { publicTalksBuildList } from '@services/i18n/public_talks';
import worker from '@services/worker/backupWorker';

const useWebWorker = () => {
  const { user } = useFirebaseAuth();

  const { isMeetingEditor } = useCurrentUser();

  const isOnline = useRecoilValue(isOnlineState);
  const isConnected = useRecoilValue(congAccountConnectedState);
  const backupAuto = useRecoilValue(backupAutoState);
  const backupInterval = useRecoilValue(backupIntervalState);
  const jwLang = useRecoilValue(JWLangState);

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
          await setIsAppDataSyncing(true);
        }

        if (event.data === 'Done') {
          await setIsAppDataSyncing(false);

          // sync complete -> refresh app data

          // load songs
          const songs = songsBuildList(sourceLang);
          await setSongs(songs);

          // load public talks
          const talks = publicTalksBuildList(sourceLang);
          await setPublicTalks(talks);

          // load assignment history
          const history = await schedulesBuildHistoryList();
          await setAssignmentsHistory(history);
        }

        if (event.data.error === 'BACKUP_FAILED') {
          await setIsAppDataSyncing(false);
          setLastBackup('error');
        }

        if (event.data.lastBackup) {
          setLastBackup(event.data.lastBackup);
        }
      };
    }
  }, [isMeetingEditor, sourceLang]);

  useEffect(() => {
    const runBackupTimer = setInterval(async () => {
      if (backupEnabled) {
        if (user) {
          worker.postMessage({
            field: 'idToken',
            value: await user.getIdToken(true),
          });
        }

        worker.postMessage('startWorker');
      }
    }, interval);

    return () => {
      clearInterval(runBackupTimer);
    };
  }, [backupEnabled, interval, user]);

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
