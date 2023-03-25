import appDb from '../indexedDb/mainDb';
import { Persons } from './Persons';
import { Schedules } from './Schedules';
import { Setting } from './Setting';

export class ScheduleClass {
  constructor(weekOf) {
    this.weekOf = weekOf;
    this.week_type = 1;
    this.noMeeting = false;
    this.chairmanMM_A = '';
    this.chairmanMM_A_name = '';
    this.chairmanMM_A_dispName = '';
    this.chairmanMM_B = '';
    this.chairmanMM_B_name = '';
    this.chairmanMM_B_dispName = '';
    this.opening_prayer = '';
    this.opening_prayer_name = '';
    this.opening_prayer_dispName = '';
    this.tgw_talk = '';
    this.tgw_talk_name = '';
    this.tgw_talk_dispName = '';
    this.tgw_gems = '';
    this.tgw_gems_name = '';
    this.tgw_gems_dispName = '';
    this.bRead_stu_A = '';
    this.bRead_stu_A_name = '';
    this.bRead_stu_A_dispName = '';
    this.bRead_stu_B = '';
    this.bRead_stu_B_name = '';
    this.bRead_stu_B_dispName = '';
    this.ass1_stu_A = '';
    this.ass1_stu_A_name = '';
    this.ass1_stu_A_dispName = '';
    this.ass1_ass_A = '';
    this.ass1_ass_A_name = '';
    this.ass1_ass_A_dispName = '';
    this.ass1_stu_B = '';
    this.ass1_stu_B_name = '';
    this.ass1_stu_B_dispName = '';
    this.ass1_ass_B = '';
    this.ass1_ass_B_name = '';
    this.ass1_ass_B_dispName = '';
    this.ass2_stu_A = '';
    this.ass2_stu_A_name = '';
    this.ass2_stu_A_dispName = '';
    this.ass2_ass_A = '';
    this.ass2_ass_A_name = '';
    this.ass2_ass_A_dispName = '';
    this.ass2_stu_B = '';
    this.ass2_stu_B_name = '';
    this.ass2_stu_B_dispName = '';
    this.ass2_ass_B = '';
    this.ass2_ass_B_name = '';
    this.ass2_ass_B_dispName = '';
    this.ass3_stu_A = '';
    this.ass3_stu_A_name = '';
    this.ass3_stu_A_dispName = '';
    this.ass3_ass_A = '';
    this.ass3_ass_A_name = '';
    this.ass3_ass_A_dispName = '';
    this.ass3_stu_B = '';
    this.ass3_stu_B_name = '';
    this.ass3_stu_B_dispName = '';
    this.ass3_ass_B = '';
    this.ass3_ass_B_name = '';
    this.ass3_ass_B_dispName = '';
    this.ass4_stu_A = '';
    this.ass4_stu_A_name = '';
    this.ass4_stu_A_dispName = '';
    this.ass4_ass_A = '';
    this.ass4_ass_A_name = '';
    this.ass4_ass_A_dispName = '';
    this.ass4_stu_B = '';
    this.ass4_stu_B_name = '';
    this.ass4_stu_B_dispName = '';
    this.ass4_ass_B = '';
    this.ass4_ass_B_name = '';
    this.ass4_ass_B_dispName = '';
    this.lc_part1 = '';
    this.lc_part1_name = '';
    this.lc_part1_dispName = '';
    this.lc_part2 = '';
    this.lc_part2_name = '';
    this.lc_part2_dispName = '';
    this.cbs_conductor = '';
    this.cbs_conductor_name = '';
    this.cbs_conductor_dispName = '';
    this.cbs_reader = '';
    this.cbs_reader_name = '';
    this.cbs_reader_dispName = '';
    this.closing_prayer = '';
    this.closing_prayer_name = '';
    this.closing_prayer_dispName = '';
    this.changes = [];
  }
}

ScheduleClass.prototype.loadDetails = async function () {
  const appData = await appDb.sched_MM.get({ weekOf: this.weekOf });
  if (!appData) return;

  this.chairmanMM_A = appData.chairmanMM_A || '';
  this.chairmanMM_B = appData.chairmanMM_B || '';
  this.opening_prayer = appData.opening_prayer || '';
  this.tgw_talk = appData.tgw_talk || '';
  this.tgw_gems = appData.tgw_gems || '';
  this.bRead_stu_A = appData.bRead_stu_A || '';
  this.bRead_stu_B = appData.bRead_stu_B || '';
  this.ass1_stu_A = appData.ass1_stu_A || '';
  this.ass1_ass_A = appData.ass1_ass_A || '';
  this.ass1_stu_B = appData.ass1_stu_B || '';
  this.ass1_ass_B = appData.ass1_ass_B || '';
  this.ass2_stu_A = appData.ass2_stu_A || '';
  this.ass2_ass_A = appData.ass2_ass_A || '';
  this.ass2_stu_B = appData.ass2_stu_B || '';
  this.ass2_ass_B = appData.ass2_ass_B || '';
  this.ass3_stu_A = appData.ass3_stu_A || '';
  this.ass3_ass_A = appData.ass3_ass_A || '';
  this.ass3_stu_B = appData.ass3_stu_B || '';
  this.ass3_ass_B = appData.ass3_ass_B || '';
  this.ass4_stu_A = appData.ass4_stu_A || '';
  this.ass4_ass_A = appData.ass4_ass_A || '';
  this.ass4_stu_B = appData.ass4_stu_B || '';
  this.ass4_ass_B = appData.ass4_ass_B || '';
  this.lc_part1 = appData.lc_part1 || '';
  this.lc_part2 = appData.lc_part2 || '';
  this.cbs_conductor = appData.cbs_conductor || '';
  this.cbs_reader = appData.cbs_reader || '';
  this.closing_prayer = appData.closing_prayer || '';

  if (Setting.account_type === 'vip') {
    if (appData.chairmanMM_A) {
      const student = Persons.get(appData.chairmanMM_A);
      this.chairmanMM_A_name = student?.person_name || '';
      this.chairmanMM_A_dispName = student?.person_displayName || '';
    }

    if (appData.chairmanMM_B) {
      const student = Persons.get(appData.chairmanMM_B);
      this.chairmanMM_B_name = student?.person_name || '';
      this.chairmanMM_B_dispName = student?.person_displayName || '';
    }

    if (appData.opening_prayer) {
      const student = Persons.get(appData.opening_prayer);
      this.opening_prayer_name = student?.person_name || '';
      this.opening_prayer_dispName = student?.person_displayName || '';
    }

    if (appData.tgw_talk) {
      const student = Persons.get(appData.tgw_talk);
      this.tgw_talk_name = student?.person_name || '';
      this.tgw_talk_dispName = student?.person_displayName || '';
    }

    if (appData.tgw_gems) {
      const student = Persons.get(appData.tgw_gems);
      this.tgw_gems_name = student?.person_name || '';
      this.tgw_gems_dispName = student?.person_displayName || '';
    }

    if (appData.bRead_stu_A) {
      const student = Persons.get(appData.bRead_stu_A);
      this.bRead_stu_A_name = student?.person_name || '';
      this.bRead_stu_A_dispName = student?.person_displayName || '';
    }

    if (appData.bRead_stu_B) {
      const student = Persons.get(appData.bRead_stu_B);
      this.bRead_stu_B_name = student?.person_name || '';
      this.bRead_stu_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass1_stu_A) {
      const student = Persons.get(appData.ass1_stu_A);
      this.ass1_stu_A_name = student?.person_name || '';
      this.ass1_stu_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass1_ass_A) {
      const student = Persons.get(appData.ass1_ass_A);
      this.ass1_ass_A_name = student?.person_name || '';
      this.ass1_ass_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass1_stu_B) {
      const student = Persons.get(appData.ass1_stu_B);
      this.ass1_stu_B_name = student?.person_name || '';
      this.ass1_stu_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass1_ass_B) {
      const student = Persons.get(appData.ass1_ass_B);
      this.ass1_ass_B_name = student?.person_name || '';
      this.ass1_ass_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass2_stu_A) {
      const student = Persons.get(appData.ass2_stu_A);
      this.ass2_stu_A_name = student?.person_name || '';
      this.ass2_stu_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass2_ass_A) {
      const student = Persons.get(appData.ass2_ass_A);
      this.ass2_ass_A_name = student?.person_name || '';
      this.ass2_ass_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass2_stu_B) {
      const student = Persons.get(appData.ass2_stu_B);
      this.ass2_stu_B_name = student?.person_name || '';
      this.ass2_stu_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass2_ass_B) {
      const student = Persons.get(appData.ass2_ass_B);
      this.ass2_ass_B_name = student?.person_name || '';
      this.ass2_ass_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass3_stu_A) {
      const student = Persons.get(appData.ass3_stu_A);
      this.ass3_stu_A_name = student?.person_name || '';
      this.ass3_stu_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass3_ass_A) {
      const student = Persons.get(appData.ass3_ass_A);
      this.ass3_ass_A_name = student?.person_name || '';
      this.ass3_ass_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass3_stu_B) {
      const student = Persons.get(appData.ass3_stu_B);
      this.ass3_stu_B_name = student?.person_name || '';
      this.ass3_stu_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass3_ass_B) {
      const student = Persons.get(appData.ass3_ass_B);
      this.ass3_ass_B_name = student?.person_name || '';
      this.ass3_ass_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass4_stu_A) {
      const student = Persons.get(appData.ass4_stu_A);
      this.ass4_stu_A_name = student?.person_name || '';
      this.ass4_stu_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass4_ass_A) {
      const student = Persons.get(appData.ass4_ass_A);
      this.ass4_ass_A_name = student?.person_name || '';
      this.ass4_ass_A_dispName = student?.person_displayName || '';
    }

    if (appData.ass4_stu_B) {
      const student = Persons.get(appData.ass4_stu_B);
      this.ass4_stu_B_name = student?.person_name || '';
      this.ass4_stu_B_dispName = student?.person_displayName || '';
    }

    if (appData.ass4_ass_B) {
      const student = Persons.get(appData.ass4_ass_B);
      this.ass4_ass_B_name = student?.person_name || '';
      this.ass4_ass_B_dispName = student?.person_displayName || '';
    }

    if (appData.lc_part1) {
      const student = Persons.get(appData.lc_part1);
      this.lc_part1_name = student?.person_name || '';
      this.lc_part1_dispName = student?.person_displayName || '';
    }

    if (appData.lc_part2) {
      const student = Persons.get(appData.lc_part2);
      this.lc_part2_name = student?.person_name || '';
      this.lc_part2_dispName = student?.person_displayName || '';
    }

    if (appData.cbs_conductor) {
      const student = Persons.get(appData.cbs_conductor);
      this.cbs_conductor_name = student?.person_name || '';
      this.cbs_conductor_dispName = student?.person_displayName || '';
    }

    if (appData.cbs_reader) {
      const student = Persons.get(appData.cbs_reader);
      this.cbs_reader_name = student?.person_name || '';
      this.cbs_reader_dispName = student?.person_displayName || '';
    }

    if (appData.closing_prayer) {
      const student = Persons.get(appData.closing_prayer);
      this.closing_prayer_name = student?.person_name || '';
      this.closing_prayer_dispName = student?.person_displayName || '';
    }
  }

  if (Setting.account_type === 'pocket') {
    this.chairmanMM_A_name = appData.chairmanMM_A_name || '';
    this.chairmanMM_A_dispName = appData.chairmanMM_A_dispName || '';
    this.chairmanMM_B_name = appData.chairmanMM_B_name || '';
    this.chairmanMM_B_dispName = appData.chairmanMM_B_dispName || '';
    this.opening_prayer_name = appData.opening_prayer_name || '';
    this.opening_prayer_dispName = appData.opening_prayer_dispName || '';
    this.tgw_talk_name = appData.tgw_talk_name || '';
    this.tgw_talk_dispName = appData.tgw_talk_dispName || '';
    this.tgw_gems_name = appData.tgw_gems_name || '';
    this.tgw_gems_dispName = appData.tgw_gems_dispName || '';
    this.bRead_stu_A_name = appData.bRead_stu_A_name || '';
    this.bRead_stu_A_dispName = appData.bRead_stu_A_dispName || '';
    this.bRead_stu_B_name = appData.bRead_stu_B_name || '';
    this.bRead_stu_B_dispName = appData.bRead_stu_B_dispName || '';
    this.ass1_stu_A_name = appData.ass1_stu_A_name || '';
    this.ass1_stu_A_dispName = appData.ass1_stu_A_dispName || '';
    this.ass1_ass_A_name = appData.ass1_ass_A_name || '';
    this.ass1_ass_A_dispName = appData.ass1_ass_A_dispName || '';
    this.ass1_stu_B_name = appData.ass1_stu_B_name || '';
    this.ass1_stu_B_dispName = appData.ass1_stu_B_dispName || '';
    this.ass1_ass_B_name = appData.ass1_ass_B_name || '';
    this.ass1_ass_B_dispName = appData.ass1_ass_B_dispName || '';
    this.ass2_stu_A_name = appData.ass2_stu_A_name || '';
    this.ass2_stu_A_dispName = appData.ass2_stu_A_dispName || '';
    this.ass2_ass_A_name = appData.ass2_ass_A_name || '';
    this.ass2_ass_A_dispName = appData.ass2_ass_A_dispName || '';
    this.ass2_stu_B_name = appData.ass2_stu_B_name || '';
    this.ass2_stu_B_dispName = appData.ass2_stu_B_dispName || '';
    this.ass2_ass_B_name = appData.ass2_ass_B_name || '';
    this.ass2_ass_B_dispName = appData.ass2_ass_B_dispName || '';
    this.ass3_stu_A_name = appData.ass3_stu_A_name || '';
    this.ass3_stu_A_dispName = appData.ass3_stu_A_dispName || '';
    this.ass3_ass_A_name = appData.ass3_ass_A_name || '';
    this.ass3_ass_A_dispName = appData.ass3_ass_A_dispName || '';
    this.ass3_stu_B_name = appData.ass3_stu_B_name || '';
    this.ass3_stu_B_dispName = appData.ass3_stu_B_dispName || '';
    this.ass3_ass_B_name = appData.ass3_ass_B_name || '';
    this.ass3_ass_B_dispName = appData.ass3_ass_B_dispName || '';
    this.ass4_stu_A_name = appData.ass4_stu_A_name || '';
    this.ass4_stu_A_dispName = appData.ass4_stu_A_dispName || '';
    this.ass4_ass_A_name = appData.ass4_ass_A_name || '';
    this.ass4_ass_A_dispName = appData.ass4_ass_A_dispName || '';
    this.ass4_stu_B_name = appData.ass4_stu_B_name || '';
    this.ass4_stu_B_dispName = appData.ass4_stu_B_dispName || '';
    this.ass4_ass_B_name = appData.ass4_ass_B_name || '';
    this.ass4_ass_B_dispName = appData.ass4_ass_B_dispName || '';
    this.lc_part1_name = appData.lc_part1_name || '';
    this.lc_part1_dispName = appData.lc_part1_dispName || '';
    this.lc_part2_name = appData.lc_part2_name || '';
    this.lc_part2_dispName = appData.lc_part2_dispName || '';
    this.cbs_conductor_name = appData.cbs_conductor_name || '';
    this.cbs_conductor_dispName = appData.cbs_conductor_dispName || '';
    this.cbs_reader_name = appData.cbs_reader_name || '';
    this.cbs_reader_dispName = appData.cbs_reader_dispName || '';
    this.closing_prayer_name = appData.closing_prayer_name || '';
    this.closing_prayer_dispName = appData.closing_prayer_dispName || '';
  }

  this.changes = appData.changes || [];
  this.week_type = appData.week_type ? +appData.week_type : 1;
  this.noMeeting = appData.noMeeting || false;
};

ScheduleClass.prototype.saveInfo = async function (scheduleInfo, isOverride) {
  const week = Schedules.get(this.weekOf);

  // creating new record
  if (!week) {
    this.changes.push({ date: new Date().toISOString(), field: 'week_type', value: scheduleInfo.week_type });
    this.changes.push({ date: new Date().toISOString(), field: 'noMeeting', value: scheduleInfo.noMeeting });
    this.week_type = scheduleInfo.week_type;
    this.noMeeting = scheduleInfo.noMeeting;

    await appDb.sched_MM.put(
      {
        weekOf: this.weekOf,
        week_type: scheduleInfo.week_type,
        noMeeting: scheduleInfo.noMeeting,
        changes: this.changes,
      },
      this.weekOf
    );

    await Schedules.add(this.weekOf);

    return;
  }

  // editing record if override true
  if (isOverride && this.week_type !== scheduleInfo.week_type) {
    const findIndex = this.changes.findIndex((item) => item.field === 'week_type');
    if (findIndex !== -1) this.changes.splice(findIndex, 1);
    this.changes.push({ date: new Date().toISOString(), field: 'week_type', value: scheduleInfo.week_type });
  }

  if (isOverride && this.noMeeting !== scheduleInfo.noMeeting) {
    const findIndex = this.changes.findIndex((item) => item.field === 'noMeeting');
    if (findIndex !== -1) this.changes.splice(findIndex, 1);
    this.changes.push({ date: new Date().toISOString(), field: 'noMeeting', value: scheduleInfo.noMeeting });
  }

  await appDb.table('sched_MM').update(this.weekOf, {
    weekOf: this.weekOf,
    week_type: isOverride ? scheduleInfo.weekType : this.week_type,
    noMeeting: isOverride ? scheduleInfo.noMeeting : this.noMeeting,
    changes: this.changes,
  });
};

ScheduleClass.prototype.saveAssignment = async function (personUID, field) {
  const stuPrev = this[field];

  const obj = {};
  this[field] = personUID || '';
  obj[field] = personUID;

  this.changes = this.changes.filter((item) => item.field !== field);
  this.changes.push({ date: new Date().toISOString(), field: field, value: personUID });
  obj.changes = this.changes;

  await appDb.sched_MM.update(this.weekOf, obj);

  const fldName = `${field}_name`;
  const fldDispName = `${field}_dispName`;

  this[fldName] = '';
  this[fldDispName] = '';

  if (personUID && personUID !== '') {
    Schedules.updateHistory(this.weekOf, field, false);
    const person = Persons.get(personUID);
    this[fldName] = person?.person_name || '';
    this[fldDispName] = person?.person_displayName || '';

    return personUID;
  }

  if (stuPrev && stuPrev !== '') {
    Schedules.updateHistory(this.weekOf, field, true);
    return stuPrev;
  }
};

ScheduleClass.prototype.save = async function (appData) {
  this.chairmanMM_A = appData.chairmanMM_A;
  this.chairmanMM_B = appData.chairmanMM_B;
  this.opening_prayer = appData.opening_prayer;
  this.tgw_talk = appData.tgw_talk;
  this.tgw_gems = appData.tgw_gems;
  this.bRead_stu_A = appData.bRead_stu_A;
  this.bRead_stu_B = appData.bRead_stu_B;
  this.ass1_stu_A = appData.ass1_stu_A;
  this.ass1_ass_A = appData.ass1_ass_A;
  this.ass1_stu_B = appData.ass1_stu_B;
  this.ass1_ass_B = appData.ass1_ass_B;
  this.ass2_stu_A = appData.ass2_stu_A;
  this.ass2_ass_A = appData.ass2_ass_A;
  this.ass2_stu_B = appData.ass2_stu_B;
  this.ass2_ass_B = appData.ass2_ass_B;
  this.ass3_stu_A = appData.ass3_stu_A;
  this.ass3_ass_A = appData.ass3_ass_A;
  this.ass3_stu_B = appData.ass3_stu_B;
  this.ass3_ass_B = appData.ass3_ass_B;
  this.ass4_stu_A = appData.ass4_stu_A;
  this.ass4_ass_A = appData.ass4_ass_A;
  this.ass4_stu_B = appData.ass4_stu_B;
  this.ass4_ass_B = appData.ass4_ass_B;
  this.lc_part1 = appData.lc_part1;
  this.lc_part2 = appData.lc_part2;
  this.cbs_conductor = appData.cbs_conductor;
  this.cbs_reader = appData.cbs_reader;
  this.closing_prayer = appData.closing_prayer;

  if (Setting.account_type === 'pocket') {
    this.chairmanMM_A_name = appData.chairmanMM_A_name;
    this.chairmanMM_A_dispName = appData.chairmanMM_A_dispName;
    this.chairmanMM_B_name = appData.chairmanMM_B_name;
    this.chairmanMM_B_dispName = appData.chairmanMM_B_dispName;
    this.opening_prayer_name = appData.opening_prayer_name;
    this.opening_prayer_dispName = appData.opening_prayer_dispName;
    this.tgw_talk_name = appData.tgw_talk_name;
    this.tgw_talk_dispName = appData.tgw_talk_dispName;
    this.tgw_gems_name = appData.tgw_gems_name;
    this.tgw_gems_dispName = appData.tgw_gems_dispName;
    this.bRead_stu_A_name = appData.bRead_stu_A_name;
    this.bRead_stu_A_dispName = appData.bRead_stu_A_dispName;
    this.bRead_stu_B_name = appData.bRead_stu_B_name;
    this.bRead_stu_B_dispName = appData.bRead_stu_B_dispName;
    this.ass1_stu_A_name = appData.ass1_stu_A_name;
    this.ass1_stu_A_dispName = appData.ass1_stu_A_dispName;
    this.ass1_ass_A_name = appData.ass1_ass_A_name;
    this.ass1_ass_A_dispName = appData.ass1_ass_A_dispName;
    this.ass1_stu_B_name = appData.ass1_stu_B_name;
    this.ass1_stu_B_dispName = appData.ass1_stu_B_dispName;
    this.ass1_ass_B_name = appData.ass1_ass_B_name;
    this.ass1_ass_B_dispName = appData.ass1_ass_B_dispName;
    this.ass2_stu_A_name = appData.ass2_stu_A_name;
    this.ass2_stu_A_dispName = appData.ass2_stu_A_dispName;
    this.ass2_ass_A_name = appData.ass2_ass_A_name;
    this.ass2_ass_A_dispName = appData.ass2_ass_A_dispName;
    this.ass2_stu_B_name = appData.ass2_stu_B_name;
    this.ass2_stu_B_dispName = appData.ass2_stu_B_dispName;
    this.ass2_ass_B_name = appData.ass2_ass_B_name;
    this.ass2_ass_B_dispName = appData.ass2_ass_B_dispName;
    this.ass3_stu_A_name = appData.ass3_stu_A_name;
    this.ass3_stu_A_dispName = appData.ass3_stu_A_dispName;
    this.ass3_ass_A_name = appData.ass3_ass_A_name;
    this.ass3_ass_A_dispName = appData.ass3_ass_A_dispName;
    this.ass3_stu_B_name = appData.ass3_stu_B_name;
    this.ass3_stu_B_dispName = appData.ass3_stu_B_dispName;
    this.ass3_ass_B_name = appData.ass3_ass_B_name;
    this.ass3_ass_B_dispName = appData.ass3_ass_B_dispName;
    this.ass4_stu_A_name = appData.ass4_stu_A_name;
    this.ass4_stu_A_dispName = appData.ass4_stu_A_dispName;
    this.ass4_ass_A_name = appData.ass4_ass_A_name;
    this.ass4_ass_A_dispName = appData.ass4_ass_A_dispName;
    this.ass4_stu_B_name = appData.ass4_stu_B_name;
    this.ass4_stu_B_dispName = appData.ass4_stu_B_dispName;
    this.ass4_ass_B_name = appData.ass4_ass_B_name;
    this.ass4_ass_B_dispName = appData.ass4_ass_B_dispName;
    this.lc_part1_name = appData.lc_part1_name;
    this.lc_part1_dispName = appData.lc_part1_dispName;
    this.lc_part2_name = appData.lc_part2_name;
    this.lc_part2_dispName = appData.lc_part2_dispName;
    this.cbs_conductor_name = appData.cbs_conductor_name;
    this.cbs_conductor_dispName = appData.cbs_conductor_dispName;
    this.cbs_reader_name = appData.cbs_reader_name;
    this.cbs_reader_dispName = appData.cbs_reader_dispName;
    this.closing_prayer_name = appData.closing_prayer_name;
    this.closing_prayer_dispName = appData.closing_prayer_dispName;
  }

  this.week_type = appData.week_type ? +appData.week_type : 1;
  this.noMeeting = appData.noMeeting || false;

  await appDb.sched_MM.put(this, this.weekOf);
  const weekExist = Schedules.get(this.weekOf);

  if (!weekExist) {
    await Schedules.add(this.weekOf);
  }
};
