import { getI18n } from 'react-i18next';

export const displayError = (type) => {
  const { t } = getI18n();

  switch (type) {
    case 'sourceNotFoundUnavailable':
      return t('sourceNotFoundUnavailable', { ns: 'ui' });
    default:
      return t('errorTryAgain', { ns: 'ui' });
  }
};
