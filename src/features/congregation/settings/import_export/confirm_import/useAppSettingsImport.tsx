import { updatedAtOverride } from '@utils/common';
import { SettingsType } from '@definition/settings';
import appDb from '@db/appDb';

const useAppSettingsImport = () => {
  const getCongSettings = async (data: SettingsType['cong_settings']) => {
    const cong_settings = updatedAtOverride(structuredClone(data));

    const oldSettings = await appDb.app_settings.get(1);
    const newSettings = oldSettings.cong_settings;

    Object.assign(newSettings, cong_settings);

    return newSettings;
  };

  const getUserSettings = async (data: SettingsType['user_settings']) => {
    const user_settings = updatedAtOverride(structuredClone(data));

    const oldSettings = await appDb.app_settings.get(1);
    const newSettings = oldSettings.user_settings;

    Object.assign(newSettings, user_settings);

    return newSettings;
  };

  return { getCongSettings, getUserSettings };
};

export default useAppSettingsImport;
