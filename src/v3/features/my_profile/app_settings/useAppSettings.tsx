import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { handleUpdateSetting } from '@services/dexie/settings';
import { autoBackupIntervalState, autoBackupState, followOSThemeState } from '@states/settings';
import { useBreakpoints } from '@hooks/index';
import { ColorSchemeType } from '@definition/app';

const useAppSettings = () => {
  const { laptopUp } = useBreakpoints();

  const autoBackup = useRecoilValue(autoBackupState);
  const autoBackupInterval = useRecoilValue(autoBackupIntervalState);
  const followOSTheme = useRecoilValue(followOSThemeState);

  const [autoSync, setAutoSync] = useState(autoBackup);
  const [autoSyncInterval, setAutoSyncInterval] = useState(autoBackupInterval);
  const [syncTheme, setSyncTheme] = useState(followOSTheme);
  const [isBlue, setIsBlue] = useState(false);
  const [isGreen, setIsGreen] = useState(false);
  const [isPurple, setIsPurple] = useState(false);
  const [isOrange, setIsOrange] = useState(false);

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

    await handleUpdateSetting({ follow_os_theme: { value, updatedAt: new Date().toISOString() } });
  };

  const handleChangeColorScheme = () => {
    const savedColor = localStorage.getItem('color') as ColorSchemeType;

    setIsBlue(false);
    setIsGreen(false);
    setIsOrange(false);
    setIsPurple(false);

    console.log('ran');

    if (savedColor === 'blue') {
      setIsBlue(true);
    }

    if (savedColor === 'green') {
      setIsGreen(true);
    }

    if (savedColor === 'orange') {
      setIsOrange(true);
    }

    if (savedColor === 'purple') {
      setIsPurple(true);
    }
  };

  return {
    autoSync,
    handleSwitchAutoBackup,
    autoSyncInterval,
    handleUpdateSyncInterval,
    laptopUp,
    syncTheme,
    handleUpdateSyncTheme,
    handleChangeColorScheme,
    isBlue,
    isGreen,
    isOrange,
    isPurple,
  };
};

export default useAppSettings;
