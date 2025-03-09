import { useEffect, useState } from 'react';
import { getWeekDate } from '@utils/date';
import useSharedHook from '../../useSharedHook';

const useMonthItem = (value: string) => {
  const { meetings } = useSharedHook();

  const [expanded, setExpanded] = useState(false);

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
