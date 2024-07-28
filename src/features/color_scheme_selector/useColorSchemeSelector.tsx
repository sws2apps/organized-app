import { ChangeEvent, useState } from 'react';
import { ColorSchemeType } from '@definition/app';

const useColorSchemeSelector = () => {
  const savedColor = localStorage.getItem('color') as ColorSchemeType;

  const [colorScheme, setColorScheme] = useState(savedColor || 'blue');

  const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value as ColorSchemeType;
    setColorScheme(selectedColor);
    localStorage.setItem('color', selectedColor);

    const theme = localStorage.getItem('theme');
    const color = selectedColor;
    const newTheme = `${color}-${theme}`;

    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { colorScheme, handleChangeColor };
};

export default useColorSchemeSelector;
