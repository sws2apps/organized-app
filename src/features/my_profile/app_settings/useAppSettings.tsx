import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  backupAutoState,
  backupIntervalState,
  themeFollowOSEnabledState,
  hideNameAndCongregationState,
} from '@states/settings';
import { useBreakpoints } from '@hooks/index';

const useAppSettings = () => {
  const { laptopUp } = useBreakpoints();

  const autoBackup = useRecoilValue(backupAutoState);
  const autoBackupInterval = useRecoilValue(backupIntervalState);
  const followOSTheme = useRecoilValue(themeFollowOSEnabledState);
  const hideNameAndCongregation = useRecoilValue(hideNameAndCongregationState);

  const [autoSync, setAutoSync] = useState(autoBackup);
  const [autoSyncInterval, setAutoSyncInterval] = useState(autoBackupInterval);
  const [syncTheme, setSyncTheme] = useState(followOSTheme);
  const [hideName, setHideName] = useState(hideNameAndCongregation);

  const handleSwitchAutoBackup = async (value) => {
    setAutoSync(value);

    await dbAppSettingsUpdate({
      'user_settings.backup_automatic.enabled': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const handleUpdateSyncInterval = async (value: number) => {
    setAutoSyncInterval(value);

    await dbAppSettingsUpdate({
      'user_settings.backup_automatic.interval': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const handleUpdateSyncTheme = async (value) => {
    setSyncTheme(value);

    await dbAppSettingsUpdate({
      'user_settings.theme_follow_os_enabled': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const handleSwitchHideName = async (value) => {
    setHideName(value);
    await dbAppSettingsUpdate({
      'user_settings.hide_name_and_congregation': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  useEffect(() => {
    setSyncTheme(followOSTheme);
  }, [followOSTheme]);

  return {
    autoSync,
    handleSwitchAutoBackup,
    autoSyncInterval,
    handleUpdateSyncInterval,
    laptopUp,
    syncTheme,
    handleUpdateSyncTheme,
    hideName,
    handleSwitchHideName,
  };
};

export default useAppSettings;
