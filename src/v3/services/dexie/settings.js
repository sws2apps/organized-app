import { promiseGetRecoil } from 'recoil-outside';
import backupWorkerInstance from '@services/worker/backupWorker';
import { settingsState } from '@states/settings';
import { appDb } from '.';

export const handleUpdateSetting = async (setting) => {
  const current = await promiseGetRecoil(settingsState);

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

  backupWorkerInstance.setUserRole(data.cong_role);
  backupWorkerInstance.setAccountType('pocket');
  backupWorkerInstance.setUserID(data.id);
  backupWorkerInstance.setCongID(data.cong_id);
  backupWorkerInstance.setIsCongAccountConnected(true);
};
