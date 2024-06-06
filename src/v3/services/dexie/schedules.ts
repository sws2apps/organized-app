import appDb from '@db/appDb';
import { UpdateSpec } from 'dexie';
import { SchedWeekType } from '@definition/schedules';
import { scheduleSchema } from './schema';

export const dbSchedUpdate = async (weekOf: string, changes: UpdateSpec<SchedWeekType>) => {
  await appDb.sched.update(weekOf, changes);
};

export const dbSchedCheck = async (weekOf: string) => {
  const findSched = await appDb.sched.get(weekOf);

  if (!findSched) {
    const newSched = structuredClone(scheduleSchema);
    newSched.weekOf = weekOf;

    await appDb.sched.put(newSched);
  }
};
