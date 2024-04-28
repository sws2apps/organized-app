import { delay } from '@utils/dev';
import { apiSendCongregationBackup, apiSendUserBackup } from './backupUtils';

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
    self.setting[event.data.field] = event.data.value;
  }

  if (event.data === 'startWorker') {
    runBackup();
  }
};

const runBackup = async () => {
  try {
    const { accountType, apiHost, congID, userID, userUID, visitorID } = self.setting;

    self.postMessage('Syncing');

    const reqPayload = {};

    if (accountType === 'vip' && userUID) {
      await apiSendCongregationBackup({ apiHost, congID, reqPayload, userUID, visitorID });
    }

    if (accountType === 'pocket' && userID) {
      await apiSendUserBackup({ apiHost, reqPayload, userID, visitorID });
    }

    await delay(5000);

    self.postMessage('Done');
    self.postMessage({ lastBackup: new Date().toISOString() });
  } catch (error) {
    console.error(error);
  }
};
