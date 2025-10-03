import { useCallback, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { fieldServiceMeetingsFilterState } from '@states/field_service_meetings';

/**
 * Hook for calendar navigation logic
 * Handles date navigation, view mode, and filtering for field service meetings
 */
const useCalendarNavigation = () => {
  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [filterId, setFilterId] = useAtom(fieldServiceMeetingsFilterState);

  // Define visible filters
  const visibleFilters = useMemo(
    () => [
      { id: 'all', translationKey: 'tr_all' },
      { id: 'myGroup', translationKey: 'tr_myGroup' },
      { id: 'joint', translationKey: 'tr_jointMeetings' },
      { id: 'zoom', translationKey: 'tr_zoom' },
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
  }, [viewMode]);

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
  }, [viewMode]);

  const handleViewModeChange = useCallback((mode: 'week' | 'month') => {
    setViewMode(mode);
  }, []);

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
    currentDate,
    viewMode,
    filterId,
    visibleFilters,

    // Handlers
    handleNavigatePrevious,
    handleNavigateNext,
    handleViewModeChange,
    handleFilterChange,
  };
};

export default useCalendarNavigation;
