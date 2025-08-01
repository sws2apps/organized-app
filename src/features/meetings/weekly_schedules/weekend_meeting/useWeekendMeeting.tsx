import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { formatDate, generateDateFromTime, timeAddMinutes } from '@utils/date';
import {
  hour24FormatState,
  settingsState,
  userLocalUIDState,
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
import { WeekendMeetingProps } from './index.types';

const useWeekendMeeting = ({
  week,
  dataView,
  hideTiming,
}: WeekendMeetingProps) => {
  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const monthShortNames = useAtomValue(monthShortNamesState);
  const sources = useAtomValue(sourcesState);
  const userUID = useAtomValue(userLocalUIDState);
  const use24 = useAtomValue(hour24FormatState);
  const settings = useAtomValue(settingsState);

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

  const openingPrayerAuto = useMemo(() => {
    return settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    )?.opening_prayer_auto_assigned.value;
  }, [settings, dataView]);

  const pgmStart = useMemo(() => {
    return (
      settings.cong_settings.weekend_meeting.find(
        (record) => record.type === dataView
      )?.time.value ?? '08:00'
    );
  }, [settings, dataView]);

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
      dataView,
    });

    return meetingDate.locale;
  }, [source, noSchedule, dataView]);

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
    if (hideTiming) return;

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
  }, [hideTiming, pgmStart, weekType, use24]);

  return {
    week,
    weekType,
    scheduleLastUpdated,
    noMeetingInfo,
    myAssignmentsTotal,
    partTimings,
    openingPrayerAuto,
    weekDateLocale,
    showChairman,
  };
};

export default useWeekendMeeting;
