import { delay } from '@utils/dev';
import { apiSendCongregationBackup, apiSendUserBackup } from './backupUtils';

const setting = {
  isEnabled: false,
  visitorID: undefined,
  apiHost: undefined,
  congID: undefined,
  isOnline: navigator.onLine,
  backupInterval: 300000,
  isCongAccountConnected: undefined,
  userRole: [],
  accountType: undefined,
  userUID: undefined,
  userID: undefined,
  lastBackup: undefined,
};

self.onmessage = function (event) {
  if (event.data.field) {
    setting[event.data.field] = event.data.value;
  }

  if (event.data === 'startWorker') {
    runBackupSchedule();
    checkLastSync();
  }
};

const runBackupSchedule = async () => {
  try {
    const {
      backupInterval,
      accountType,
      apiHost,
      congID,
      isCongAccountConnected,
      isEnabled,
      isOnline,
      userID,
      userUID,
      visitorID,
    } = setting;

    if (isEnabled && backupInterval && isOnline && visitorID && apiHost && congID && isCongAccountConnected) {
      self.postMessage('Syncing');
      await delay(5000);
      const reqPayload = {};
      if (accountType === 'vip' && userUID) {
        const data = await apiSendCongregationBackup({ apiHost, congID, reqPayload, userUID, visitorID });
        if (data && data.message === 'BACKUP_SENT') {
          setting.lastBackup = new Date().toISOString();
        }
      }
      if (accountType === 'pocket' && userID) {
        const data = await apiSendUserBackup({ apiHost, reqPayload, userID, visitorID });
        if (data && data.message === 'BACKUP_SENT') {
          setting.lastBackup = new Date().toISOString();
        }
      }
    }
    self.postMessage('Done');
    setTimeout(runBackupSchedule, backupInterval);
  } catch {
    self.postMessage('Done');
    setTimeout(runBackupSchedule, setting.backupInterval);
  }
};

const checkLastSync = () => {
  const { isOnline, lastBackup } = setting;

  if (isOnline && lastBackup) {
    let result: string | number = 0;

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

    self.postMessage({ lastBackup: result });
  }

  setTimeout(checkLastSync, 500);
};
