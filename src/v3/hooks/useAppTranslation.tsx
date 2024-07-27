import { useTranslation } from 'react-i18next';

const useAppTranslation = () => {
  const { t, i18n } = useTranslation();

  return { t, i18n };
};

export default useAppTranslation;
