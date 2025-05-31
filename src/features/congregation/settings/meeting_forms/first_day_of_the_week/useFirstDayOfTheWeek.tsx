import { FirstDayOfTheWeekOption } from '@definition/settings';
import { SelectChangeEvent } from '@mui/material';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { firstDayOfTheWeekState, settingsState } from '@states/settings';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

const useFirstDayOfTheWeek = () => {
  const settings = useAtomValue(settingsState);
  const firstDayOfTheWeekOption = useAtomValue(firstDayOfTheWeekState);

  const [firstDayOfTheWeek, setFirstDayOfTheWeek] =
    useState<FirstDayOfTheWeekOption>(firstDayOfTheWeekOption);

  useEffect(() => {
    setFirstDayOfTheWeek(firstDayOfTheWeekOption);
  }, [firstDayOfTheWeekOption]);

  const handleOnSelectFirstDayOfTheWeek = useCallback(
    async (e: SelectChangeEvent<unknown>) => {
      if (e.target.value === firstDayOfTheWeek) return;

      const newFirstDay = settings.cong_settings.first_day_week
        ? structuredClone(settings.cong_settings.first_day_week)
        : { value: null, updatedAt: '' };

      newFirstDay.value = e.target.value as FirstDayOfTheWeekOption;
      newFirstDay.updatedAt = new Date().toISOString();

      await dbAppSettingsUpdate({
        'cong_settings.first_day_week': newFirstDay,
      });
    },
    [firstDayOfTheWeek, settings.cong_settings.first_day_week]
  );

  return {
    firstDayOfTheWeek,
    handleOnSelectFirstDayOfTheWeek,
  };
};

export default useFirstDayOfTheWeek;
