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
      const currentLocalLanguage = LANGUAGE_LIST.find((lang) =>
        lang.threeLettersCode.includes(appLanguage)
      ).locale.split('-')[0];
      if (
        currentLocalLanguage !== navigatorLanguage &&
        !appLanguageChangeFrom
      ) {
        handleLangChange(
          LANGUAGE_LIST.find((lang) => lang.locale.includes(navigatorLanguage))
            .locale
        );
      }
    }
  }, [appLanguage, LANGUAGE_LIST, handleLangChange, appLanguageChangeFrom]);
};

export default useDetectBrowserLanguage;
