import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { sourcesFormattedState } from '@states/sources';

const useWeekNavigation = (selectedWeek: string, setSelectedWeek: (value: string) => void) => {
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

  const handleChangeWeekBack = () => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex > 0) {
      setSelectedWeek(allWeeks[selectedWeekIndex - 1]);
    }
  };

  const handleChangeWeekNext = () => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex < allWeeks.length - 1) {
      setSelectedWeek(allWeeks[selectedWeekIndex + 1]);
    }
  };

  useEffect(() => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex !== -1) {
      setShowWeekArrows({
        back: selectedWeekIndex !== 0,
        next: selectedWeekIndex + 1 !== allWeeks.length,
      });
    }
  }, [getAllWeeks, selectedWeek]);

  return { showWeekArrows, handleChangeWeekBack, handleChangeWeekNext };
};

export default useWeekNavigation;
