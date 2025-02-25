import { delay } from '@utils/common';
import {
  apiGetCongregationBackup,
  apiGetPocketBackup,
  apiSendCongregationBackup,
  apiSendPocketBackup,
} from './backupApi';
import {
  dbClearExportState,
  dbExportDataBackup,
  dbGetMetadata,
  dbGetSettings,
} from './backupUtils';

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
  let backup = '';

  try {
    const { apiHost, userID, idToken } = self.setting;

    const settings = await dbGetSettings();
    const accountType = settings.user_settings.account_type;

    if (accountType === 'vip' && idToken && userID) {
      backup = 'started';
      self.postMessage('Syncing');

      // loop until server responds backup completed excluding failure after 3 retries
      let retry = 1;

      do {
        const metadata = await dbGetMetadata();

        const backupData = await apiGetCongregationBackup({
          apiHost,
          userID,
          idToken,
          metadata: JSON.stringify(metadata),
        });

        const reqPayload = await dbExportDataBackup(backupData);

        const metadataUpdate = await dbGetMetadata();

        const data = await apiSendCongregationBackup({
          apiHost,
          userID,
          reqPayload,
          idToken,
          metadata: metadataUpdate,
        });

        if (data.message === 'UNAUTHORIZED_REQUEST') {
          backup = 'failed';
          self.postMessage({
            error: 'BACKUP_FAILED',
            details: 'UNAUTHORIZED_ACCESS',
          });
        }

        if (data.message === 'error_api_internal-error') {
          backup = 'failed';
          self.postMessage({ error: 'BACKUP_FAILED' });
        }

        if (data.message === 'BACKUP_SENT') {
          backup = 'completed';
        }

        if (retry < 3 && backup !== 'completed') {
          await delay(5000);
        }

        if (retry === 3 && backup !== 'completed') {
          backup = 'failed';
          self.postMessage({ error: 'BACKUP_FAILED' });
        }

        retry++;
      } while (backup === 'started');
    }

    if (accountType === 'pocket') {
      backup = 'started';
      self.postMessage('Syncing');

      // loop until server responds backup completed excluding failure after 3 retries
      let retry = 1;

      do {
        const metadata = await dbGetMetadata();

        const backupData = await apiGetPocketBackup({
          apiHost,
          metadata: JSON.stringify(metadata),
        });

        const reqPayload = await dbExportDataBackup(backupData);

        const metadataUpdate = await dbGetMetadata();
        const data = await apiSendPocketBackup({
          apiHost,
          reqPayload,
          metadata: JSON.stringify(metadataUpdate),
        });

        if (data.message === 'UNAUTHORIZED_REQUEST') {
          backup = 'failed';
          self.postMessage({
            error: 'BACKUP_FAILED',
            details: 'UNAUTHORIZED_ACCESS',
          });
        }

        if (data.message === 'error_api_internal-error') {
          backup = 'failed';
          self.postMessage({ error: 'BACKUP_FAILED' });
        }

        if (data.message === 'BACKUP_SENT') {
          backup = 'completed';
        }

        if (retry < 3 && backup !== 'completed') {
          await delay(5000);
        }

        if (retry === 3 && backup !== 'completed') {
          backup = 'failed';
          self.postMessage({ error: 'BACKUP_FAILED' });
        }

        retry++;
      } while (backup === 'started');
    }

    if (backup === 'completed') {
      await dbClearExportState();

      self.postMessage('Done');
      self.postMessage({ lastBackup: new Date().toISOString() });
    }
  } catch (error) {
    console.error(error);
    backup = 'failed';
    self.postMessage({ error: 'BACKUP_FAILED', details: error.message });
  }
};
