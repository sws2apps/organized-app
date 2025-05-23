import { getI18n } from 'react-i18next';
import { PublicTalkType } from '@definition/public_talks';

export const publicTalksBuildList = (language: string) => {
  const resource = getI18n().options.resources[language];

  if (!resource) return [];

  const translations = resource.talks;

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
