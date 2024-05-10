import { getI18n } from 'react-i18next';

export const publicTalksBuildList = (language) => {
  const translations = getI18n().options.resources[language].talks;

  const result = [];
  for (const [key, value] of Object.entries(translations)) {
    const number = +key.split('_')[2];

    result.push({
      talk_number: number,
      talk_title: value,
    });
  }

  return result;
};
