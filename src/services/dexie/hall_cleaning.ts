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

// Serialize writes inside the transaction so repeated updates to a week merge
// with the previous encrypted write rather than racing it.
const saveSequentially = <T>(
  items: T[],
  save: (item: T) => Promise<SchedWeekType>
) =>
  items.reduce<Promise<SchedWeekType[]>>(async (pending, item) => {
    const saved = await pending;
    saved.push(await save(item));
    return saved;
  }, Promise.resolve([]));

const saveCleaningWeek = async (week: SchedWeekType) => {
  await dbSchedCheck(week.weekOf);
  const latest = await dbSchedGet(week.weekOf);
  if (!latest) throw new Error('error_app_generic-desc');
  const cleaning = mergeHallCleaningData(
    latest.hall_cleaning,
    week.hall_cleaning
  );
  await dbSchedUpdate(week.weekOf, { hall_cleaning: cleaning });
  return { ...latest, hall_cleaning: cleaning };
};

export const dbHallCleaningWeeksUpdate = (weeks: SchedWeekType[]) =>
  appDb.transaction('rw', appDb.sched, appDb.metadata, () =>
    saveSequentially(weeks, saveCleaningWeek)
  );

export const dbHallCleaningSettingsUpdate = (
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
const saveMajorCleaning = async ({ weekOf, event }: MajorCleaningUpdate) => {
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
  return { ...week, hall_cleaning: cleaning };
};

export const dbMajorCleaningUpdate = (updates: MajorCleaningUpdate[]) =>
  appDb.transaction('rw', appDb.sched, appDb.metadata, () =>
    saveSequentially(updates, saveMajorCleaning)
  );
