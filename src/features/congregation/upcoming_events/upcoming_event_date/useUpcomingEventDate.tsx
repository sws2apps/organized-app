import { useMemo } from 'react';
import { generateWeekday } from '@services/i18n/translation';
import { formatDate } from '@utils/date';

const useUpcomingEventDate = (date: Date) => {
  const weekdays = generateWeekday();

  const eventDate = useMemo(() => {
    const shortMonth = formatDate(date, 'LLL');
    const day = formatDate(date, 'd');
    return `${shortMonth}. ${day}`;
  }, [date]);

  const eventDay = useMemo(() => {
    const todayIndex = date.getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    return weekdays[adjustedIndex];
  }, [date, weekdays]);

  return {
    eventDate,
    eventDay,
  };
};

export default useUpcomingEventDate;
