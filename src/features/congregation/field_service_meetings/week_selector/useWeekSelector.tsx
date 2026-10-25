import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import {
  fieldServiceMeetingsState,
  fieldServiceMeetingsWeekRangeState,
  fieldServiceMeetingsViewModeState,
} from '@states/field_service_meetings';
import { userDataViewState } from '@states/settings';
import { monthNamesState } from '@states/app';
import {
  fieldServiceMeetingWeek,
  fieldServiceMeetingWeekCoverage,
} from '@utils/field_service_meetings';
import { weeksInMonth, formatDate } from '@utils/date';
import { filterMeetingsByDataView } from '@features/congregation/field_service_meetings/filter_meetings_by_data_view';

const useWeekSelector = () => {
  const { desktopUp } = useBreakpoints();
  const [date, setDate] = useAtom(fieldServiceMeetingsWeekRangeState);
  const [, setView] = useAtom(fieldServiceMeetingsViewModeState);
  const meetings = useAtomValue(fieldServiceMeetingsState);
  const view = useAtomValue(userDataViewState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const visibleGroups = useMemo(
    () =>
      view === 'main'
        ? groups
        : groups.filter((group) => group.group_id === view),
    [groups, view]
  );
  const monthNames = useAtomValue(monthNamesState);
  const selectedWeek = fieldServiceMeetingWeek(date);
  const selectedMonth = selectedWeek.slice(0, 7);
  const [expanded, setExpanded] = useState(desktopUp);
  const [sortDown, setSortDown] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<string | false>(
    selectedMonth
  );
  const [year, setYear] = useState(Number(selectedWeek.slice(0, 4)));
  useEffect(() => {
    setYear(Number(selectedWeek.slice(0, 4)));
    setExpandedMonth(selectedMonth);
    if (!desktopUp) setExpanded(false);
  }, [selectedWeek, selectedMonth, desktopUp]);
  const records = useMemo(
    () => filterMeetingsByDataView(meetings, view),
    [meetings, view]
  );
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const values = new Set([
      current - 1,
      current,
      current + 1,
      year,
      Number(selectedWeek.slice(0, 4)),
    ]);
    for (const meeting of records) {
      for (const value of [
        meeting.meeting_data.start,
        meeting.meeting_data.end,
      ]) {
        const date = new Date(value);
        if (Number.isFinite(date.getTime())) values.add(date.getFullYear());
      }
    }
    return [...values].sort((a, b) => b - a);
  }, [records, year, selectedWeek]);
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const value = `${year}/${String(index + 1).padStart(2, '0')}`;
        return {
          value,
          label: monthNames[index],
          weeks: weeksInMonth(value).map((week) => {
            const end = new Date(week);
            end.setDate(end.getDate() + 6);
            return {
              value: week,
              ...fieldServiceMeetingWeekCoverage(
                records,
                visibleGroups,
                week,
                formatDate(end, 'yyyy/MM/dd')
              ),
            };
          }),
        };
      }),
    [year, monthNames, records, visibleGroups]
  );
  return {
    years,
    year,
    setYear,
    months: sortDown ? months.toReversed() : months,
    selectedWeek,
    expandedMonth,
    setExpandedMonth,
    expanded,
    sortDown,
    toggleExpanded: () => setExpanded((value) => !value),
    toggleSort: () => setSortDown((value) => !value),
    selectWeek: (week: string) => {
      setDate(new Date(week));
      setView('week');
      if (!desktopUp) setExpanded(false);
    },
  };
};
export default useWeekSelector;
