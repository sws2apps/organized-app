import { mergeHallCleaningWeeks } from '@utils/hall_cleaning';
import { runHallCleaningUpdate } from '@services/app/hall_cleaning_queue';
import type {
  HallCleaningChanges,
  HallCleaningConfig,
} from '@definition/hall_cleaning';
import { store } from '@states/index';
import { settingsState, userDataViewState } from '@states/settings';
import { schedulesState, assignmentsHistoryState } from '@states/schedules';
import { dbHallCleaningSettingsUpdate } from '@services/dexie/hall_cleaning';
import {
  schedulesBuildHistoryList,
  schedulesHallCleaningApplyTurnChange,
} from '@services/app/schedules';

export const saveHallCleaningSettings = (
  dataView: string,
  changes:
    | HallCleaningChanges
    | ((current: HallCleaningConfig) => HallCleaningChanges)
) => {
  return runHallCleaningUpdate(async () => {
    if (store.get(userDataViewState) !== dataView)
      throw new Error('error_app_generic-desc');
    const settings = store.get(settingsState);
    const records = structuredClone(settings.cong_settings.hall_cleaning ?? []);
    const record = records.find((item) => item.type === dataView);
    if (!record) throw new Error('error_app_generic-desc');
    const patch = typeof changes === 'function' ? changes(record) : changes;
    const updatedAt = new Date().toISOString();
    for (const [key, value] of Object.entries(patch)) {
      Object.assign(record, { [key]: { value, updatedAt } });
    }
    const weeks = await schedulesHallCleaningApplyTurnChange(record);
    const saved = await dbHallCleaningSettingsUpdate(weeks, records);
    store.set(schedulesState, (current) =>
      mergeHallCleaningWeeks(current, saved)
    );
    store.set(settingsState, {
      ...store.get(settingsState),
      cong_settings: {
        ...store.get(settingsState).cong_settings,
        hall_cleaning: records,
      },
    });
    store.set(assignmentsHistoryState, schedulesBuildHistoryList());
  });
};
