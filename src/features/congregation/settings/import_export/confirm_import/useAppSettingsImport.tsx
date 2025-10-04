import { updatedAtOverride } from '@utils/common';
import { SettingsType } from '@definition/settings';
import appDb from '@db/appDb';

const useAppSettingsImport = () => {
  const getCongSettings = async (data: SettingsType['cong_settings']) => {
    const cong_settings = updatedAtOverride(structuredClone(data));

    const oldSettings = await appDb.app_settings.get(1);
    const newSettings = oldSettings.cong_settings;

    const freezeKeys = [
      'cong_access_code',
      'cong_master_key',
      'cong_migrated',
      'cong_name',
      'cong_new',
      'cong_id',
      'country_code',
    ];

    for (const key of freezeKeys) {
      delete cong_settings[key];
    }

    Object.assign(newSettings, cong_settings);

    return newSettings;
  };

  const getUserSettings = async (data: SettingsType['user_settings']) => {
    const user_settings = updatedAtOverride(structuredClone(data));

    const oldSettings = await appDb.app_settings.get(1);
    const newSettings = oldSettings.user_settings;

    const freezeKeys = [
      'account_type',
      'cong_role',
      'firstname',
      'id',
      'lastname',
      'user_avatar',
      'user_local_uid',
      'user_members_delegate',
    ];

    for (const key of freezeKeys) {
      delete user_settings[key];
    }

    Object.assign(newSettings, user_settings);

    return newSettings;
  };

  return { getCongSettings, getUserSettings };
};

export default useAppSettingsImport;
