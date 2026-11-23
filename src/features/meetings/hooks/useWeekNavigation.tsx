import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesFormattedState } from '@states/sources';
import { formatDate, getWeekDate } from '@utils/date';

const useWeekNavigation = (
  selectedWeek: string,
  setSelectedWeek: (value: string) => void
) => {
  const weeksSource = useAtomValue(sourcesFormattedState);

  const [showWeekArrows, setShowWeekArrows] = useState({
    back: false,
    next: false,
  });

  const getAllWeeks = useCallback(() => {
    return weeksSource
      .flatMap((year) => year.months.flatMap((month) => month.weeks))
      .sort();
  }, [weeksSource]);

  const handleChangeWeekBack = useCallback(() => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex > 0) {
      setSelectedWeek(allWeeks[selectedWeekIndex - 1]);
    }
  }, [getAllWeeks, selectedWeek, setSelectedWeek]);

  const handleChangeWeekNext = useCallback(() => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex >= 0 && selectedWeekIndex < allWeeks.length - 1) {
      setSelectedWeek(allWeeks[selectedWeekIndex + 1]);
    }
  }, [getAllWeeks, selectedWeek, setSelectedWeek]);

  useEffect(() => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    setShowWeekArrows({
      back: selectedWeekIndex > 0,
      next: selectedWeekIndex >= 0 && selectedWeekIndex < allWeeks.length - 1,
    });
  }, [getAllWeeks, selectedWeek]);

  return {
    showWeekArrows,
    handleChangeWeekBack,
    handleChangeWeekNext,
    isCurrentWeek: selectedWeek === formatDate(getWeekDate(), 'yyyy/MM/dd'),
  };
};

export default useWeekNavigation;
