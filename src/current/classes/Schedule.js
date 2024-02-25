import appDb from '../../shared/indexedDb/mainDb';
import { Persons } from './Persons';
import { S34s } from './S34s';
import { Schedules } from './Schedules';
import { Setting } from './Setting';
import { VisitingSpeakers } from './VisitingSpeakers';

export class ScheduleClass {
  constructor(weekOf) {
    this.weekOf = weekOf;
    this.week_type = 1;
    this.noMMeeting = false;
    this.chairmanMM_A = '';
    this.chairmanMM_A_name = '';
    this.chairmanMM_A_dispName = '';
    this.chairmanMM_B = '';
    this.chairmanMM_B_name = '';
    this.chairmanMM_B_dispName = '';
    this.opening_prayerMM = '';
    this.opening_prayerMM_name = '';
    this.opening_prayerMM_dispName = '';
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
    this.closing_prayerMM = '';
    this.closing_prayerMM_name = '';
    this.closing_prayerMM_dispName = '';
    this.noWMeeting = false;
    this.chairman_WM = '';
    this.chairman_WM_name = '';
    this.chairman_WM_dispName = '';
    this.opening_prayerWM = '';
    this.opening_prayerWM_name = '';
    this.opening_prayerWM_dispName = '';
    this.speaker_1 = '';
    this.speaker_1_name = '';
    this.speaker_1_dispName = '';
    this.speaker_2 = '';
    this.speaker_2_name = '';
    this.speaker_2_dispName = '';
    this.is_visiting_speaker = false;
    this.is_custom_talk = false;
    this.substitute_speaker = '';
    this.substitute_speaker_name = '';
    this.substitute_speaker_dispName = '';
    this.public_talk = '';
    this.public_talk_title = '';
    this.event_name = '';
    this.wtstudy_reader = '';
    this.wtstudy_reader_name = '';
    this.wtstudy_reader_dispName = '';
    this.changes = [];
  }
}

ScheduleClass.prototype.loadDetails = async function () {
  const appData = await appDb.sched.get({ weekOf: this.weekOf });
  if (!appData) return;

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');
  const elderRole = Setting.cong_role.includes('elder');
  const msRole = Setting.cong_role.includes('ms');
  const publisherRole = Setting.cong_role.includes('publisher');
  const hasPersonAccess = lmmoRole || secretaryRole || elderRole || coordinatorRole || publicTalkCoordinatorRole;
  const viewMeetingScheduleRole =
    !hasPersonAccess && (Setting.cong_role.includes('view_meeting_schedule') || msRole || publisherRole);

  this.chairmanMM_A = appData.chairmanMM_A || '';
  this.chairmanMM_B = appData.chairmanMM_B || '';
  this.opening_prayerMM = appData.opening_prayerMM || '';
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
  this.closing_prayerMM = appData.closing_prayerMM || '';
  this.chairman_WM = appData.chairman_WM || '';
  this.opening_prayerWM = appData.opening_prayerWM || '';
  this.speaker_1 = appData.speaker_1 || '';
  this.speaker_2 = appData.speaker_2 || '';
  this.substitute_speaker = appData.substitute_speaker || '';
  this.wtstudy_reader = appData.wtstudy_reader || '';

  if (hasPersonAccess) {
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

    if (appData.opening_prayerMM) {
      const student = Persons.get(appData.opening_prayerMM);
      this.opening_prayerMM_name = student?.person_name || '';
      this.opening_prayerMM_dispName = student?.person_displayName || '';
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

    if (appData.closing_prayerMM) {
      const student = Persons.get(appData.closing_prayerMM);
      this.closing_prayerMM_name = student?.person_name || '';
      this.closing_prayerMM_dispName = student?.person_displayName || '';
    }

    if (appData.chairman_WM) {
      const student = Persons.get(appData.chairman_WM);
      this.chairman_WM_name = student?.person_name || '';
      this.chairman_WM_dispName = student?.person_displayName || '';
    }

    if (appData.opening_prayerWM) {
      const student = Persons.get(appData.opening_prayerWM);
      this.opening_prayerWM_name = student?.person_name || '';
      this.opening_prayerWM_dispName = student?.person_displayName || '';
    }

    if (appData.speaker_1) {
      let person;
      if (appData.is_visiting_speaker) {
        person = VisitingSpeakers.getSpeakerByUid(appData.speaker_1);
      }
      if (!appData.is_visiting_speaker) {
        person = Persons.get(appData.speaker_1);
      }
      this.speaker_1_name = person?.person_name || '';
      this.speaker_1_dispName = person?.person_displayName || '';
    }

    if (appData.speaker_2) {
      const student = Persons.get(appData.speaker_2);
      this.speaker_2_name = student?.person_name || '';
      this.speaker_2_dispName = student?.person_displayName || '';
    }

    if (appData.substitute_speaker) {
      const student = Persons.get(appData.substitute_speaker);
      this.substitute_speaker_name = student?.person_name || '';
      this.substitute_speaker_dispName = student?.person_displayName || '';
    }

    if (appData.wtstudy_reader) {
      const student = Persons.get(appData.wtstudy_reader);
      this.wtstudy_reader_name = student?.person_name || '';
      this.wtstudy_reader_dispName = student?.person_displayName || '';
    }
  }

  if (viewMeetingScheduleRole) {
    this.chairmanMM_A_name = appData.chairmanMM_A_name || '';
    this.chairmanMM_A_dispName = appData.chairmanMM_A_dispName || '';
    this.chairmanMM_B_name = appData.chairmanMM_B_name || '';
    this.chairmanMM_B_dispName = appData.chairmanMM_B_dispName || '';
    this.opening_prayerMM_name = appData.opening_prayerMM_name || '';
    this.opening_prayerMM_dispName = appData.opening_prayerMM_dispName || '';
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
    this.closing_prayerMM_name = appData.closing_prayerMM_name || '';
    this.closing_prayerMM_dispName = appData.closing_prayerMM_dispName || '';
    this.chairman_WM_name = appData.chairman_WM_name || '';
    this.chairman_WM_dispName = appData.chairman_WM_dispName || '';
    this.opening_prayerWM_name = appData.opening_prayerWM_name || '';
    this.opening_prayerWM_dispName = appData.opening_prayerWM_dispName || '';
    this.speaker_1_name = appData.speaker_1_name || '';
    this.speaker_1_dispName = appData.speaker_1_dispName || '';
    this.speaker_2_name = appData.speaker_2_name || '';
    this.speaker_2_dispName = appData.speaker_2_dispName || '';
    this.substitute_speaker_name = appData.substitute_speaker_name || '';
    this.substitute_speaker_dispName = appData.substitute_speaker_dispName || '';
    this.wtstudy_reader_name = appData.wtstudy_reader_name || '';
    this.wtstudy_reader_dispName = appData.wtstudy_reader_dispName || '';
  }

  this.changes = appData.changes || [];
  this.week_type = appData.week_type ? +appData.week_type : 1;
  this.noMMeeting = appData.noMMeeting || false;
  this.is_visiting_speaker = appData.is_visiting_speaker || false;
  this.is_custom_talk = appData.is_custom_talk || false;

  this.public_talk = appData.public_talk || '';
  if (this.public_talk !== '' && S34s.talks.length > 0) {
    this.public_talk_title = `(${this.public_talk}) ${S34s.findLocal(this.public_talk)}`;
  } else {
    this.public_talk_title = appData.public_talk_title || '';
  }
  this.event_name = appData.event_name || '';
  this.noWMeeting = appData.noWMeeting || false;
};

ScheduleClass.prototype.saveInfo = async function (scheduleInfo, isOverride) {
  const week = Schedules.get(this.weekOf);

  // creating new record
  if (!week) {
    this.changes.push({ date: new Date().toISOString(), field: 'week_type', value: scheduleInfo.week_type });

    const data = { weekOf: this.weekOf, week_type: scheduleInfo.week_type };

    if (scheduleInfo.noMMeeting !== undefined) {
      this.changes.push({ date: new Date().toISOString(), field: 'noMMeeting', value: scheduleInfo.noMMeeting });
      this.noMMeeting = scheduleInfo.noMMeeting;
      data.noMMeeting = scheduleInfo.noMMeeting;
    }

    if (scheduleInfo.noWMeeting !== undefined) {
      this.changes.push({ date: new Date().toISOString(), field: 'noWMeeting', value: scheduleInfo.noWMeeting });
      this.noWMeeting = scheduleInfo.noWMeeting;
      data.noWMeeting = scheduleInfo.noWMeeting;
    }

    this.week_type = scheduleInfo.week_type;

    data.changes = this.changes;

    await appDb.sched.put(data, this.weekOf);

    await Schedules.add(this.weekOf);

    return;
  }

  // editing record if override true
  if (isOverride && this.week_type !== scheduleInfo.week_type) {
    const findIndex = this.changes.findIndex((item) => item.field === 'week_type');
    if (findIndex !== -1) this.changes.splice(findIndex, 1);
    this.changes.push({ date: new Date().toISOString(), field: 'week_type', value: scheduleInfo.week_type });
  }

  if (scheduleInfo.noMMeeting !== undefined && isOverride && this.noMMeeting !== scheduleInfo.noMMeeting) {
    const findIndex = this.changes.findIndex((item) => item.field === 'noMMeeting');
    if (findIndex !== -1) this.changes.splice(findIndex, 1);
    this.changes.push({ date: new Date().toISOString(), field: 'noMMeeting', value: scheduleInfo.noMMeeting });
  }

  if (scheduleInfo.noWMeeting !== undefined && isOverride && this.noWMeeting !== scheduleInfo.noWMeeting) {
    const findIndex = this.changes.findIndex((item) => item.field === 'noWMeeting');
    if (findIndex !== -1) this.changes.splice(findIndex, 1);
    this.changes.push({ date: new Date().toISOString(), field: 'noWMeeting', value: scheduleInfo.noWMeeting });
  }

  const data = {
    weekOf: this.weekOf,
    week_type: isOverride ? scheduleInfo.week_type : this.week_type,
    changes: this.changes,
  };

  if (scheduleInfo.noMMeeting !== undefined) {
    data.noMMeeting = isOverride ? scheduleInfo.noMMeeting : this.noMMeeting;
    this.noMMeeting = isOverride ? scheduleInfo.noMMeeting : this.noMMeeting;
  }

  if (scheduleInfo.noWMeeting !== undefined) {
    data.noWMeeting = isOverride ? scheduleInfo.noWMeeting : this.noWMeeting;
    this.noWMeeting = isOverride ? scheduleInfo.noWMeeting : this.noWMeeting;
  }

  await appDb.table('sched').update(this.weekOf, data);

  this.week_type = isOverride ? scheduleInfo.week_type : this.week_type;
};

ScheduleClass.prototype.savePublicTalk = async function (public_talk) {
  public_talk = public_talk === '' ? public_talk : +public_talk;

  const prevTalk = this.public_talk;
  const newTalk = public_talk;

  if (prevTalk !== newTalk) {
    this.changes = this.changes.filter((record) => record.field !== 'public_talk');
    this.changes.push({ date: new Date().toISOString(), field: 'public_talk', value: public_talk });

    const data = {
      weekOf: this.weekOf,
      public_talk: public_talk === '' ? undefined : +public_talk,
      public_talk_title: public_talk === '' ? '' : `(${public_talk}) ${S34s.findLocal(public_talk)}`,
      changes: this.changes,
    };

    await appDb.table('sched').update(this.weekOf, data);

    // updating previous talk
    if (prevTalk && prevTalk !== '') {
      Schedules.updateTalkHistory({
        talk_number: prevTalk,
        weekOf: this.weekOf,
        deleted: true,
        speaker_1: this.speaker_1,
        speaker_2: this.speaker_2,
      });
    }

    // update new talk
    if (newTalk && newTalk !== '') {
      Schedules.updateTalkHistory({
        talk_number: newTalk,
        weekOf: this.weekOf,
        deleted: false,
        speaker_1: this.speaker_1,
        speaker_2: this.speaker_2,
      });
    }

    this.public_talk = public_talk;
    this.public_talk_title = data.public_talk_title;
  }
};

ScheduleClass.prototype.saveAssignment = async function (personUID, field) {
  const stuPrev = this[field];

  const obj = {};
  this[field] = personUID || '';
  obj[field] = personUID;

  this.changes = this.changes.filter((item) => item.field !== field);
  this.changes.push({ date: new Date().toISOString(), field: field, value: personUID });
  obj.changes = this.changes;

  await appDb.sched.update(this.weekOf, obj);

  const fldName = `${field}_name`;
  const fldDispName = `${field}_dispName`;

  this[fldName] = '';
  this[fldDispName] = '';

  // update public talk
  if (field === 'speaker_1' || field === 'speaker_2') {
    if (this.public_talk !== '') {
      const speaker1 = field === 'speaker_1' ? this[field] : this.speaker_1;
      const speaker2 = field === 'speaker_2' ? this[field] : this.speaker_2;

      Schedules.updateTalkHistory({
        talk_number: this.public_talk,
        weekOf: this.weekOf,
        speaker_1: speaker1,
        speaker_2: speaker2,
      });
    }
  }

  if (personUID && personUID !== '') {
    Schedules.updateHistory(this.weekOf, field, false);
    let person;

    if (field === 'speaker_1' && this.is_visiting_speaker) {
      person = VisitingSpeakers.getSpeakerByUid(personUID);
    }

    if (field !== 'speaker_1') {
      person = Persons.get(personUID);
    }

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
  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');
  const elderRole = Setting.cong_role.includes('elder');
  const hasPersonAccess = lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole || elderRole;
  const viewMeetingScheduleRole =
    !hasPersonAccess &&
    (Setting.cong_role.includes('view_meeting_schedule') ||
      Setting.cong_role.includes('ms') ||
      Setting.cong_role.includes('publisher'));

  if (!lmmoRole) {
    this.chairmanMM_A = appData.chairmanMM_A || '';
    this.chairmanMM_B = appData.chairmanMM_B || '';
    this.opening_prayerMM = appData.opening_prayerMM || '';
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
    this.closing_prayerMM = appData.closing_prayerMM || '';

    if (appData.noMMeeting !== undefined) {
      this.noMMeeting = appData.noMMeeting || false;
    }
  }

  if (!coordinatorRole) {
    this.chairman_WM = appData.chairman_WM || '';
    this.opening_prayerWM = appData.opening_prayerWM || '';
    this.wtstudy_reader = appData.wtstudy_reader || '';
  }

  if (!publicTalkCoordinatorRole) {
    this.speaker_1 = appData.speaker_1 || '';
    this.speaker_2 = appData.speaker_2 || '';
    this.substitute_speaker = appData.substitute_speaker || '';
    this.public_talk = appData.public_talk || '';
    if (hasPersonAccess && this.public_talk !== '') {
      this.public_talk_title = `(${this.public_talk}) ${S34s.findLocal(this.public_talk)}`;
    }
    if (!hasPersonAccess) {
      this.public_talk_title = appData.public_talk_title || '';
    }
  }

  if (Setting.account_type === 'pocket' || viewMeetingScheduleRole) {
    if (!lmmoRole) {
      this.chairmanMM_A_name = appData.chairmanMM_A_name || '';
      this.chairmanMM_A_dispName = appData.chairmanMM_A_dispName || '';
      this.chairmanMM_B_name = appData.chairmanMM_B_name || '';
      this.chairmanMM_B_dispName = appData.chairmanMM_B_dispName || '';
      this.opening_prayerMM_name = appData.opening_prayerMM_name || '';
      this.opening_prayerMM_dispName = appData.opening_prayerMM_dispName || '';
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
      this.closing_prayerMM_name = appData.closing_prayerMM_name || '';
      this.closing_prayerMM_dispName = appData.closing_prayerMM_dispName || '';
    }

    if (!coordinatorRole) {
      this.chairman_WM_name = appData.chairman_WM_name || '';
      this.chairman_WM_dispName = appData.chairman_WM_dispName || '';
      this.opening_prayerWM_name = appData.opening_prayerWM_name || '';
      this.opening_prayerWM_dispName = appData.opening_prayerWM_dispName || '';
      this.wtstudy_reader_name = appData.wtstudy_reader_name || '';
      this.wtstudy_reader_dispName = appData.wtstudy_reader_dispName || '';
    }

    if (!publicTalkCoordinatorRole) {
      this.speaker_1_name = appData.speaker_1_name || '';
      this.speaker_1_dispName = appData.speaker_1_dispName || '';
      this.speaker_2_name = appData.speaker_2_name || '';
      this.speaker_2_dispName = appData.speaker_2_dispName || '';
      this.substitute_speaker_name = appData.substitute_speaker_name || '';
      this.substitute_speaker_dispName = appData.substitute_speaker_dispName || '';
    }
  }

  if (!coordinatorRole && !publicTalkCoordinatorRole) {
    if (appData.noWMeeting !== undefined) {
      this.noWMeeting = appData.noWMeeting || false;
    }
  }

  if (!lmmoRole && !coordinatorRole && !publicTalkCoordinatorRole) {
    this.week_type = appData.week_type ? +appData.week_type : 1;
  }

  await appDb.sched.put(this, this.weekOf);
  const weekExist = Schedules.get(this.weekOf);

  if (!weekExist) {
    await Schedules.add(this.weekOf);
  }
};

ScheduleClass.prototype.updateVisitingSpeaker = async function (value) {
  this.changes = this.changes.filter((record) => record.field !== 'is_visiting_speaker');
  this.changes.push({ date: new Date().toISOString(), field: 'is_visiting_speaker', value });

  const data = {
    weekOf: this.weekOf,
    is_visiting_speaker: value,
    changes: this.changes,
  };

  await appDb.table('sched').update(this.weekOf, data);

  this.is_visiting_speaker = value;

  // remove speakers
  await this.saveAssignment(undefined, 'speaker_1');
  await this.saveAssignment(undefined, 'speaker_2');

  if (this.public_talk !== '') {
    Schedules.updateTalkHistory({
      talk_number: this.public_talk,
      weekOf: this.weekOf,
      deleted: true,
      speaker_1: this.speaker_1,
      speaker_2: this.speaker_2,
    });
  }
};

ScheduleClass.prototype.toggleCustomTalk = async function (value) {
  this.changes = this.changes.filter((record) => record.field !== 'is_custom_talk');
  this.changes.push({ date: new Date().toISOString(), field: 'is_custom_talk', value });

  const data = {
    weekOf: this.weekOf,
    is_custom_talk: value,
    changes: this.changes,
  };

  await appDb.table('sched').update(this.weekOf, data);

  this.is_custom_talk = value;

  // remove talk
  await this.savePublicTalk('');
};

ScheduleClass.prototype.saveEventName = async function (event) {
  this.changes = this.changes.filter((record) => record.field !== 'event_name');
  this.changes.push({ date: new Date().toISOString(), field: 'event_name', value: event });

  const data = {
    weekOf: this.weekOf,
    event_name: event,
    changes: this.changes,
  };

  await appDb.table('sched').update(this.weekOf, data);

  this.event_name = event;
};
