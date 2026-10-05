import { useAtomValue } from 'jotai';
import { ColorSchemeType } from '@definition/app';
import { colorSchemeState } from '@states/app';
import {
  accountAppearanceSave,
  appColorSchemeApply,
} from '@services/app/appearance';

const useColorSchemeSelector = () => {
  const colorScheme = useAtomValue(colorSchemeState);

  const handleChangeColor = async (selectedColor: ColorSchemeType) => {
    appColorSchemeApply(selectedColor);

    await accountAppearanceSave('color_scheme', selectedColor);
  };

  return { colorScheme, handleChangeColor };
};

export default useColorSchemeSelector;
