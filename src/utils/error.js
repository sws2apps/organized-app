import { getI18n } from 'react-i18next';
import { promiseSetRecoil } from 'recoil-outside';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';

export const displayError = (type) => {
  const { t } = getI18n();

  switch (type) {
    case 'sourceNotFoundUnavailable':
      return t('sourceNotFoundUnavailable', { ns: 'ui' });
    default:
      return t('errorTryAgain', { ns: 'ui' });
  }
};

export const displayMultiProviderAuthError = async () => {
  const { t } = getI18n();
  await promiseSetRecoil(appMessageState, t('oauthAccountExistsWithDifferentCredential', { ns: 'ui' }));
  await promiseSetRecoil(appSeverityState, 'warning');
  await promiseSetRecoil(appSnackOpenState, true);
};
