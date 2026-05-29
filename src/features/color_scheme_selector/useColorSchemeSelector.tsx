import { useAtom, useAtomValue } from 'jotai';
import { ColorSchemeType } from '@definition/app';
import { appThemeNameState, colorSchemeState } from '@states/app';

const useColorSchemeSelector = () => {
  const [colorScheme, setColorScheme] = useAtom(colorSchemeState);

  const theme = useAtomValue(appThemeNameState);

  const handleChangeColor = (selectedColor: ColorSchemeType) => {
    setColorScheme(selectedColor);
    document.documentElement.setAttribute('data-theme', `${selectedColor}-${theme}`);
  };

  return { colorScheme, handleChangeColor };
};

export default useColorSchemeSelector;
