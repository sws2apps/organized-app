import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';

const useMidweekMeeting = () => {
  const currentWeekVisible = useIntersectionObserver({
    root: '.schedules-view-week-selector .MuiTabs-scroller',
    selector: '.schedules-current-week',
  });

  const schedules = useRecoilValue(schedulesState);

  const [value, setValue] = useState<number | boolean>(false);

  const week = useMemo(() => {
    if (typeof value === 'boolean') return '';

    return schedules.at(value).weekOf;
  }, [value, schedules]);

  const handleGoCurrent = () => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    const index = schedules.findIndex((record) => record.weekOf === weekOf);

    setValue(index);
  };

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  return {
    value,
    handleGoCurrent,
    handleValueChange,
    week,
    currentWeekVisible,
  };
};

export default useMidweekMeeting;
