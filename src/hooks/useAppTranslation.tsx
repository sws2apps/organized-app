import { useTranslation } from 'react-i18next';
import { getAppLang } from '@services/app';

const useHookTranslation = () => {
  const appLang = getAppLang();

  const { t, i18n } = useTranslation('ui', { lng: appLang });

  return { t, i18n };
};

export default useHookTranslation;
