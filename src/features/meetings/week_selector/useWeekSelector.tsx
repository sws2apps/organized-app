import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { MeetingType } from '@definition/app';
import { SourcesFormattedType } from '@definition/sources';
import { sourcesFormattedState, sourcesValidState } from '@states/sources';
import { useBreakpoints } from '@hooks/index';
import { selectedWeekState } from '@states/schedules';
import { convertStringToBoolean } from '@utils/common';
import {
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import MonthsContainer from './months_container';
import { addDays } from '@utils/date';

const useWeekSelector = () => {
  const location = useLocation();

  const { desktopUp } = useBreakpoints();

  const resetSelectedWeek = useResetRecoilState(selectedWeekState);

  const sourcesValid = useRecoilValue(sourcesValidState);
  const sourcesFormattedByWeek = useRecoilValue(sourcesFormattedState);
  const selectedWeek = useRecoilValue(selectedWeekState);
  const meetingExactDate = useRecoilValue(meetingExactDateState);
  const midweekDay = useRecoilValue(midweekMeetingWeekdayState);
  const weekendDay = useRecoilValue(weekendMeetingWeekdayState);

  const [expanded, setExpanded] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [sortDown, setSortDown] = useState(
    convertStringToBoolean(localStorage.getItem('meeting_sort_down'))
  );

  const currentYear = useMemo(() => {
    if (selectedWeek.length > 0) {
      return new Date(selectedWeek).getFullYear().toString();
    }

    return new Date().getFullYear().toString();
  }, [selectedWeek]);

  const meeting: MeetingType = useMemo(() => {
    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const sources = useMemo(() => {
    if (meeting === 'midweek' && !meetingExactDate) {
      return sourcesFormattedByWeek;
    }

    const groupedData = sourcesValid.reduce<SourcesFormattedType[]>(
      (acc, curr) => {
        let toAdd: number;

        if (meeting === 'midweek') {
          toAdd = midweekDay - 1;
        }

        if (meeting === 'weekend') {
          toAdd = weekendDay - 1;
        }

        const date = addDays(curr.weekOf, toAdd);
        const year = date.getFullYear();
        const month = date.getMonth();

        // Initialize year object if not already present
        const findYear = acc.find((record) => record.value === year);
        if (!findYear) {
          acc.push({ value: year, months: [] });
        }

        // Initialize month array if not already present
        const yearRecord = acc.find((record) => record.value === year);
        const findMonth = yearRecord.months.find(
          (record) => record.value === month
        );
        if (!findMonth) {
          yearRecord.months.push({ value: month, weeks: [] });
        }

        // Add current week to the appropriate month array
        const monthRecord = yearRecord.months.find(
          (record) => record.value === month
        );

        monthRecord.weeks.push(curr.weekOf);

        return acc;
      },
      []
    );

    for (const year in groupedData) {
      groupedData[year].months.sort((a, b) => b.value - a.value);
    }

    return groupedData;
  }, [
    meeting,
    meetingExactDate,
    sourcesFormattedByWeek,
    sourcesValid,
    midweekDay,
    weekendDay,
  ]);

  const tabs = useMemo(() => {
    return sources.toReversed().map((year) => ({
      label: year.value.toString(),
      Component: <MonthsContainer months={year.months} reverse={sortDown} />,
    }));
  }, [sources, sortDown]);

  const activeTab = useMemo(() => {
    return tabs.findIndex((record) => record.label === currentYear);
  }, [tabs, currentYear]);

  const hasWeeks = useMemo(() => {
    return sources.length > 0;
  }, [sources]);

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleToggleSort = () => {
    setSortDown((prev) => {
      localStorage.setItem('meeting_sort_down', !prev ? 'true' : 'false');
      return !prev;
    });
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

  return {
    tabs,
    hasWeeks,
    expanded,
    handleToggleExpand,
    activeTab,
    openDelete,
    handleCloseDelete,
    handleOpenDelete,
    meeting,
    sortDown,
    handleToggleSort,
  };
};

export default useWeekSelector;
