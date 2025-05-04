import { useAtomValue } from 'jotai';
import useLanguage from '../features/language_switcher/useLanguage';
import { appLangChangeFrom, appLangState } from '@states/app';
import { useEffect } from 'react';

const useDetectBrowserLanguage = () => {
  const { LANGUAGE_LIST, handleLangChange } = useLanguage();
  const appLanguage = useAtomValue(appLangState);
  const appLanguageChangeFrom = useAtomValue(appLangChangeFrom);

  useEffect(() => {
    const navigatorLanguage = navigator.language;
    if (appLanguage) {
      const currentLanguage = LANGUAGE_LIST.find((lang) =>
        lang.threeLettersCode.includes(appLanguage)
      );

      if (!currentLanguage) return;

      const currentLocalLanguage = currentLanguage.locale.split('-')[0];
      const browserLocalLanguage = navigatorLanguage.split('-')[0];

      if (
        currentLocalLanguage !== browserLocalLanguage &&
        !appLanguageChangeFrom
      ) {
        const browserLanguage = LANGUAGE_LIST.find(
          (lang) =>
            lang.locale.includes(navigatorLanguage) ||
            lang.locale.split('-')[0] === navigatorLanguage.split('-')[0]
        );

        if (!browserLanguage) return;

        handleLangChange(browserLanguage.locale);
      }
    }
  }, [appLanguage, LANGUAGE_LIST, handleLangChange, appLanguageChangeFrom]);
};

export default useDetectBrowserLanguage;
