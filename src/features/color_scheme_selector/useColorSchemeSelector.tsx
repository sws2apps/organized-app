import { ChangeEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ColorSchemeType } from '@definition/app';
import { cookiesConsentState, isDarkThemeState } from '@states/app';

const savedColor = localStorage.getItem('color') as ColorSchemeType;

const useColorSchemeSelector = () => {
  const cookiesConsent = useRecoilValue(cookiesConsentState);
  const isDark = useRecoilValue(isDarkThemeState);

  const [colorScheme, setColorScheme] = useState(savedColor || 'blue');

  const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value as ColorSchemeType;
    setColorScheme(selectedColor);

    if (cookiesConsent) {
      localStorage.setItem('color', selectedColor);
    }

    let theme: string;

    if (cookiesConsent) {
      theme = localStorage.getItem('theme');
    }

    if (!cookiesConsent) {
      theme = isDark ? 'dark' : 'light';
    }

    const color = selectedColor;
    const newTheme = `${color}-${theme}`;

    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { colorScheme, handleChangeColor };
};

export default useColorSchemeSelector;
