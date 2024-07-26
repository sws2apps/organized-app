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
  const [openDelete, setOpenDelete] = useState(false);

  const tabs = sources.map((year) => ({
    label: year.value.toString(),
    Component: <MonthsContainer months={year.months} />,
  }));

  const currentYear =
    selectedWeek.length > 0 ? new Date(selectedWeek).getFullYear().toString() : new Date().getFullYear().toString();

  const activeTab = tabs.findIndex((record) => record.label === currentYear);

  const hasWeeks = sources.length > 0;

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleOpenDelete = () => setOpenDelete(true);

  const handleCloseDelete = () => setOpenDelete(false);

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

  return { tabs, hasWeeks, expanded, handleToggleExpand, activeTab, openDelete, handleCloseDelete, handleOpenDelete };
};

export default useWeekSelector;
