import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isDarkThemeState } from '@states/app';

const useThemeSwitcher = () => {
  const [isDark, setIsDark] = useRecoilState(isDarkThemeState);

  const handleChangeTheme = (value) => {
    setIsDark(value);
  };

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme').split('-')[0];
    const newTheme = `${currentTheme}-${isDark ? 'dark' : 'light'}`;

    document.documentElement.setAttribute('data-theme', newTheme);

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-100');
    document.querySelector("meta[name='theme-color']").setAttribute('content', themeColor);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, handleChangeTheme };
};

export default useThemeSwitcher;
