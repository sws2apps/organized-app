import dateFormat from 'dateformat';
import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { Persons } from '../classes/Persons';
import { Schedules } from '../classes/Schedules';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';
import { refreshMyAssignmentsState } from '../states/main';
import { addMonths, addWeeks } from './app';
import { VisitingSpeakers } from '../classes/VisitingSpeakers';

export const getHistoryInfo = (weekOf, assignment) => {
  const source = Sources.get(weekOf);
  const weekData = source.local();
  const [varYear, varMonth, varDay] = weekOf.split('/');
  const lDate = new Date(varYear, varMonth - 1, varDay);
  const dateFormatted = dateFormat(lDate, Setting.shortDateFormat());

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const viewMeetingScheduleRole =
    !lmmoRole &&
    !secretaryRole &&
    !coordinatorRole &&
    !publicTalkCoordinatorRole &&
    (Setting.cong_role.includes('view_meeting_schedule') ||
      Setting.cong_role.includes('elder') ||
      Setting.cong_role.includes('publisher') ||
      Setting.cong_role.includes('ms'));

  const schedule = Schedules.get(weekOf);

  const history = {};
  history.ID = crypto.randomUUID();
  history.weekOf = schedule.weekOf;
  history.weekOfFormatted = dateFormatted;
  history.studentID = schedule[assignment];

  if (lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole) {
    const person = Persons.get(history.studentID);
    history.studentName = person?.person_displayName || '';
  }

  if (viewMeetingScheduleRole) {
    const fldDispName = `${assignment}_dispName`;
    history.studentName = schedule[fldDispName];
  }

  history.class = '';
  history.assignment = assignment;

  // Chairman History
  if (assignment === 'chairmanMM_A') {
    history.assignmentID = 110;
    history.assignmentName = getI18n().t('chairmanMidweekMeeting2', { ns: 'ui', lng: Setting.appLang() });
  }

  // Aux Class Counselor History
  if (assignment === 'chairmanMM_B') {
    history.assignmentID = 110;
    history.assignmentName = getI18n().t('auxClassCounselor', { ns: 'ui', lng: Setting.appLang() });
  }

  // Opening Prayer
  if (assignment === 'opening_prayerMM') {
    history.assignmentID = 111;
    history.assignmentName = getI18n().t('openingPrayerMidweekMeeting', { ns: 'ui', lng: Setting.appLang() });
  }

  // TGW Talk 10 min. History
  if (assignment === 'tgw_talk') {
    history.assignmentID = 112;
    history.assignmentName = getI18n().t('tgwTalk', { ns: 'source', lng: Setting.appLang() });
    history.assignmentSource = weekData.mwb_tgw_talk;
  }

  // TGW Spiritual Gems History
  if (assignment === 'tgw_gems') {
    history.assignmentID = 113;
    history.assignmentName = getI18n().t('tgwGems', { ns: 'source', lng: Setting.appLang() });
  }

  //Bible Reading History
  if (assignment.startsWith('bRead_stu_')) {
    const stuclass = assignment.split('_')[2];
    history.assignmentID = 100;
    history.assignmentName = getI18n().t('bibleReading', { ns: 'source', lng: Setting.appLang() });
    history.class = stuclass;
    history.assignmentSource = weekData.mwb_tgw_bread;
  }

  //AYF
  if (assignment.startsWith('ass')) {
    const srcFld = 'mwb_ayf_' + assignment.split('_')[0].replace('ass', 'part');
    const timeFld = 'mwb_ayf_' + assignment.split('_')[0].replace('ass', 'part') + '_time';
    history.assignmentSource = weekData[srcFld];
    history.assignmentTime = weekData[timeFld];
  }

  //AYF Assigment History
  if (assignment.startsWith('ass') && assignment.includes('_stu_')) {
    const stuclass = assignment.split('_')[2];
    const weekFld = 'mwb_ayf_' + assignment.split('_')[0].replace('ass', 'part') + '_type';
    const assType = weekData[weekFld];

    history.assignmentID = assType;
    history.assignmentType = 'ayf';
    if (assType === 101 || (assType >= 140 && assType < 170)) {
      history.assignmentName = getI18n().t('initialCall', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 102 || (assType >= 170 && assType < 200)) {
      history.assignmentName = getI18n().t('returnVisit', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 103) {
      history.assignmentName = getI18n().t('bibleStudy', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 104) {
      history.assignmentName = getI18n().t('talk', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 108) {
      history.assignmentName = getI18n().t('memorialInvite', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 123) {
      history.assignmentName = getI18n().t('startingConversation', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 124) {
      history.assignmentName = getI18n().t('followingUp', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 125) {
      history.assignmentName = getI18n().t('makingDisciples', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 126) {
      history.assignmentName = getI18n().t('explainingBeliefs', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 127) {
      history.assignmentName = getI18n().t('discussion', { ns: 'source', lng: Setting.appLang() });
    }
    history.class = stuclass;

    const fldStudent = assignment.replace('_stu_', '_ass_');
    const fldValue = schedule[fldStudent];

    if (lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole) {
      const person = Persons.get(fldValue);
      history.assistantDispName = person?.person_displayName || '';
    }

    if (viewMeetingScheduleRole) {
      const fldDispName = `${fldStudent}_dispName`;
      history.assistantDispName = schedule[fldDispName];
    }
  }

  // AYF Assistant History
  if (assignment.startsWith('ass') && assignment.includes('_ass_')) {
    const fldStudent = assignment.replace('_ass_', '_stu_');
    const fldValue = schedule[fldStudent];
    const weekFld = 'mwb_ayf_' + assignment.split('_')[0].replace('ass', 'part') + '_type';
    const assType = weekData[weekFld];

    if (lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole) {
      const person = Persons.get(fldValue);
      history.studentForAssistant = person?.person_displayName || '';
    }

    if (viewMeetingScheduleRole) {
      const fldDispName = `${fldStudent}_dispName`;
      history.studentForAssistant = schedule[fldDispName];
    }

    history.assignmentID = 109;
    history.assignmentType = 'ayf';

    const assistantStr = getI18n().t('assistant', { ns: 'ui', lng: Setting.appLang() });

    let mainPart;
    if (assType === 101 || (assType >= 140 && assType < 170)) {
      mainPart = getI18n().t('initialCall', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 102 || (assType >= 170 && assType < 200)) {
      mainPart = getI18n().t('returnVisit', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 103) {
      mainPart = getI18n().t('bibleStudy', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 108) {
      mainPart = getI18n().t('memorialInvite', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 123) {
      mainPart = getI18n().t('startingConversation', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 124) {
      mainPart = getI18n().t('followingUp', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 125) {
      mainPart = getI18n().t('makingDisciples', { ns: 'source', lng: Setting.appLang() });
    } else if (assType === 126) {
      mainPart = getI18n().t('explainingBeliefs', { ns: 'source', lng: Setting.appLang() });
    }

    history.assignmentName = `${assistantStr} (${mainPart})`;

    const stuclass = assignment.split('_')[2];
    history.class = stuclass;
  }

  // LC Assignment History
  if (assignment.startsWith('lc_part')) {
    const lcIndex = assignment.slice(-1);
    const fldSource = `mwb_lc_part${lcIndex}`;
    const fldTime = `mwb_lc_part${lcIndex}_time`;
    const fldContent = `mwb_lc_part${lcIndex}_content`;

    history.assignmentID = 114;
    history.assignmentName = getI18n().t('lcPart', { ns: 'source', lng: Setting.appLang() });
    history.assignmentSource = `(${weekData[fldTime]} min.) ${weekData[fldSource]}`;
    history.assignmentContent = weekData[fldContent];
  }

  // CBS Conductor History
  if (assignment === 'cbs_conductor') {
    history.assignmentID = 115;
    history.assignmentName = getI18n().t('cbsConductor', { ns: 'source', lng: Setting.appLang() });
    history.assignmentName += ` (${getI18n().t('cbs', { ns: 'source', lng: Setting.appLang() })})`;
    history.assignmentSource = weekData.mwb_lc_cbs;
  }

  // CBS Reader History
  if (assignment === 'cbs_reader') {
    history.assignmentID = 116;
    history.assignmentName = getI18n().t('cbsReader', { ns: 'source', lng: Setting.appLang() });
    history.assignmentName += ` (${getI18n().t('cbs', { ns: 'source', lng: Setting.appLang() })})`;
    history.assignmentSource = weekData.mwb_lc_cbs;
  }

  // Closing Prayer History
  if (assignment === 'closing_prayerMM') {
    history.assignmentID = 111;
    history.assignmentName = getI18n().t('closingPrayer', { ns: 'ui', lng: Setting.appLang() });
  }

  // Weekend Meeting Chairman
  if (assignment === 'chairman_WM') {
    history.assignmentID = 118;
    history.assignmentName = getI18n().t('chairmanWeekendMeeting', { ns: 'ui', lng: Setting.appLang() });
  }

  // Weekend Meeting Opening Prayer
  if (assignment === 'opening_prayerWM') {
    history.assignmentID = 119;
    history.assignmentName = getI18n().t('openingPrayerWeekendMeeting', { ns: 'ui', lng: Setting.appLang() });
  }

  // Weekend Meeting Speaker 1
  if (assignment === 'speaker_1') {
    if (!viewMeetingScheduleRole && schedule.is_visiting_speaker) {
      const person = VisitingSpeakers.getSpeakerByUid(history.studentID);
      history.studentName = person?.person_displayName || '';
    }

    history.assignmentSource = schedule.public_talk_title;
    history.assignmentID = 121;

    if (schedule.speaker_2 === '') {
      history.assignmentName = getI18n().t('speaker', { ns: 'ui', lng: Setting.appLang() });
    }

    if (schedule.speaker_2 !== '') {
      if (!viewMeetingScheduleRole) {
        const person = Persons.get(schedule.speaker_2);
        history.speaker2DispName = person?.person_displayName || '';
      }

      if (viewMeetingScheduleRole) {
        history.speaker2DispName = schedule.speaker_2_dispName;
      }

      history.assignmentName = getI18n().t('speakerSymposiumPart1', { ns: 'ui', lng: Setting.appLang() });
    }
  }

  // Weekend Meeting Speaker 2
  if (assignment === 'speaker_2') {
    history.assignmentSource = schedule.public_talk_title;
    history.assignmentID = 120;

    if (!viewMeetingScheduleRole) {
      const person = Persons.get(schedule.speaker_1);
      history.speaker1DispName = person?.person_displayName || '';
    }

    if (viewMeetingScheduleRole) {
      history.speaker1DispName = schedule.speaker_1_dispName;
    }

    history.assignmentName = getI18n().t('speakerSymposiumPart2', { ns: 'ui', lng: Setting.appLang() });
  }

  // Substitute Speaker
  if (assignment === 'substitute_speaker') {
    history.assignmentID = 120;
    history.assignmentName = getI18n().t('substituteSpeaker', { ns: 'source', lng: Setting.appLang() });
  }

  // Watchtower Study Reader
  if (assignment === 'wtstudy_reader') {
    history.assignmentSource = weekData.w_study_title;
    history.assignmentID = 122;
    history.assignmentName = getI18n().t('wtStudyReader', { ns: 'ui', lng: Setting.appLang() });
  }

  return history;
};

export const saveAssignment = async (weekOf, stuID, varSave) => {
  const schedule = Schedules.get(weekOf);
  const tmpPerson = await schedule.saveAssignment(stuID, varSave);

  if (tmpPerson === Setting.user_local_uid) {
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

  let result = `${newHour}:`;

  if (newMinute < 10) {
    result += `0${newMinute}`;
  } else {
    result += newMinute;
  }

  return result;
};

export const fetchMyAssignments = () => {
  try {
    const myItems = [];

    for (const history of Schedules.history) {
      const fldValue = history.studentID;

      let isFound = false;
      let isBehalf = false;

      const localUID = Setting.user_local_uid;

      if (fldValue === localUID) {
        isFound = true;
      }

      if (Setting.user_members_delegate.some((member) => member.person_uid === fldValue)) {
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
      return a.weekOf > b.weekOf ? 1 : -1;
    });

    return myItems;
  } catch (err) {
    throw new Error(err);
  }
};

export const getPersonAutofillNoPart = (persons) => {
  let selected;

  for (const person of persons) {
    const assignments = Schedules.history.filter((record) => record.studentID === person.person_uid);
    if (assignments.length === 0) {
      selected = person.person_uid;
      break;
    }
  }

  return selected;
};

export const getPersonAutofillNoPartWithinMonth = (persons, week, assClass, assType) => {
  let selected;

  const str = week.split('/');
  const currentDate = new Date(`${str[0]}/${str[1]}/${str[2]}`);
  const lastMonth = addMonths(currentDate, -1);
  const nextMonth = addMonths(currentDate, 1);

  for (const person of persons) {
    const assignments = Schedules.history.filter((record) => {
      const tmpArray = record.weekOf.split('/');
      const tmpDate = new Date(`${tmpArray[0]}/${tmpArray[1]}/${tmpArray[2]}`);

      return tmpDate > lastMonth && tmpDate < nextMonth && record.studentID === person.person_uid;
    });

    if (assignments.length === 0) {
      if (assClass) {
        const lastAssignment = Schedules.history.find((record) => {
          const tmpArray = record.weekOf.split('/');
          const tmpDate = new Date(`${tmpArray[0]}/${tmpArray[1]}/${tmpArray[2]}`);

          return tmpDate < currentDate && record.studentID === person.person_uid;
        });

        const lastAssignmentClass = lastAssignment?.class;
        const lastAssignmentType = lastAssignment?.assignmentID;
        const hasAux = Setting.class_count === 2;

        if (lastAssignmentType !== assType && (!hasAux || (hasAux && lastAssignmentClass !== assClass))) {
          selected = person.person_uid;
          break;
        }
      }

      if (!assClass) {
        selected = person.person_uid;
        break;
      }
    }
  }

  return selected;
};

export const getPersonAutofillNoPartWithin2Weeks = (persons, week, assClass, assType) => {
  let selected;

  const str = week.split('/');
  const currentDate = new Date(`${str[0]}/${str[1]}/${str[2]}`);
  const lastMonth = addWeeks(currentDate, -2);
  const nextMonth = addWeeks(currentDate, 2);

  for (const person of persons) {
    const assignments = Schedules.history.filter((record) => {
      const tmpArray = record.weekOf.split('/');
      const tmpDate = new Date(`${tmpArray[0]}/${tmpArray[1]}/${tmpArray[2]}`);

      return tmpDate > lastMonth && tmpDate < nextMonth && record.studentID === person.person_uid;
    });

    if (assignments.length === 0) {
      if (assClass) {
        const lastAssignment = Schedules.history.find((record) => {
          const tmpArray = record.weekOf.split('/');
          const tmpDate = new Date(`${tmpArray[0]}/${tmpArray[1]}/${tmpArray[2]}`);

          return tmpDate < currentDate && record.studentID === person.person_uid;
        });

        const lastAssignmentClass = lastAssignment?.class;
        const lastAssignmentType = lastAssignment?.assignmentID;
        const hasAux = Setting.class_count === 2;

        if (lastAssignmentType !== assType && (!hasAux || (hasAux && lastAssignmentClass !== assClass))) {
          selected = person.person_uid;
          break;
        }
      }

      if (!assClass) {
        selected = person.person_uid;
        break;
      }
    }
  }

  return selected;
};

export const getPersonAutofillNoPartSameWeek = (persons, week, assClass, assType) => {
  let selected;

  const str = week.split('/');
  const currentDate = new Date(`${str[0]}/${str[1]}/${str[2]}`);

  for (const person of persons) {
    const assignments = Schedules.history.filter(
      (record) => record.weekOf === week && record.studentID === person.person_uid
    );

    if (assignments.length === 0) {
      if (assClass) {
        const lastAssignment = Schedules.history.find((record) => {
          const tmpArray = record.weekOf.split('/');
          const tmpDate = new Date(`${tmpArray[0]}/${tmpArray[1]}/${tmpArray[2]}`);

          return tmpDate < currentDate && record.studentID === person.person_uid;
        });

        const lastAssignmentClass = lastAssignment?.class;
        const lastAssignmentType = lastAssignment?.assignmentID;
        const hasAux = Setting.class_count === 2;

        if (lastAssignmentType !== assType && (!hasAux || (hasAux && lastAssignmentClass !== assClass))) {
          selected = person.person_uid;
          break;
        }
      }

      if (!assClass) {
        selected = person.person_uid;
        break;
      }
    }
  }

  return selected;
};

export const getPersonAutofillSibling = (persons, assType, assClass) => {
  let selected;

  for (const person of persons) {
    const lastAssignment = Schedules.history.find((record) => record.studentID === person.person_uid);

    if (lastAssignment.assignmentID !== assType) {
      if (assClass) {
        const hasAux = Setting.class_count === 2;

        if (!hasAux || (hasAux && lastAssignment.class !== assClass)) {
          selected = person.person_uid;
          break;
        }
      }

      if (!assClass) {
        selected = person.person_uid;
        break;
      }
    }
  }

  return selected;
};

export const selectRandomPerson = (data) => {
  let assType = data.assType;
  const week = data.week;
  const mainStudent = data.mainStudent;
  const assClass = data.assClass;
  const isLC = data.isLC;
  const isElderPart = data.isElderPart;

  let selected;

  const persons = Persons.getByAssignment({ assType, stuForAssistant: mainStudent, isLC, isElderPart });

  assType = assType === 'isAssistant' ? 109 : assType;

  if (persons.length === 0) return selected;

  // 1st rule: no part
  selected = getPersonAutofillNoPart(persons);

  // 2nd rule: no part within one month
  if (!selected) {
    selected = getPersonAutofillNoPartWithinMonth(persons, week, assClass, assType);
  }

  // 3rd rule: no part within two weeks
  if (!selected) {
    selected = getPersonAutofillNoPartWithin2Weeks(persons, week, assClass, assType);
  }

  // 4th rule: no part within same meeting
  if (!selected) {
    selected = getPersonAutofillNoPartSameWeek(persons, week, assClass, assType);
  }

  // 5th rule: no same part consecutively
  if (!selected) {
    selected = getPersonAutofillSibling(persons, assType, assClass);
  }

  return selected;
};

export const weekendMeetingAutofill = async (startWeek, endWeek) => {
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const tmpArrayEnd = endWeek.split('/');
  endWeek = new Date(tmpArrayEnd[0], +tmpArrayEnd[1] - 1, tmpArrayEnd[2]);

  const tmpArrayStart = startWeek.split('/');
  let currentWeek = new Date(tmpArrayStart[0], +tmpArrayStart[1] - 1, tmpArrayStart[2]);

  do {
    // launching autofill
    currentWeek = dateFormat(currentWeek, 'yyyy/mm/dd');
    const schedule = Schedules.get(currentWeek);

    if (schedule.noWMeeting === false) {
      let selected;

      if (
        publicTalkCoordinatorRole &&
        !schedule.is_visiting_speaker &&
        schedule.week_type === 1 &&
        schedule.speaker_1 === ''
      ) {
        // Assign Speaker 1
        selected = selectRandomPerson({ assType: 121, week: currentWeek });
        if (selected) {
          await saveAssignment(currentWeek, selected, 'speaker_1');
        }

        // Assign Speaker 2
        if (selected) {
          const tmpPerson = Persons.get(selected);
          const isSpeakerHalf = tmpPerson.assignments.find((assignment) => assignment.code === 121);
          if (isSpeakerHalf) {
            selected = selectRandomPerson({ assType: 120, week: currentWeek });
            if (selected) {
              await saveAssignment(currentWeek, selected, 'speaker_2');
            }
          }
        }
      }

      // Assign Chairman
      if (coordinatorRole && schedule.chairman_WM === '') {
        selected = selectRandomPerson({ assType: 118, week: currentWeek });
        if (selected) {
          await saveAssignment(currentWeek, selected, 'chairman_WM');
        }
      }

      // Assign Opening Prayer
      if (coordinatorRole && !Setting.opening_prayer_WM_autoAssign && schedule.opening_prayerWM === '') {
        selected = selectRandomPerson({ assType: 119, week: currentWeek });
        if (selected) {
          await saveAssignment(currentWeek, selected, 'opening_prayerWM');
        }
      }

      // Assign Watchtower Study Reader
      if (coordinatorRole && schedule.wtstudy_reader === '') {
        selected = selectRandomPerson({ assType: 122, week: currentWeek });
        if (selected) {
          await saveAssignment(currentWeek, selected, 'wtstudy_reader');
        }
      }
    }

    // assigning next week
    const tmpArrayCurrent = currentWeek.split('/');
    currentWeek = new Date(tmpArrayCurrent[0], +tmpArrayCurrent[1] - 1, tmpArrayCurrent[2]);
    currentWeek = currentWeek.setDate(currentWeek.getDate() + 7);
  } while (currentWeek <= endWeek);
};

export const weekendMeetingDelete = async (startWeek, endWeek) => {
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const tmpArrayEnd = endWeek.split('/');
  endWeek = new Date(tmpArrayEnd[0], +tmpArrayEnd[1] - 1, tmpArrayEnd[2]);

  const tmpArrayStart = startWeek.split('/');
  let currentWeek = new Date(tmpArrayStart[0], +tmpArrayStart[1] - 1, tmpArrayStart[2]);

  do {
    currentWeek = dateFormat(currentWeek, 'yyyy/mm/dd');

    if (coordinatorRole) {
      // Delete Chairman
      await saveAssignment(currentWeek, undefined, 'chairman_WM');

      // Delete Opening Prayer
      await saveAssignment(currentWeek, undefined, 'opening_prayerWM');

      // Delete Watchtower Study Reader
      await saveAssignment(currentWeek, undefined, 'wtstudy_reader');
    }

    if (publicTalkCoordinatorRole) {
      // Delete Speaker 1
      await saveAssignment(currentWeek, undefined, 'speaker_1');

      // Delete Speaker 2
      await saveAssignment(currentWeek, undefined, 'speaker_2');
    }

    // assigning next week
    const tmpArrayCurrent = currentWeek.split('/');
    currentWeek = new Date(tmpArrayCurrent[0], +tmpArrayCurrent[1] - 1, tmpArrayCurrent[2]);
    currentWeek = currentWeek.setDate(currentWeek.getDate() + 7);
  } while (currentWeek <= endWeek);
};

export const buildArrayWeeks = (startWeek, endWeek) => {
  const result = [];

  let currentWeek = startWeek;

  do {
    result.push(currentWeek);

    // assigning next week
    let nextWeek = new Date(currentWeek);
    nextWeek = nextWeek.setDate(nextWeek.getDate() + 7);

    currentWeek = dateFormat(nextWeek, 'yyyy/mm/dd');
  } while (currentWeek <= endWeek);

  return result;
};
