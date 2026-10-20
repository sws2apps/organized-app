import { mergeHallCleaningData } from '@utils/hall_cleaning';
import type { MajorCleaningUpdate } from '@definition/hall_cleaning';
import { hasMajorCleaningDateConflict } from '@utils/major_cleaning';
import appDb from '@db/appDb';
import type { SchedWeekType } from '@definition/schedules';
import type { SettingsType } from '@definition/settings';
import {
  dbSchedCheck,
  dbSchedGet,
  dbSchedUpdate,
} from '@services/dexie/schedules';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

export const dbHallCleaningWeeksUpdate = (weeks: SchedWeekType[]) =>
  appDb.transaction('rw', appDb.sched, appDb.metadata, async () => {
    const saved: SchedWeekType[] = [];
    for (const week of weeks) {
      await dbSchedCheck(week.weekOf);
      const latest = await dbSchedGet(week.weekOf);
      if (!latest) throw new Error('error_app_generic-desc');
      const cleaning = mergeHallCleaningData(
        latest.hall_cleaning,
        week.hall_cleaning
      );
      await dbSchedUpdate(week.weekOf, { hall_cleaning: cleaning });
      saved.push({ ...latest, hall_cleaning: cleaning });
    }
    return saved;
  });

export const dbHallCleaningSettingsUpdate = async (
  weeks: SchedWeekType[],
  records: SettingsType['cong_settings']['hall_cleaning']
) => {
  return appDb.transaction(
    'rw',
    appDb.sched,
    appDb.app_settings,
    appDb.metadata,
    async () => {
      const saved = await dbHallCleaningWeeksUpdate(weeks);
      await dbAppSettingsUpdate({ 'cong_settings.hall_cleaning': records });
      return saved;
    }
  );
};

// Update only the cleaning field so unrelated meeting edits are retained.
export const dbMajorCleaningUpdate = async (updates: MajorCleaningUpdate[]) =>
  appDb.transaction('rw', appDb.sched, appDb.metadata, async () => {
    const result: SchedWeekType[] = [];
    for (const { weekOf, event } of updates) {
      await dbSchedCheck(weekOf);
      const week = await dbSchedGet(weekOf);
      if (!week) throw new Error('error_app_generic-desc');
      const cleaning = {
        midweek: {},
        weekend: {},
        yearly: {},
        ...week.hall_cleaning,
      };
      if (hasMajorCleaningDateConflict(cleaning.events ?? [], event))
        throw new Error('major-cleaning-date-conflict');
      cleaning.events = [
        ...(cleaning.events ?? []).filter(
          (entry) => entry.id !== event.id || entry.type !== event.type
        ),
        event,
      ];
      await dbSchedUpdate(weekOf, { hall_cleaning: cleaning });
      result.push({ ...week, hall_cleaning: cleaning });
    }
    return result;
  });
