import { selector } from 'recoil';
import { isLightThemeState } from './main';

export const themeOptionsState = selector({
  key: 'themeOptions',
  get: ({ get }) => {
    const isLight = get(isLightThemeState);

    return {
      mainColor: '#3f51b5 !important',
      textNotImportant: isLight ? '#707B7C' : '#D0D3D4',
      reportIconColor: isLight ? '#CB4335' : '#FDFEFE',
      redNoteBg: isLight ? '#F5B7B1' : '#E74C3C',
      whatsNewBg: isLight ? '#AEB6BF' : '#2C3E50',
      whatsNewBgSecondary: isLight ? '#F4F6F6' : '#1C2833',
      btnProgress: isLight ? '#212F3D' : '#FBFCFC',
      searchBg: isLight ? 'black' : 'white',
    };
  },
});
