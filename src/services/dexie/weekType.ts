import { getTranslation } from '@services/i18n/translation';
import appDb from '@db/appDb';

export const dbWeekTypeUpdate = async () => {
  const normWeekObj = {};
  const tgWeekObj = {};
  const coWeekObj = {};
  const caWeekObj = {};
  const memorialWeekObj = {};
  const specialTalkWeekObj = {};
  const noMeetingWeekObj = {};

  const language = localStorage.getItem('ui_lang') || 'en';

  const languages = [language];

  if (!languages.includes('en')) languages.push('en');

  for (const lang of languages) {
    const locale = lang.toUpperCase();

    normWeekObj[locale] = getTranslation({
      key: 'tr_normalWeek',
      language: lang,
    });
    tgWeekObj[locale] = getTranslation({
      key: 'tr_circuitOverseerWeek',
      language: lang,
    });
    caWeekObj[locale] = getTranslation({
      key: 'tr_assemblyWeek',
      language: lang,
    });
    coWeekObj[locale] = getTranslation({
      key: 'tr_conventionWeek',
      language: lang,
    });
    memorialWeekObj[locale] = getTranslation({
      key: 'tr_memorialWeek',
      language: lang,
    });
    specialTalkWeekObj[locale] = getTranslation({
      key: 'tr_specialTalkWeek',
      language: lang,
    });
    noMeetingWeekObj[locale] = getTranslation({
      key: 'tr_noMeeting',
      language: lang,
    });
  }

  await appDb.week_type.clear();

  await appDb.week_type.bulkPut([
    {
      id: 1,
      sort_index: 1,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...normWeekObj },
    },
    {
      id: 2,
      sort_index: 2,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...tgWeekObj },
    },
    {
      id: 3,
      sort_index: 4,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...caWeekObj },
    },
    {
      id: 4,
      sort_index: 3,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...coWeekObj },
    },
    {
      id: 5,
      sort_index: 5,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...memorialWeekObj },
    },
    {
      id: 6,
      sort_index: 6,
      meeting: ['weekend'],
      week_type_name: { ...specialTalkWeekObj },
    },
    {
      id: 20,
      sort_index: 20,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...noMeetingWeekObj },
    },
  ]);
};
