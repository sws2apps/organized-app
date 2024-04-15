import { getI18n } from 'react-i18next';
import { promiseSetRecoil } from 'recoil-outside';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';

export const displayError = (type) => {
  const { t } = getI18n();

  if (type === 'sourceNotFoundUnavailable') {
    return t('sourceNotFoundUnavailable', { ns: 'ui' });
  }

  if (type === 'INTERNAL_ERROR') {
    return t('internalError', { ns: 'ui' });
  }

  if (type === 'BACKUP_DISCREPANCY') {
    return t('backupDiscrepancy', { ns: 'ui' });
  }

  return type;
};

export const displayMultiProviderAuthError = async () => {
  const { t } = getI18n();
  await promiseSetRecoil(appMessageState, t('oauthAccountExistsWithDifferentCredential', { ns: 'ui' }));
  await promiseSetRecoil(appSeverityState, 'warning');
  await promiseSetRecoil(appSnackOpenState, true);
};
