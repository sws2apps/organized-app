import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { MeetingType } from '@definition/app';
import { SourcesFormattedType } from '@definition/sources';
import { sourcesFormattedState, sourcesValidState } from '@states/sources';
import { useBreakpoints } from '@hooks/index';
import { selectedWeekState } from '@states/schedules';
import { convertStringToBoolean } from '@utils/common';
import { JWLangState, meetingExactDateState } from '@states/settings';
import MonthsContainer from './months_container';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const useWeekSelector = () => {
  const location = useLocation();

  const { desktopUp } = useBreakpoints();

  const resetSelectedWeek = useResetAtom(selectedWeekState);

  const sourcesValid = useAtomValue(sourcesValidState);
  const sourcesFormattedByWeek = useAtomValue(sourcesFormattedState);
  const selectedWeek = useAtomValue(selectedWeekState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const lang = useAtomValue(JWLangState);

  const [expanded, setExpanded] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [sortDown, setSortDown] = useState(
    convertStringToBoolean(localStorage.getItem('meeting_sort_down'))
  );
  const [activeTab, setActiveTab] = useState(0);

  const meeting: MeetingType = useMemo(() => {
    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const currentYear = useMemo(() => {
    if (selectedWeek.length === 0) return;

    const mtd = schedulesGetMeetingDate({
      week: selectedWeek,
      meeting,
    });

    const date = mtd.date;
    return date.split('/')[0];
  }, [selectedWeek, meeting]);

  const weeksWithoutMemorial = useMemo(() => {
    const weeksExact = sourcesFormattedByWeek.reduce<SourcesFormattedType[]>(
      (acc, curr) => {
        for (const month of curr.months) {
          let anyMemorialWeek: string;

          if (meeting === 'midweek') {
            anyMemorialWeek = month.weeks.find((week) =>
              sourcesValid.find(
                (s) =>
                  s.weekOf === week &&
                  !s.midweek_meeting.weekly_bible_reading[lang]
              )
            );
          }

          if (meeting === 'weekend') {
            anyMemorialWeek = month.weeks.find((week) =>
              sourcesValid.find(
                (s) => s.weekOf === week && !s.weekend_meeting.w_study[lang]
              )
            );
          }

          if (anyMemorialWeek) {
            month.weeks = month.weeks.filter(
              (week) => week !== anyMemorialWeek
            );
          }
        }

        acc.push(curr);

        return acc;
      },
      []
    );

    const weeks = sourcesValid.filter((record) => {
      if (meeting === 'midweek') {
        const anyMemorialWeek =
          !record.midweek_meeting.weekly_bible_reading[lang];

        if (anyMemorialWeek) {
          return false;
        }
      }

      if (meeting === 'weekend') {
        const anyMemorialWeek = !record.weekend_meeting.w_study[lang];

        if (anyMemorialWeek) {
          return false;
        }
      }

      return true;
    });

    return { weeksExact, weeks };
  }, [meeting, lang, sourcesFormattedByWeek, sourcesValid]);

  const sources = useMemo(() => {
    if (meeting === 'midweek' && !meetingExactDate) {
      return weeksWithoutMemorial.weeksExact;
    }

    const groupedData = weeksWithoutMemorial.weeks.reduce<
      SourcesFormattedType[]
    >((acc, curr) => {
      const mtd = schedulesGetMeetingDate({
        week: curr.weekOf,
        meeting,
      });

      const date = mtd.date;
      const year = +date.split('/')[0];
      const month = date.substring(0, 7);

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
    }, []);

    for (const year in groupedData) {
      groupedData[year].months.sort((a, b) => b.value.localeCompare(a.value));
    }

    return groupedData;
  }, [meeting, meetingExactDate, weeksWithoutMemorial]);

  const tabs = useMemo(() => {
    return sources.toReversed().map((year) => ({
      label: year.value.toString(),
      Component: <MonthsContainer months={year.months} reverse={sortDown} />,
    }));
  }, [sources, sortDown]);

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
    if (!currentYear) return;

    const findIndex = tabs.findIndex((record) => record.label === currentYear);

    if (findIndex === -1) return;

    setActiveTab(findIndex);
  }, [tabs, currentYear]);

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
