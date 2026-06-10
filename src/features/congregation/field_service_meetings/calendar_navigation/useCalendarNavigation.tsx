import { useCallback, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  fieldServiceMeetingsFilterState,
  fieldServiceMeetingsViewModeState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';
import { formatDate, getWeekDate } from '@utils/date';
import { monthNamesState } from '@states/app';
import { getTranslation } from '@services/i18n/translation';

/**
 * Hook for calendar navigation logic
 * Handles date navigation, view mode, and filtering for field service meetings
 */
const useCalendarNavigation = () => {
  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------

  const [currentDate, setCurrentDate] = useAtom(
    fieldServiceMeetingsWeekRangeState
  );
  const [viewMode, setViewMode] = useAtom(fieldServiceMeetingsViewModeState);
  const [filterId, setFilterId] = useAtom(fieldServiceMeetingsFilterState);

  const months = useAtomValue(monthNamesState);
  const firstDayOfWeek = useMemo(() => getWeekDate(currentDate), [currentDate]);

  const lastDayOfWeek = useMemo(() => {
    const lastDay = new Date(firstDayOfWeek);
    lastDay.setDate(firstDayOfWeek.getDate() + 6);
    return lastDay;
  }, [firstDayOfWeek]);

  const weekRangeLabel = useMemo(() => {
    const startDay = firstDayOfWeek.getDate();
    const endDay = lastDayOfWeek.getDate();
    const startMonthIndex = firstDayOfWeek.getMonth();
    const endMonthIndex = lastDayOfWeek.getMonth();
    const startMonth = months[startMonthIndex];
    const endMonth = months[endMonthIndex];

    if (startMonthIndex === endMonthIndex) {
      const dateRange = getTranslation({
        key: 'tr_dateRangeNoYear',
        params: {
          startDate: startDay,
          endDate: endDay,
        },
      });

      return getTranslation({
        key: 'tr_longDateNoYearLocale',
        params: {
          month: startMonth,
          date: dateRange,
        },
      });
    }

    const startDateFormatted = getTranslation({
      key: 'tr_longDateNoYearLocale',
      params: {
        month: startMonth,
        date: startDay,
      },
    });

    const endDateFormatted = getTranslation({
      key: 'tr_longDateNoYearLocale',
      params: {
        month: endMonth,
        date: endDay,
      },
    });

    return getTranslation({
      key: 'tr_dateRangeNoYear',
      params: {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      },
    });
  }, [firstDayOfWeek, lastDayOfWeek, months]);

  // In month view show the month (and year); in week view the week range.
  const monthLabel = useMemo(
    () => `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
    [months, currentDate]
  );

  const periodLabel = viewMode === 'month' ? monthLabel : weekRangeLabel;

  const visibleFilters = useMemo(
    () => [
      { id: 'all', translationKey: 'tr_all' },
      { id: 'my-group', translationKey: 'tr_myGroup' },
      { id: 'joint', translationKey: 'tr_jointMeetings' },
      { id: 'online', translationKey: 'tr_online' },
    ],
    []
  );

  // -------------------------------------------------------------------------
  // Navigation Handlers
  // -------------------------------------------------------------------------

  const handleNavigatePrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === 'week') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setMonth(prev.getMonth() - 1);
      }
      return newDate;
    });
  }, [viewMode, setCurrentDate]);

  const handleNavigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + 7);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
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
        formatDate(getWeekDate(currentDate), 'yyyy/MM/dd') ===
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

  // -------------------------------------------------------------------------
  // Return Values
  // -------------------------------------------------------------------------

  return {
    // State
    periodLabel,
    viewMode,
    filterId,
    visibleFilters,
    isCurrentPeriod,

    // Handlers
    handleNavigatePrevious,
    handleNavigateNext,
    handleViewModeChange,
    handleFilterChange,
    goToToday,
  };
};

export default useCalendarNavigation;
