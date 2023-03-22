import dateFormat from 'dateformat';
import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { Persons } from '../classes/Persons';
import { Schedules } from '../classes/Schedules';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';
import { refreshMyAssignmentsState } from '../states/main';

export const getHistoryInfo = (weekOf, assignment) => {
  const source = Sources.get(weekOf);
  const weekData = source.local;
  const [varMonth, varDay, varYear] = weekOf.split('/');
  const lDate = new Date(varYear, varMonth - 1, varDay);
  const dateFormatted = dateFormat(lDate, Setting.shortDateFormat);

  const schedule = Schedules.get(weekOf);

  const history = {};
  history.ID = crypto.randomUUID();
  history.weekOf = schedule.weekOf;
  history.weekOfFormatted = dateFormatted;
  history.studentID = schedule[assignment];

  if (Setting.account_type === 'vip') {
    const person = Persons.get(history.studentID);
    history.studentName = person?.person_displayName || '';
  }

  if (Setting.account_type === 'pocket') {
    const fldDispName = `${assignment}_dispName`;
    history.studentName = schedule[fldDispName];
  }

  history.class = '';
  history.assignment = assignment;

  // Chairman History
  if (assignment === 'chairmanMM_A') {
    history.assignmentID = 110;
    history.assignmentName = getI18n().t('chairmanMidweekMeeting2', { ns: 'ui' });
  }

  // Aux Class Counselor History
  if (assignment === 'chairmanMM_B') {
    history.assignmentID = 110;
    history.assignmentName = getI18n().t('auxClassCounselor', { ns: 'ui' });
  }

  // Opening Prayer
  if (assignment === 'opening_prayer') {
    history.assignmentID = 111;
    history.assignmentName = getI18n().t('openingPrayer', { ns: 'ui' });
  }

  // TGW Talk 10 min. History
  if (assignment === 'tgw_talk') {
    history.assignmentID = 112;
    history.assignmentName = getI18n().t('tgwTalk', { ns: 'source' });
    history.assignmentSource = weekData.tgwTalk_src;
  }

  // TGW Spiritual Gems History
  if (assignment === 'tgw_gems') {
    history.assignmentID = 113;
    history.assignmentName = getI18n().t('tgwGems', { ns: 'source' });
  }

  //Bible Reading History
  if (assignment.startsWith('bRead_stu_')) {
    const stuclass = assignment.split('_')[2];
    history.assignmentID = 100;
    history.assignmentName = getI18n().t('bibleReading', { ns: 'source' });
    history.class = stuclass;
    history.studyPoint = weekData.bibleReading_study;
    history.assignmentSource = weekData.bibleReading_src;
  }

  //AYF
  if (assignment.startsWith('ass')) {
    const srcFld = assignment.split('_')[0] + '_src';
    const timeFld = assignment.split('_')[0] + '_time';
    history.assignmentSource = weekData[srcFld];
    history.assignmentTime = weekData[timeFld];
  }

  //AYF Assigment History
  if (assignment.startsWith('ass') && assignment.includes('_stu_')) {
    const stuclass = assignment.split('_')[2];
    const weekFld = assignment.split('_')[0] + '_type';
    const studyFld = assignment.split('_')[0] + '_study';
    const assType = weekData[weekFld];
    const studyPoint = weekData[studyFld];

    history.assignmentID = assType;
    history.assignmentType = 'ayf';
    if (assType === 101 || (assType >= 140 && assType < 170)) {
      history.assignmentName = getI18n().t('initialCall', { ns: 'source' });
    } else if (assType === 102 || (assType >= 170 && assType < 200)) {
      history.assignmentName = getI18n().t('returnVisit', { ns: 'source' });
    } else if (assType === 103) {
      history.assignmentName = getI18n().t('bibleStudy', { ns: 'source' });
    } else if (assType === 104) {
      history.assignmentName = getI18n().t('talk', { ns: 'source' });
    } else if (assType === 108) {
      history.assignmentName = getI18n().t('memorialInvite', { ns: 'source' });
    }
    history.class = stuclass;
    history.studyPoint = studyPoint;

    const fldStudent = assignment.replace('_stu_', '_ass_');
    const fldValue = schedule[fldStudent];

    if (Setting.account_type === 'vip') {
      const person = Persons.get(fldValue);
      history.assistantDispName = person?.person_displayName || '';
    }

    if (Setting.account_type === 'pocket') {
      const fldDispName = `${fldStudent}_dispName`;
      history.assistantDispName = schedule[fldDispName];
    }
  }

  // AYF Assistant History
  if (assignment.startsWith('ass') && assignment.includes('_ass_')) {
    const fldStudent = assignment.replace('_ass_', '_stu_');
    const fldValue = schedule[fldStudent];

    if (Setting.account_type === 'vip') {
      const person = Persons.get(fldValue);
      history.studentForAssistant = person?.person_displayName || '';
    }

    if (Setting.account_type === 'pocket') {
      const fldDispName = `${fldStudent}_dispName`;
      history.studentForAssistant = schedule[fldDispName];
    }

    history.assignmentID = 109;
    history.assignmentType = 'ayf';
    history.assignmentName = getI18n().t('assistant', { ns: 'ui' });

    const stuclass = assignment.split('_')[2];
    history.class = stuclass;
  }

  // LC Assignment History
  if (assignment.startsWith('lc_part')) {
    const lcIndex = assignment.slice(-1);
    const fldSource = `lcPart${lcIndex}_src`;
    const fldTime = `lcPart${lcIndex}_time`;
    const fldContent = `lcPart${lcIndex}_content`;

    history.assignmentID = 114;
    history.assignmentName = getI18n().t('lcPart', { ns: 'source' });
    history.assignmentSource = `(${weekData[fldTime]} min.) ${weekData[fldSource]}`;
    history.assignmentContent = weekData[fldContent];
  }

  // CBS Conductor History
  if (assignment === 'cbs_conductor') {
    history.assignmentID = 115;
    history.assignmentName = getI18n().t('cbsConductor', { ns: 'source' });
    history.assignmentName += ` (${getI18n().t('cbs', { ns: 'source' })})`;
    history.assignmentSource = weekData.cbs_src;
  }

  // CBS Reader History
  if (assignment === 'cbs_reader') {
    history.assignmentID = 116;
    history.assignmentName = getI18n().t('cbsReader', { ns: 'source' });
    history.assignmentName += ` (${getI18n().t('cbs', { ns: 'source' })})`;
    history.assignmentSource = weekData.cbs_src;
  }

  // Closing Prayer History
  if (assignment === 'closing_prayer') {
    history.assignmentID = 111;
    history.assignmentName = getI18n().t('closingPrayer', { ns: 'ui' });
  }

  return history;
};

export const saveAssignment = async (weekOf, stuID, varSave) => {
  const schedule = Schedules.get(weekOf);
  const tmpPerson = await schedule.saveAssignment(stuID, varSave);

  if (tmpPerson === Setting.local_uid) {
    const prevValue = await promiseGetRecoil(refreshMyAssignmentsState);
    await promiseSetRecoil(refreshMyAssignmentsState, !prevValue);
  }
};

export const formatSelectedSchedulesForShare = (data) => {
  const result = data.filter((item) => item.indexOf('/') >= 0) || [];
  return result;
};

export const addMinutes = (prev, min) => {
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

export const fetchMyAssignments = () => {
  try {
    const myItems = [];

    for (const history of Schedules.history) {
      const fldValue = history.studentID;

      let isFound = false;
      let isBehalf = false;

      const localUID = Setting.account_type === 'vip' ? Setting.local_uid : Setting.pocket_local_id.person_uid;

      if (fldValue === localUID) {
        isFound = true;
      }

      if (Setting.pocket_members.some((member) => member.person_uid === fldValue)) {
        isFound = true;
        isBehalf = true;
      }

      if (isFound) {
        const d = new Date();
        const todayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayValue = todayDate.getDay();
        const diff = todayDate.getDate() - dayValue + (dayValue === 0 ? -6 : 1);
        const currentWeekDate = new Date(todayDate.setDate(diff));

        const msInDay = 24 * 60 * 60 * 1000;
        const weekDate = new Date(history.weekOf);
        const dayDiff = Math.round((weekDate - currentWeekDate) / msInDay);

        if (dayDiff >= 0) {
          history.isBehalf = isBehalf;
          myItems.push(history);
        }
      }
    }

    myItems.sort((a, b) => {
      const dateA = a.weekOf.split('/')[2] + '/' + a.weekOf.split('/')[0] + '/' + a.weekOf.split('/')[1];
      const dateB = b.weekOf.split('/')[2] + '/' + b.weekOf.split('/')[0] + '/' + b.weekOf.split('/')[1];
      return dateA > dateB ? 1 : -1;
    });

    return myItems;
  } catch (err) {
    throw new Error(err);
  }
};
