import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  backupAutoState,
  backupIntervalState,
  themeFollowOSEnabledState,
} from '@states/settings';
import { useBreakpoints } from '@hooks/index';

const useAppSettings = () => {
  const { laptopUp } = useBreakpoints();

  const autoBackup = useRecoilValue(backupAutoState);
  const autoBackupInterval = useRecoilValue(backupIntervalState);
  const followOSTheme = useRecoilValue(themeFollowOSEnabledState);

  const [autoSync, setAutoSync] = useState(autoBackup);
  const [autoSyncInterval, setAutoSyncInterval] = useState(autoBackupInterval);
  const [syncTheme, setSyncTheme] = useState(followOSTheme);

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
  };
};

export default useAppSettings;
