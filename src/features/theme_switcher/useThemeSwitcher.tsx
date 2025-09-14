import { useCallback, useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  appThemeNameState,
  colorSchemeState,
  isDarkThemeState,
} from '@states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { themeFollowOSEnabledState } from '@states/settings';

const useThemeSwitcher = () => {
  const [appTheme, setAppThemeName] = useAtom(appThemeNameState);

  const followOSTheme = useAtomValue(themeFollowOSEnabledState);
  const isDark = useAtomValue(isDarkThemeState);
  const color = useAtomValue(colorSchemeState);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const handleProceedChange = useCallback(
    (theme: string) => {
      const newTheme = `${color}-${theme}`;

      document.documentElement.setAttribute('data-theme', newTheme);

      const themeColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--accent-100');

      document
        .querySelector("meta[name='theme-color']")
        .setAttribute('content', themeColor);
    },
    [color]
  );

  const handleChangeTheme = (value: boolean) => {
    if (followOSTheme) {
      setIsOpenConfirm(true);
      return;
    }

    const theme = value ? 'dark' : 'light';

    setAppThemeName(theme);
    handleProceedChange(theme);
  };

  const handleCloseConfirm = () => {
    setIsOpenConfirm(false);
  };

  const handleOverrideThemeAuto = async () => {
    const theme = appTheme === 'dark' ? 'light' : 'dark';

    setAppThemeName(theme);
    handleProceedChange(theme);

    await dbAppSettingsUpdate({
      'user_settings.theme_follow_os_enabled': {
        value: false,
        updatedAt: new Date().toISOString(),
      },
    });

    setIsOpenConfirm(false);
  };

  useEffect(() => {
    if (!followOSTheme) return;

    // Check if the OS is in dark mode
    const darkModeMediaQuery = matchMedia('(prefers-color-scheme: dark)');

    // Function to handle the change event
    const handleDarkModeChange = (e) => {
      if (e.matches) {
        setAppThemeName('dark');
        handleProceedChange('dark');
      } else {
        setAppThemeName('light');
        handleProceedChange('light');
      }
    };

    // Listen for changes
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    // Call the function to set the initial state
    handleDarkModeChange(darkModeMediaQuery);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, [followOSTheme, setAppThemeName, handleProceedChange]);

  return {
    isDark,
    handleChangeTheme,
    isOpenConfirm,
    handleCloseConfirm,
    handleOverrideThemeAuto,
  };
};

export default useThemeSwitcher;
