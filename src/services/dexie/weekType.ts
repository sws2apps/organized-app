import { LANGUAGE_LIST } from '@constants/index';
import { getTranslation } from '@services/i18n/translation';
import appDb from '@db/appDb';

export const dbWeekTypeUpdate = async () => {
  const normWeekObj = {};
  const tgWeekObj = {};
  const coWeekObj = {};
  const caWeekObj = {};
  const memorialWeekObj = {};
  const noMeetingWeekObj = {};

  LANGUAGE_LIST.forEach((lang) => {
    const locale = lang.locale.toUpperCase();

    normWeekObj[locale] = getTranslation({ key: 'tr_normalWeek' });
    tgWeekObj[locale] = getTranslation({ key: 'tr_circuitOverseerWeek' });
    caWeekObj[locale] = getTranslation({ key: 'tr_assemblyWeek' });
    coWeekObj[locale] = getTranslation({ key: 'tr_conventionWeek' });
    memorialWeekObj[locale] = getTranslation({ key: 'tr_memorialWeek' });
    noMeetingWeekObj[locale] = getTranslation({ key: 'tr_noMeeting' });
  });

  await appDb.week_type.clear();

  await appDb.week_type.bulkPut([
    { id: 1, sort_index: 1, week_type_name: { ...normWeekObj } },
    { id: 2, sort_index: 2, week_type_name: { ...tgWeekObj } },
    { id: 3, sort_index: 4, week_type_name: { ...coWeekObj } },
    { id: 4, sort_index: 3, week_type_name: { ...caWeekObj } },
    { id: 5, sort_index: 5, week_type_name: { ...memorialWeekObj } },
    { id: 20, sort_index: 20, week_type_name: { ...noMeetingWeekObj } },
  ]);
};
