import { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { formatMediumDateWithFullMonth } from '@utils/date';

const useDutiesEditor = () => {
  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);

  const [showWeekNav, setShowWeekNav] = useState({
    back: false,
    next: false,
  });

  const allWeeks = useMemo(() => {
    return schedules.map((schedule) => schedule.weekOf);
  }, [schedules]);

  const weekDateLocale = useMemo(() => {
    if (selectedWeek.length === 0) return '';

    return formatMediumDateWithFullMonth(selectedWeek);
  }, [selectedWeek]);

  const handleChangeWeekBack = () => {
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex > 0) {
      setSelectedWeek(allWeeks[selectedWeekIndex - 1]);
    }
  };

  const handleChangeWeekNext = () => {
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex < allWeeks.length - 1) {
      setSelectedWeek(allWeeks[selectedWeekIndex + 1]);
    }
  };

  useEffect(() => {
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex !== -1) {
      setShowWeekNav({
        back: selectedWeekIndex !== 0,
        next: selectedWeekIndex + 1 !== allWeeks.length,
      });
    }
  }, [allWeeks, selectedWeek]);

  return {
    weekDateLocale,
    showWeekNav,
    handleChangeWeekBack,
    handleChangeWeekNext,
  };
};

export default useDutiesEditor;
