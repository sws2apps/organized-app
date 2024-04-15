import { UpdateSpec } from 'dexie';
import appDb from '@shared/indexedDb/appDb';
import { TimeAwayType } from '@definition/person';
import { SettingsType } from '@definition/settings';
import { setCongAccountConnected, setCongID, setIsMFAEnabled, setUserID } from '@services/recoil/app';
import worker from '@services/worker/backupWorker';

export const dbAppSettingsSave = async (setting: SettingsType) => {
  const current = await appDb.app_settings.get(1);

  const newSettings = { ...current, ...setting };
  await appDb.app_settings.put(newSettings);
};

export const dbAppSettingsUpdate = async (changes: UpdateSpec<SettingsType>) => {
  await appDb.app_settings.update(1, changes);
};

export const dbAppSettingsUpdateFromRemote = async (data) => {
  const current = await appDb.app_settings.get(1);

  const newSettings = {
    ...current,
    cong_number: data.cong_number,
    cong_name: data.cong_name,
    cong_role: data.cong_role,
    username: data.username,
    user_members_delegate: data.user_members_delegate,
    user_local_uid: data.user_local_uid,
    account_type: 'pocket',
  };

  await appDb.app_settings.put(newSettings);

  worker.postMessage({ field: 'userRole', value: data.cong_role });
  worker.postMessage({ field: 'accountType', value: 'pocket' });
  worker.postMessage({ field: 'userID', value: data.id });
  worker.postMessage({ field: 'congID', value: data.cong_id });
  worker.postMessage({ field: 'isCongAccountConnected', value: true });
};

export const dbAppSettingsTimeAwayAdd = async () => {
  const setting = await appDb.app_settings.get(1);

  setting.user_time_away.push({
    id: crypto.randomUUID(),
    startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
    endDate: { value: null, updatedAt: '' },
    comments: { value: '', updatedAt: '' },
    _deleted: null,
  });

  await appDb.app_settings.put(setting);
};

export const dbAppSettingsTimeAwayDelete = async (id) => {
  const setting = await appDb.app_settings.get(1);

  const currentTimeAway = setting.user_time_away.find((record) => record.id === id);
  currentTimeAway._deleted = new Date().toISOString();

  await appDb.app_settings.put(setting);
};

export const dbAppSettingsTimeAwayUpdate = async (timeAway: TimeAwayType) => {
  const setting = await appDb.app_settings.get(1);

  const currentIndex = setting.user_time_away.findIndex((record) => record.id === timeAway.id);
  setting.user_time_away[currentIndex] = { ...timeAway };

  await appDb.app_settings.put(setting);
};

export const dbAppSettingsSaveProfilePic = async (url: string, provider: string) => {
  if (url && url !== '' && url !== null) {
    if (provider !== 'microsoft.com' && provider !== 'yahoo.com') {
      const downloadedImg = new Image();
      downloadedImg.crossOrigin = 'Anonymous';

      const imageReceived = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = downloadedImg.width;
        canvas.height = downloadedImg.height;
        canvas.innerText = downloadedImg.alt;

        context.drawImage(downloadedImg, 0, 0);

        canvas.toBlob((done) => savePic(done));

        // Remove the event listener to avoid memory leak
        downloadedImg.removeEventListener('load', imageReceived, false);
      };

      downloadedImg.src = url;
      downloadedImg.addEventListener('load', imageReceived, false);

      const savePic = (profileBlob) => {
        profileBlob.arrayBuffer().then((profileBuffer) => {
          const blob = new Blob([profileBuffer]);
          const src = URL.createObjectURL(blob);

          dbAppSettingsUpdate({ user_avatar: src });
        });
      };

      return;
    }
  }

  await dbAppSettingsUpdate({ user_avatar: '' });
};

export const dbAppSettingsUpdateUserInfoAfterLogin = async (data) => {
  const { id, cong_id, cong_name, cong_role, cong_number, user_members_delegate, user_local_uid, mfaEnabled } = data;

  await setIsMFAEnabled(mfaEnabled);
  await setCongID(cong_id);
  await setCongAccountConnected(true);

  const settings = await appDb.app_settings.get(1);

  if (!settings.firstname || settings.firstname.updatedAt < data.firstname.updatedAt) {
    settings.firstname = data.firstname;
  }

  if (!settings.lastname || settings.lastname.updatedAt < data.lastname.updatedAt) {
    settings.lastname = data.lastname;
  }

  settings.cong_name = cong_name;
  settings.cong_number = cong_number;
  settings.user_members_delegate = user_members_delegate;

  if (user_local_uid && user_local_uid !== null) {
    settings.user_local_uid = user_local_uid;
  }

  settings.cong_role = cong_role;
  settings.account_type = 'vip';

  await dbAppSettingsSave(settings);

  await setUserID(id);

  worker.postMessage({ field: 'isEnabled', value: settings.autoBackup });
  worker.postMessage({ field: 'userRole', value: cong_role });
  worker.postMessage({ field: 'userID', value: id });
  worker.postMessage({ field: 'congID', value: cong_id });
  worker.postMessage({ field: 'isCongAccountConnected', value: true });
  worker.postMessage({ field: 'accountType', value: 'vip' });
};
