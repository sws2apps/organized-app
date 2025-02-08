import { getI18n } from 'react-i18next';

export const getTranslation = ({
  key,
  language,
  params = {},
}: {
  key: string;
  language?: string;
  params?: object;
}) => {
  const i18n = getI18n();

  if (i18n) {
    if (!language) language = i18n.language;

    return i18n.t(key, { lng: language, ...params });
  }
};

export const generateWeekday = (language?: string) => {
  const result: string[] = [
    getTranslation({ key: 'tr_monday', language }),
    getTranslation({ key: 'tr_tuesday', language }),
    getTranslation({ key: 'tr_wednesday', language }),
    getTranslation({ key: 'tr_thursday', language }),
    getTranslation({ key: 'tr_friday', language }),
    getTranslation({ key: 'tr_saturday', language }),
    getTranslation({ key: 'tr_sunday', language }),
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
  return getTranslation({ key: code });
};

export const handleAppChangeLanguage = (lang) => {
  const I18n = getI18n();

  I18n.changeLanguage(lang);
};

export const generateMonthNames = (language?: string) => {
  const months: string[] = [
    getTranslation({ key: 'tr_january', language }),
    getTranslation({ key: 'tr_february', language }),
    getTranslation({ key: 'tr_march', language }),
    getTranslation({ key: 'tr_april', language }),
    getTranslation({ key: 'tr_may', language }),
    getTranslation({ key: 'tr_june', language }),
    getTranslation({ key: 'tr_july', language }),
    getTranslation({ key: 'tr_august', language }),
    getTranslation({ key: 'tr_september', language }),
    getTranslation({ key: 'tr_october', language }),
    getTranslation({ key: 'tr_november', language }),
    getTranslation({ key: 'tr_december', language }),
  ];

  return months;
};

export const generateMonthShortNames = (language?: string) => {
  const months: string[] = [
    getTranslation({ key: 'tr_januaryShort', language }),
    getTranslation({ key: 'tr_februaryShort', language }),
    getTranslation({ key: 'tr_marchShort', language }),
    getTranslation({ key: 'tr_aprilShort', language }),
    getTranslation({ key: 'tr_mayShort', language }),
    getTranslation({ key: 'tr_juneShort', language }),
    getTranslation({ key: 'tr_julyShort', language }),
    getTranslation({ key: 'tr_augustShort', language }),
    getTranslation({ key: 'tr_septemberShort', language }),
    getTranslation({ key: 'tr_octoberShort', language }),
    getTranslation({ key: 'tr_novemberShort', language }),
    getTranslation({ key: 'tr_decemberShort', language }),
  ];

  return months;
};
