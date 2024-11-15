import { useEffect, useState } from 'react';
import { getWeekDate } from '@utils/date';
import { MeetingType } from '@definition/app';

const useMonthItem = (value: string) => {
  const [expanded, setExpanded] = useState(false);

  const meetings: MeetingType[] = ['midweek', 'weekend'];

  const handleToggleExpanded = () => setExpanded((prev) => !prev);

  useEffect(() => {
    const currentWeek = getWeekDate();
    const year = currentWeek.getFullYear().toString();
    const month = (currentWeek.getMonth() + 1).toString().padStart(2, '0');

    const monthValue = `${year}/${month}`;

    setExpanded(value === monthValue);
  }, [value]);

  return { expanded, handleToggleExpanded, meetings };
};

export default useMonthItem;
