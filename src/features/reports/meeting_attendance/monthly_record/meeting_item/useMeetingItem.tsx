import { useMemo } from 'react';

const useMeetingItem = (month: string) => {
  const weeksCount = useMemo(() => {
    const [year, monthValue] = month.split('/').map(Number);

    const firstDay = new Date(year, monthValue - 1, 1);

    const firstMonday =
      firstDay.getDay() === 1
        ? firstDay
        : new Date(
            year,
            monthValue - 1,
            firstDay.getDate() + ((8 - firstDay.getDay()) % 7)
          );

    const daysInMonth = new Date(year, +monthValue, 0).getDate();
    const daysFromFirstMonday = daysInMonth - (firstMonday.getDate() - 1);

    return Math.ceil(daysFromFirstMonday / 7);
  }, [month]);

  return { weeksCount };
};

export default useMeetingItem;
