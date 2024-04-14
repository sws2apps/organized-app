import { getI18n } from 'react-i18next';

export const publicTalksBuildList = (language: string) => {
  const talks = getI18n().options.resources[language].talks;
  console.log(talks);
};
