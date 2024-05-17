import { delay } from '@utils/common';
import { apiGetCongregationBackup, apiSendCongregationBackup } from './backupApi';
import { dbExportDataBackup } from './backupUtils';

declare const self: MyWorkerGlobalScope;

self.setting = {
  visitorID: undefined,
  apiHost: undefined,
  congID: undefined,
  userRole: [],
  accountType: undefined,
  userUID: undefined,
  userID: undefined,
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
    const { accountType, apiHost, congID, userUID, visitorID, userRole } = self.setting;

    self.postMessage('Syncing');

    if (accountType === 'vip' && userUID) {
      // loop until server responds backup completed excluding failure
      do {
        const backupData = await apiGetCongregationBackup({ apiHost, congID, userUID, visitorID });

        const reqPayload = await dbExportDataBackup(userRole, backupData);

        const data = await apiSendCongregationBackup({
          apiHost,
          congID,
          reqPayload,
          userUID,
          visitorID,
          lastBackup: backupData.last_backup,
        });

        if (data?.message === 'BACKUP_SENT') backup = 'completed';

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
