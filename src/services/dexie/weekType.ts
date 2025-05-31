import { getTranslation } from '@services/i18n/translation';
import { getListLanguages } from '@services/app';
import { Week } from '@definition/week_type';
import appDb from '@db/appDb';

export const dbWeekTypeUpdate = async () => {
  const translationMap = {
    normWeekObj: 'tr_normalWeek',
    coWeekObj: 'tr_circuitOverseerWeek',
    caWeekObj: 'tr_assemblyWeek',
    covWeekObj: 'tr_conventionWeek',
    memorialWeekObj: 'tr_memorialWeek',
    specialTalkWeekObj: 'tr_specialTalkWeek',
    noMeetingWeekObj: 'tr_noMeeting',
    treasuresObj: 'tr_treasuresPartOnly',
    studentsObj: 'tr_studentsAssignmentsOnly',
    livingObj: 'tr_livingPartOnly',
    treasuresStudentsObj: 'tr_treasuresStudentsParts',
    studentsLivingObj: 'tr_studentsLivingParts',
    publicTalkObj: 'tr_publicTalkOnly',
    wtStudyObj: 'tr_watchtowerStudyOnly',
    specialTalkOnlyObj: 'tr_specialTalkOnly',
  };

  const resultObjects: Record<string, Record<string, string>> = {};

  for (const key in translationMap) {
    resultObjects[key] = {};
  }

  const languages = await getListLanguages();

  for (const lang of languages) {
    const locale = lang.locale;

    for (const [objKey, translationKey] of Object.entries(translationMap)) {
      resultObjects[objKey][lang.code] = getTranslation({
        key: translationKey,
        language: locale,
      });
    }
  }

  await appDb.week_type.clear();

  await appDb.week_type.bulkPut([
    {
      id: Week.NORMAL,
      sort_index: 1,
      language_group: false,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...resultObjects.normWeekObj },
    },
    {
      id: Week.CO_VISIT,
      sort_index: 2,
      language_group: false,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...resultObjects.coWeekObj },
    },
    {
      id: Week.ASSEMBLY,
      sort_index: 4,
      language_group: false,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...resultObjects.caWeekObj },
    },
    {
      id: Week.CONVENTION,
      sort_index: 3,
      language_group: false,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...resultObjects.covWeekObj },
    },
    {
      id: Week.MEMORIAL,
      sort_index: 5,
      language_group: false,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...resultObjects.memorialWeekObj },
    },
    {
      id: Week.SPECIAL_TALK,
      sort_index: 6,
      language_group: false,
      meeting: ['weekend'],
      week_type_name: { ...resultObjects.specialTalkWeekObj },
    },
    {
      id: Week.TREASURES_PART,
      sort_index: 7,
      language_group: true,
      meeting: ['midweek'],
      week_type_name: { ...resultObjects.treasuresObj },
    },
    {
      id: Week.TREASURES_STUDENTS,
      sort_index: 8,
      language_group: true,
      meeting: ['midweek'],
      week_type_name: { ...resultObjects.treasuresStudentsObj },
    },
    {
      id: Week.STUDENTS_ASSIGNMENTS,
      sort_index: 9,
      language_group: true,
      meeting: ['midweek'],
      week_type_name: { ...resultObjects.studentsObj },
    },
    {
      id: Week.STUDENTS_LIVING,
      sort_index: 10,
      language_group: true,
      meeting: ['midweek'],
      week_type_name: { ...resultObjects.studentsLivingObj },
    },
    {
      id: Week.LIVING_PART,
      sort_index: 11,
      language_group: true,
      meeting: ['midweek'],
      week_type_name: { ...resultObjects.livingObj },
    },

    {
      id: Week.PUBLIC_TALK,
      sort_index: 12,
      language_group: true,
      meeting: ['weekend'],
      week_type_name: { ...resultObjects.publicTalkObj },
    },
    {
      id: Week.SPECIAL_TALK_ONLY,
      sort_index: 13,
      language_group: true,
      meeting: ['weekend'],
      week_type_name: { ...resultObjects.specialTalkOnlyObj },
    },
    {
      id: Week.WATCHTOWER_STUDY,
      sort_index: 14,
      language_group: true,
      meeting: ['weekend'],
      week_type_name: { ...resultObjects.wtStudyObj },
    },

    {
      id: Week.NO_MEETING,
      sort_index: 20,
      language_group: false,
      meeting: ['midweek', 'weekend'],
      week_type_name: { ...resultObjects.noMeetingWeekObj },
    },
  ]);
};
