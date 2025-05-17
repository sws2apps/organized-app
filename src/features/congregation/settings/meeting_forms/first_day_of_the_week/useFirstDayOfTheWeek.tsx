import { FirstDayOfTheWeekOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { firstDayOfTheWeekState, settingsState } from '@states/settings';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const useFirstDayOfTheWeek = () => {
  const settings = useRecoilValue(settingsState);
  const firstDayOfTheWeekOption = useRecoilValue(firstDayOfTheWeekState);

  const [firstDayOfTheWeek, setFirstDayOfTheWeek] =
    useState<FirstDayOfTheWeekOption>(firstDayOfTheWeekOption);

  const handleFirstDayOfTheWeekChange = async (
    value: FirstDayOfTheWeekOption
  ) => {
    const newFirstDay = settings.cong_settings.first_day_week
      ? structuredClone(settings.cong_settings.first_day_week)
      : { value: null, updatedAt: '' };

    newFirstDay.value = value;
    newFirstDay.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.first_day_week': newFirstDay,
    });
  };

  useEffect(() => {
    setFirstDayOfTheWeek(firstDayOfTheWeekOption);
  }, [firstDayOfTheWeekOption]);

  return {
    firstDayOfTheWeek,
    handleFirstDayOfTheWeekChange,
  };
};

export default useFirstDayOfTheWeek;
