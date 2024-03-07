import { promiseGetRecoil } from 'recoil-outside';
import { settingsState } from '@states/settings';
import { appDb } from '.';
import { SettingsType, TimeAwayType } from '@definition/app';
import worker from '@services/worker/backupWorker';

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

export const handleUserTimeAwayAdd = async () => {
  const current: SettingsType = await promiseGetRecoil(settingsState);

  const obj: TimeAwayType = {
    id: crypto.randomUUID(),
    startDate: new Date().toISOString(),
    endDate: null,
    comments: '',
  };

  const objChange = {
    date: new Date().toISOString(),
    id: obj.id,
    type: 'add',
    value: obj,
  };

  const currentTimeAways = current?.user_time_away || { data: [], changes: [] };
  const currentData = currentTimeAways.data || [];
  const currentChanges = currentTimeAways.changes || [];

  const newData = [...currentData, obj];
  const newChanges = [...currentChanges, objChange];

  const newTimeAways = {
    data: newData,
    changes: newChanges,
  };

  const newSettings = { ...current, user_time_away: newTimeAways };

  await appDb.app_settings.put(newSettings);
};

export const handleUserTimeAwayDelete = async (id) => {
  const current: SettingsType = await promiseGetRecoil(settingsState);

  const currentData = current.user_time_away.data;
  const currentChanges = current.user_time_away.changes;

  const newData = currentData.filter((record) => record.id !== id);
  const newChanges = currentChanges.filter((change) => change.id !== id);

  newChanges.push({
    date: new Date().toISOString(),
    id: id,
    type: 'deleted',
    value: { id: '', startDate: '', endDate: '', comments: '' },
  });

  const newTimeAways = {
    data: newData,
    changes: newChanges,
  };

  const newSettings = { ...current, user_time_away: newTimeAways };

  await appDb.app_settings.put(newSettings);
};

export const handleUserTimeAwayUpdate = async (timeAway: TimeAwayType) => {
  const current: SettingsType = await promiseGetRecoil(settingsState);
  const currentTimeAways = structuredClone(current.user_time_away);

  const findIndex = currentTimeAways.data.findIndex((record) => record.id === timeAway.id);

  currentTimeAways.data[findIndex] = timeAway;

  const currentChanges = currentTimeAways.changes;
  const newChanges = currentChanges.filter((change) => change.id !== timeAway.id);

  newChanges.push({
    date: new Date().toISOString(),
    id: timeAway.id,
    type: 'modify',
    value: timeAway,
  });

  const newTimeAways = {
    data: currentTimeAways.data,
    changes: newChanges,
  };

  const newSettings = { ...current, user_time_away: newTimeAways };

  await appDb.app_settings.put(newSettings);
};
