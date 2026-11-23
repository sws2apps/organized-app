import { mergeHallCleaningWeeks } from '@utils/hall_cleaning';
import { runHallCleaningUpdate } from '@services/app/hall_cleaning_queue';
import type { MajorCleaningEvent } from '@definition/hall_cleaning';
import { store } from '@states/index';
import { schedulesState } from '@states/schedules';
import { dbMajorCleaningUpdate } from '@services/dexie/hall_cleaning';
import { majorCleaningScheduleUpdates } from '@utils/major_cleaning';

export const saveMajorCleanings = (events: MajorCleaningEvent[]) => {
  return runHallCleaningUpdate(async () => {
    const updates = majorCleaningScheduleUpdates(
      events,
      store.get(schedulesState)
    );
    const saved = await dbMajorCleaningUpdate(updates);
    store.set(schedulesState, (current) =>
      mergeHallCleaningWeeks(current, saved)
    );
  });
};
