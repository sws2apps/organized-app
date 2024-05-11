import { getI18n } from 'react-i18next';

export const getTranslation = ({ key, language, params = {} }: { key: string; language?: string; params?: object }) => {
  const i18n = getI18n();

  if (i18n) {
    if (!language) language = i18n.language;

    return i18n.t(key, { lng: language, ...params });
  }
};

export const generateWeekday = () => {
  const result: string[] = [
    getTranslation({ key: 'tr_monday' }),
    getTranslation({ key: 'tr_tuesday' }),
    getTranslation({ key: 'tr_wednesday' }),
    getTranslation({ key: 'tr_thursday' }),
    getTranslation({ key: 'tr_friday' }),
    getTranslation({ key: 'tr_saturday' }),
    getTranslation({ key: 'tr_sunday' }),
  ];

  return result;
};

export const getShortDateFormat = () => {
  return getTranslation({ key: 'shortDateFormat' });
};

export const getShortDatePickerFormat = () => {
  return getTranslation({ key: 'shortDatePickerFormat' });
};

export const getMessageByCode = (code: string) => {
  switch (code) {
    case 'DEVICE_REMOVED':
      return getTranslation({ key: 'tr_deviceRemoved' });
    case 'INPUT_INVALID':
      return getTranslation({ key: 'tr_inputInvalid' });
    case 'POCKET_NOT_FOUND':
      return getTranslation({ key: 'tr_pocketNotFound' });
    case 'TOKEN_INVALID':
      return getTranslation({ key: 'tr_2FATokenInvalidExpired' });
    case 'INTERNAL_ERROR':
      return getTranslation({ key: 'tr_internalError' });
    case 'Failed to fetch':
      return getTranslation({ key: 'tr_oauthError' });
    case 'sourceNotFoundUnavailable':
      return getTranslation({ key: 'tr_sourceNotFoundUnavailable' });
    case 'BACKUP_DISCREPANCY':
      return getTranslation({ key: 'tr_backupDiscrepancy' });
    case 'auth/account-exists-with-different-credential':
      return getTranslation({ key: 'tr_oauthAccountExistsWithDifferentCredential' });
    default:
      return code;
  }
};

export const handleAppChangeLanguage = (lang) => {
  const I18n = getI18n();

  I18n.changeLanguage(lang);
};
