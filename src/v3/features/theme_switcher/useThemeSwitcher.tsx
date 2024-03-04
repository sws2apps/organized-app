import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isDarkThemeState } from '@states/app';
import { setIsDarkTheme } from '@services/recoil/app';
import { followOSThemeState } from '@states/settings';
import { handleUpdateSetting } from '@services/dexie/settings';

const useThemeSwitcher = () => {
  const isDark = useRecoilValue(isDarkThemeState);
  const followOSTheme = useRecoilValue(followOSThemeState);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const handleChangeTheme = async (value) => {
    if (followOSTheme) {
      setIsOpenConfirm(true);
      return;
    }

    await setIsDarkTheme(value);
  };

  const handleCloseConfirm = () => {
    setIsOpenConfirm(false);
  };

  const handleOverrideThemeAuto = async () => {
    await setIsDarkTheme(!isDark);

    await handleUpdateSetting({ follow_os_theme: { value: false, updatedAt: new Date().toISOString() } });

    setIsOpenConfirm(false);
  };

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme').split('-')[0];
    const newTheme = `${currentTheme}-${isDark ? 'dark' : 'light'}`;

    document.documentElement.setAttribute('data-theme', newTheme);

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-100');
    document.querySelector("meta[name='theme-color']").setAttribute('content', themeColor);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (!followOSTheme) return;

    // Check if the OS is in dark mode
    const darkModeMediaQuery = matchMedia('(prefers-color-scheme: dark)');

    // Function to handle the change event
    const handleDarkModeChange = async (e) => {
      if (e.matches) {
        localStorage.setItem('theme', 'dark');
        await setIsDarkTheme(true);
      } else {
        localStorage.setItem('theme', 'light');
        await setIsDarkTheme(false);
      }
    };

    // Listen for changes
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    // Call the function to set the initial state
    handleDarkModeChange(darkModeMediaQuery);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, [followOSTheme]);

  return { isDark, handleChangeTheme, isOpenConfirm, handleCloseConfirm, handleOverrideThemeAuto };
};

export default useThemeSwitcher;
