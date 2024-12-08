import { LANGUAGE_LIST } from '@constants/index';
import { useTranslation } from 'react-i18next';

const useHookTranslation = () => {
  const appLang = localStorage.getItem('ui_lang') || 'en';

  const identifier =
    LANGUAGE_LIST.find((record) => record.locale === appLang)?.identifier ||
    appLang;

  const { t, i18n } = useTranslation('ui', { lng: identifier });

  return { t, i18n };
};

export default useHookTranslation;
