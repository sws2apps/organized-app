import { promiseSetRecoil } from 'recoil-outside';
import { getI18n } from 'react-i18next';
import dateFormat from 'dateformat';
import appDb from '../indexedDb/mainDb';
import { LANGUAGE_LIST } from '../locales/langList.js';
import { dbGetAppSettings, dbUpdateAppSettings } from '../indexedDb/dbAppSettings';
import { dbGetStudents, dbGetStudentUidById, dbSavePersonMigration } from '../indexedDb/dbPersons';
import { dbSaveScheduleByAss } from '../indexedDb/dbSchedule';
import {
  dbFirstBibleStudy,
  dbFirstBRead,
  dbFirstIniCall,
  dbFirstRV,
  dbFirstTalk,
  dbHistoryAssignment,
} from '../indexedDb/dbAssignment';
import { dbGetAllSourceMaterials, dbMigrateSrcData } from '../indexedDb/dbSourceMaterial';
import { studentsAssignmentHistoryState } from '../states/persons';
import { loadApp } from './app';

export const runUpdater = async () => {
  await removeInvalidWeeks();
  await updateWeekType();
  await updateAssignmentType();
  await updateScheduleToId();
  await removeOutdatedSettings();
  await builtHistoricalAssignment();
  await updatePersonAssignments();
  await loadApp();
};

const updateScheduleToId = async () => {
  let appSettings = await dbGetAppSettings();
  if (!appSettings.isScheduleConverted) {
    const scheduleData = await appDb.table('sched_MM').toArray();

    for (let c = 0; c < scheduleData.length; c++) {
      const schedule = scheduleData[c];
      if (schedule.bRead_stu_A !== undefined) {
        const uid = await dbGetStudentUidById(schedule.bRead_stu_A);

        await dbSaveScheduleByAss('bRead_stu_A', uid, schedule.weekOf);
      }
      if (schedule.bRead_stu_B !== undefined) {
        const uid = await dbGetStudentUidById(schedule.bRead_stu_B);
        await dbSaveScheduleByAss('bRead_stu_B', uid, schedule.weekOf);
      }
      for (let d = 1; d <= 4; d++) {
        const fldNameA = `ass${d}_stu_A`;
        if (schedule[fldNameA] !== undefined) {
          const uid = await dbGetStudentUidById(schedule[fldNameA]);
          await dbSaveScheduleByAss(fldNameA, uid, schedule.weekOf);
        }

        const fldNameAssA = `ass${d}_ass_A`;
        if (schedule[fldNameAssA] !== undefined) {
          const uid = await dbGetStudentUidById(schedule[fldNameAssA]);
          await dbSaveScheduleByAss(fldNameAssA, uid, schedule.weekOf);
        }

        const fldNameB = `ass${d}_stu_B`;
        if (schedule[fldNameB] !== undefined) {
          const uid = await dbGetStudentUidById(schedule[fldNameB]);
          await dbSaveScheduleByAss(fldNameB, uid, schedule.weekOf);
        }

        const fldNameAssB = `ass${d}_ass_B`;
        if (schedule[fldNameAssB] !== undefined) {
          const uid = await dbGetStudentUidById(schedule[fldNameAssB]);
          await dbSaveScheduleByAss(fldNameAssB, uid, schedule.weekOf);
        }
      }
    }

    // save settings
    let obj = {};
    obj.isScheduleConverted = true;
    await dbUpdateAppSettings(obj);
  } else {
  }
};

const removeOutdatedSettings = async () => {
  let appSettings = await dbGetAppSettings();

  if (appSettings.crd) {
    delete appSettings.crd;
    await dbUpdateAppSettings({ ...appSettings }, true);
  }
  if (appSettings.pwd) {
    delete appSettings.pwd;
    await dbUpdateAppSettings({ ...appSettings }, true);
  }
  if (appSettings.userMe) {
    delete appSettings.userMe;
    await dbUpdateAppSettings({ ...appSettings }, true);
  }
};

const builtHistoricalAssignment = async () => {
  let appSettings = await dbGetAppSettings();
  if (appSettings.isAssignmentsConverted === undefined || !appSettings.isAssignmentsConverted) {
    const allSources = await dbGetAllSourceMaterials();
    for (let s = 0; s < allSources.length; s++) {
      const source = allSources[s];
      let obj = { ...source };
      for (let t = 1; t < 5; t++) {
        const fldName = `ass${t}_type`;
        if (source[fldName] === 1) {
          obj[fldName] = 101;
        } else if (source[fldName] === 2) {
          obj[fldName] = 102;
        } else if (source[fldName] === 3) {
          obj[fldName] = 103;
        } else if (source[fldName] === 4) {
          obj[fldName] = 104;
        } else if (source[fldName] === 5) {
          obj[fldName] = 105;
        } else if (source[fldName] === 6) {
          obj[fldName] = 106;
        } else if (source[fldName] === 7) {
          obj[fldName] = 107;
        } else if (source[fldName] === 20) {
          obj[fldName] = 108;
        }
      }

      await dbMigrateSrcData(obj);
    }

    const history = await dbHistoryAssignment();
    await promiseSetRecoil(studentsAssignmentHistoryState, history);

    const students = await dbGetStudents();
    if (students.length > 0) {
      const today = dateFormat(new Date(), 'mm/dd/yyyy');
      for (let b = 0; b < students.length; b++) {
        const student = students[b];
        const firstBRead = (await dbFirstBRead(student.person_uid)) || today;
        const firstIniCall = (await dbFirstIniCall(student.person_uid)) || today;
        const firstRV = (await dbFirstRV(student.person_uid)) || today;
        const firstBibleStudy = (await dbFirstBibleStudy(student.person_uid)) || today;
        const firstTalk = (await dbFirstTalk(student.person_uid)) || today;
        student.assignments = [];

        if (student.isBRead) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 100,
            startDate: firstBRead,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isInitialCall) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 101,
            startDate: firstIniCall,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isReturnVisit) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 102,
            startDate: firstRV,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isBibleStudy) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 103,
            startDate: firstBibleStudy,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isTalk) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 104,
            startDate: firstTalk,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        await dbSavePersonMigration(student);
      }
    }

    // save settings
    let obj = {};
    obj.isAssignmentsConverted = true;
    await dbUpdateAppSettings(obj);
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
  });

  await appDb.assignment.clear();

  await appDb.assignment.put(
    {
      code: 100,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      assignment_type_name: {
        ...bReadObj,
      },
      id_type: 1,
    },
    1
  );

  await appDb.assignment.put(
    {
      code: 101,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...initCallObj,
      },
      id_type: 2,
    },
    2
  );

  await appDb.assignment.put(
    {
      code: 102,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...rvObj,
      },
      id_type: 3,
    },
    3
  );

  await appDb.assignment.put(
    {
      code: 103,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...bsObj,
      },
      id_type: 4,
    },
    4
  );

  await appDb.assignment.put(
    {
      code: 104,
      maleOnly: true,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...talkObj,
      },
      id_type: 5,
    },
    5
  );

  await appDb.assignment.put(
    {
      code: 105,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...icVideoObj,
      },
      id_type: 6,
    },
    6
  );

  await appDb.assignment.put(
    {
      code: 106,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...rvVideoObj,
      },
      id_type: 7,
    },
    7
  );

  await appDb.assignment.put(
    {
      code: 107,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...otherObj,
      },
      id_type: 8,
    },
    8
  );

  await appDb.assignment.put(
    {
      code: 108,
      linkTo: 101,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...memorialObj,
      },
      id_type: 9,
    },
    9
  );

  await appDb.assignment.put(
    {
      code: 110,
      maleOnly: true,
      assignable: true,
      type: 'mm',
      assignment_type_name: {
        ...chairmanMMObj,
      },
      id_type: 10,
    },
    10
  );

  await appDb.assignment.put(
    {
      code: 111,
      maleOnly: true,
      assignable: true,
      type: 'mm',
      assignment_type_name: {
        ...prayerMMObj,
      },
      id_type: 11,
    },
    11
  );

  await appDb.assignment.put(
    {
      code: 112,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      assignment_type_name: {
        ...tgwTalkObj,
      },
      id_type: 12,
    },
    12
  );

  await appDb.assignment.put(
    {
      code: 113,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      assignment_type_name: {
        ...tgwGemsObj,
      },
      id_type: 13,
    },
    13
  );

  await appDb.assignment.put(
    {
      code: 114,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      assignment_type_name: {
        ...lcPartObj,
      },
      id_type: 14,
    },
    14
  );

  await appDb.assignment.put(
    {
      code: 115,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      assignment_type_name: {
        ...cbsConductorObj,
      },
      id_type: 15,
    },
    15
  );

  await appDb.assignment.put(
    {
      code: 116,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      assignment_type_name: {
        ...cbsReaderObj,
      },
      id_type: 16,
    },
    16
  );

  await appDb.assignment.put(
    {
      code: 117,
      linkTo: 105,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...memorialVideoObj,
      },
      id_type: 17,
    },
    17
  );

  // handle initial call variation (140-169)
  let codeIndice = 140;
  for (const [key, value] of Object.entries(initCallVariationsObj)) {
    if (value && value !== '0' && codeIndice < 170) {
      const variations = value.split('|');
      for await (const variation of variations) {
        await appDb.assignment.put(
          {
            code: codeIndice,
            linkTo: 101,
            assignable: false,
            type: 'ayf',
            assignment_type_name: {
              [key]: variation,
            },
            id_type: codeIndice,
          },
          codeIndice
        );

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
        await appDb.assignment.put(
          {
            code: codeIndice,
            linkTo: 102,
            assignable: false,
            type: 'ayf',
            assignment_type_name: {
              [key]: variation,
            },
            id_type: codeIndice,
          },
          codeIndice
        );

        codeIndice++;
      }
    }
  }
};

const removeInvalidWeeks = async () => {
  const weekInvalids = ['07/26/2023'];

  for await (const weekInvalid of weekInvalids) {
    const srcData = await appDb.src.get({ weekOf: weekInvalid });
    if (srcData) await appDb.src.delete(srcData.weekOf);

    const schedData = await appDb.sched_MM.get({ weekOf: weekInvalid });
    if (schedData) await appDb.src.delete(schedData.weekOf);
  }
};

const updatePersonAssignments = async () => {
  let appSettings = await dbGetAppSettings();
  if (appSettings.personAssignmentsConverted === undefined || !appSettings.personAssignmentsConverted) {
    const data = await appDb.table('persons').reverse().reverse().sortBy('person_name');
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

        await appDb.persons.update(person.id, {
          assignments: newAssignments,
        });
      }
    }

    // save settings
    const obj = { personAssignmentsConverted: true };
    await dbUpdateAppSettings(obj);
  }
};
