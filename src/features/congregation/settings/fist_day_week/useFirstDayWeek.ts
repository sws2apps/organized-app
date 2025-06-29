/* eslint-disable @typescript-eslint/no-unused-vars */
import { FirstDayOfTheWeekOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  firstDayOfTheWeekState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

const useFirstDayWeek = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const optionalInitial = useAtomValue(firstDayOfTheWeekState);

  console.log(optionalInitial);

  const [firstDayOfTheWeek, setFirstDayOfTheWeek] = useState(
    FirstDayOfTheWeekOption.MONDAY
  );

  const handleFirstDayOfTheWeekChange = async (
    value: FirstDayOfTheWeekOption
  ) => {
    const firstDayOfTheWeek = structuredClone(
      settings.cong_settings.first_day_week
    );

    const current = firstDayOfTheWeek.find(
      (record) => record.type === dataView
    );

    console.log(current);

    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    }

    if (!current) {
      firstDayOfTheWeek.push({
        _deleted: false,
        type: dataView,
        updatedAt: new Date().toISOString(),
        value,
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.first_day_week': firstDayOfTheWeek,
    });
  };

  useEffect(() => {
    setFirstDayOfTheWeek(optionalInitial);
  }, [optionalInitial]);

  return {
    firstDayOfTheWeek,
    handleFirstDayOfTheWeekChange,
  };
};

export default useFirstDayWeek;
