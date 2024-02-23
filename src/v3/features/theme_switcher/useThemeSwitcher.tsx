import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isDarkThemeState } from '@states/app';
import { setIsDarkTheme } from '@services/recoil/app';
import { followOSThemeState } from '@states/settings';

const useThemeSwitcher = () => {
  const isDark = useRecoilValue(isDarkThemeState);
  const followOSTheme = useRecoilValue(followOSThemeState);

  const handleChangeTheme = async (value) => {
    await setIsDarkTheme(value);
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
      darkModeMediaQuery.removeEventListener('change', handleChangeTheme);
    };
  }, [followOSTheme]);

  return { isDark, handleChangeTheme };
};

export default useThemeSwitcher;
