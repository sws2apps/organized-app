import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { addMonths, getWeekDate, timeAddMinutes } from '@utils/date';
import { formatDate } from '@services/dateformat';
import {
  userDataViewState,
  userLocalUIDState,
  weekendMeetingOpeningPrayerAutoAssignState,
  weekendMeetingTimeState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { ASSIGNMENT_PATH } from '@constants/index';
import {
  schedulesGetData,
  schedulesWeekNoMeeting,
} from '@services/app/schedules';
import {
  AssignmentCongregation,
  WeekendMeetingTimingsType,
} from '@definition/schedules';
import { monthNamesState, monthShortNamesState } from '@states/app';
import { sourcesState } from '@states/sources';

const useWeekendMeeting = () => {
  const currentWeekVisible = useIntersectionObserver({
    root: '.schedules-view-week-selector .MuiTabs-scroller',
    selector: '.schedules-current-week',
  });

  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);
  const monthShortNames = useRecoilValue(monthShortNamesState);
  const monthNames = useRecoilValue(monthNamesState);
  const sources = useRecoilValue(sourcesState);
  const userUID = useRecoilValue(userLocalUIDState);
  const pgmStart = useRecoilValue(weekendMeetingTimeState);
  const openingPrayerAuto = useRecoilValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const meetingDay = useRecoilValue(weekendMeetingWeekdayState);

  const [value, setValue] = useState<number | boolean>(false);

  const noSchedule = useMemo(() => {
    return schedules.length === 0;
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    const minDate = formatDate(addMonths(new Date(), -2), 'yyyy/MM/dd');

    return schedules.filter((record) => record.weekOf >= minDate);
  }, [schedules]);

  const week = useMemo(() => {
    if (typeof value === 'boolean') return null;

    return filteredSchedules.at(value)?.weekOf || null;
  }, [value, filteredSchedules]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const weekType: Week = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    const type = schedule.weekend_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView]);

  const weekDateLocale = useMemo(() => {
    if (!source) return;

    const [year, month, day] = source.weekOf.split('/');
    const meetingDate = new Date(+year, +month - 1, +day + +meetingDay - 1);

    const newMonth = meetingDate.getMonth();
    const newDate = meetingDate.getDate();
    const newYear = meetingDate.getFullYear();

    const monthName = monthNames[newMonth].toUpperCase();

    const weekDateLocale = t('tr_longDateWithYearLocale', {
      date: newDate,
      month: monthName,
      year: newYear,
    });

    return weekDateLocale;
  }, [source, t, meetingDay, monthNames]);

  const scheduleLastUpdated = useMemo(() => {
    if (!schedule) return;

    const assignments = Object.entries(ASSIGNMENT_PATH);
    const weekendAssignments = assignments.filter(
      (record) =>
        record[0].includes('WM_') && record[0] !== 'WM_CircuitOverseer'
    );

    const dates: string[] = [];
    for (const [, path] of weekendAssignments) {
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
    const monthName = monthShortNames[month];

    const dateFormatted = t('tr_longDateWithYearLocale', {
      year,
      month: monthName,
      date,
    });

    return dateFormatted;
  }, [schedule, dataView, monthShortNames, t]);

  const myAssignmentsTotal = useMemo(() => {
    if (!schedule) return;

    const assignments = Object.entries(ASSIGNMENT_PATH);
    const weekendAssignments = assignments.filter((record) =>
      record[0].includes('WM_')
    );

    let cn = 0;

    for (const [, path] of weekendAssignments) {
      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      if (assigned?.value.length > 0 && assigned?.value === userUID) {
        cn++;
      }
    }

    return cn > 0 ? cn : undefined;
  }, [schedule, dataView, userUID]);

  const noMeetingInfo = useMemo(() => {
    const noMeeting = schedulesWeekNoMeeting(weekType);

    if (!noMeeting) return { value: false, event: undefined };

    const event = source.weekend_meeting.event_name.value;

    return { value: true, event };
  }, [weekType, source]);

  const partTimings = useMemo(() => {
    const timings = {} as WeekendMeetingTimingsType;

    timings.pgm_start = timeAddMinutes(pgmStart, 0);
    timings.public_talk = timeAddMinutes(timings.pgm_start, 5);
    timings.middle_song = timeAddMinutes(timings.public_talk, 30);
    timings.w_study = timeAddMinutes(timings.middle_song, 5);

    if (weekType === Week.CO_VISIT) {
      timings.service_talk = timeAddMinutes(timings.w_study, 30);
      timings.pgm_end = timeAddMinutes(timings.service_talk, 30);
    }

    if (weekType === Week.NORMAL) {
      timings.pgm_end = timeAddMinutes(timings.w_study, 60);
    }

    return timings;
  }, [pgmStart, weekType]);

  const handleGoCurrent = () => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    const index = filteredSchedules.findIndex(
      (record) => record.weekOf === weekOf
    );

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
    weekType,
    scheduleLastUpdated,
    noMeetingInfo,
    myAssignmentsTotal,
    partTimings,
    openingPrayerAuto,
    weekDateLocale,
    noSchedule,
  };
};

export default useWeekendMeeting;
