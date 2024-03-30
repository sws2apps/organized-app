import { promiseGetRecoil } from 'recoil-outside';
import {
  accountTypeState,
  coordinatorRoleState,
  elderLocalRoleState,
  lmmoRoleState,
  publicTalkCoordinatorRoleState,
} from '@states/settings';
import { schedulesState } from '@states/schedules';
import { publicTalkFindLocal } from '../app/publicTalks';
import { formatDate } from '@services/dateformat';
import { scheduleSchema } from '@services/dexie/schema';
import { publicTalksLocaleState } from '@states/publicTalks';
import { appDb } from '.';

export const saveSchedule = async (appData) => {
  const lmmoRole = await promiseGetRecoil(lmmoRoleState);
  const coordinatorRole = await promiseGetRecoil(coordinatorRoleState);
  const publicTalkCoordinatorRole = await promiseGetRecoil(publicTalkCoordinatorRoleState);
  const hasPersonAccess = await promiseGetRecoil(elderLocalRoleState);
  const talksList = await promiseGetRecoil(publicTalksLocaleState);
  const accountType = await promiseGetRecoil(accountTypeState);

  const schedules = await promiseGetRecoil(schedulesState);

  const tmpSchedule = schedules.find((s) => s.weekOf === appData.weekOf);
  const schedule = { ...tmpSchedule };

  if (!lmmoRole) {
    schedule.chairmanMM_A = appData.chairmanMM_A || '';
    schedule.chairmanMM_B = appData.chairmanMM_B || '';
    schedule.opening_prayerMM = appData.opening_prayerMM || '';
    schedule.tgw_talk = appData.tgw_talk || '';
    schedule.tgw_gems = appData.tgw_gems || '';
    schedule.bRead_stu_A = appData.bRead_stu_A || '';
    schedule.bRead_stu_B = appData.bRead_stu_B || '';
    schedule.ass1_stu_A = appData.ass1_stu_A || '';
    schedule.ass1_ass_A = appData.ass1_ass_A || '';
    schedule.ass1_stu_B = appData.ass1_stu_B || '';
    schedule.ass1_ass_B = appData.ass1_ass_B || '';
    schedule.ass2_stu_A = appData.ass2_stu_A || '';
    schedule.ass2_ass_A = appData.ass2_ass_A || '';
    schedule.ass2_stu_B = appData.ass2_stu_B || '';
    schedule.ass2_ass_B = appData.ass2_ass_B || '';
    schedule.ass3_stu_A = appData.ass3_stu_A || '';
    schedule.ass3_ass_A = appData.ass3_ass_A || '';
    schedule.ass3_stu_B = appData.ass3_stu_B || '';
    schedule.ass3_ass_B = appData.ass3_ass_B || '';
    schedule.ass4_stu_A = appData.ass4_stu_A || '';
    schedule.ass4_ass_A = appData.ass4_ass_A || '';
    schedule.ass4_stu_B = appData.ass4_stu_B || '';
    schedule.ass4_ass_B = appData.ass4_ass_B || '';
    schedule.lc_part1 = appData.lc_part1 || '';
    schedule.lc_part2 = appData.lc_part2 || '';
    schedule.cbs_conductor = appData.cbs_conductor || '';
    schedule.cbs_reader = appData.cbs_reader || '';
    schedule.closing_prayerMM = appData.closing_prayerMM || '';

    if (appData.noMMeeting !== undefined) {
      schedule.noMMeeting = appData.noMMeeting || false;
    }
  }

  if (!coordinatorRole) {
    schedule.chairman_WM = appData.chairman_WM || '';
    schedule.opening_prayerWM = appData.opening_prayerWM || '';
    schedule.wtstudy_reader = appData.wtstudy_reader || '';
  }

  if (!publicTalkCoordinatorRole) {
    schedule.speaker_1 = appData.speaker_1 || '';
    schedule.speaker_2 = appData.speaker_2 || '';
    schedule.public_talk = appData.public_talk || '';
    if (hasPersonAccess && schedule.public_talk !== '' && talksList.length > 0) {
      schedule.public_talk_title = `(${schedule.public_talk}) ${publicTalkFindLocal(schedule.public_talk)}`;
    } else {
      schedule.public_talk_title = appData.public_talk_title || '';
    }
  }

  if (accountType === 'pocket' || !hasPersonAccess) {
    schedule.chairmanMM_A_name = appData.chairmanMM_A_name || '';
    schedule.chairmanMM_A_dispName = appData.chairmanMM_A_dispName || '';
    schedule.chairmanMM_B_name = appData.chairmanMM_B_name || '';
    schedule.chairmanMM_B_dispName = appData.chairmanMM_B_dispName || '';
    schedule.opening_prayerMM_name = appData.opening_prayerMM_name || '';
    schedule.opening_prayerMM_dispName = appData.opening_prayerMM_dispName || '';
    schedule.tgw_talk_name = appData.tgw_talk_name || '';
    schedule.tgw_talk_dispName = appData.tgw_talk_dispName || '';
    schedule.tgw_gems_name = appData.tgw_gems_name || '';
    schedule.tgw_gems_dispName = appData.tgw_gems_dispName || '';
    schedule.bRead_stu_A_name = appData.bRead_stu_A_name || '';
    schedule.bRead_stu_A_dispName = appData.bRead_stu_A_dispName || '';
    schedule.bRead_stu_B_name = appData.bRead_stu_B_name || '';
    schedule.bRead_stu_B_dispName = appData.bRead_stu_B_dispName || '';
    schedule.ass1_stu_A_name = appData.ass1_stu_A_name || '';
    schedule.ass1_stu_A_dispName = appData.ass1_stu_A_dispName || '';
    schedule.ass1_ass_A_name = appData.ass1_ass_A_name || '';
    schedule.ass1_ass_A_dispName = appData.ass1_ass_A_dispName || '';
    schedule.ass1_stu_B_name = appData.ass1_stu_B_name || '';
    schedule.ass1_stu_B_dispName = appData.ass1_stu_B_dispName || '';
    schedule.ass1_ass_B_name = appData.ass1_ass_B_name || '';
    schedule.ass1_ass_B_dispName = appData.ass1_ass_B_dispName || '';
    schedule.ass2_stu_A_name = appData.ass2_stu_A_name || '';
    schedule.ass2_stu_A_dispName = appData.ass2_stu_A_dispName || '';
    schedule.ass2_ass_A_name = appData.ass2_ass_A_name || '';
    schedule.ass2_ass_A_dispName = appData.ass2_ass_A_dispName || '';
    schedule.ass2_stu_B_name = appData.ass2_stu_B_name || '';
    schedule.ass2_stu_B_dispName = appData.ass2_stu_B_dispName || '';
    schedule.ass2_ass_B_name = appData.ass2_ass_B_name || '';
    schedule.ass2_ass_B_dispName = appData.ass2_ass_B_dispName || '';
    schedule.ass3_stu_A_name = appData.ass3_stu_A_name || '';
    schedule.ass3_stu_A_dispName = appData.ass3_stu_A_dispName || '';
    schedule.ass3_ass_A_name = appData.ass3_ass_A_name || '';
    schedule.ass3_ass_A_dispName = appData.ass3_ass_A_dispName || '';
    schedule.ass3_stu_B_name = appData.ass3_stu_B_name || '';
    schedule.ass3_stu_B_dispName = appData.ass3_stu_B_dispName || '';
    schedule.ass3_ass_B_name = appData.ass3_ass_B_name || '';
    schedule.ass3_ass_B_dispName = appData.ass3_ass_B_dispName || '';
    schedule.ass4_stu_A_name = appData.ass4_stu_A_name || '';
    schedule.ass4_stu_A_dispName = appData.ass4_stu_A_dispName || '';
    schedule.ass4_ass_A_name = appData.ass4_ass_A_name || '';
    schedule.ass4_ass_A_dispName = appData.ass4_ass_A_dispName || '';
    schedule.ass4_stu_B_name = appData.ass4_stu_B_name || '';
    schedule.ass4_stu_B_dispName = appData.ass4_stu_B_dispName || '';
    schedule.ass4_ass_B_name = appData.ass4_ass_B_name || '';
    schedule.ass4_ass_B_dispName = appData.ass4_ass_B_dispName || '';
    schedule.lc_part1_name = appData.lc_part1_name || '';
    schedule.lc_part1_dispName = appData.lc_part1_dispName || '';
    schedule.lc_part2_name = appData.lc_part2_name || '';
    schedule.lc_part2_dispName = appData.lc_part2_dispName || '';
    schedule.cbs_conductor_name = appData.cbs_conductor_name || '';
    schedule.cbs_conductor_dispName = appData.cbs_conductor_dispName || '';
    schedule.cbs_reader_name = appData.cbs_reader_name || '';
    schedule.cbs_reader_dispName = appData.cbs_reader_dispName || '';
    schedule.closing_prayerMM_name = appData.closing_prayerMM_name || '';
    schedule.closing_prayerMM_dispName = appData.closing_prayerMM_dispName || '';
    schedule.chairman_WM_name = appData.chairman_WM_name || '';
    schedule.chairman_WM_dispName = appData.chairman_WM_dispName || '';
    schedule.opening_prayerWM_name = appData.opening_prayerWM_name || '';
    schedule.opening_prayerWM_dispName = appData.opening_prayerWM_dispName || '';
    schedule.wtstudy_reader_name = appData.wtstudy_reader_name || '';
    schedule.wtstudy_reader_dispName = appData.wtstudy_reader_dispName || '';
    schedule.speaker_1_name = appData.speaker_1_name || '';
    schedule.speaker_1_dispName = appData.speaker_1_dispName || '';
    schedule.speaker_2_name = appData.speaker_2_name || '';
    schedule.speaker_2_dispName = appData.speaker_2_dispName || '';
  }

  if (!coordinatorRole && !publicTalkCoordinatorRole) {
    if (appData.noWMeeting !== undefined) {
      schedule.noWMeeting = appData.noWMeeting || false;
    }
  }

  if (!lmmoRole && !coordinatorRole && !publicTalkCoordinatorRole) {
    schedule.week_type = appData.week_type ? +appData.week_type : 1;
  }

  await appDb.sched.put(schedule);
};

export const getCurrentExistingWeekDate = async () => {
  const schedules = await appDb.sched.toArray();

  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monDay = new Date(today.setDate(diff));

  let currentWeek = formatDate(monDay, 'yyyy/mm/dd');
  let isExist = false;

  if (schedules.length > 0) {
    do {
      const fDate = formatDate(monDay, 'yyyy/mm/dd');
      const schedule = schedules.find((data) => data.weekOf === fDate);
      if (schedule) {
        currentWeek = fDate;
        isExist = true;
      }
      monDay.setDate(monDay.getDate() + 7);
    } while (isExist === false);
  }

  return currentWeek;
};

export const saveScheduleInfo = async ({ scheduleInfo, isOverride }) => {
  const schedules = await promiseGetRecoil(schedulesState);
  const tmpWeek = schedules.find((schedule) => schedule.weekOf === scheduleInfo.weekOf);

  const model = structuredClone(scheduleSchema);

  // creating new record
  if (!tmpWeek) {
    const data = Object.assign(model, {
      weekOf: scheduleInfo.weekOf,
      week_type: scheduleInfo.week_type,
      changes: [{ date: new Date().toISOString(), field: 'week_type', value: scheduleInfo.week_type }],
    });

    if (scheduleInfo.noMMeeting !== undefined) {
      data.noMMeeting = scheduleInfo.noMMeeting;
      data.changes.push({ date: new Date().toISOString(), field: 'noMMeeting', value: scheduleInfo.noMMeeting });
    }

    if (scheduleInfo.noWMeeting !== undefined) {
      data.noWMeeting = scheduleInfo.noWMeeting;
      data.changes.push({ date: new Date().toISOString(), field: 'noWMeeting', value: scheduleInfo.noWMeeting });
    }

    await appDb.sched.put(data);
    return;
  }

  const week = structuredClone(tmpWeek);
  const data = Object.assign(model, week);

  // editing record if override true
  if (isOverride && week.week_type !== scheduleInfo.week_type) {
    data.week_type = scheduleInfo.week_type;
    data.changes = data.changes.filter((change) => change.field !== 'week_type');
    data.changes.push({ date: new Date().toISOString(), field: 'week_type', value: scheduleInfo.week_type });
  }

  if (scheduleInfo.noMMeeting !== undefined && isOverride && data.noMMeeting !== scheduleInfo.noMMeeting) {
    data.noMMeeting = scheduleInfo.noMMeeting;
    data.changes = week.changes.filter((change) => change.field !== 'noMMeeting');
    data.changes.push({ date: new Date().toISOString(), field: 'noMMeeting', value: scheduleInfo.noMMeeting });
  }

  if (scheduleInfo.noWMeeting !== undefined && isOverride && data.noWMeeting !== scheduleInfo.noWMeeting) {
    data.noWMeeting = scheduleInfo.noWMeeting;
    data.changes = week.changes.filter((change) => change.field !== 'noWMeeting');
    data.changes.push({ date: new Date().toISOString(), field: 'noWMeeting', value: scheduleInfo.noWMeeting });
  }

  await appDb.sched.put(data);
};

export const savePublicTalk = async (week, public_talk) => {
  const schedules = await promiseGetRecoil(schedulesState);
  const oldSchedule = schedules.find((schedule) => schedule.weekOf === week);

  const schedule = structuredClone(oldSchedule);

  public_talk = public_talk === '' ? public_talk : +public_talk;

  const prevTalk = schedule.public_talk;
  const newTalk = public_talk;

  if (prevTalk !== newTalk) {
    schedule.changes = schedule.changes.filter((record) => record.field !== 'public_talk');
    schedule.changes.push({ date: new Date().toISOString(), field: 'public_talk', value: public_talk });

    const title = await publicTalkFindLocal(public_talk);

    const data = {
      weekOf: week,
      public_talk: public_talk === '' ? undefined : +public_talk,
      public_talk_title: public_talk === '' ? '' : `(${public_talk}) ${title}`,
      changes: schedule.changes,
    };

    await appDb.sched.update(week, data);
  }
};

export const saveEventName = async (week, event) => {
  const schedules = await promiseGetRecoil(schedulesState);
  const oldSchedule = schedules.find((schedule) => schedule.weekOf === week);

  const schedule = structuredClone(oldSchedule);

  schedule.changes = schedule.changes.filter((record) => record.field !== 'event_name');
  schedule.changes.push({ date: new Date().toISOString(), field: 'event_name', value: event });

  const data = {
    weekOf: week,
    event_name: event,
    changes: schedule.changes,
  };

  await appDb.sched.update(week, data);
};
