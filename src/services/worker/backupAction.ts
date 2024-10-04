import { delay } from '@utils/common';
import {
  apiGetCongregationBackup,
  apiSendCongregationBackup,
} from './backupApi';
import { dbExportDataBackup, dbGetSettings } from './backupUtils';

declare const self: MyWorkerGlobalScope;

self.setting = {
  apiHost: undefined,
  congID: undefined,
  userID: undefined,
  idToken: undefined,
};

self.onmessage = function (event) {
  if (event.data.field) {
    if (Object.keys(self.setting).includes(event.data.field)) {
      self.setting[event.data.field] = event.data.value;
    }
  }

  if (event.data === 'startWorker') {
    runBackup();
  }
};

const runBackup = async () => {
  let backup = 'started';

  try {
    const { apiHost, congID, idToken } = self.setting;

    const settings = await dbGetSettings();
    const accountType = settings.user_settings.account_type;

    self.postMessage('Syncing');

    if (accountType === 'vip' && idToken) {
      // loop until server responds backup completed excluding failure
      do {
        const backupData = await apiGetCongregationBackup({
          apiHost,
          congID,
          idToken,
        });

        const lastBackup = backupData.app_settings.cong_settings['last_backup'];

        const reqPayload = await dbExportDataBackup(backupData);

        const data = await apiSendCongregationBackup({
          apiHost,
          congID,
          reqPayload,
          idToken,
          lastBackup,
        });

        if (data.message === 'UNAUTHORIZED_REQUEST') {
          backup = 'failed';
          self.postMessage({
            error: 'BACKUP_FAILED',
            details: 'UNAUTHORIZED_ACCESS',
          });
        }

        if (data.message !== 'UNAUTHORIZED_REQUEST') {
          if (data?.message === 'BACKUP_SENT') backup = 'completed';
        }

        if (backup !== 'completed') {
          await delay(5000);
        }
      } while (backup === 'started');
    }

    if (backup === 'completed') {
      self.postMessage('Done');
      self.postMessage({ lastBackup: new Date().toISOString() });
    }
  } catch (error) {
    console.error(error);
    backup = 'failed';
    self.postMessage({ error: 'BACKUP_FAILED', details: error.message });
  }
};
