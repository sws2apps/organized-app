import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';
import { MonthItemType } from './index.types';
import { schedulesWeekAssignmentsInfo } from '@services/app/schedules';
import { schedulesState, selectedWeekState } from '@states/schedules';

const useMonthItem = ({
  month,
  weeks,
  currentExpanded,
  onChangeCurrentExpanded,
}: MonthItemType) => {
  const location = useLocation();

  const monthNames = useRecoilValue(monthNamesState);
  const schedules = useRecoilValue(schedulesState);
  const selectedWeek = useRecoilValue(selectedWeekState);

  const [expanded, setExpanded] = useState(
    currentExpanded === month.toString()
  );
  const [total, setTotal] = useState(0);
  const [assigned, setAssigned] = useState(0);

  const monthName = monthNames[month];

  const meeting = useMemo(() => {
    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const assignComplete = useMemo(() => {
    return total === 0 ? false : assigned === total;
  }, [total, assigned]);

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);

    if (currentExpanded === month.toString()) {
      onChangeCurrentExpanded('');
    } else {
      onChangeCurrentExpanded(month.toString());
    }
  };

  useEffect(() => {
    setExpanded(currentExpanded === month.toString());
  }, [currentExpanded, month]);

  useEffect(() => {
    if (!selectedWeek) return;

    const selectedMonth = new Date(selectedWeek).getMonth();
    if (selectedMonth.toString() !== currentExpanded) {
      onChangeCurrentExpanded(selectedMonth.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek]);

  useEffect(() => {
    const loadMonthDetails = async () => {
      setTotal(0);
      setAssigned(0);

      for await (const week of weeks) {
        const schedule = schedules.find((record) => record.weekOf === week);

        const { assigned, total } = await schedulesWeekAssignmentsInfo(
          schedule.weekOf,
          meeting
        );

        setTotal((prev) => prev + total);
        setAssigned((prev) => prev + assigned);
      }
    };

    loadMonthDetails();
  }, [weeks, schedules, meeting]);

  return { monthName, expanded, handleToggleExpand, assignComplete };
};

export default useMonthItem;
