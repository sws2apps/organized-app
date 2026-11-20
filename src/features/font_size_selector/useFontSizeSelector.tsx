import { useAtom } from 'jotai';
import { appFontSizeState } from '@states/app';

const useFontSizeSelector = () => {
  const [fontSize, handleChangeFontSize] = useAtom(appFontSizeState);

  return { fontSize, handleChangeFontSize };
};

export default useFontSizeSelector;
