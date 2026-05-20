import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { FirstDayWeekOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  firstDayWeekState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { settingSchema } from '@services/dexie/schema';

const useFirstDayOfTheWeek = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const optionalInitial = useAtomValue(firstDayWeekState);

  const [firstDayWeek, setFirstDayWeek] = useState(FirstDayWeekOption.MONDAY);

  const handleFirstDayWeekChange = async (value: FirstDayWeekOption) => {
    const initialData =
      settings.cong_settings.first_day_week ||
      settingSchema.cong_settings.first_day_week;

    const firstDayWeek = structuredClone(initialData);

    const current = firstDayWeek.find((record) => record.type === dataView);

    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    }

    if (!current) {
      firstDayWeek.push({
        _deleted: false,
        type: dataView,
        updatedAt: new Date().toISOString(),
        value,
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.first_day_week': firstDayWeek,
    });
  };

  useEffect(() => {
    setFirstDayWeek(optionalInitial);
  }, [optionalInitial]);

  return { firstDayWeek, handleFirstDayWeekChange };
};

export default useFirstDayOfTheWeek;
