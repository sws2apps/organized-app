import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isMyAssignmentOpenState } from '@states/app';
import {
  meetingExactDateState,
  midweekMeetingWeekdayState,
  shortDateFormatState,
  userLocalUIDState,
  userMembersDelegateState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { DisplayRange } from './indextypes';
import { localStorageGetItem } from '@utils/common';
import { assignmentsHistoryState } from '@states/schedules';
import { addWeeks, getWeekDate } from '@utils/date';
import { AssignmentHistoryType } from '@definition/schedules';
import { formatDate } from '@services/dateformat';

const useMyAssignments = () => {
  const navigate = useNavigate();

  const LOCAL_STORAGE_KEY = 'organized_my-assignments-range';

  const [open, setOpen] = useRecoilState(isMyAssignmentOpenState);

  const userUID = useRecoilValue(userLocalUIDState);
  const delegateMembers = useRecoilValue(userMembersDelegateState);
  const assignmentsHistory = useRecoilValue(assignmentsHistoryState);
  const exactDate = useRecoilValue(meetingExactDateState);
  const midweekMeetingDay = useRecoilValue(midweekMeetingWeekdayState);
  const weekendMeetingDay = useRecoilValue(weekendMeetingWeekdayState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const storageValue = localStorageGetItem(LOCAL_STORAGE_KEY);
  const intialValue: DisplayRange = storageValue
    ? +storageValue
    : DisplayRange.MONTHS_12;

  const [displayRange, setDisplayRange] = useState(intialValue);

  const isSetup = useMemo(() => {
    return userUID.length === 0;
  }, [userUID]);

  const personAssignments = useMemo(() => {
    const now = getWeekDate();
    const maxDate = addWeeks(now, displayRange);

    let personAssignments = assignmentsHistory.filter(
      (record) =>
        (record.assignment.person === userUID ||
          delegateMembers.includes(record.assignment.person)) &&
        formatDate(new Date(record.weekOf), 'yyyy/MM/dd') >=
          formatDate(now, 'yyyy/MM/dd') &&
        formatDate(new Date(record.weekOf), 'yyyy/MM/dd') <=
          formatDate(maxDate, 'yyyy/MM/dd')
    );

    if (exactDate) {
      personAssignments = personAssignments.map((record) => {
        const isMidweek = record.assignment.key.startsWith('MM_');
        const isWeekend = record.assignment.key.startsWith('WM_');

        const [year, month, day] = record.weekOf.split('/');

        let meetingDate: Date;

        if (isMidweek) {
          meetingDate = new Date(
            +year,
            +month - 1,
            +day + +midweekMeetingDay - 1
          );
        }

        if (isWeekend) {
          meetingDate = new Date(
            +year,
            +month - 1,
            +day + +weekendMeetingDay - 1
          );
        }

        return {
          ...record,
          weekOf: formatDate(meetingDate, 'yyyy/MM/dd'),
          weekOfFormatted: formatDate(meetingDate, shortDateFormat),
        };
      });
    }

    const groupedByMonth = personAssignments.reduce<
      Record<string, AssignmentHistoryType[]>
    >((acc, obj) => {
      const [year, month] = obj.weekOf.split('/').slice(0, 2);
      const key = `${year}/${month}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});

    const sortedGroups = Object.keys(groupedByMonth)
      .sort()
      .map((key) => ({
        month: key,
        children: groupedByMonth[key].sort((a, b) =>
          a.weekOf.localeCompare(b.weekOf)
        ),
      }));

    return sortedGroups;
  }, [
    assignmentsHistory,
    displayRange,
    userUID,
    delegateMembers,
    shortDateFormat,
    exactDate,
    midweekMeetingDay,
    weekendMeetingDay,
  ]);

  const handleClose = () => setOpen(false);

  const handleOpenManageAccess = () => {
    navigate('/manage-access');
    setOpen(false);
  };

  const handleRangeChange = (value: DisplayRange) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, value.toString());

    setDisplayRange(value);
  };

  return {
    handleOpenManageAccess,
    open,
    handleClose,
    isSetup,
    displayRange,
    handleRangeChange,
    personAssignments,
  };
};

export default useMyAssignments;
