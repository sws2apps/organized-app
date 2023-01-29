import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import dateFormat from 'dateformat';
import { dbGetAppSettings } from './dbAppSettings';
import { dbGetStudentByUid, dbGetStudentDetails, dbGetStudentsMini } from './dbPersons';
import { dbGetScheduleData } from './dbSchedule';
import { dbGetSourceMaterial, dbGetWeekListBySched } from './dbSourceMaterial';
import appDb from './mainDb';
import {
  monthNamesState,
  refreshMyAssignmentsState,
  shortDateFormatState,
  sourceLangState,
  userLocalUidState,
} from '../states/main';
import { assTypeLocalState } from '../states/sourceMaterial';
import { allStudentsState, filteredStudentsState, studentsAssignmentHistoryState } from '../states/persons';
import { meetingTimeState } from '../states/congregation';
import { getAssignmentName } from '../utils/app';

export const dbGetAssType = async (assType, appLang) => {
  let srcAssType = '';
  if (assType === '') {
    return srcAssType;
  } else {
    const i = parseInt(assType, 10);
    const appData = await appDb.table('assignment').get(i);
    srcAssType = appData.assignment_type_name[appLang];
    return srcAssType;
  }
};

export const dbGetListAssType = async () => {
  const assType = [];
  let obj = {};
  const appData = await appDb.table('assignment').reverse().reverse().sortBy('code');

  for (let i = 0; i < appData.length; i++) {
    obj = {};
    obj.code = appData[i].code;
    obj.assignable = appData[i].assignable;
    obj.assignment_type_name = appData[i].assignment_type_name;
    obj.maleOnly = appData[i].maleOnly || false;
    obj.type = appData[i].type;
    obj.linkTo = appData[i].linkTo;
    assType.push(obj);
  }
  return assType;
};

export const dbSaveAss = async (weekOf, stuID, varSave) => {
  const appData = await appDb.table('sched_MM').get({ weekOf: weekOf });
  const stuPrev = appData[varSave];
  const changes = appData.changes ? [...appData.changes] : [];

  const obj = {};
  obj[varSave] = stuID;

  const findIndex = changes.findIndex((item) => item.field === varSave);
  if (findIndex !== -1) changes.splice(findIndex, 1);
  changes.push({ date: new Date().toISOString(), field: varSave, value: stuID });
  obj.changes = changes;

  await appDb.table('sched_MM').update(weekOf, { ...obj });

  const history = await dbHistoryAssignment();
  await promiseSetRecoil(studentsAssignmentHistoryState, history);

  await dbRefreshStudentHistory(stuPrev, stuID);

  const localUid = await promiseGetRecoil(userLocalUidState);

  if (stuID === localUid) {
    const prevValue = await promiseGetRecoil(refreshMyAssignmentsState);
    await promiseSetRecoil(refreshMyAssignmentsState, !prevValue);
  }
};

export const dbHistoryAssignment = async () => {
  try {
    const appData = await appDb.table('sched_MM').toArray();
    const persons = (await appDb.persons.toArray()).length;
    let dbHistory = [];

    if (persons > 0) {
      let histID = 0;
      for (let i = 0; i < appData.length; i++) {
        let person = {};

        const weekData = await dbGetSourceMaterial(appData[i].weekOf);
        const [varMonth, varDay, varYear] = appData[i].weekOf.split('/');
        const lDate = new Date(varYear, varMonth - 1, varDay);
        const shortDateFormat = await promiseGetRecoil(shortDateFormatState);
        const dateFormatted = dateFormat(lDate, shortDateFormat);

        const assList = [];
        const excludeFiles = ['weekOf', 'week_type', 'noMeeting', 'isReleased', 'changes'];
        for (const [key, value] of Object.entries(appData[i])) {
          if (excludeFiles.indexOf(key) === -1) {
            if (value && value !== '') {
              assList.push({ assignment: key, person: value });
            }
          }
        }

        for (const item of assList) {
          person.ID = histID;
          person.weekOf = appData[i].weekOf;
          person.weekOfFormatted = dateFormatted;
          person.studentID = item.person;
          const stuDetails = await dbGetStudentByUid(item.person);
          person.studentName = stuDetails?.person_displayName || '';
          person.class = '';

          // Chairman History
          if (item.assignment === 'chairmanMM_A') {
            person.assignmentID = 110;
            person.assignmentName = getI18n().t('chairmanMidweekMeeting2', { ns: 'ui' });
          }

          // Aux Class Counselor History
          if (item.assignment === 'chairmanMM_B') {
            person.assignmentID = 110;
            person.assignmentName = getI18n().t('auxClassCounselor', { ns: 'ui' });
          }

          // Opening Prayer
          if (item.assignment === 'opening_prayer') {
            person.assignmentID = 111;
            person.assignmentName = getI18n().t('openingPrayer', { ns: 'ui' });
          }

          // TGW Talk 10 min. History
          if (item.assignment === 'tgw_talk') {
            person.assignmentID = 112;
            person.assignmentName = getI18n().t('tgwTalk', { ns: 'ui' });
            person.assignmentSource = weekData.tgwTalk_src;
          }

          // TGW Spiritual Gems History
          if (item.assignment === 'tgw_gems') {
            person.assignmentID = 113;
            person.assignmentName = getI18n().t('tgwGems', { ns: 'ui' });
          }

          //Bible Reading History
          if (item.assignment.startsWith('bRead_stu_')) {
            const stuclass = item.assignment.split('_')[2];
            person.assignmentID = 100;
            person.assignmentName = getI18n().t('bibleReading', { ns: 'ui' });
            person.class = stuclass;
            person.studyPoint = weekData.bibleReading_study;
          }

          //AYF Assigment History
          if (item.assignment.startsWith('ass') && item.assignment.includes('_stu_')) {
            const stuclass = item.assignment.split('_')[2];
            const weekFld = item.assignment.split('_')[0] + '_type';
            const studyFld = item.assignment.split('_')[0] + '_study';
            const assType = weekData[weekFld];
            const studyPoint = weekData[studyFld];

            person.assignmentID = assType;
            if (assType === 101) {
              person.assignmentName = getI18n().t('initialCall', { ns: 'ui' });
            } else if (assType === 102) {
              person.assignmentName = getI18n().t('returnVisit', { ns: 'ui' });
            } else if (assType === 103) {
              person.assignmentName = getI18n().t('bibleStudy', { ns: 'ui' });
            } else if (assType === 104) {
              person.assignmentName = getI18n().t('talk', { ns: 'ui' });
            } else if (assType === 108) {
              person.assignmentName = getI18n().t('memorialInvite', { ns: 'ui' });
            }
            person.class = stuclass;
            person.studyPoint = studyPoint;
          }

          // AYF Assistant History
          if (item.assignment.startsWith('ass') && item.assignment.includes('_ass_')) {
            const stuclass = item.assignment.split('_')[2];
            person.assignmentID = 109;
            person.assignmentName = getI18n().t('assistant', { ns: 'ui' });
            person.class = stuclass;
          }

          // LC Assignment History
          if (item.assignment.startsWith('lc_part')) {
            const lcIndex = item.assignment.slice(-1);
            const fldSource = `lcPart${lcIndex}_src`;
            const fldTime = `lcPart${lcIndex}_time`;
            const fldContent = `lcPart${lcIndex}_content`;

            person.assignmentID = 114;
            person.assignmentName = getI18n().t('lcPart', { ns: 'ui' });
            person.assignmentSource = `(${weekData[fldTime]} min.) ${weekData[fldSource]}`;
            person.assignmentContent = weekData[fldContent];
          }

          // CBS Conductor History
          if (item.assignment === 'cbs_conductor') {
            person.assignmentID = 115;
            person.assignmentName = getI18n().t('cbsConductor', { ns: 'ui' });
            person.assignmentSource = weekData.cbs_src;
          }

          // CBS Reader History
          if (item.assignment === 'cbs_reader') {
            person.assignmentID = 116;
            person.assignmentName = getI18n().t('cbsReader', { ns: 'ui' });
            person.assignmentSource = weekData.cbs_src;
          }

          // Closing Prayer History
          if (item.assignment === 'closing_prayer') {
            person.assignmentID = 111;
            person.assignmentName = getI18n().t('closingPrayer', { ns: 'ui' });
          }

          dbHistory.push(person);
          person = {};
          histID++;
        }
      }
      dbHistory.sort((a, b) => {
        const dateA = a.weekOf.split('/')[2] + '/' + a.weekOf.split('/')[0] + '/' + a.weekOf.split('/')[1];
        const dateB = b.weekOf.split('/')[2] + '/' + b.weekOf.split('/')[0] + '/' + b.weekOf.split('/')[1];
        return dateA < dateB ? 1 : -1;
      });
    }

    return dbHistory;
  } catch {}
};

export const dbStudentAssignmentsHistory = async (stuID) => {
  const appData = await dbHistoryAssignment();
  const history = appData.filter((data) => data.studentID === stuID);
  return history;
};

export const dbLastBRead = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastBRead = appData.filter((data) => (data.assignmentID === 100) & (data.studentID === stuID));

  let dLast;
  if (lastBRead.length > 0) {
    dLast = lastBRead[0].weekOf;
  }
  return dLast;
};

export const dbFirstBRead = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastBRead = appData.filter((data) => (data.assignmentID === 100) & (data.studentID === stuID));

  let dLast;
  if (lastBRead.length > 0) {
    dLast = lastBRead[lastBRead.length - 1].weekOf;
  }
  return dLast;
};

export const dbLastIniCall = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastIniCall = appData.filter((data) => (data.assignmentID === 101) & (data.studentID === stuID));

  let dLast;
  if (lastIniCall.length > 0) {
    dLast = lastIniCall[0].weekOf;
  }
  return dLast;
};

export const dbFirstIniCall = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastIniCall = appData.filter((data) => (data.assignmentID === 101) & (data.studentID === stuID));

  let dLast;
  if (lastIniCall.length > 0) {
    dLast = lastIniCall[lastIniCall.length - 1].weekOf;
  }
  return dLast;
};

export const dbLastRV = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastRV = appData.filter((data) => (data.assignmentID === 102) & (data.studentID === stuID));

  let dLast;
  if (lastRV.length > 0) {
    dLast = lastRV[0].weekOf;
  }
  return dLast;
};

export const dbFirstRV = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastRV = appData.filter((data) => (data.assignmentID === 102) & (data.studentID === stuID));

  let dLast;
  if (lastRV.length > 0) {
    dLast = lastRV[lastRV.length - 1].weekOf;
  }
  return dLast;
};

export const dbLastBibleStudy = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastBibleStudy = appData.filter((data) => (data.assignmentID === 103) & (data.studentID === stuID));

  let dLast;
  if (lastBibleStudy.length > 0) {
    dLast = lastBibleStudy[0].weekOf;
  }
  return dLast;
};

export const dbFirstBibleStudy = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastBibleStudy = appData.filter((data) => (data.assignmentID === 103) & (data.studentID === stuID));

  let dLast;
  if (lastBibleStudy.length > 0) {
    dLast = lastBibleStudy[lastBibleStudy.length - 1].weekOf;
  }
  return dLast;
};

export const dbLastTalk = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastTalk = appData.filter((data) => (data.assignmentID === 104) & (data.studentID === stuID));

  let dLast;
  if (lastTalk.length > 0) {
    dLast = lastTalk[0].weekOf;
  }
  return dLast;
};

export const dbFirstTalk = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastTalk = appData.filter((data) => (data.assignmentID === 104) & (data.studentID === stuID));

  let dLast;
  if (lastTalk.length > 0) {
    dLast = lastTalk[lastTalk.length - 1].weekOf;
  }
  return dLast;
};

export const dbLastAssistant = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastAssistant = appData.filter((data) => (data.assignmentID === 109) & (data.studentID === stuID));
  let dLast;
  if (lastAssistant.length > 0) {
    dLast = lastAssistant[0].weekOf;
  }
  return dLast;
};

export const dbLastAssignment = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastAssignment = appData.filter((data) => data.studentID === stuID);
  let dLast;
  if (lastAssignment.length > 0) {
    dLast = lastAssignment[0].weekOf;
  }
  return dLast;
};

export const dbLastChairman = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastChairman = appData.filter((data) => (data.assignmentID === 110) & (data.studentID === stuID));

  let dLast;
  if (lastChairman.length > 0) {
    dLast = lastChairman[0].weekOf;
  }
  return dLast;
};

export const dbFirstChairman = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const firstChairman = appData.filter((data) => (data.assignmentID === 110) & (data.studentID === stuID));

  let dFirst;
  if (firstChairman.length > 0) {
    dFirst = firstChairman[firstChairman.length - 1].weekOf;
  }
  return dFirst;
};

export const dbLastPrayer = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastPrayer = appData.filter((data) => (data.assignmentID === 111) & (data.studentID === stuID));

  let dLast;
  if (lastPrayer.length > 0) {
    dLast = lastPrayer[0].weekOf;
  }
  return dLast;
};

export const dbFirstPrayer = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const firstPrayer = appData.filter((data) => (data.assignmentID === 111) & (data.studentID === stuID));

  let dFirst;
  if (firstPrayer.length > 0) {
    dFirst = firstPrayer[firstPrayer.length - 1].weekOf;
  }
  return dFirst;
};

export const dbLastTGWTalk = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastTGWTalk = appData.filter((data) => (data.assignmentID === 112) & (data.studentID === stuID));

  let dLast;
  if (lastTGWTalk.length > 0) {
    dLast = lastTGWTalk[0].weekOf;
  }
  return dLast;
};

export const dbFirstTGWTalk = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const firstTGWTalk = appData.filter((data) => (data.assignmentID === 112) & (data.studentID === stuID));

  let dFirst;
  if (firstTGWTalk.length > 0) {
    dFirst = firstTGWTalk[firstTGWTalk.length - 1].weekOf;
  }
  return dFirst;
};

export const dbLastTGWGems = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastTGWGems = appData.filter((data) => (data.assignmentID === 113) & (data.studentID === stuID));

  let dLast;
  if (lastTGWGems.length > 0) {
    dLast = lastTGWGems[0].weekOf;
  }
  return dLast;
};

export const dbFirstTGWGems = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const firstTGWGems = appData.filter((data) => (data.assignmentID === 113) & (data.studentID === stuID));

  let dFirst;
  if (firstTGWGems.length > 0) {
    dFirst = firstTGWGems[firstTGWGems.length - 1].weekOf;
  }
  return dFirst;
};

export const dbLastLCPart = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastLCPart = appData.filter((data) => (data.assignmentID === 114) & (data.studentID === stuID));

  let dLast;
  if (lastLCPart.length > 0) {
    dLast = lastLCPart[0].weekOf;
  }
  return dLast;
};

export const dbFirstLCPart = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const firstLCPart = appData.filter((data) => (data.assignmentID === 114) & (data.studentID === stuID));

  let dFirst;
  if (firstLCPart.length > 0) {
    dFirst = firstLCPart[firstLCPart.length - 1].weekOf;
  }
  return dFirst;
};

export const dbLastCBSConductor = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastCBSConductor = appData.filter((data) => (data.assignmentID === 115) & (data.studentID === stuID));

  let dLast;
  if (lastCBSConductor.length > 0) {
    dLast = lastCBSConductor[0].weekOf;
  }
  return dLast;
};

export const dbFirstCBSConductor = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const firstCBSConductor = appData.filter((data) => (data.assignmentID === 115) & (data.studentID === stuID));

  let dFirst;
  if (firstCBSConductor.length > 0) {
    dFirst = firstCBSConductor[firstCBSConductor.length - 1].weekOf;
  }
  return dFirst;
};

export const dbLastCBSReader = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const lastCBSReader = appData.filter((data) => (data.assignmentID === 116) & (data.studentID === stuID));

  let dLast;
  if (lastCBSReader.length > 0) {
    dLast = lastCBSReader[0].weekOf;
  }
  return dLast;
};

export const dbFirstCBSReader = async (stuID) => {
  const appData = await promiseGetRecoil(studentsAssignmentHistoryState);
  const firstCBSReader = appData.filter((data) => (data.assignmentID === 116) & (data.studentID === stuID));

  let dFirst;
  if (firstCBSReader.length > 0) {
    dFirst = firstCBSReader[firstCBSReader.length - 1].weekOf;
  }
  return dFirst;
};

export const dbRefreshStudentHistory = async (varPrev, varNew) => {
  let varPers;
  for (let a = 1; a <= 2; a++) {
    if (a === 1) {
      varPers = varPrev;
    } else {
      varPers = varNew;
    }

    if (varPers) {
      const student = await dbGetStudentDetails(varPers);
      if (student) {
        const stuAssignment = await dbLastAssignment(varPers);
        const obj = {};
        obj.lastAssignment = stuAssignment;
        obj.changes = student.changes || [];
        const findIndex = obj.changes.findIndex((item) => item.field === 'lastAssignment');
        if (findIndex !== -1) obj.changes.splice(findIndex, 1);
        obj.changes.push({ date: new Date().toISOString(), field: 'lastAssignment', value: stuAssignment });
        await appDb.table('persons').update(student.id, { ...obj });

        const students = await dbGetStudentsMini();
        await promiseSetRecoil(allStudentsState, students);
        await promiseSetRecoil(filteredStudentsState, students);

        const history = await dbHistoryAssignment();
        await promiseSetRecoil(studentsAssignmentHistoryState, history);
      }
    }
  }
};

export const dbGetS89WeekList = async (scheduleName) => {
  const sourceLang = await promiseGetRecoil(sourceLangState);
  const s89Data = [];
  const allWeeks = await dbGetWeekListBySched(scheduleName);
  for (let i = 0; i < allWeeks.length; i++) {
    const week = allWeeks[i].value;
    const scheduleData = await dbGetScheduleData(week);
    if (!scheduleData.noMeeting) {
      const parentWeek = {};
      parentWeek.value = week;
      const dateW = new Date(week);
      const weekDateFormatted = dateFormat(dateW, getI18n().t('shortDateFormat', { ns: 'ui' }));
      parentWeek.label = weekDateFormatted;
      parentWeek.children = [];

      const sourceData = await dbGetSourceMaterial(week);
      let assClass = {};
      let assType = {};

      if (
        (scheduleData.bRead_stu_A && scheduleData.bRead_stu_A !== '') ||
        (scheduleData.bRead_stu_B && scheduleData.bRead_stu_B !== '')
      ) {
        assType.label = getI18n().t('bibleReading', { ns: 'ui', lng: sourceLang });
        assType.value = week + '-0@bRead';
        assType.children = [];

        if (scheduleData.bRead_stu_A && scheduleData.bRead_stu_A !== '') {
          assClass = {};
          assClass.value = week + '-0@bRead-A';
          assClass.label = getI18n().t('mainHall', { ns: 'ui', lng: sourceLang });
          assType.children.push(assClass);
        }
        if (scheduleData.bRead_stu_B && scheduleData.bRead_stu_B !== '') {
          assClass = {};
          assClass.value = week + '-0@bRead-B';
          assClass.label = getI18n().t('auxClass1', { ns: 'ui', lng: sourceLang });
          assType.children.push(assClass);
        }
        parentWeek.children.push(assType);
      }

      const assTypeList = await promiseGetRecoil(assTypeLocalState);
      for (let i = 1; i <= 4; i++) {
        const fldStuA = 'ass' + i + '_stu_A';
        const fldStuB = 'ass' + i + '_stu_B';
        const fldAss = 'ass' + i + '_type';
        if (
          (scheduleData[fldStuA] && scheduleData[fldStuA] !== '') ||
          (scheduleData[fldStuB] && scheduleData[fldStuB] !== '')
        ) {
          assType = {};
          let indexType;
          indexType = assTypeList.findIndex((type) => type.value === sourceData[fldAss]);
          assType.label = indexType >= 0 ? assTypeList[indexType].label : '';
          assType.value = week + '-' + i + '@ass' + i;
          if (scheduleData[fldStuA] && scheduleData[fldStuA] !== '') {
            assType.children = [];
            assClass = {};
            assClass.value = week + '-' + i + '@ass' + i + '-A';
            assClass.label = getI18n().t('mainHall', { ns: 'ui', lng: sourceLang });
            assType.children.push(assClass);
          }
          if (scheduleData[fldStuB] && scheduleData[fldStuB] !== '') {
            assType.children = [];
            assClass = {};
            assClass.value = week + '-' + i + '@ass' + i + '-B';
            assClass.label = getI18n().t('auxClass1', { ns: 'ui', lng: sourceLang });
            assType.children.push(assClass);
          }
          parentWeek.children.push(assType);
        }
      }
      if (parentWeek.children.length > 0) {
        s89Data.push(parentWeek);
      }
    }
  }
  const obj = {};
  obj.value = 'S89';
  obj.label = getI18n().t('allWeeks', { ns: 'ui' });
  obj.children = s89Data;

  return obj;
};

export const dbGetS89ItemData = async (week, assName, classLabel) => {
  const sourceLang = await promiseGetRecoil(sourceLangState);

  let stuFld = '';
  let assFld = '';
  let assTimeFld = '';
  let assTypeFld = 0;

  if (assName === 'bRead') {
    stuFld = 'bRead_stu_' + classLabel;
  } else if (assName === 'ass1') {
    stuFld = 'ass1_stu_' + classLabel;
    assFld = 'ass1_ass_' + classLabel;
    assTypeFld = 'ass1_type';
    assTimeFld = 'ass1_time';
  } else if (assName === 'ass2') {
    stuFld = 'ass2_stu_' + classLabel;
    assFld = 'ass2_ass_' + classLabel;
    assTypeFld = 'ass2_type';
    assTimeFld = 'ass2_time';
  } else if (assName === 'ass3') {
    stuFld = 'ass3_stu_' + classLabel;
    assFld = 'ass3_ass_' + classLabel;
    assTypeFld = 'ass3_type';
    assTimeFld = 'ass3_time';
  } else if (assName === 'ass4') {
    stuFld = 'ass4_stu_' + classLabel;
    assFld = 'ass4_ass_' + classLabel;
    assTypeFld = 'ass4_type';
    assTimeFld = 'ass4_time';
  }

  const appSettings = await dbGetAppSettings();
  let midDay = parseInt(appSettings.meeting_day, 10);

  const [varMonth, varDay, varYear] = week.split('/');
  midDay = parseInt(varDay, 10) + midDay - 1;
  const lDate = new Date(varYear, varMonth - 1, midDay);
  const dateFormatted = dateFormat(lDate, getI18n().getDataByLanguage(sourceLang).ui['shortDateFormat']);

  const sourceData = await dbGetSourceMaterial(week);
  const scheduleData = await dbGetScheduleData(week);

  const s89Data = {};
  const stuID = scheduleData[stuFld];
  const { person_name } = await dbGetStudentDetails(stuID);
  s89Data.studentName = person_name;
  s89Data.assistantName = '';
  s89Data.isBRead = false;
  s89Data.isInitialCall = false;
  s89Data.initialCallSpec = '';
  s89Data.isReturnVisit = false;
  s89Data.returnVisitSpec = '';
  s89Data.isBibleStudy = false;
  s89Data.bibleStudySpec = '';
  s89Data.isTalk = false;
  s89Data.assignmentDate = dateFormatted;
  s89Data.isMemorialInvite = false;

  if (assName === 'ass1' || assName === 'ass2' || assName === 'ass3' || assName === 'ass4') {
    const assType = sourceData[assTypeFld];
    if (assType === 101 || assType === 102 || assType === 103 || assType === 108) {
      const assID = scheduleData[assFld];
      if (typeof assID !== 'undefined' && assID !== '') {
        const assInfo = await dbGetStudentDetails(assID);
        s89Data.assistantName = assInfo.person_name;
      }
    }

    const ass1Type = sourceData['ass1_type'];
    const ass2Type = sourceData['ass2_type'];
    const ass3Type = sourceData['ass3_type'];
    const ass4Type = sourceData['ass4_type'];
    const assTime = sourceData[assTimeFld];

    if (assType === 101 || assType === 108 || assType === 102) {
      if (assType === 101) s89Data.isInitialCall = true;
      if (assType === 108) s89Data.isMemorialInvite = true;
      if (assType === 102) s89Data.isReturnVisit = true;

      let fieldSpec = 'initialCallSpec';
      if (assType === 102) fieldSpec = 'returnVisitSpec';
      if (assName === 'ass1') {
        if (ass1Type === ass2Type || ass1Type === ass3Type || ass1Type === ass4Type) {
          const spec = getI18n().t('assignmentPart', { ns: 'ui', id: 1, time: assTime });
          s89Data[fieldSpec] = spec;
        }
      } else if (assName === 'ass2') {
        if (ass2Type === ass1Type || ass2Type === ass3Type || ass2Type === ass4Type) {
          const spec = getI18n().t('assignmentPart', { ns: 'ui', id: 2, time: assTime });
          s89Data[fieldSpec] = spec;
        }
      } else if (assName === 'ass3') {
        if (ass3Type === ass1Type || ass3Type === ass2Type || ass3Type === ass4Type) {
          const spec = getI18n().t('assignmentPart', { ns: 'ui', id: 3, time: assTime });
          s89Data[fieldSpec] = spec;
        }
      } else if (assName === 'ass4') {
        if (ass4Type === ass1Type || ass4Type === ass2Type || ass4Type === ass3Type) {
          const spec = getI18n().t('assignmentPart', { ns: 'ui', id: 4, time: assTime });
          s89Data[fieldSpec] = spec;
        }
      }
    } else if (assType === 103) {
      s89Data.isBibleStudy = true;
    } else if (assType === 104) {
      s89Data.isTalk = true;
    }
  } else {
    s89Data.isBRead = true;
  }

  if (classLabel === 'A') {
    s89Data.isMainHall = true;
    s89Data.isAuxClass = false;
  } else {
    s89Data.isMainHall = false;
    s89Data.isAuxClass = true;
  }

  return s89Data;
};

export const dbGetScheduleForPrint = async (scheduleName) => {
  const data = [];
  const allWeeks = await dbGetWeekListBySched(scheduleName);
  const meetingStart = dateFormat(await promiseGetRecoil(meetingTimeState), 'h:MM');

  for (let i = 0; i < allWeeks.length; i++) {
    const week = allWeeks[i].value;
    const scheduleData = await dbGetScheduleData(week);
    const sourceData = await dbGetSourceMaterial(week);

    // pgm start
    const time = {};
    time.pgmStart = meetingStart;

    // opening comments
    time.openingComments = addMinutes(time.pgmStart, 5);

    // tgw talk
    time.tgwTalk = addMinutes(time.openingComments, 1);

    // tgw gems
    time.tgwGems = addMinutes(time.tgwTalk, 10);

    // bible reading
    time.bibleReading = addMinutes(time.tgwGems, 10);

    // ayf 1
    time.ayf1 = addMinutes(time.bibleReading, 5);

    // ayf 2
    if (
      sourceData.ass1_type === 105 ||
      sourceData.ass1_type === 106 ||
      sourceData.ass1_type === 107 ||
      sourceData.ass1_type === 117
    ) {
      time.ayf2 = addMinutes(time.ayf1, +sourceData.ass1_time);
    } else {
      time.ayf2 = addMinutes(time.ayf1, +sourceData.ass1_time + 1);
    }

    // ayf 3
    if (
      sourceData.ass2_type === 105 ||
      sourceData.ass2_type === 106 ||
      sourceData.ass2_type === 107 ||
      sourceData.ass2_type === 117
    ) {
      time.ayf3 = addMinutes(time.ayf2, +sourceData.ass2_time);
    } else {
      time.ayf3 = addMinutes(time.ayf2, +sourceData.ass2_time + 1);
    }

    // ayf 4
    if (
      sourceData.ass3_type === 105 ||
      sourceData.ass3_type === 106 ||
      sourceData.ass3_type === 107 ||
      sourceData.ass2_type === 117
    ) {
      time.ayf4 = addMinutes(time.ayf3, +sourceData.ass3_time);
    } else {
      time.ayf4 = addMinutes(time.ayf3, +sourceData.ass3_time + 1);
    }

    // middle song
    if (sourceData.ass4_time !== '') {
      if (
        sourceData.ass4_type === 105 ||
        sourceData.ass4_type === 106 ||
        sourceData.ass4_type === 107 ||
        sourceData.ass2_type === 117
      ) {
        time.middleSong = addMinutes(time.ayf4, +sourceData.ass4_time);
      } else {
        time.middleSong = addMinutes(time.ayf4, +sourceData.ass4_time + 1);
      }
    } else {
      time.middleSong = time.ayf4;
    }

    // lc part 1
    time.lc1 = addMinutes(time.middleSong, 5);

    // lc part 2
    if (sourceData.lcPart1_time_override) {
      time.lc2 = addMinutes(time.lc1, sourceData.lcPart1_time_override);
    } else {
      time.lc2 = addMinutes(time.lc1, sourceData.lcPart1_time);
    }

    if (scheduleData.week_type === 1) {
      // normal - cbs
      if (sourceData.lcCount_override) {
        if (sourceData.lcCount_override === 1) {
          time.cbs = time.lc2;
        } else {
          time.cbs = addMinutes(time.lc2, sourceData.lcPart2_time_override);
        }
      }

      if (sourceData.lcCount_override === undefined) {
        if (sourceData.lcCount === 1) {
          time.cbs = time.lc2;
        } else {
          time.cbs = addMinutes(time.lc2, sourceData.lcPart2_time);
        }
      }

      // normal - concluding comments
      if (sourceData.cbs_time_override) {
        time.concludingComments = addMinutes(time.cbs, sourceData.cbs_time_override);
      } else {
        time.concludingComments = addMinutes(time.cbs, 30);
      }

      // normal - pgm end
      time.pgmEnd = addMinutes(time.concludingComments, 3);
    } else {
      // co - concluding comments
      if (sourceData.lcCount === 1) {
        time.concludingComments = time.lc2;
      } else {
        if (sourceData.lcPart2_time_override) {
          time.concludingComments = addMinutes(time.lc2, sourceData.lcPart2_time_override);
        } else {
          time.concludingComments = addMinutes(time.lc2, sourceData.lcPart2_time);
        }
      }

      // co - talk
      time.coTalk = addMinutes(time.concludingComments, 3);

      // co - pgm end
      time.pgmEnd = addMinutes(time.coTalk, 30);
    }

    const obj = {};
    obj.week = week;
    obj.scheduleData = scheduleData;
    obj.sourceData = { ...sourceData, ...time };
    data.push(obj);
  }
  return data;
};

const addMinutes = (prev, min) => {
  const split = prev.split(':');
  const hour = +split[0];
  const minute = +split[1];

  let newHour = hour;
  let newMinute = minute + min;
  if (newMinute >= 60) {
    newHour = hour + 1;
    newMinute = newMinute - 60;
  }

  return `${newHour}:${newMinute < 10 ? `0${newMinute}` : newMinute}`;
};

export const dbMyAssignments = async () => {
  try {
    const tmpSchedules = await appDb.table('sched_MM').toArray();

    const schedules = [];
    for await (const schedule of tmpSchedules) {
      const week = schedule.weekOf;
      const details = await dbGetScheduleData(week);
      const src = await dbGetSourceMaterial(week);
      schedules.push({ ...details, ...src });
    }

    const monthNames = await promiseGetRecoil(monthNamesState);

    let { local_uid, pocket_members } = await dbGetAppSettings();
    pocket_members = pocket_members ? pocket_members : [];

    const d = new Date();
    const todayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayValue = todayDate.getDay();
    const diff = todayDate.getDate() - dayValue + (dayValue === 0 ? -6 : 1);
    const currentWeekDate = new Date(todayDate.setDate(diff));

    const msInDay = 24 * 60 * 60 * 1000;

    const fldCheck = [
      'chairmanMM_A',
      'chairmanMM_B',
      'opening_prayer',
      'tgw_talk',
      'tgw_gems',
      'bRead_stu_A',
      'bRead_stu_B',
      'ass1_stu_A',
      'ass1_ass_A',
      'ass1_stu_B',
      'ass1_ass_B',
      'ass2_stu_A',
      'ass2_ass_A',
      'ass2_stu_B',
      'ass2_ass_B',
      'ass3_stu_A',
      'ass3_ass_A',
      'ass3_stu_B',
      'ass3_ass_B',
      'ass4_stu_A',
      'ass4_ass_A',
      'ass4_stu_B',
      'ass4_ass_B',
      'lc_part1',
      'lc_part2',
      'cbs_conductor',
      'cbs_reader',
      'closing_prayer',
    ];

    const myItems = [];
    schedules.forEach((schedule) => {
      const weekDate = new Date(schedule.weekOf);
      const dayDiff = Math.round((weekDate - currentWeekDate) / msInDay);

      if (dayDiff >= 0) {
        fldCheck.forEach((fld) => {
          const fldDispName = `${fld}_dispName`;
          const fldValue = schedule[fld];
          const fldDispNameValue = schedule[fldDispName];

          let isFound = false;
          let isBehalf = false;

          if (fldValue === local_uid) {
            isFound = true;
          }

          if (pocket_members.some((member) => member.person_uid === fldValue)) {
            isFound = true;
            isBehalf = true;
          }

          if (isFound) {
            const split = schedule.weekOf.split('/');
            const monthIndex = +split[0] - 1;
            const monthValue = `${monthNames[monthIndex]} ${split[2]}`;

            const obj = {};
            obj.month_value = monthValue;
            obj.id = window.crypto.randomUUID();
            obj.weekOf = schedule.weekOf;
            obj.person = fldValue;
            obj.personDispName = fldDispNameValue;

            // Chairman History
            if (fld === 'chairmanMM_A') {
              obj.assignmentName = getI18n().t('chairmanMidweekMeeting2', { ns: 'ui' });
            }

            // Aux Class Counselor History
            if (fld === 'chairmanMM_B') {
              obj.assignmentName = getI18n().t('auxClassCounselor', { ns: 'ui' });
            }

            // Opening Prayer
            if (fld === 'opening_prayer') {
              obj.assignmentName = getI18n().t('openingPrayerMidweekMeeting', { ns: 'ui' });
            }

            // TGW Talk 10 min. History
            if (fld === 'tgw_talk') {
              obj.assignmentName = getI18n().t('tgwTalk2', { ns: 'ui' });
              obj.assignmentSource = schedule.tgwTalk_src;
            }

            // TGW Spiritual Gems History
            if (fld === 'tgw_gems') {
              obj.assignmentName = getI18n().t('tgwGems2', { ns: 'ui' });
            }

            //Bible Reading History
            if (fld.startsWith('bRead_stu_')) {
              const stuclass = fld.split('_')[2];
              obj.assignmentName = getI18n().t('bibleReading', { ns: 'ui' });
              obj.class = stuclass;
              obj.studyPoint = schedule.bibleReading_study;
              obj.assignmentSource = schedule.bibleReading_src;
            }

            //AYF Assigment History
            if (fld.startsWith('ass') && fld.includes('_stu_')) {
              const stuclass = fld.split('_')[2];
              const weekFld = fld.split('_')[0] + '_type';
              const studyFld = fld.split('_')[0] + '_study';
              const timeFld = fld.split('_')[0] + '_time';
              const sourceFld = fld.split('_')[0] + '_src';
              const assistantFld = fld.replace('_stu_', '_ass_');
              const assistantFldDispName = `${assistantFld}_dispName`;
              const assType = schedule[weekFld];
              const studyPoint = schedule[studyFld];
              const assSource = schedule[sourceFld];
              const assTime = schedule[timeFld];
              const assistantDispName = schedule[assistantFldDispName];

              obj.assignmentName = `${getAssignmentName(assType)} - ${getI18n().t('student', { ns: 'ui' })}`;
              obj.assistantDispName = assistantDispName;
              obj.assignmentTime = assTime;
              obj.assignmentSource = assSource;
              obj.assignmentType = 'ayf';
              obj.class = stuclass;
              obj.studyPoint = studyPoint;
            }

            //AYF Assistant History
            if (fld.startsWith('ass') && fld.includes('_ass_')) {
              const stuclass = fld.split('_')[2];
              const studyFld = fld.split('_')[0] + '_study';
              const weekFld = fld.split('_')[0] + '_type';
              const sourceFld = fld.split('_')[0] + '_src';
              const timeFld = fld.split('_')[0] + '_time';
              const studentFld = fld.replace('_ass_', '_stu_');
              const studentFldDispName = `${studentFld}_dispName`;
              const studyPoint = schedule[studyFld];
              const assSource = schedule[sourceFld];
              const assTime = schedule[timeFld];
              const studentDispName = schedule[studentFldDispName];
              const assType = schedule[weekFld];

              obj.assignmentName = `${getAssignmentName(assType)} - ${getI18n().t('assistant', { ns: 'ui' })}`;
              obj.studentForAssistant = studentDispName;
              obj.assignmentTime = assTime;
              obj.assignmentSource = assSource;
              obj.assignmentType = 'ayf';
              obj.class = stuclass;
              obj.studyPoint = studyPoint;
            }

            // LC Assignment History
            if (fld.startsWith('lc_part')) {
              const lcIndex = fld.slice(-1);
              const fldSource = `lcPart${lcIndex}_src`;
              const fldTime = `lcPart${lcIndex}_time`;
              const fldContent = `lcPart${lcIndex}_content`;

              obj.assignmentName = getI18n().t('lcPart', { ns: 'ui' });
              obj.assignmentTime = schedule[fldTime];
              obj.assignmentSource = schedule[fldSource];
              obj.assignmentContent = schedule[fldContent];
            }

            // CBS Conductor History
            if (fld === 'cbs_conductor') {
              obj.assignmentName = getI18n().t('cbsConductor2', { ns: 'ui' });
              obj.assignmentSource = schedule.cbs_src;
            }

            // CBS Reader History
            if (fld === 'cbs_reader') {
              obj.assignmentName = getI18n().t('cbsReader2', { ns: 'ui' });
              obj.assignmentSource = schedule.cbs_src;
            }

            // Closing Prayer
            if (fld === 'closing_prayer') {
              obj.assignmentName = getI18n().t('closingPrayerMidweekMeeting', { ns: 'ui' });
            }

            obj.isBehalf = isBehalf;

            myItems.push(obj);
          }
        });
      }
    });

    myItems.sort((a, b) => {
      const dateA = a.weekOf.split('/')[2] + '/' + a.weekOf.split('/')[0] + '/' + a.weekOf.split('/')[1];
      const dateB = b.weekOf.split('/')[2] + '/' + b.weekOf.split('/')[0] + '/' + b.weekOf.split('/')[1];
      return dateA > dateB ? 1 : -1;
    });

    return myItems;
  } catch (err) {
    console.log(err);
  }
};
