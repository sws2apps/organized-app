import dateFormat from 'dateformat';
import appDb from '../../shared/indexedDb/mainDb';
import { Persons } from './Persons';
import { ScheduleClass } from './Schedule';
import { addMinutes, buildArrayWeeks, getHistoryInfo } from '../utils/schedule';
import { Setting } from './Setting';
import { getI18n } from 'react-i18next';
import { Sources } from './Sources';
import { S34s } from './S34s';
import { VisitingSpeakers } from './VisitingSpeakers';
import { checkAYFExplainingBeliefsAssignment } from '../utils/sourceMaterial';

class SchedulesClass {
  constructor() {
    this.list = [];
    this.history = [];
    this.talkHistory = [];
  }
}

SchedulesClass.prototype.sort = function (arrayName) {
  this[arrayName].sort((a, b) => {
    return a.weekOf < b.weekOf ? 1 : -1;
  });
};

SchedulesClass.prototype.loadAll = async function () {
  this.list.length = 0;
  const appData = await appDb.sched.toArray();

  for await (const source of appData) {
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
        const excludeFiles = [
          'weekOf',
          'week_type',
          'noMMeeting',
          'noWMeeting',
          'isReleased',
          'changes',
          'is_visiting_speaker',
          'public_talk',
          'event_name',
        ];
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

  await appDb.sched.delete(week);
  this.list = this.list.filter((schedule) => schedule.weekOf !== week);
};

SchedulesClass.prototype.updatePocketSchedule = async function (data) {
  for await (const week of data) {
    const schedule = this.get(week.weekOf) || new ScheduleClass(week.weekOf);
    await schedule.save(week);
  }
};

SchedulesClass.prototype.S89ItemData = function (week, assName, classLabel) {
  const sourceLang = Setting.source_lang;

  let stuFld = '';
  let assFld = '';
  let assTypeFld = 0;

  const s89Data = {};

  if (assName === 'bRead') {
    stuFld = 'bRead_stu_' + classLabel;
    s89Data.partNo = 3;
  } else if (assName === 'ass1') {
    stuFld = 'ass1_stu_' + classLabel;
    assFld = 'ass1_ass_' + classLabel;
    assTypeFld = 'mwb_ayf_part1_type';
    s89Data.partNo = 4;
  } else if (assName === 'ass2') {
    stuFld = 'ass2_stu_' + classLabel;
    assFld = 'ass2_ass_' + classLabel;
    assTypeFld = 'mwb_ayf_part2_type';
    s89Data.partNo = 5;
  } else if (assName === 'ass3') {
    stuFld = 'ass3_stu_' + classLabel;
    assFld = 'ass3_ass_' + classLabel;
    assTypeFld = 'mwb_ayf_part3_type';
    s89Data.partNo = 6;
  } else if (assName === 'ass4') {
    stuFld = 'ass4_stu_' + classLabel;
    assFld = 'ass4_ass_' + classLabel;
    assTypeFld = 'mwb_ayf_part4_type';
    s89Data.partNo = 7;
  }

  let midDay = parseInt(Setting.midweek_meeting_day, 10);

  const [varYear, varMonth, varDay] = week.split('/');
  midDay = parseInt(varDay, 10) + midDay - 1;
  const lDate = new Date(varYear, varMonth - 1, midDay);
  const dateFormatted = dateFormat(lDate, getI18n().getDataByLanguage(sourceLang).ui['shortDateFormat']);

  const sourceData = Sources.get(week).local();
  const scheduleData = this.get(week);

  const stuID = scheduleData[stuFld];
  const { person_name } = Persons.get(stuID);
  s89Data.studentName = person_name;
  s89Data.assistantName = '';
  s89Data.assignmentDate = dateFormatted;

  if (assName === 'ass1' || assName === 'ass2' || assName === 'ass3' || assName === 'ass4') {
    let assType = sourceData[assTypeFld];
    if (assType >= 140 && assType < 170) assType = 101;
    if (assType >= 170 && assType < 200) assType = 102;

    if (
      assType === 101 ||
      assType === 102 ||
      assType === 103 ||
      assType === 108 ||
      assType === 123 ||
      assType === 124 ||
      assType === 125 ||
      assType === 126
    ) {
      const assID = scheduleData[assFld];
      if (typeof assID !== 'undefined' && assID !== '') {
        const assInfo = Persons.get(assID);
        s89Data.assistantName = assInfo.person_name;
      }
    }
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

    let midDay = +Setting.midweek_meeting_day;
    const [varYear, varMonth, varDay] = week.split('/');
    midDay = parseInt(varDay, 10) + midDay - 1;
    const lDate = new Date(varYear, varMonth - 1, midDay);

    const meetingDate = t('longDateFormat', {
      lng: sourceLang,
      ns: 'source',
      month: Setting.monthNames()[lDate.getMonth()],
      date: lDate.getDate(),
      year: lDate.getFullYear(),
    });

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
      sourceData.mwb_ayf_part1_type === 105 ||
      sourceData.mwb_ayf_part1_type === 106 ||
      sourceData.mwb_ayf_part1_type === 107 ||
      sourceData.mwb_ayf_part1_type === 117 ||
      sourceData.mwb_ayf_part1_type === 127
    ) {
      time.ayf2 = addMinutes(time.ayf1, +sourceData.mwb_ayf_part1_time);
    } else {
      time.ayf2 = addMinutes(time.ayf1, +sourceData.mwb_ayf_part1_time + 1);
    }

    // ayf 3
    if (
      sourceData.mwb_ayf_part2_type === 105 ||
      sourceData.mwb_ayf_part2_type === 106 ||
      sourceData.mwb_ayf_part2_type === 107 ||
      sourceData.mwb_ayf_part2_type === 117 ||
      sourceData.mwb_ayf_part2_type === 127
    ) {
      time.ayf3 = addMinutes(time.ayf2, +sourceData.mwb_ayf_part2_time);
    } else {
      time.ayf3 = addMinutes(time.ayf2, +sourceData.mwb_ayf_part2_time + 1);
    }

    if (sourceData.mwb_ayf_part3_time !== '') {
      // ayf 4
      if (
        sourceData.mwb_ayf_part3_type === 105 ||
        sourceData.mwb_ayf_part3_type === 106 ||
        sourceData.mwb_ayf_part3_type === 107 ||
        sourceData.mwb_ayf_part3_type === 117 ||
        sourceData.mwb_ayf_part3_type === 127
      ) {
        time.ayf4 = addMinutes(time.ayf3, +sourceData.mwb_ayf_part3_time);
      } else {
        time.ayf4 = addMinutes(time.ayf3, +sourceData.mwb_ayf_part3_time + 1);
      }

      // middle song
      if (sourceData.mwb_ayf_part4_time !== '') {
        if (
          sourceData.mwb_ayf_part4_type === 105 ||
          sourceData.mwb_ayf_part4_type === 106 ||
          sourceData.mwb_ayf_part4_type === 107 ||
          sourceData.mwb_ayf_part4_type === 117 ||
          sourceData.mwb_ayf_part4_type === 127
        ) {
          time.middleSong = addMinutes(time.ayf4, +sourceData.mwb_ayf_part4_time);
        } else {
          time.middleSong = addMinutes(time.ayf4, +sourceData.mwb_ayf_part4_time + 1);
        }
      } else {
        time.middleSong = time.ayf4;
      }
    } else {
      time.middleSong = time.ayf3;
    }

    // lc part 1
    time.lc1 = addMinutes(time.middleSong, 5);

    // lc part 2
    if (sourceData.mwb_lc_part1_time_override !== '') {
      time.lc2 = addMinutes(time.lc1, sourceData.mwb_lc_part1_time_override);
    } else {
      time.lc2 = addMinutes(time.lc1, sourceData.mwb_lc_part1_time);
    }

    if (scheduleData.week_type === 1) {
      // normal - cbs
      if (sourceData.mwb_lc_count_override !== 0) {
        if (sourceData.mwb_lc_count_override === 1) {
          time.cbs = time.lc2;
        } else {
          time.cbs = addMinutes(time.lc2, sourceData.mwb_lc_part2_time_override);
        }
      }

      if (sourceData.mwb_lc_count_override === 0) {
        if (sourceData.mwb_lc_count === 1) {
          time.cbs = time.lc2;
        } else {
          time.cbs = addMinutes(time.lc2, sourceData.mwb_lc_part2_time);
        }
      }

      // normal - concluding comments
      if (sourceData.mwb_lc_cbs_time_override !== '') {
        time.concludingComments = addMinutes(time.cbs, sourceData.mwb_lc_cbs_time_override);
      } else {
        time.concludingComments = addMinutes(time.cbs, 30);
      }

      // normal - pgm end
      time.pgmEnd = addMinutes(time.concludingComments, 3);
    } else {
      // co - concluding comments
      if (sourceData.mwb_lc_count === 1) {
        time.concludingComments = time.lc2;
      } else {
        if (sourceData.mwb_lc_part2_time_override !== '') {
          time.concludingComments = addMinutes(time.lc2, sourceData.mwb_lc_part2_time_override);
        } else {
          time.concludingComments = addMinutes(time.lc2, sourceData.mwb_lc_part2_time);
        }
      }

      // co - talk
      time.coTalk = addMinutes(time.concludingComments, 3);

      // co - pgm end
      time.pgmEnd = addMinutes(time.coTalk, 30);
    }

    const explainTalk = {
      mwb_ayf_part1_explainTalk:
        sourceData.mwb_ayf_part1_type === 126 ? checkAYFExplainingBeliefsAssignment(sourceData.mwb_ayf_part1) : false,
      mwb_ayf_part2_explainTalk:
        sourceData.mwb_ayf_part2_type === 126 ? checkAYFExplainingBeliefsAssignment(sourceData.mwb_ayf_part2) : false,
      mwb_ayf_part3_explainTalk:
        sourceData.mwb_ayf_part3_type === 126 ? checkAYFExplainingBeliefsAssignment(sourceData.mwb_ayf_part3) : false,
      mwb_ayf_part4_explainTalk:
        sourceData.mwb_ayf_part4_type === 126 ? checkAYFExplainingBeliefsAssignment(sourceData.mwb_ayf_part4) : false,
    };

    const obj = {};
    obj.week = week;
    obj.scheduleData = scheduleData;
    obj.sourceData = { ...sourceData, ...time, ...explainTalk, meeting_date: meetingDate };
    data.push(obj);
  }

  return data;
};

SchedulesClass.prototype.buildScheduleForShare = async function (scheduleIndex) {
  // get role
  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const objSchedule = [];
  const objSource = [];

  const allWeeks = Sources.weekListBySchedule(scheduleIndex);

  for (const week of allWeeks) {
    const schedData = this.get(week);
    const sourceData = Sources.get(week).local();

    const cleanSrc = { weekOf: sourceData.weekOf };
    const cleanSched = { weekOf: schedData.weekOf, week_type: schedData.week_type };

    // polish sources by role
    for (const [key, value] of Object.entries(sourceData)) {
      if (lmmoRole) {
        if (key.startsWith('mwb_')) {
          cleanSrc[key] = value;
        }
      }

      if (coordinatorRole) {
        if (key.startsWith('w_')) {
          cleanSrc[key] = value;
        }
      }
    }

    // polish schedules by role
    for (const [key, value] of Object.entries(schedData)) {
      if (lmmoRole) {
        if (key.indexOf('MM') >= 0) {
          cleanSched[key] = value;
        }
        if (key.indexOf('tgw') >= 0) {
          cleanSched[key] = value;
        }
        if (key.indexOf('bRead') >= 0) {
          cleanSched[key] = value;
        }
        if (key.indexOf('ass') >= 0) {
          cleanSched[key] = value;
        }
        if (key.indexOf('lc') >= 0) {
          cleanSched[key] = value;
        }
        if (key.indexOf('cbs') >= 0) {
          cleanSched[key] = value;
        }
      }
      if (coordinatorRole) {
        if (key.indexOf('WM') >= 0) {
          cleanSched[key] = value;
        }
        if (key === 'event_name') {
          cleanSrc[key] = value;
        }
        if (key.indexOf('wtstudy') >= 0) {
          cleanSched[key] = value;
        }
      }
      if (publicTalkCoordinatorRole) {
        if (key.indexOf('speaker') >= 0) {
          cleanSched[key] = value;
          if (schedData.is_visiting_speaker && key === 'speaker_1_name') {
            cleanSched[key] = VisitingSpeakers.getSpeakerByUid(value)?.person_name || '';
          }
          if (schedData.is_visiting_speaker && key === 'speaker_1_dispName') {
            cleanSched[key] = VisitingSpeakers.getSpeakerByUid(value)?.person_displayName || '';
          }
        }
        if (key === 'is_visiting_speaker') {
          cleanSrc[key] = value;
        }
        if (key.indexOf('public_talk') >= 0) {
          cleanSched[key] = value;
        }
      }
    }

    objSchedule.push(cleanSched);
    objSource.push(cleanSrc);
  }

  const dataPocket = {
    sources: objSource,
    schedules: objSchedule,
  };

  return dataPocket;
};

SchedulesClass.prototype.buildTalkHistory = function () {
  this.talkHistory.length = 0;

  try {
    const publicTalkEditorRole =
      Setting.cong_role.includes('public_talk_coordinator') || Setting.cong_role.includes('coordinator');

    if (publicTalkEditorRole) {
      const talksList = S34s.getLocal();
      const appData = this.list;

      for (const talk of talksList) {
        let history = appData.filter((schedule) => schedule.public_talk === talk.talk_number);
        history = history.map((record) => {
          const obj = {};
          obj.weekOf = record.weekOf;
          obj.weekOfFormatted = dateFormat(record.weekOf, Setting.shortDateFormat());
          obj.speaker1 = record.speaker1 || '';
          obj.speaker_1_dispName = record.speaker_1_dispName;
          obj.speaker2 = record.speaker2 || '';
          obj.speaker_2_dispName = record.speaker_2_dispName;
          return obj;
        });

        const obj = {
          talk_number: talk.talk_number,
          history,
          last_delivered: '',
          last_delivered_formatted: '',
        };

        if (history.length > 0) {
          obj.last_delivered = history[0].weekOf;
          obj.last_delivered_formatted = history[0].weekOfFormatted;
        }

        this.talkHistory.push(obj);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

SchedulesClass.prototype.updateTalkHistory = function ({ talk_number, weekOf, deleted, speaker_1, speaker_2 }) {
  const currentTalk = this.talkHistory.find((item) => item.talk_number === talk_number);

  if (deleted) {
    currentTalk.history = currentTalk.history.filter((record) => record.weekOf !== weekOf);
    const lastDelivered = currentTalk.history[0];
    currentTalk.last_delivered = lastDelivered ? lastDelivered.last_delivered : '';
    currentTalk.last_delivered_formatted = lastDelivered ? lastDelivered.last_delivered_formatted : '';
  }

  if (!deleted) {
    const appData = this.get(weekOf);
    const isVisitingSpeaker = appData.is_visiting_speaker;

    let speaker_1_dispName = '';
    if (!isVisitingSpeaker) {
      speaker_1_dispName = Persons.get(speaker_1)?.person_displayName || '';
    }
    if (isVisitingSpeaker) {
      speaker_1_dispName = VisitingSpeakers.getSpeakerByUid(speaker_1)?.person_displayName || '';
    }

    const speaker_2_dispName = Persons.get(speaker_2)?.person_displayName || '';

    const weekOfFormatted = dateFormat(weekOf, Setting.shortDateFormat());
    const obj = {};
    obj.weekOf = weekOf;
    obj.weekOfFormatted = weekOfFormatted;
    obj.speaker1 = speaker_1;
    obj.speaker_1_dispName = speaker_1_dispName;
    obj.speaker2 = speaker_2;
    obj.speaker_2_dispName = speaker_2_dispName;

    currentTalk.history = currentTalk.history.filter((record) => record.weekOf !== weekOf);
    currentTalk.history.push(obj);

    currentTalk.history.sort((a, b) => {
      return a.weekOf < b.weekOf ? 1 : -1;
    });

    currentTalk.last_delivered = weekOf;
    currentTalk.last_delivered_formatted = weekOfFormatted;
  }
};

SchedulesClass.prototype.WeekendMeetingData = function (startWeek, endWeek) {
  const weeks = buildArrayWeeks(startWeek, endWeek);
  const result = [];

  for (const week of weeks) {
    const schedule = structuredClone(this.get(week));
    const source = Sources.get(week).local();

    const WMDay = Setting.weekend_meeting_day - 1;
    const tmpDate = new Date(schedule.weekOf);
    const tmpWMDate = tmpDate.setDate(tmpDate.getDate() + WMDay);
    const WMDate = dateFormat(tmpWMDate, 'yyyy/mm/dd');
    const WMDateFormatted = dateFormat(tmpWMDate, Setting.shortDateFormat());

    schedule.weekend_meeting_date = WMDate;
    schedule.weekend_meeting_date_formatted = WMDateFormatted;

    const publicTalks = S34s.getLocal();
    const currentTalk = publicTalks.find((record) => record.talk_number === schedule.public_talk);
    schedule.public_talk_title = currentTalk ? currentTalk.talk_title : '';

    schedule.w_co_talk_title = source.w_co_talk_title;

    schedule.speakers = schedule.speaker_1_name;

    if (schedule.is_visiting_speaker) {
      const speaker = VisitingSpeakers.getSpeakerByUid(schedule.speaker_1);
      if (speaker) {
        schedule.speakers += '\u000A';
        schedule.speakers += `(${speaker.cong_name})`;
      }
    }

    if (schedule.speaker_2_name !== '') {
      schedule.speakers += '\u000A';
      schedule.speakers += schedule.speaker_2_name;
    }

    result.push(schedule);
  }

  return result;
};

export const Schedules = new SchedulesClass();
