import { promiseGetRecoil } from 'recoil-outside';
import { settingsState } from '@states/settings';
import { appDb } from '.';
import worker from '@services/worker/backupWorker';
import { SettingsType } from '@definition/app';

export const handleUpdateSetting = async (setting: SettingsType) => {
  const current: SettingsType = await promiseGetRecoil(settingsState);

  if (current.id === 1) {
    const newSettings = { ...current, ...setting };

    await appDb.app_settings.put(newSettings);
  }
};

export const handleUpdateSettingFromRemote = async (data) => {
  const current = await promiseGetRecoil(settingsState);
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
