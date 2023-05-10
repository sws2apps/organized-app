import dateFormat from 'dateformat';
import appDb from '../indexedDb/mainDb';
import { Persons } from './Persons';
import { ScheduleClass } from './Schedule';
import { addMinutes, getHistoryInfo } from '../utils/schedule';
import { Setting } from './Setting';
import { getI18n } from 'react-i18next';
import { Sources } from './Sources';

class SchedulesClass {
  constructor() {
    this.list = [];
    this.history = [];
  }
}

SchedulesClass.prototype.sort = function (arrayName) {
  this[arrayName].sort((a, b) => {
    const dateA = a.weekOf.split('/')[2] + '/' + a.weekOf.split('/')[0] + '/' + a.weekOf.split('/')[1];
    const dateB = b.weekOf.split('/')[2] + '/' + b.weekOf.split('/')[0] + '/' + b.weekOf.split('/')[1];
    return dateA < dateB ? 1 : -1;
  });
};

SchedulesClass.prototype.loadAll = async function () {
  this.list.length = 0;
  const appData = await appDb.sched_MM.toArray();

  for (const source of appData) {
    const week = new ScheduleClass(source.weekOf);
    await week.loadDetails();
    this.list.push(week);
  }

  this.sort('list');
};

SchedulesClass.prototype.buildHistory = function () {
  this.history.length = 0;

  try {
    const appData = this.list;
    const personsCount = Persons.list.length;

    const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');

    if (personsCount > 0 || !lmmoRole) {
      for (const schedule of appData) {
        const assList = [];
        const excludeFiles = ['weekOf', 'week_type', 'noMeeting', 'isReleased', 'changes'];
        for (const [key, value] of Object.entries(schedule)) {
          if (excludeFiles.indexOf(key) === -1 && key.indexOf('_name') === -1 && key.indexOf('_dispName') === -1) {
            if (value && value !== '') {
              assList.push({ assignment: key, person: value });
            }
          }
        }

        for (const item of assList) {
          let history = getHistoryInfo(schedule.weekOf, item.assignment);
          this.history.push(history);
          history = null;
        }
      }

      this.sort('history');
    }
  } catch (err) {
    throw new Error(err);
  }
};

SchedulesClass.prototype.updateHistory = function (weekOf, assignment, deleted) {
  const findIndex = this.history.findIndex((item) => item.weekOf === weekOf && item.assignment === assignment);
  if (findIndex !== -1) this.history.splice(findIndex, 1);
  if (deleted) return;

  let history = getHistoryInfo(weekOf, assignment);
  this.history.push(history);
  this.sort('history');
  history = null;
};

SchedulesClass.prototype.get = function (weekOf) {
  return this.list.find((schedule) => schedule.weekOf === weekOf);
};

SchedulesClass.prototype.add = async function (weekOf) {
  const week = new ScheduleClass(weekOf);
  await week.loadDetails();
  this.list.push(week);
  this.sort('list');
};

SchedulesClass.prototype.personAssignments = function (person) {
  return this.history.filter((history) => history.studentID === person) || [];
};

SchedulesClass.prototype.personLastAssignmentFormatted = function (person) {
  return this.history.find((history) => history.studentID === person)?.weekOfFormatted || '';
};

SchedulesClass.prototype.personLastAssignment = function (person) {
  return this.history.find((history) => history.studentID === person)?.weekOf || '';
};

SchedulesClass.prototype.delete = async function (week) {
  if (!this.get(week)) {
    return;
  }

  await appDb.sched_MM.delete(week);
  this.list = this.list.filter((schedule) => schedule.weekOf !== week);
};

SchedulesClass.prototype.updatePocketSchedule = async function (data) {
  if (data.midweekMeeting) {
    for await (const monthSchedule of data.midweekMeeting) {
      const weeks = monthSchedule.schedules;
      for await (const week of weeks) {
        const schedule = this.get(week.weekOf) || new ScheduleClass(week.weekOf);
        await schedule.save(week);
      }
    }
  }
};

SchedulesClass.prototype.S89ItemData = function (week, assName, classLabel) {
  const sourceLang = Setting.source_lang;

  let stuFld = '';
  let assFld = '';
  let assTypeFld = 0;

  if (assName === 'bRead') {
    stuFld = 'bRead_stu_' + classLabel;
  } else if (assName === 'ass1') {
    stuFld = 'ass1_stu_' + classLabel;
    assFld = 'ass1_ass_' + classLabel;
    assTypeFld = 'ass1_type';
  } else if (assName === 'ass2') {
    stuFld = 'ass2_stu_' + classLabel;
    assFld = 'ass2_ass_' + classLabel;
    assTypeFld = 'ass2_type';
  } else if (assName === 'ass3') {
    stuFld = 'ass3_stu_' + classLabel;
    assFld = 'ass3_ass_' + classLabel;
    assTypeFld = 'ass3_type';
  } else if (assName === 'ass4') {
    stuFld = 'ass4_stu_' + classLabel;
    assFld = 'ass4_ass_' + classLabel;
    assTypeFld = 'ass4_type';
  }

  let midDay = parseInt(Setting.meeting_day, 10);

  const [varMonth, varDay, varYear] = week.split('/');
  midDay = parseInt(varDay, 10) + midDay - 1;
  const lDate = new Date(varYear, varMonth - 1, midDay);
  const dateFormatted = dateFormat(lDate, getI18n().getDataByLanguage(sourceLang).ui['shortDateFormat']);

  const sourceData = Sources.get(week).local();
  const scheduleData = this.get(week);

  const s89Data = {};
  const stuID = scheduleData[stuFld];
  const { person_name } = Persons.get(stuID);
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
    let assType = sourceData[assTypeFld];
    if (assType >= 140 && assType < 170) assType = 101;
    if (assType >= 170 && assType < 200) assType = 102;

    if (assType === 101 || assType === 102 || assType === 103 || assType === 108) {
      const assID = scheduleData[assFld];
      if (typeof assID !== 'undefined' && assID !== '') {
        const assInfo = Persons.get(assID);
        s89Data.assistantName = assInfo.person_name;
      }
    }

    let ass1Type = sourceData['ass1_type'];
    if (ass1Type >= 140 && ass1Type < 170) ass1Type = 101;
    if (ass1Type >= 170 && ass1Type < 200) ass1Type = 102;

    let ass2Type = sourceData['ass2_type'];
    if (ass2Type >= 140 && ass2Type < 170) ass2Type = 101;
    if (ass2Type >= 170 && ass2Type < 200) ass2Type = 102;

    let ass3Type = sourceData['ass3_type'];
    if (ass3Type >= 140 && ass3Type < 170) ass3Type = 101;
    if (ass3Type >= 170 && ass3Type < 200) ass3Type = 102;

    let ass4Type = sourceData['ass4_type'];
    if (ass4Type >= 140 && ass4Type < 170) ass4Type = 101;
    if (ass4Type >= 170 && ass4Type < 200) ass4Type = 102;

    if (assType === 101 || assType === 108 || assType === 102) {
      if (assType === 101) s89Data.isInitialCall = true;
      if (assType === 108) s89Data.isMemorialInvite = true;
      if (assType === 102) s89Data.isReturnVisit = true;

      let fieldSpec = 'initialCallSpec';
      if (assType === 102) fieldSpec = 'returnVisitSpec';

      if (assName === 'ass1') {
        if (ass1Type === ass2Type) {
          s89Data[fieldSpec] = getI18n().t('s89Part1Label', { lng: sourceLang, ns: 'source' });
        }
      } else if (assName === 'ass2') {
        if (ass2Type === ass1Type) {
          s89Data[fieldSpec] = getI18n().t('s89Part2Label', { lng: sourceLang, ns: 'source' });
        }
        if (ass2Type === ass3Type) {
          s89Data[fieldSpec] = getI18n().t('s89Part1Label', { lng: sourceLang, ns: 'source' });
        }
      } else if (assName === 'ass3') {
        if (ass3Type === ass2Type) {
          s89Data[fieldSpec] = getI18n().t('s89Part2Label', { lng: sourceLang, ns: 'source' });
        }
        if (ass3Type === ass4Type) {
          s89Data[fieldSpec] = getI18n().t('s89Part1Label', { lng: sourceLang, ns: 'source' });
        }
      } else if (assName === 'ass4') {
        if (ass4Type === ass3Type) {
          s89Data[fieldSpec] = getI18n().t('s89Part2Label', { lng: sourceLang, ns: 'source' });
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

SchedulesClass.prototype.S140Data = function (scheduleName) {
  const { t } = getI18n();

  const sourceLang = Setting.source_lang;

  const data = [];
  const allWeeks = Sources.weekListBySchedule(scheduleName);
  const meetingStart = dateFormat(Setting.meeting_time, t('shortTimeFormat', { lng: sourceLang, ns: 'source' }));

  for (const week of allWeeks) {
    const scheduleData = this.get(week);
    const sourceData = Sources.get(week).local();

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
    if (sourceData.lcPart1_time_override !== '') {
      time.lc2 = addMinutes(time.lc1, sourceData.lcPart1_time_override);
    } else {
      time.lc2 = addMinutes(time.lc1, sourceData.lcPart1_time);
    }

    if (scheduleData.week_type === 1) {
      // normal - cbs
      if (sourceData.lcCount_override !== 0) {
        if (sourceData.lcCount_override === 1) {
          time.cbs = time.lc2;
        } else {
          time.cbs = addMinutes(time.lc2, sourceData.lcPart2_time_override);
        }
      }

      if (sourceData.lcCount_override === 0) {
        if (sourceData.lcCount === 1) {
          time.cbs = time.lc2;
        } else {
          time.cbs = addMinutes(time.lc2, sourceData.lcPart2_time);
        }
      }

      // normal - concluding comments
      if (sourceData.cbs_time_override !== '') {
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
        if (sourceData.lcPart2_time_override !== '') {
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

SchedulesClass.prototype.buildScheduleForShare = async function (scheduleIndex) {
  // get current schedule id
  const month = +scheduleIndex.split('/')[0];
  const year = +scheduleIndex.split('/')[1];

  let id;
  const schedule = await appDb.sws_pocket.where('[month+year]').equals([month, year]).first();

  if (schedule) {
    id = schedule.id;
  } else {
    id = window.crypto.randomUUID();
    await appDb.sws_pocket.add({
      id: id,
      month: month,
      year: year,
    });
  }

  const objSchedule = [];
  const objSource = [];

  const allWeeks = Sources.weekListBySchedule(scheduleIndex);

  for (const week of allWeeks) {
    const schedData = this.get(week);
    const sourceData = Sources.get(week).local();

    objSchedule.push(schedData);
    objSource.push(sourceData);
  }

  const dataPocket = {
    sources: objSource,
    id: id,
    schedules: objSchedule,
    month: month,
    year: year,
  };

  return dataPocket;
};

export const Schedules = new SchedulesClass();
