import { useTranslation } from 'react-i18next';

const useAppTranslation = (props?: string) => {
  const namespace = props || 'ui';

  const { t, i18n } = useTranslation(namespace);

  return { t, i18n };
};

export default useAppTranslation;
