import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { isMyAssignmentOpenState } from '@states/app';
import {
  shortDateFormatState,
  userLocalUIDState,
  userMembersDelegateState,
} from '@states/settings';
import {
  AssignmentsMonth,
  AssignmentsWeek,
  PersonAssignments,
} from './indextypes';
import { assignmentsHistoryState } from '@states/schedules';
import { addWeeks, formatDate, getWeekDate } from '@utils/date';
import { AssignmentHistoryType } from '@definition/schedules';
import {
  WeeklySchedulesLocationState,
  WeeklySchedulesType,
} from '@pages/meetings/schedules/index.types';
import { resolveAssignmentDate } from '@utils/assignments';

/**
 * Groups assignments by month, week and day. A week belongs to the month of its
 * first assignment, so it is never split between two months.
 */
const groupAssignments = (
  assignments: AssignmentHistoryType[]
): PersonAssignments => {
  const list = assignments.toSorted((a, b) => a.weekOf.localeCompare(b.weekOf));

  const weeks: AssignmentsWeek[] = [];

  for (const record of list) {
    const weekOf = formatDate(
      getWeekDate(new Date(record.weekOf)),
      'yyyy/MM/dd'
    );

    let week = weeks.at(-1);
    if (week?.weekOf !== weekOf) {
      week = { weekOf, days: [] };
      weeks.push(week);
    }

    let day = week.days.at(-1);
    if (day?.date !== record.weekOf) {
      day = { date: record.weekOf, assignments: [] };
      week.days.push(day);
    }

    day.assignments.push(record);
  }

  const byMonth: AssignmentsMonth[] = [];

  for (const week of weeks) {
    const month = week.days[0].date.slice(0, 7);
    const count = week.days.reduce(
      (total, day) => total + day.assignments.length,
      0
    );

    const last = byMonth.at(-1);

    if (last?.month === month) {
      last.weeks.push(week);
      last.total += count;
    } else {
      byMonth.push({ month, total: count, weeks: [week] });
    }
  }

  return { byMonth, total: list.length };
};

const WEEKLY_SCHEDULES_KEY = 'organized_weekly_schedules';

// twelve months ahead
const RANGE_WEEKS = 48;

const useMyAssignments = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useAtom(isMyAssignmentOpenState);

  const userUID = useAtomValue(userLocalUIDState);
  const delegateMembers = useAtomValue(userMembersDelegateState);
  const assignmentsHistory = useAtomValue(assignmentsHistoryState);
  const shortDateFormat = useAtomValue(shortDateFormatState);

  const [tab, setTab] = useState(0);

  const isSetup = useMemo(() => {
    return userUID.length === 0;
  }, [userUID]);

  const personAssignments = useMemo(() => {
    const now = new Date();
    const maxDate = addWeeks(now, RANGE_WEEKS);

    const remapAssignmentsDate = assignmentsHistory.map((record) =>
      resolveAssignmentDate(record, shortDateFormat)
    );

    const filterAssignments = (uid: string) => {
      return remapAssignmentsDate.filter(
        (record) =>
          record.assignment.person === uid &&
          record.weekOf >= formatDate(now, 'yyyy/MM/dd') &&
          record.weekOf <= formatDate(maxDate, 'yyyy/MM/dd')
      );
    };

    const ownAssignments = filterAssignments(userUID);
    const delegateAssignments = delegateMembers.flatMap(filterAssignments);

    return {
      ownAssignments: groupAssignments(ownAssignments),
      delegateAssignments: groupAssignments(delegateAssignments),
    };
  }, [assignmentsHistory, userUID, delegateMembers, shortDateFormat]);

  const hasDelegated = personAssignments.delegateAssignments.total > 0;

  const handleClose = () => setOpen(false);

  const handleOpenManageAccess = () => {
    navigate('/manage-access');
    setOpen(false);
  };

  const handleOpenAssignment = (history: AssignmentHistoryType) => {
    const key = history.assignment.key ?? '';

    let schedule: WeeklySchedulesType = 'weekend';

    if (key.startsWith('MM_')) schedule = 'midweek';
    if (key === 'WM_Speaker_Outgoing') schedule = 'outgoing';

    const week = formatDate(
      getWeekDate(new Date(history.weekOf)),
      'yyyy/MM/dd'
    );

    const state: WeeklySchedulesLocationState = { schedule, week };

    localStorage.setItem(WEEKLY_SCHEDULES_KEY, schedule);
    setOpen(false);
    navigate('/weekly-schedules', { state });
  };

  return {
    handleOpenManageAccess,
    open,
    handleClose,
    isSetup,
    handleOpenAssignment,
    personAssignments,
    tab: hasDelegated ? tab : 0,
    setTab,
    hasDelegated,
    current:
      tab === 1 && hasDelegated
        ? personAssignments.delegateAssignments
        : personAssignments.ownAssignments,
  };
};

export default useMyAssignments;
