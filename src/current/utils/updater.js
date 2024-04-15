import { getI18n } from 'react-i18next';
import appDb from '../../shared/indexedDb/mainDb';
import { LANGUAGE_LIST } from '../../shared/locales/langList.js';
import { loadApp } from './app';
import { Setting } from '../classes/Setting';
import { Persons } from '../classes/Persons';
import { Schedules } from '../classes/Schedules';
import { saveAssignment } from './schedule';

export const runUpdater = async () => {
  await removeInvalidWeeks();
  await updateWeekType();
  await updateAssignmentType();
  await removeOutdatedSettings();
  await updatePersonAssignments();
  await checkAutoBackup();
  await removeDuplicateTimeAway();
  await removeAutoAssignedOpeningPrayer();
  await updateAssignments2024();
  await loadApp();
};

const removeOutdatedSettings = async () => {
  let appSettings = (await appDb.app_settings.toArray())[0];

  if (appSettings.crd) {
    delete appSettings.crd;
    await Setting.update(appSettings, true);
  }
  if (appSettings.pwd) {
    delete appSettings.pwd;
    await Setting.update(appSettings, true);
  }
  if (appSettings.userMe) {
    delete appSettings.userMe;
    await Setting.update(appSettings, true);
  }

  if (appSettings.pocket_local_id || appSettings.pocket_local_id === null) {
    delete appSettings.pocket_local_id;
    await Setting.update(appSettings, true);
  }

  if (appSettings.pocket_members) {
    delete appSettings.pocket_members;
    await Setting.update(appSettings, true);
  }

  if (appSettings.local_uid) {
    delete appSettings.local_uid;
    await Setting.update(appSettings, true);
  }
};

const updateWeekType = async () => {
  const { t } = getI18n();

  let normWeekObj = {};
  let tgWeekObj = {};
  let coWeekObj = {};
  let caWeekObj = {};

  const listSourceLangs = LANGUAGE_LIST.filter((lang) => lang.isSource === true);

  listSourceLangs.forEach((lang) => {
    const langCode = lang.code.toUpperCase();

    normWeekObj[langCode] = t('normalWeek', { lng: lang.code, ns: 'source' });
    tgWeekObj[langCode] = t('circuitOverseerWeek', { lng: lang.code, ns: 'source' });
    caWeekObj[langCode] = t('assemblyWeek', { lng: lang.code, ns: 'source' });
    coWeekObj[langCode] = t('conventionWeek', { lng: lang.code, ns: 'source' });
  });

  await appDb.week_type.clear();

  await appDb.week_type.put(
    {
      id_week_type: 1,
      sort_index: 1,
      week_type_name: {
        ...normWeekObj,
      },
    },
    1
  );

  await appDb.week_type.put(
    {
      id_week_type: 2,
      sort_index: 2,
      week_type_name: {
        ...tgWeekObj,
      },
    },
    2
  );

  await appDb.week_type.put(
    {
      id_week_type: 3,
      sort_index: 4,
      week_type_name: {
        ...coWeekObj,
      },
    },
    3
  );

  await appDb.week_type.put(
    {
      id_week_type: 4,
      sort_index: 3,
      week_type_name: {
        ...caWeekObj,
      },
    },
    4
  );
};

const updateAssignmentType = async () => {
  const { t } = getI18n();

  let bReadObj = {};
  let initCallObj = {};
  let rvObj = {};
  let bsObj = {};
  let talkObj = {};
  let icVideoObj = {};
  let rvVideoObj = {};
  let otherObj = {};
  let memorialObj = {};
  let memorialVideoObj = {};
  let chairmanMMObj = {};
  let prayerMMObj = {};
  let tgwTalkObj = {};
  let tgwGemsObj = {};
  let lcPartObj = {};
  let cbsConductorObj = {};
  let cbsReaderObj = {};
  let initCallVariationsObj = {};
  let rvVariationsObj = {};
  const chairmanWMObj = {};
  const prayerWMObj = {};
  const speakerObj = {};
  const speakerSymposiumObj = {};
  const wtStudyReaderObj = {};
  const startingConversationObj = {};
  const followingUpObj = {};
  const makingDisciplesObj = {};
  const explainingBeliefsObj = {};
  const dicussionObj = {};

  const listSourceLangs = LANGUAGE_LIST.filter((lang) => lang.isSource === true);

  listSourceLangs.forEach((lang) => {
    const langCode = lang.code.toUpperCase();

    bReadObj[langCode] = t('bibleReading', { lng: lang.code, ns: 'source' });
    initCallObj[langCode] = t('initialCall', { lng: lang.code, ns: 'source' });
    rvObj[langCode] = t('returnVisit', { lng: lang.code, ns: 'source' });
    bsObj[langCode] = t('bibleStudy', { lng: lang.code, ns: 'source' });
    talkObj[langCode] = t('talk', { lng: lang.code, ns: 'source' });
    otherObj[langCode] = t('otherPart', { lng: lang.code, ns: 'source' });
    icVideoObj[langCode] = t('initialCallVideo', { lng: lang.code, ns: 'source' });
    rvVideoObj[langCode] = t('returnVisitVideo', { lng: lang.code, ns: 'source' });
    memorialObj[langCode] = t('memorialInvite', { lng: lang.code, ns: 'source' });
    memorialVideoObj[langCode] = t('memorialInviteVideo', { lng: lang.code, ns: 'source' });
    chairmanMMObj[langCode] = t('chairmanMidweekMeeting', { lng: lang.code, ns: 'source' });
    prayerMMObj[langCode] = t('prayerMidweekMeeting', { lng: lang.code, ns: 'source' });
    tgwTalkObj[langCode] = t('tgwTalk', { lng: lang.code, ns: 'source' });
    tgwGemsObj[langCode] = t('tgwGems', { lng: lang.code, ns: 'source' });
    lcPartObj[langCode] = t('lcPart', { lng: lang.code, ns: 'source' });
    cbsConductorObj[langCode] = t('cbsConductor', { lng: lang.code, ns: 'source' });
    cbsReaderObj[langCode] = t('cbsReader', { lng: lang.code, ns: 'source' });
    initCallVariationsObj[langCode] = t('initialCallVariations', { lng: lang.code, ns: 'source' });
    rvVariationsObj[langCode] = t('returnVisitVariations', { lng: lang.code, ns: 'source' });
    chairmanWMObj[langCode] = t('chairmanWeekendMeeting', { lng: lang.code, ns: 'source' });
    prayerWMObj[langCode] = t('prayerWeekendMeeting', { lng: lang.code, ns: 'source' });
    speakerObj[langCode] = t('speaker', { lng: lang.code, ns: 'source' });
    speakerSymposiumObj[langCode] = t('speakerSymposium', { lng: lang.code, ns: 'source' });
    wtStudyReaderObj[langCode] = t('wtStudyReader', { lng: lang.code, ns: 'source' });
    startingConversationObj[langCode] = t('startingConversation', { lng: lang.code, ns: 'source' });
    followingUpObj[langCode] = t('followingUp', { lng: lang.code, ns: 'source' });
    makingDisciplesObj[langCode] = t('makingDisciples', { lng: lang.code, ns: 'source' });
    explainingBeliefsObj[langCode] = t('explainingBeliefs', { lng: lang.code, ns: 'source' });
    dicussionObj[langCode] = t('discussion', { lng: lang.code, ns: 'source' });
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
    id_type: 100,
  });

  await appDb.assignment.put({
    code: 101,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...initCallObj,
    },
    id_type: 101,
  });

  await appDb.assignment.put({
    code: 102,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...rvObj,
    },
    id_type: 102,
  });

  await appDb.assignment.put({
    code: 103,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...bsObj,
    },
    id_type: 103,
  });

  await appDb.assignment.put({
    code: 104,
    maleOnly: true,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...talkObj,
    },
    id_type: 104,
  });

  await appDb.assignment.put({
    code: 105,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...icVideoObj,
    },
    id_type: 105,
  });

  await appDb.assignment.put({
    code: 106,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...rvVideoObj,
    },
    id_type: 106,
  });

  await appDb.assignment.put({
    code: 107,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...otherObj,
    },
    id_type: 107,
  });

  await appDb.assignment.put({
    code: 108,
    linkTo: 101,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...memorialObj,
    },
    id_type: 108,
  });

  await appDb.assignment.put({
    code: 110,
    maleOnly: true,
    assignable: true,
    type: 'mm',
    assignment_type_name: {
      ...chairmanMMObj,
    },
    id_type: 110,
  });

  await appDb.assignment.put({
    code: 111,
    maleOnly: true,
    assignable: true,
    type: 'mm',
    assignment_type_name: {
      ...prayerMMObj,
    },
    id_type: 111,
  });

  await appDb.assignment.put({
    code: 112,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...tgwTalkObj,
    },
    id_type: 112,
  });

  await appDb.assignment.put({
    code: 113,
    maleOnly: true,
    assignable: true,
    type: 'tgw',
    assignment_type_name: {
      ...tgwGemsObj,
    },
    id_type: 113,
  });

  await appDb.assignment.put({
    code: 114,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...lcPartObj,
    },
    id_type: 114,
  });

  await appDb.assignment.put({
    code: 115,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...cbsConductorObj,
    },
    id_type: 115,
  });

  await appDb.assignment.put({
    code: 116,
    maleOnly: true,
    assignable: true,
    type: 'lc',
    assignment_type_name: {
      ...cbsReaderObj,
    },
    id_type: 116,
  });

  await appDb.assignment.put({
    code: 117,
    linkTo: 105,
    assignable: false,
    type: 'ayf',
    assignment_type_name: {
      ...memorialVideoObj,
    },
    id_type: 117,
  });

  await appDb.assignment.put({
    code: 118,
    assignment_type_name: {
      ...chairmanWMObj,
    },
    id_type: 118,
  });

  await appDb.assignment.put({
    code: 119,
    assignment_type_name: {
      ...prayerWMObj,
    },
    id_type: 119,
  });

  await appDb.assignment.put({
    code: 120,
    assignment_type_name: {
      ...speakerObj,
    },
    id_type: 120,
  });

  await appDb.assignment.put({
    code: 121,
    assignment_type_name: {
      ...speakerSymposiumObj,
    },
    id_type: 121,
  });

  await appDb.assignment.put({
    code: 122,
    assignment_type_name: {
      ...wtStudyReaderObj,
    },
    id_type: 122,
  });

  await appDb.assignment.put({
    code: 123,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...startingConversationObj,
    },
    id_type: 123,
  });

  await appDb.assignment.put({
    code: 124,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...followingUpObj,
    },
    id_type: 124,
  });

  await appDb.assignment.put({
    code: 125,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...makingDisciplesObj,
    },
    id_type: 125,
  });

  await appDb.assignment.put({
    code: 126,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...explainingBeliefsObj,
    },
    id_type: 126,
  });

  await appDb.assignment.put({
    code: 127,
    assignable: true,
    type: 'ayf',
    assignment_type_name: {
      ...dicussionObj,
    },
    id_type: 127,
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

const removeInvalidWeeks = async () => {
  const weekInvalids = ['01/26/2022', '07/26/2023'];

  for await (const weekInvalid of weekInvalids) {
    const srcData = await appDb.sources.get({ weekOf: weekInvalid });
    if (srcData) await appDb.sources.delete(srcData.weekOf);

    const schedData = await appDb.sched.get({ weekOf: weekInvalid });
    if (schedData) await appDb.sched.delete(schedData.weekOf);
  }
};

const updatePersonAssignments = async () => {
  if (Setting.personAssignmentsConverted === undefined || !Setting.personAssignmentsConverted) {
    const data = Persons.list;
    const persons = data.filter((student) => student.isMoved === false);

    if (persons.length > 0) {
      for await (const person of persons) {
        const prevAssignments = person.assignments;
        const newAssignments = [];

        prevAssignments.forEach((assignment) => {
          if (assignment.isActive === undefined || assignment.isActive) {
            newAssignments.push({ code: assignment.code });
          }
        });

        person.assignments = newAssignments;

        await person.save(person);
      }
    }

    // save settings
    const obj = { personAssignmentsConverted: true };
    await Setting.update(obj);
  }
};

const checkAutoBackup = async () => {
  if (Setting.autoBackup === undefined) {
    const obj = { autoBackup: true };
    await Setting.update(obj);
  }

  if (Setting.autoBackup_interval === undefined) {
    const obj = { autoBackup_interval: 5 };
    await Setting.update(obj);
  }
};

const removeDuplicateTimeAway = async () => {
  const persons = await appDb.persons.toArray();

  for await (const person of persons) {
    if (person.timeAway && person.timeAway.length > 0) {
      const cleanTimeAways = person.timeAway.filter(
        (v, i, a) => a.findIndex((v2) => v2.timeAwayId === v.timeAwayId) === i
      );

      let newPerson;
      const classPerson = Persons.get(person.person_uid);
      if (classPerson) newPerson = { ...classPerson, timeAway: cleanTimeAways };
      if (!classPerson) newPerson = { ...person, timeAway: cleanTimeAways };

      await Persons.preSave(newPerson);
    }
  }
};

const removeAutoAssignedOpeningPrayer = async () => {
  if (Setting.opening_prayer_MM_autoAssign) {
    for await (const schedule of Schedules.list) {
      if (schedule.chairmanMM_A === schedule.opening_prayerMM) {
        await saveAssignment(schedule.weekOf, undefined, 'opening_prayerMM');
      }
    }
  }
};

const updateAssignments2024 = async () => {
  const settings = (await appDb.app_settings.toArray())[0];

  if (settings.assignment_updated2024) return;

  const persons = await appDb.persons.toArray();

  for await (const person of persons) {
    const newAssignments = structuredClone(person.assignments);

    const hasInitiallCall = newAssignments.find((assignment) => assignment.code === 101);
    if (hasInitiallCall) newAssignments.push({ code: 123 });

    const hasReturnVisit = newAssignments.find((assignment) => assignment.code === 102);
    if (hasReturnVisit) newAssignments.push({ code: 124 });

    const hasBibleStudy = newAssignments.find((assignment) => assignment.code === 103);
    if (hasBibleStudy) newAssignments.push({ code: 125 });

    const hasChairman = newAssignments.find((assignment) => assignment.code === 110);
    if (hasChairman) newAssignments.push({ code: 127 });

    newAssignments.push({ code: 126 });

    let newPerson;
    const classPerson = Persons.get(person.person_uid);
    if (classPerson) newPerson = { ...classPerson, assignments: newAssignments };
    if (!classPerson) newPerson = { ...person, assignments: newAssignments };

    await Persons.preSave(newPerson);
  }

  // save settings
  const obj = { assignment_updated2024: true };
  await Setting.update(obj);
};
