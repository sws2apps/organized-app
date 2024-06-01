import { useEffect, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { sourcesFormattedState } from '@states/sources';
import { useBreakpoints } from '@hooks/index';
import { selectedWeekState } from '@states/schedules';
import MonthsContainer from './months_container';

const useWeekSelector = () => {
  const { desktopUp } = useBreakpoints();

  const resetSelectedWeek = useResetRecoilState(selectedWeekState);

  const sources = useRecoilValue(sourcesFormattedState);
  const selectedWeek = useRecoilValue(selectedWeekState);

  const [expanded, setExpanded] = useState(true);

  const tabs = sources.map((year) => ({
    label: year.value.toString(),
    Component: <MonthsContainer months={year.months} />,
  }));

  const hasWeeks = sources.length > 0;

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (!desktopUp && selectedWeek.length > 0) {
      setExpanded(false);
    }
  }, [selectedWeek, desktopUp]);

  useEffect(() => {
    return () => {
      resetSelectedWeek();
    };
  }, [resetSelectedWeek]);

  return { tabs, hasWeeks, expanded, handleToggleExpand };
};

export default useWeekSelector;
