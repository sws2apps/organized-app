import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dbAppSettingsSave } from '@services/dexie/settings';
import { autoBackupIntervalState, autoBackupState, followOSThemeState } from '@states/settings';
import { useBreakpoints } from '@hooks/index';
import worker from '@services/worker/backupWorker';

const useAppSettings = () => {
  const { laptopUp } = useBreakpoints();

  const autoBackup = useRecoilValue(autoBackupState);
  const autoBackupInterval = useRecoilValue(autoBackupIntervalState);
  const followOSTheme = useRecoilValue(followOSThemeState);

  const [autoSync, setAutoSync] = useState(autoBackup);
  const [autoSyncInterval, setAutoSyncInterval] = useState(autoBackupInterval);
  const [syncTheme, setSyncTheme] = useState(followOSTheme);

  const handleSwitchAutoBackup = async (value) => {
    setAutoSync(value);

    await dbAppSettingsSave({ autoBackup: { value, updatedAt: new Date().toISOString() } });

    worker.postMessage({ field: 'isEnabled', value });
  };

  const handleUpdateSyncInterval = async (value) => {
    setAutoSyncInterval(value);

    await dbAppSettingsSave({ autoBackup_interval: { value, updatedAt: new Date().toISOString() } });

    worker.postMessage({ field: 'backupInterval', value: value * 60 * 1000 });
  };

  const handleUpdateSyncTheme = async (value) => {
    setSyncTheme(value);

    await dbAppSettingsSave({ follow_os_theme: { value, updatedAt: new Date().toISOString() } });
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
