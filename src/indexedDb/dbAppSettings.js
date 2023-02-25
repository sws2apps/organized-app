import { promiseSetRecoil } from 'recoil-outside';
import { congNameState, congNumberState, pocketLocalIDState, usernameState } from '../states/congregation';
import { userIDState } from '../states/main';
import appDb from './mainDb';

export const dbUpdateAppSettings = async (settingValue, overwrite) => {
  if (overwrite) {
    await appDb.table('app_settings').put({ id: 1, ...settingValue });
  } else {
    await appDb.table('app_settings').update(1, {
      ...settingValue,
    });
  }
};

export const dbGetAppSettings = async () => {
  const congData = await appDb.table('app_settings').get({ id: 1 });
  return congData;
};

export const dbUpdateUserSettings = async (data) => {
  const obj = {
    cong_number: data.cong_number,
    cong_name: data.cong_name,
    cong_role: data.cong_role,
    username: data.username,
    pocket_members: data.pocket_members,
    pocket_local_id: data.pocket_local_id,
    user_id: data.id,
    account_type: 'pocket',
  };

  await dbUpdateAppSettings(obj);

  await promiseSetRecoil(usernameState, data.username);
  await promiseSetRecoil(congNameState, data.cong_name);
  await promiseSetRecoil(congNumberState, data.cong_number);
  await promiseSetRecoil(userIDState, data.id);
  await promiseSetRecoil(pocketLocalIDState, data.pocket_local_id.person_uid);
};
