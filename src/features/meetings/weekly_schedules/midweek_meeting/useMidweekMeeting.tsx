import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import {
  midweekMeetingClassCountState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { ASSIGNMENT_PATH } from '@constants/index';
import {
  schedulesGetData,
  schedulesWeekNoMeeting,
} from '@services/app/schedules';
import { AssignmentCongregation } from '@definition/schedules';
import { monthShortNamesState } from '@states/app';
import { sourcesState } from '@states/sources';

const useMidweekMeeting = () => {
  const currentWeekVisible = useIntersectionObserver({
    root: '.schedules-view-week-selector .MuiTabs-scroller',
    selector: '.schedules-current-week',
  });

  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const dataView = useRecoilValue(userDataViewState);
  const monthNames = useRecoilValue(monthShortNamesState);
  const sources = useRecoilValue(sourcesState);
  const userUID = useRecoilValue(userLocalUIDState);

  const [value, setValue] = useState<number | boolean>(false);

  const week = useMemo(() => {
    if (typeof value === 'boolean') return null;

    return schedules.at(value)?.weekOf || null;
  }, [value, schedules]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const weekType: Week = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView]);

  const showAuxCounselor = useMemo(() => {
    if (weekType === Week.CO_VISIT) {
      return false;
    }

    if (classCount === 1) {
      return false;
    }

    return true;
  }, [classCount, weekType]);

  const scheduleLastUpdated = useMemo(() => {
    if (!schedule) return;

    const assignments = Object.entries(ASSIGNMENT_PATH);
    const midweekAssignments = assignments.filter(
      (record) =>
        record[0].includes('MM_') && record[0] !== 'MM_CircuitOverseer'
    );

    const dates: string[] = [];
    for (const [, path] of midweekAssignments) {
      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      if (assigned?.updatedAt.length > 0) {
        dates.push(assigned.updatedAt);
      }
    }

    const recentDate = dates.sort((a, b) => b.localeCompare(a)).at(0);
    if (!recentDate) return;

    const d = new Date(recentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const monthName = monthNames[month];

    const dateFormatted = t('tr_longDateWithYearLocale', {
      year,
      month: monthName,
      date,
    });

    return dateFormatted;
  }, [schedule, dataView, monthNames, t]);

  const myAssignmentsTotal = useMemo(() => {
    if (!schedule) return;

    const assignments = Object.entries(ASSIGNMENT_PATH);
    const midweekAssignments = assignments.filter((record) =>
      record[0].includes('MM_')
    );

    let cn = 0;

    for (const [, path] of midweekAssignments) {
      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      if (assigned?.value === userUID) {
        cn++;
      }
    }

    return cn > 0 ? cn : undefined;
  }, [schedule, dataView, userUID]);

  const noMeetingInfo = useMemo(() => {
    const noMeeting = schedulesWeekNoMeeting(weekType);

    if (!noMeeting) return { value: false, event: undefined };

    const event = source.midweek_meeting.event_name.value;

    return { value: true, event };
  }, [weekType, source]);

  const handleGoCurrent = () => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    const index = schedules.findIndex((record) => record.weekOf === weekOf);

    setValue(index);
  };

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  return {
    value,
    handleGoCurrent,
    handleValueChange,
    week,
    currentWeekVisible,
    showAuxCounselor,
    weekType,
    scheduleLastUpdated,
    noMeetingInfo,
    myAssignmentsTotal,
  };
};

export default useMidweekMeeting;
