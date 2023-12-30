import { getI18n } from 'react-i18next';

export const getTranslation = ({
  key,
  namespace = 'ui',
  language,
  params = {},
}: {
  key: string;
  namespace?: string;
  language?: string;
  params?: object;
}) => {
  const i18n = getI18n();

  if (!language) language = 'e';

  if (i18n) {
    return i18n.t(key, { lng: language, ns: namespace, ...params });
  }
};

export const generateMonths = () => {
  const months = [];

  months.push(getTranslation({ key: 'january' }));
  months.push(getTranslation({ key: 'february' }));
  months.push(getTranslation({ key: 'march' }));
  months.push(getTranslation({ key: 'april' }));
  months.push(getTranslation({ key: 'may' }));
  months.push(getTranslation({ key: 'june' }));
  months.push(getTranslation({ key: 'july' }));
  months.push(getTranslation({ key: 'august' }));
  months.push(getTranslation({ key: 'september' }));
  months.push(getTranslation({ key: 'october' }));
  months.push(getTranslation({ key: 'november' }));
  months.push(getTranslation({ key: 'december' }));

  return months;
};

export const getShortDateFormat = () => {
  return getTranslation({ key: 'shortDateFormat' });
};

export const getShortDatePickerFormat = () => {
  return getTranslation({ key: 'shortDatePickerFormat' });
};

export const getMessageByCode = (code) => {
  switch (code) {
    case 'DEVICE_REMOVED':
      return getTranslation({ key: 'trans_deviceRemoved' });
    case 'INPUT_INVALID':
      return getTranslation({ key: 'trans_inputInvalid' });
    case 'POCKET_NOT_FOUND':
      return getTranslation({ key: 'trans_pocketNotFound' });
    case 'TOKEN_INVALID':
      return getTranslation({ key: 'trans_mfaTokenInvalidExpired' });
    case 'INTERNAL_ERROR':
      return getTranslation({ key: 'trans_internalError' });
    case 'Failed to fetch':
      return getTranslation({ key: 'trans_oauthError' });
    case 'sourceNotFoundUnavailable':
      return getTranslation({ key: 'trans_sourceNotFoundUnavailable' });
    case 'BACKUP_DISCREPANCY':
      return getTranslation({ key: 'trans_backupDiscrepancy' });
    case 'auth/account-exists-with-different-credential':
      return getTranslation({ key: 'trans_oauthAccountExistsWithDifferentCredential' });
    default:
      return code;
  }
};

export const handleAppChangeLanguage = (lang) => {
  const I18n = getI18n();

  I18n.changeLanguage(lang);
};
