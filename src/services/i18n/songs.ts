import { getI18n } from 'react-i18next';
import { SongType } from '@definition/songs';
import { LANGUAGE_LIST } from '@constants/index';

export const songsBuildList = (language: string) => {
  const identifier =
    LANGUAGE_LIST.find((record) => record.locale === language)?.identifier ||
    language;

  const translations = getI18n().options.resources[identifier].songs;

  const result: SongType[] = [];
  for (const [key, value] of Object.entries(translations)) {
    const number = +key.split('_')[2];

    result.push({
      song_number: number,
      song_title: value,
    });
  }

  return result;
};
