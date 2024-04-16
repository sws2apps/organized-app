import { UpdateSpec } from 'dexie';
import appDb from '@shared/indexedDb/appDb';
import { SchedInfoType, SchedWeekType } from '@definition/schedules';
import { scheduleSchema } from './schema';

type TableUpdateType = { weekOf: string; changes: UpdateSpec<SchedWeekType> };

type ScheduleInfoType = { scheduleInfo: SchedInfoType; isOverride: boolean };

export const dbSchedUpdate = async ({ weekOf, changes }: TableUpdateType) => {
  await appDb.sched.update(weekOf, changes);
};

export const dbSchedSaveInfo = async ({ scheduleInfo, isOverride }: ScheduleInfoType) => {
  const tmpWeek = await appDb.sched.get(scheduleInfo.weekOf);

  // creating new record
  if (!tmpWeek) {
    const schedNew = structuredClone(scheduleSchema);

    schedNew.weekOf = scheduleInfo.weekOf;
    schedNew.week_type = { value: scheduleInfo.week_type, updatedAt: new Date().toISOString() };
    schedNew.noMMeeting = { value: scheduleInfo.noMMeeting, updatedAt: new Date().toISOString() };
    schedNew.noWMeeting = { value: scheduleInfo.noWMeeting, updatedAt: new Date().toISOString() };

    await appDb.sched.put(schedNew);
    return;
  }

  // editing record if override true
  if (isOverride) {
    const schedEdit = structuredClone(tmpWeek);

    if (schedEdit.week_type.value !== scheduleInfo.week_type) {
      schedEdit.week_type = { value: scheduleInfo.week_type, updatedAt: new Date().toISOString() };
    }

    if (schedEdit.noMMeeting.value !== scheduleInfo.noMMeeting) {
      schedEdit.noMMeeting = { value: scheduleInfo.noMMeeting, updatedAt: new Date().toISOString() };
    }

    if (schedEdit.noWMeeting.value !== scheduleInfo.noWMeeting) {
      schedEdit.noWMeeting = { value: scheduleInfo.noWMeeting, updatedAt: new Date().toISOString() };
    }

    await appDb.sched.put(schedEdit);
  }
};

export const dbSchedSave = async (appData: SchedWeekType) => {
  const schedule = await appDb.sched.get(appData.weekOf);

  for (const [key, value] of Object.entries(appData)) {
    let isUpdated = false;

    if (value['updatedAt']) {
      const newDate: string = value['updatedAt'];
      const oldDate: string = schedule[key]['updatedAt'];

      if (oldDate === '') isUpdated = true;

      if (oldDate.length > 0 && newDate.length > 0) {
        const dateA = new Date(oldDate);
        const dateB = new Date(newDate);

        isUpdated = dateB > dateA;
      }
    }

    if (!value['updatedAt']) {
      isUpdated = true;
    }

    if (isUpdated) {
      schedule[key] = value;
    }
  }

  await appDb.sched.put(schedule);
};
