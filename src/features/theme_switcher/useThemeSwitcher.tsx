import { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { cookiesConsentState, isDarkThemeState } from '@states/app';
import { setIsDarkTheme } from '@services/states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { accountTypeState, themeFollowOSEnabledState } from '@states/settings';

const useThemeSwitcher = () => {
  const [isDark, setIsDark] = useAtom(isDarkThemeState);

  const followOSTheme = useAtomValue(themeFollowOSEnabledState);
  const cookiesConsent = useAtomValue(cookiesConsentState);
  const accountType = useAtomValue(accountTypeState);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const handleChangeTheme = (value) => {
    if (followOSTheme) {
      setIsOpenConfirm(true);
      return;
    }

    setIsDarkTheme(value);
  };

  const handleCloseConfirm = () => {
    setIsOpenConfirm(false);
  };

  const handleOverrideThemeAuto = async () => {
    setIsDarkTheme(!isDark);

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

    const darkValue = isDark ? 'dark' : 'light';

    const newTheme = `${currentTheme}-${darkValue}`;

    document.documentElement.setAttribute('data-theme', newTheme);

    const themeColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--accent-100');

    document
      .querySelector("meta[name='theme-color']")
      .setAttribute('content', themeColor);

    setIsDark(darkValue === 'dark');

    if (cookiesConsent || accountType === 'pocket') {
      localStorage.setItem('theme', darkValue);
    }
  }, [isDark, cookiesConsent, accountType, setIsDark]);

  useEffect(() => {
    if (!followOSTheme) return;

    // Check if the OS is in dark mode
    const darkModeMediaQuery = matchMedia('(prefers-color-scheme: dark)');

    // Function to handle the change event
    const handleDarkModeChange = (e) => {
      if (e.matches) {
        if (cookiesConsent || accountType === 'pocket') {
          localStorage.setItem('theme', 'dark');
        }

        setIsDarkTheme(true);
      } else {
        if (cookiesConsent || accountType === 'pocket') {
          localStorage.setItem('theme', 'light');
        }

        setIsDarkTheme(false);
      }
    };

    // Listen for changes
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    // Call the function to set the initial state
    handleDarkModeChange(darkModeMediaQuery);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, [followOSTheme, cookiesConsent, accountType]);

  return {
    isDark,
    handleChangeTheme,
    isOpenConfirm,
    handleCloseConfirm,
    handleOverrideThemeAuto,
  };
};

export default useThemeSwitcher;
