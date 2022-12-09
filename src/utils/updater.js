import { promiseSetRecoil } from 'recoil-outside';
import { getI18n } from 'react-i18next';
import dateFormat from 'dateformat';
import appDb from '../indexedDb/mainDb';
import { langList } from '../locales/langList';
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
import { startupProgressState } from '../states/main';
import { loadApp } from './app';

let i = 0;

export const runUpdater = async () => {
  const step = 100 / 4;

  await updateAssignmentType(step);
  await updateScheduleToId(step);
  await removeOutdatedSettings(step);
  await builtHistoricalAssignment(step);

  await loadApp();
  i = 0;
};

const updateScheduleToId = async (step) => {
  let appSettings = await dbGetAppSettings();
  if (!appSettings.isScheduleConverted) {
    var scheduleData = await appDb.table('sched_MM').toArray();

    let a = step / scheduleData.length;
    for (let c = 0; i < scheduleData.length; c++) {
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

      i = i + a;
      promiseSetRecoil(startupProgressState, i);
    }

    // save settings
    let obj = {};
    obj.isScheduleConverted = true;
    await dbUpdateAppSettings(obj);
  } else {
    i = i + step;
    promiseSetRecoil(startupProgressState, i);
  }
};

const removeOutdatedSettings = async (step) => {
  let appSettings = await dbGetAppSettings();
  appSettings = await dbGetAppSettings();
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
  i = i + step;
  promiseSetRecoil(startupProgressState, i);
};

const builtHistoricalAssignment = async (step) => {
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
      const a = step / students.length;
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

        i = i + a;
        promiseSetRecoil(startupProgressState, i);
      }
    }

    // save settings
    let obj = {};
    obj.isAssignmentsConverted = true;
    await dbUpdateAppSettings(obj);
  } else {
    i = i + step;
    promiseSetRecoil(startupProgressState, i);
  }
};

const updateAssignmentType = async (step) => {
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

  langList.forEach((lang) => {
    bReadObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.bibleReading'];
    initCallObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.initialCall'];
    rvObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.returnVisit'];
    bsObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.bibleStudy'];
    talkObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.talk'];
    otherObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.otherPart'];
    icVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.initialCallVideo'];
    rvVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.returnVisitVideo'];
    memorialObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.memorialInvite'];
    memorialVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation[
      'global.memorialInviteVideo'
    ];
    chairmanMMObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation[
      'global.chairmanMidweekMeeting'
    ];
    prayerMMObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation[
      'global.prayerMidweekMeeting'
    ];
    tgwTalkObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.tgwTalk'];
    tgwGemsObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.tgwGems'];
    lcPartObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.lcPart'];
    cbsConductorObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation[
      'global.cbsConductor'
    ];
    cbsReaderObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).translation['global.cbsReader'];
  });

  await appDb.ass_type.clear();

  appDb.ass_type.bulkAdd([
    {
      id_type: 8,
      code: 100,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      ass_type_name: {
        ...bReadObj,
      },
    },
    {
      id_type: 1,
      code: 101,
      assignable: true,
      type: 'ayf',
      ass_type_name: {
        ...initCallObj,
      },
    },
    {
      id_type: 2,
      code: 102,
      assignable: true,
      type: 'ayf',
      ass_type_name: {
        ...rvObj,
      },
    },
    {
      id_type: 3,
      code: 103,
      assignable: true,
      type: 'ayf',
      ass_type_name: {
        ...bsObj,
      },
    },
    {
      id_type: 4,
      code: 104,
      maleOnly: true,
      assignable: true,
      type: 'ayf',
      ass_type_name: {
        ...talkObj,
      },
    },
    {
      id_type: 5,
      code: 105,
      assignable: false,
      type: 'ayf',
      ass_type_name: {
        ...icVideoObj,
      },
    },
    {
      id_type: 6,
      code: 106,
      assignable: false,
      type: 'ayf',
      ass_type_name: {
        ...rvVideoObj,
      },
    },
    {
      id_type: 7,
      code: 107,
      assignable: false,
      type: 'ayf',
      ass_type_name: {
        ...otherObj,
      },
    },
    {
      id_type: 20,
      code: 108,
      linkTo: 101,
      assignable: false,
      type: 'ayf',
      ass_type_name: {
        ...memorialObj,
      },
    },
    {
      id_type: 9,
      code: 110,
      maleOnly: true,
      assignable: true,
      type: 'mm',
      ass_type_name: {
        ...chairmanMMObj,
      },
    },
    {
      id_type: 10,
      code: 111,
      maleOnly: true,
      assignable: true,
      type: 'mm',
      ass_type_name: {
        ...prayerMMObj,
      },
    },
    {
      id_type: 11,
      code: 112,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      ass_type_name: {
        ...tgwTalkObj,
      },
    },
    {
      id_type: 12,
      code: 113,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      ass_type_name: {
        ...tgwGemsObj,
      },
    },
    {
      id_type: 13,
      code: 114,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      ass_type_name: {
        ...lcPartObj,
      },
    },
    {
      id_type: 14,
      code: 115,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      ass_type_name: {
        ...cbsConductorObj,
      },
    },
    {
      id_type: 15,
      code: 116,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      ass_type_name: {
        ...cbsReaderObj,
      },
    },
    {
      id_type: 21,
      code: 117,
      linkTo: 105,
      assignable: false,
      type: 'ayf',
      ass_type_name: {
        ...memorialVideoObj,
      },
    },
  ]);

  i = i + step;
  promiseSetRecoil(startupProgressState, i);
};
