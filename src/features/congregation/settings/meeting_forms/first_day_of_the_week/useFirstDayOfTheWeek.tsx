import { FirstDayOfTheWeekOption } from '@definition/settings';
import { SelectChangeEvent } from '@mui/material';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { firstDaysOfTheWeekInCongState, settingsState } from '@states/settings';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

const useFirstDayOfTheWeek = () => {
  const settings = useAtomValue(settingsState);
  const firstDayOfTheWeekOption = useAtomValue(firstDaysOfTheWeekInCongState);

  const [firstDayOfTheWeek, setFirstDayOfTheWeek] =
    useState<FirstDayOfTheWeekOption>(firstDayOfTheWeekOption);

  useEffect(() => {
    setFirstDayOfTheWeek(firstDayOfTheWeekOption);
  }, [firstDayOfTheWeekOption]);

  const handleOnSelectFirstDayOfTheWeek = useCallback(
    async (e: SelectChangeEvent<unknown>) => {
      const selectedValue = e.target.value as FirstDayOfTheWeekOption;

      if (selectedValue === firstDayOfTheWeek) return;

      const updatedList = settings.cong_settings.first_day_week.map((item) => {
        if (item.type === 'main') {
          return {
            ...item,
            value: selectedValue,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      await dbAppSettingsUpdate({
        'cong_settings.first_day_week': updatedList,
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
