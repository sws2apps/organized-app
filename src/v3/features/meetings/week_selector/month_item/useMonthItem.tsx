import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';
import { MonthItemType } from './index.types';
import { schedulesWeekAssignmentsInfo } from '@services/app/schedules';
import { schedulesState } from '@states/schedules';

const useMonthItem = ({ month, weeks }: MonthItemType) => {
  const monthNames = useRecoilValue(monthNamesState);
  const schedules = useRecoilValue(schedulesState);

  const [expanded, setExpanded] = useState(false);
  const [total, setTotal] = useState(0);
  const [assigned, setAssigned] = useState(0);

  const monthName = monthNames[month];

  const assignComplete = total === 0 ? false : assigned === total;

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    const loadMonthDetails = async () => {
      setTotal(0);
      setAssigned(0);

      for await (const week of weeks) {
        const schedule = schedules.find((record) => record.weekOf === week);

        const { assigned, total } = await schedulesWeekAssignmentsInfo(schedule.weekOf);
        setTotal((prev) => prev + total);
        setAssigned((prev) => prev + assigned);
      }
    };

    loadMonthDetails();
  }, [weeks, schedules]);

  return { monthName, expanded, handleToggleExpand, assignComplete };
};

export default useMonthItem;
