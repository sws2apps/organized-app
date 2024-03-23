import { LANGUAGE_LIST } from '@constants/index';
import { appDb } from '@services/dexie';
import { getTranslation } from '@services/i18n/translation';

export const updateWeekType = async () => {
  const normWeekObj = {};
  const tgWeekObj = {};
  const coWeekObj = {};
  const caWeekObj = {};

  LANGUAGE_LIST.forEach((lang) => {
    const langCode = lang.code.toUpperCase();

    normWeekObj[langCode] = getTranslation({ key: 'tr_normalWeek', namespace: 'source' });
    tgWeekObj[langCode] = getTranslation({ key: 'tr_circuitOverseerWeek', namespace: 'source' });
    caWeekObj[langCode] = getTranslation({ key: 'tr_assemblyWeek', namespace: 'source' });
    coWeekObj[langCode] = getTranslation({ key: 'tr_conventionWeek', namespace: 'source' });
  });

  await appDb.week_type.clear();

  await appDb.week_type.put({ id_week_type: 1, sort_index: 1, week_type_name: { ...normWeekObj } });
  await appDb.week_type.put({ id_week_type: 2, sort_index: 2, week_type_name: { ...tgWeekObj } });
  await appDb.week_type.put({ id_week_type: 3, sort_index: 4, week_type_name: { ...coWeekObj } });
  await appDb.week_type.put({ id_week_type: 4, sort_index: 3, week_type_name: { ...caWeekObj } });
};

export const updateAssignmentType = async () => {
  const bReadObj = {};
  const initCallObj = {};
  const rvObj = {};
  const bsObj = {};
  const talkObj = {};
  const icVideoObj = {};
  const rvVideoObj = {};
  const otherObj = {};
  const memorialObj = {};
  const memorialVideoObj = {};
  const chairmanMMObj = {};
  const prayerMMObj = {};
  const tgwTalkObj = {};
  const tgwGemsObj = {};
  const lcPartObj = {};
  const cbsConductorObj = {};
  const cbsReaderObj = {};
  const initCallVariationsObj: { [language: string]: string } = {};
  const rvVariationsObj: { [language: string]: string } = {};
  const chairmanWMObj = {};
  const prayerWMObj = {};
  const speakerObj = {};
  const speakerSymposiumObj = {};
  const wtStudyReaderObj = {};

  LANGUAGE_LIST.forEach((lang) => {
    const langCode = lang.code.toUpperCase();

    bReadObj[langCode] = getTranslation({ key: 'tr_bibleReading', namespace: 'source' });
    initCallObj[langCode] = getTranslation({ key: 'tr_initialCall', namespace: 'source' });
    rvObj[langCode] = getTranslation({ key: 'tr_returnVisit', namespace: 'source' });
    bsObj[langCode] = getTranslation({ key: 'tr_bibleStudy', namespace: 'source' });
    talkObj[langCode] = getTranslation({ key: 'tr_talk', namespace: 'source' });
    otherObj[langCode] = getTranslation({ key: 'tr_otherPart', namespace: 'source' });
    icVideoObj[langCode] = getTranslation({ key: 'tr_initialCallVideo', namespace: 'source' });
    rvVideoObj[langCode] = getTranslation({ key: 'tr_returnVisitVideo', namespace: 'source' });
    memorialObj[langCode] = getTranslation({ key: 'tr_memorialInvite', namespace: 'source' });
    memorialVideoObj[langCode] = getTranslation({
      key: 'tr_memorialInviteVideo',
      language: lang.code,
      namespace: 'source',
    });
    chairmanMMObj[langCode] = getTranslation({
      key: 'tr_chairmanMidweekMeeting',
      language: lang.code,
      namespace: 'source',
    });
    prayerMMObj[langCode] = getTranslation({ key: 'tr_prayerMidweekMeeting', namespace: 'source' });
    tgwTalkObj[langCode] = getTranslation({ key: 'tr_tgwTalk', namespace: 'source' });
    tgwGemsObj[langCode] = getTranslation({ key: 'tr_tgwGems', namespace: 'source' });
    lcPartObj[langCode] = getTranslation({ key: 'tr_lcPart', namespace: 'source' });
    cbsConductorObj[langCode] = getTranslation({ key: 'tr_cbsConductor', namespace: 'source' });
    cbsReaderObj[langCode] = getTranslation({ key: 'tr_cbsReader', namespace: 'source' });
    initCallVariationsObj[langCode] = getTranslation({
      key: 'tr_initialCallVariations',
      language: lang.code,
      namespace: 'source',
    });
    rvVariationsObj[langCode] = getTranslation({
      key: 'tr_returnVisitVariations',
      language: lang.code,
      namespace: 'source',
    });
    chairmanWMObj[langCode] = getTranslation({
      key: 'tr_chairmanWeekendMeeting',
      language: lang.code,
      namespace: 'source',
    });
    prayerWMObj[langCode] = getTranslation({ key: 'tr_prayerWeekendMeeting', namespace: 'source' });
    speakerObj[langCode] = getTranslation({ key: 'tr_speaker', namespace: 'source' });
    speakerSymposiumObj[langCode] = getTranslation({
      key: 'tr_speakerSymposium',
      language: lang.code,
      namespace: 'source',
    });
    wtStudyReaderObj[langCode] = getTranslation({ key: 'tr_wtStudyReader', namespace: 'source' });
  });

  await appDb.assignment.clear();

  await appDb.assignment.put({
    code: 100,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...bReadObj,
    },
    id_type: 1,
  });

  await appDb.assignment.put({
    code: 101,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...initCallObj,
    },
    id_type: 2,
  });

  await appDb.assignment.put({
    code: 102,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...rvObj,
    },
    id_type: 3,
  });

  await appDb.assignment.put({
    code: 103,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...bsObj,
    },
    id_type: 4,
  });

  await appDb.assignment.put({
    code: 104,
    maleOnly: true,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...talkObj,
    },
    id_type: 5,
  });

  await appDb.assignment.put({
    code: 105,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...icVideoObj,
    },
    id_type: 6,
  });

  await appDb.assignment.put({
    code: 106,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...rvVideoObj,
    },
    id_type: 7,
  });

  await appDb.assignment.put({
    code: 107,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...otherObj,
    },
    id_type: 8,
  });

  await appDb.assignment.put({
    code: 108,
    linkTo: 101,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...memorialObj,
    },
    id_type: 9,
  });

  await appDb.assignment.put({
    code: 110,
    maleOnly: true,
    assignable: true,
    type: 'mm',
    assignment_type_name: {
      ...chairmanMMObj,
    },
    id_type: 10,
  });

  await appDb.assignment.put({
    code: 111,
    maleOnly: true,
    assignable: true,
    type: 'mm',
    assignment_type_name: {
      ...prayerMMObj,
    },
    id_type: 11,
  });

  await appDb.assignment.put({
    code: 112,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...tgwTalkObj,
    },
    id_type: 12,
  });

  await appDb.assignment.put({
    code: 113,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...tgwGemsObj,
    },
    id_type: 13,
  });

  await appDb.assignment.put({
    code: 114,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...lcPartObj,
    },
    id_type: 14,
  });

  await appDb.assignment.put({
    code: 115,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...cbsConductorObj,
    },
    id_type: 15,
  });

  await appDb.assignment.put({
    code: 116,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...cbsReaderObj,
    },
    id_type: 16,
  });

  await appDb.assignment.put({
    code: 117,
    linkTo: 105,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...memorialVideoObj,
    },
    id_type: 17,
  });

  await appDb.assignment.put({
    code: 118,
    assignment_type_name: {
      ...chairmanWMObj,
    },
    id_type: 18,
  });

  await appDb.assignment.put({
    code: 119,
    assignment_type_name: {
      ...prayerWMObj,
    },
    id_type: 19,
  });

  await appDb.assignment.put({
    code: 120,
    assignment_type_name: {
      ...speakerObj,
    },
    id_type: 20,
  });

  await appDb.assignment.put({
    code: 121,
    assignment_type_name: {
      ...speakerSymposiumObj,
    },
    id_type: 21,
  });

  await appDb.assignment.put({
    code: 122,
    assignment_type_name: {
      ...wtStudyReaderObj,
    },
    id_type: 22,
  });

  // handle initial call variation (140-169)
  let codeIndice = 140;
  for (const [key, value] of Object.entries(initCallVariationsObj)) {
    if (value && value !== '0' && codeIndice < 170) {
      const variations = value.split('|');
      for await (const variation of variations) {
        await appDb.assignment.put({
          code: codeIndice,
          linkTo: 101,
          assignable: false,
          type: 'ayf',
          assignment_type_name: {
            [key]: variation,
          },
          id_type: codeIndice,
        });

        codeIndice++;
      }
    }
  }

  // handle return call variation (170-199)
  codeIndice = 170;
  for (const [key, value] of Object.entries(rvVariationsObj)) {
    if (value && value !== '0' && codeIndice < 200) {
      const variations = value.split('|');
      for await (const variation of variations) {
        await appDb.assignment.put({
          code: codeIndice,
          linkTo: 102,
          assignable: false,
          type: 'ayf',
          assignment_type_name: {
            [key]: variation,
          },
          id_type: codeIndice,
        });

        codeIndice++;
      }
    }
  }
};
