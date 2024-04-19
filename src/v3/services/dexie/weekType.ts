import { LANGUAGE_LIST } from '@constants/index';
import { getTranslation } from '@services/i18n/translation';
import appDb from '@shared/indexedDb/appDb';

export const dbWeekTypeUpdate = async () => {
  const normWeekObj = {};
  const tgWeekObj = {};
  const coWeekObj = {};
  const caWeekObj = {};

  LANGUAGE_LIST.forEach((lang) => {
    const langCode = lang.code.toUpperCase();

    normWeekObj[langCode] = getTranslation({ key: 'tr_normalWeek' });
    tgWeekObj[langCode] = getTranslation({ key: 'tr_circuitOverseerWeek' });
    caWeekObj[langCode] = getTranslation({ key: 'tr_assemblyWeek' });
    coWeekObj[langCode] = getTranslation({ key: 'tr_conventionWeek' });
  });

  await appDb.week_type.clear();

  await appDb.week_type.put({ id: 1, sort_index: 1, week_type_name: { ...normWeekObj } });
  await appDb.week_type.put({ id: 2, sort_index: 2, week_type_name: { ...tgWeekObj } });
  await appDb.week_type.put({ id: 3, sort_index: 4, week_type_name: { ...coWeekObj } });
  await appDb.week_type.put({ id: 4, sort_index: 3, week_type_name: { ...caWeekObj } });
};
