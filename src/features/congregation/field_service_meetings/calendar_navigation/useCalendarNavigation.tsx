import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  fieldServiceMeetingsFilterState,
  fieldServiceMeetingsViewModeState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';
import { formatDate, getWeekDate } from '@utils/date';
import { monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';

const useCalendarNavigation = () => {
  const { t } = useAppTranslation();
  const navigationRef = useRef<HTMLDivElement>(null);
  const [isNavigationWrapped, setIsNavigationWrapped] = useState(false);

  useLayoutEffect(() => {
    const row = navigationRef.current;
    if (!row) return;
    const [date, tabs] = row.children;
    if (!date || !tabs) return;

    const measure = () => {
      setIsNavigationWrapped(
        tabs.getBoundingClientRect().top >= date.getBoundingClientRect().bottom
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(date);
    observer.observe(tabs);
    return () => observer.disconnect();
  }, []);

  const [currentDate, setCurrentDate] = useAtom(
    fieldServiceMeetingsWeekRangeState
  );
  const [viewMode, setViewMode] = useAtom(fieldServiceMeetingsViewModeState);
  const [filterId, setFilterId] = useAtom(fieldServiceMeetingsFilterState);

  const months = useAtomValue(monthNamesState);
  // getWeekDate mutates its argument, so always hand it a copy of the atom value.
  const firstDayOfWeek = useMemo(
    () => getWeekDate(new Date(currentDate)),
    [currentDate]
  );

  const weekLabel = useMemo(
    () =>
      t('tr_longDateNoYearLocale', {
        month: months[firstDayOfWeek.getMonth()],
        date: firstDayOfWeek.getDate(),
      }),
    [firstDayOfWeek, months, t]
  );

  const monthLabel = useMemo(
    () => `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
    [months, currentDate]
  );

  const periodLabel = viewMode === 'month' ? monthLabel : weekLabel;

  const visibleFilters = useMemo(
    () => [
      { id: 'all', translationKey: 'tr_all' },
      { id: 'my-group', translationKey: 'tr_myGroup' },
      { id: 'joint', translationKey: 'tr_jointMeetings' },
      { id: 'online', translationKey: 'tr_online' },
    ],
    []
  );

  const handleNavigatePrevious = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === 'week') {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 7);
        return newDate;
      }
      // First of month: keeping the day-of-month overflows short months
      // (e.g. Mar 31 → Mar 3 when stepping to February).
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
  }, [viewMode, setCurrentDate]);

  const handleNavigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === 'week') {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 7);
        return newDate;
      }
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
  }, [viewMode, setCurrentDate]);

  const handleViewModeChange = useCallback(
    (mode: 'week' | 'month') => {
      setViewMode(mode);
    },
    [setViewMode]
  );

  // Whether the displayed period already includes today (week or month).
  const isCurrentPeriod = useMemo(() => {
    const today = new Date();
    if (viewMode === 'week') {
      return (
        formatDate(getWeekDate(new Date(currentDate)), 'yyyy/MM/dd') ===
        formatDate(getWeekDate(today), 'yyyy/MM/dd')
      );
    }
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  }, [currentDate, viewMode]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);

  const handleFilterChange = useCallback(
    (id: string) => {
      setFilterId(id);
    },
    [setFilterId]
  );

  return {
    navigationRef,
    isNavigationWrapped,
    periodLabel,
    viewMode,
    filterId,
    visibleFilters,
    isCurrentPeriod,
    handleNavigatePrevious,
    handleNavigateNext,
    handleViewModeChange,
    handleFilterChange,
    goToToday,
  };
};

export default useCalendarNavigation;
