import { getI18n } from 'react-i18next';
import { PublicTalkType } from '@definition/public_talks';
import { LANGUAGE_LIST } from '@constants/index';

export const publicTalksBuildList = (language: string) => {
  const identifier =
    LANGUAGE_LIST.find((record) => record.locale === language)?.identifier ||
    language;

  const translations = getI18n().options.resources[identifier].talks;

  const result: PublicTalkType[] = [];
  for (const [key, value] of Object.entries(translations)) {
    const number = +key.split('_')[2];

    result.push({
      talk_number: number,
      talk_title: value,
    });
  }

  return result;
};
