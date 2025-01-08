import { useMemo } from 'react';
import { createNumbersArray } from '@utils/common';

const useMeetingItem = (month: string) => {
  const weeksCount = useMemo(() => {
    const [year, monthValue] = month.split('/').map(Number);

    // Get the first day of the month
    const firstDay = new Date(year, monthValue - 1, 1);

    // Find the first Monday
    const firstMonday =
      firstDay.getDay() === 1
        ? firstDay
        : new Date(
            year,
            monthValue - 1,
            firstDay.getDate() + ((8 - firstDay.getDay()) % 7)
          );

    // Get the number of days in the month
    const daysInMonth = new Date(year, +monthValue, 0).getDate();

    // Calculate the number of days from the first Monday to the end of the month
    const daysFromFirstMonday = daysInMonth - (firstMonday.getDate() - 1);

    // Calculate the number of weeks
    const weeksFromFirstMonday = Math.ceil(daysFromFirstMonday / 7);

    const result = createNumbersArray(weeksFromFirstMonday);

    return result;
  }, [month]);

  return { weeksCount };
};

export default useMeetingItem;
