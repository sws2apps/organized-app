import { LANGUAGE_LIST } from '@constants/index';
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

    if (language) {
      const identifier =
        LANGUAGE_LIST.find((record) => record.locale === language)
          ?.identifier || language;

      language = identifier;
    }

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
  return getTranslation({ key: code });
};

export const handleAppChangeLanguage = (lang) => {
  const I18n = getI18n();

  I18n.changeLanguage(lang);
};

export const generateMonthNames = () => {
  const months: string[] = [
    getTranslation({ key: 'tr_january' }),
    getTranslation({ key: 'tr_february' }),
    getTranslation({ key: 'tr_march' }),
    getTranslation({ key: 'tr_april' }),
    getTranslation({ key: 'tr_may' }),
    getTranslation({ key: 'tr_june' }),
    getTranslation({ key: 'tr_july' }),
    getTranslation({ key: 'tr_august' }),
    getTranslation({ key: 'tr_september' }),
    getTranslation({ key: 'tr_october' }),
    getTranslation({ key: 'tr_november' }),
    getTranslation({ key: 'tr_december' }),
  ];

  return months;
};

export const generateMonthShortNames = () => {
  const months: string[] = [
    getTranslation({ key: 'tr_januaryShort' }),
    getTranslation({ key: 'tr_februaryShort' }),
    getTranslation({ key: 'tr_marchShort' }),
    getTranslation({ key: 'tr_aprilShort' }),
    getTranslation({ key: 'tr_mayShort' }),
    getTranslation({ key: 'tr_juneShort' }),
    getTranslation({ key: 'tr_julyShort' }),
    getTranslation({ key: 'tr_augustShort' }),
    getTranslation({ key: 'tr_septemberShort' }),
    getTranslation({ key: 'tr_octoberShort' }),
    getTranslation({ key: 'tr_novemberShort' }),
    getTranslation({ key: 'tr_decemberShort' }),
  ];

  return months;
};
