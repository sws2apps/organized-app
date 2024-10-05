import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { cookiesConsentState, isDarkThemeState } from '@states/app';
import { setIsDarkTheme } from '@services/recoil/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { themeFollowOSEnabledState } from '@states/settings';

const useThemeSwitcher = () => {
  const isDark = useRecoilValue(isDarkThemeState);
  const followOSTheme = useRecoilValue(themeFollowOSEnabledState);
  const cookiesConsent = useRecoilValue(cookiesConsentState);

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

    await dbAppSettingsUpdate({
      'user_settings.theme_follow_os_enabled': {
        value: false,
        updatedAt: new Date().toISOString(),
      },
    });

    setIsOpenConfirm(false);
  };

  useEffect(() => {
    const currentTheme = document.documentElement
      .getAttribute('data-theme')
      .split('-')[0];

    const newTheme = `${currentTheme}-${isDark ? 'dark' : 'light'}`;

    document.documentElement.setAttribute('data-theme', newTheme);

    const themeColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--accent-100');

    document
      .querySelector("meta[name='theme-color']")
      .setAttribute('content', themeColor);

    if (cookiesConsent) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, cookiesConsent]);

  useEffect(() => {
    if (!followOSTheme) return;

    // Check if the OS is in dark mode
    const darkModeMediaQuery = matchMedia('(prefers-color-scheme: dark)');

    // Function to handle the change event
    const handleDarkModeChange = async (e) => {
      if (e.matches) {
        if (cookiesConsent) localStorage.setItem('theme', 'dark');

        await setIsDarkTheme(true);
      } else {
        if (cookiesConsent) localStorage.setItem('theme', 'light');

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
  }, [followOSTheme, cookiesConsent]);

  return {
    isDark,
    handleChangeTheme,
    isOpenConfirm,
    handleCloseConfirm,
    handleOverrideThemeAuto,
  };
};

export default useThemeSwitcher;
