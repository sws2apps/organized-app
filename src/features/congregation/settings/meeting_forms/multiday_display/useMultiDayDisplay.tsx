import { useAtomValue } from 'jotai';
import { UpcomingEventDisplayType } from '@definition/upcoming_events';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingSchema } from '@services/dexie/schema';
import {
  eventsMultiDayDisplayState,
  settingsState,
  userDataViewState,
} from '@states/settings';

const useMultiDayDisplay = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const display = useAtomValue(eventsMultiDayDisplayState);

  const handleDisplayChange = async (value: UpcomingEventDisplayType) => {
    const records = structuredClone(
      settings.cong_settings.events_multiday_display ||
        settingSchema.cong_settings.events_multiday_display
    );

    let current = records.find((record) => record.type === dataView);

    if (!current) {
      current = { type: dataView, value, updatedAt: '', _deleted: false };
      records.push(current);
    }

    current.value = value;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.events_multiday_display': records,
    });
  };

  return { display, handleDisplayChange };
};

export default useMultiDayDisplay;
