import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { addMonths, generateDateFromTime, getWeekDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import {
  hour24FormatState,
  JWLangState,
  midweekMeetingClassCountState,
  midweekMeetingOpeningPrayerLinkedState,
  midweekMeetingTimeState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import {
  ASSIGNMENT_PATH,
  MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP,
} from '@constants/index';
import {
  schedulesGetData,
  schedulesMidweekGetTiming,
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

  const schedules = useAtomValue(schedulesState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const dataView = useAtomValue(userDataViewState);
  const monthNames = useAtomValue(monthShortNamesState);
  const sources = useAtomValue(sourcesState);
  const userUID = useAtomValue(userLocalUIDState);
  const pgmStart = useAtomValue(midweekMeetingTimeState);
  const lang = useAtomValue(JWLangState);
  const use24 = useAtomValue(hour24FormatState);
  const openingPrayerLinked = useAtomValue(
    midweekMeetingOpeningPrayerLinkedState
  );

  const [value, setValue] = useState<number | boolean>(false);

  const noSchedule = useMemo(() => {
    if (schedules.length === 0) return true;

    let noMeeting = true;

    for (const schedule of schedules) {
      if (schedule.midweek_meeting) {
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

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView, noSchedule]);

  const languageWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const showAuxCounselor = useMemo(() => {
    return (
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType)
    );
  }, [classCount, weekType, languageWeekType]);

  const scheduleLastUpdated = useMemo(() => {
    if (!schedule || noSchedule) return;

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
  }, [schedule, dataView, monthNames, t, noSchedule]);

  const myAssignmentsTotal = useMemo(() => {
    if (!schedule || noSchedule) return;

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
      source.midweek_meeting.event_name.find(
        (record) => record.type === dataView
      )?.value ?? '';

    return { value: true, event };
  }, [weekType, source, dataView, noSchedule]);

  const partTimings = useMemo(() => {
    if ((!schedule && !source) || noSchedule) return;

    let meetingStart = pgmStart;

    if (!use24) {
      const date = generateDateFromTime(pgmStart);
      meetingStart = formatDate(date, 'h:mm');
    }

    const result = schedulesMidweekGetTiming({
      schedule,
      dataView,
      pgmStart: meetingStart,
      source,
      lang,
    });

    return result;
  }, [schedule, source, dataView, pgmStart, lang, use24, noSchedule]);

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
    showAuxCounselor,
    weekType,
    scheduleLastUpdated,
    noMeetingInfo,
    myAssignmentsTotal,
    partTimings,
    openingPrayerLinked,
    noSchedule,
  };
};

export default useMidweekMeeting;
