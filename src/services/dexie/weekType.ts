import { LANGUAGE_LIST } from '@constants/index';
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

  let language = localStorage.getItem('ui_lang') || 'eng';

  if (language === 'en') language = 'eng';

  if (language.includes('-')) {
    const appLang =
      LANGUAGE_LIST.find((record) => record.locale === appLang)
        ?.threeLettersCode || 'eng';
  }

  const settings = await appDb.app_settings.get(1);
  const dataView = settings.user_settings.data_view;

  const jwLang =
    settings.cong_settings.source_material?.language.find(
      (record) => record.type === dataView
    ).value || 'E';

  const sourceLang = LANGUAGE_LIST.find(
    (record) => record.code.toUpperCase() === jwLang
  ).threeLettersCode;

  const languages = [{ locale: sourceLang, code: jwLang.toUpperCase() }];

  if (sourceLang !== 'eng') {
    languages.push({ code: 'E', locale: 'eng' });
  }

  for (const lang of languages) {
    const locale = lang.locale;

    normWeekObj[lang.code] = getTranslation({
      key: 'tr_normalWeek',
      language: locale,
    });
    tgWeekObj[lang.code] = getTranslation({
      key: 'tr_circuitOverseerWeek',
      language: locale,
    });
    caWeekObj[lang.code] = getTranslation({
      key: 'tr_assemblyWeek',
      language: locale,
    });
    coWeekObj[lang.code] = getTranslation({
      key: 'tr_conventionWeek',
      language: locale,
    });
    memorialWeekObj[lang.code] = getTranslation({
      key: 'tr_memorialWeek',
      language: locale,
    });
    specialTalkWeekObj[lang.code] = getTranslation({
      key: 'tr_specialTalkWeek',
      language: locale,
    });
    noMeetingWeekObj[lang.code] = getTranslation({
      key: 'tr_noMeeting',
      language: locale,
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
