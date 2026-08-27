import { useAtom, useAtomValue } from 'jotai';
import { ColorSchemeType } from '@definition/app';
import { appThemeNameState, colorSchemeState } from '@states/app';

const useColorSchemeSelector = () => {
  const [colorScheme, setColorScheme] = useAtom(colorSchemeState);

  const theme = useAtomValue(appThemeNameState);

  const handleChangeColor = (selectedColor: ColorSchemeType) => {
    setColorScheme(selectedColor);
    document.documentElement.dataset.theme = `${selectedColor}-${theme}`;

    const themeColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--accent-100');

    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute('content', themeColor);
  };

  return { colorScheme, handleChangeColor };
};

export default useColorSchemeSelector;
