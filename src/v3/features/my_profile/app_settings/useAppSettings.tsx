import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { handleUpdateSetting } from '@services/dexie/settings';
import { autoBackupIntervalState, autoBackupState } from '@states/settings';
import { useBreakpoints } from '@hooks/index';

const useAppSettings = () => {
  const { laptopUp } = useBreakpoints();

  const autoBackup = useRecoilValue(autoBackupState);
  const autoBackupInterval = useRecoilValue(autoBackupIntervalState);

  const [autoSync, setAutoSync] = useState(autoBackup);
  const [autoSyncInterval, setAutoSyncInterval] = useState(autoBackupInterval);
  const [syncTheme, setSyncTheme] = useState(false);

  const handleSwitchAutoBackup = async (value) => {
    setAutoSync(value);

    await handleUpdateSetting({ autoBackup: { value, updatedAt: new Date().toISOString() } });
  };

  const handleUpdateSyncInterval = async (value) => {
    setAutoSyncInterval(value);

    await handleUpdateSetting({ autoBackup_interval: { value, updatedAt: new Date().toISOString() } });
  };

  const handleUpdateSyncTheme = async (value) => {
    setSyncTheme(value);
  };

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
