import { ChangeEvent } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ColorSchemeType } from '@definition/app';
import { appThemeNameState, colorSchemeState } from '@states/app';

const useColorSchemeSelector = () => {
  const [colorScheme, setColorScheme] = useAtom(colorSchemeState);

  const theme = useAtomValue(appThemeNameState);

  const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value as ColorSchemeType;
    setColorScheme(selectedColor);

    const color = selectedColor;
    const newTheme = `${color}-${theme}`;

    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { colorScheme, handleChangeColor };
};

export default useColorSchemeSelector;
