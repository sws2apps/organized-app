import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import {
  addMonths,
  formatDate,
  generateDateFromTime,
  getWeekDate,
  timeAddMinutes,
} from '@utils/date';
import {
  hour24FormatState,
  userDataViewState,
  userLocalUIDState,
  weekendMeetingOpeningPrayerAutoAssignState,
  weekendMeetingTimeState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { ASSIGNMENT_PATH, WEEKEND_WITH_TALKS_NOCO } from '@constants/index';
import {
  schedulesGetData,
  schedulesGetMeetingDate,
  schedulesWeekNoMeeting,
} from '@services/app/schedules';
import {
  AssignmentCongregation,
  WeekendMeetingTimingsType,
} from '@definition/schedules';
import { monthShortNamesState } from '@states/app';
import { sourcesState } from '@states/sources';

const useWeekendMeeting = () => {
  const currentWeekVisible = useIntersectionObserver({
    root: '.schedules-view-week-selector .MuiTabs-scroller',
    selector: '.schedules-current-week',
  });

  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const monthShortNames = useAtomValue(monthShortNamesState);
  const sources = useAtomValue(sourcesState);
  const userUID = useAtomValue(userLocalUIDState);
  const pgmStart = useAtomValue(weekendMeetingTimeState);
  const use24 = useAtomValue(hour24FormatState);
  const openingPrayerAuto = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );

  const [value, setValue] = useState<number | boolean>(false);

  const noSchedule = useMemo(() => {
    if (schedules.length === 0) return true;

    let noMeeting = true;

    for (const schedule of schedules) {
      if (schedule.weekend_meeting) {
        noMeeting = false;
        break;
      }
    }

    return noMeeting;
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
    if (!schedule || noSchedule) return Week.NORMAL;

    return (
      schedule.weekend_meeting?.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView, noSchedule]);

  const mainWeekType = useMemo(() => {
    if (!schedule || noSchedule) return Week.NORMAL;

    return (
      schedule.weekend_meeting?.week_type.find(
        (record) => record.type === 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule, noSchedule]);

  const showChairman = useMemo(() => {
    if (dataView !== 'main' && WEEKEND_WITH_TALKS_NOCO.includes(weekType)) {
      return mainWeekType !== Week.CO_VISIT;
    }

    return true;
  }, [dataView, weekType, mainWeekType]);

  const weekDateLocale = useMemo(() => {
    if (!source || noSchedule) return;

    const meetingDate = schedulesGetMeetingDate({
      week: source.weekOf,
      meeting: 'weekend',
    });

    return meetingDate.locale;
  }, [source, noSchedule]);

  const scheduleLastUpdated = useMemo(() => {
    if (!schedule || noSchedule) return;

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
  }, [schedule, dataView, monthShortNames, t, noSchedule]);

  const myAssignmentsTotal = useMemo(() => {
    if (!schedule || noSchedule) return;

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
  }, [schedule, dataView, userUID, noSchedule]);

  const noMeetingInfo = useMemo(() => {
    const noMeeting = schedulesWeekNoMeeting(weekType);

    if (!noMeeting || !source || noSchedule)
      return { value: false, event: undefined };

    const event =
      source.weekend_meeting.event_name.find(
        (record) => record.type === dataView
      )?.value ?? '';

    return { value: true, event };
  }, [weekType, source, dataView, noSchedule]);

  const partTimings = useMemo(() => {
    const timings = {} as WeekendMeetingTimingsType;

    let meetingStart = pgmStart;

    if (!use24) {
      const date = generateDateFromTime(pgmStart);
      meetingStart = formatDate(date, 'h:mm');
    }

    timings.pgm_start = timeAddMinutes(meetingStart, 0);
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
  }, [pgmStart, weekType, use24]);

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
    showChairman,
  };
};

export default useWeekendMeeting;
