import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { schedulesState } from '@states/schedules';
import { formatDate, generateDateFromTime } from '@utils/date';
import {
  hour24FormatState,
  JWLangState,
  settingsState,
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
import { sourcesState } from '@states/sources';
import { MidweekMeetingProps } from './index.types';

const useMidweekMeeting = ({
  week,
  dataView,
  hideTiming,
}: MidweekMeetingProps) => {
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const userUID = useAtomValue(userLocalUIDState);
  const lang = useAtomValue(JWLangState);
  const use24 = useAtomValue(hour24FormatState);
  const settings = useAtomValue(settingsState);

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

  const classCount = useMemo(() => {
    return (
      settings.cong_settings.midweek_meeting.find(
        (record) => record.type === dataView
      )?.class_count.value ?? 1
    );
  }, [settings, dataView]);

  const openingPrayerLinked = useMemo(() => {
    return settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    )?.opening_prayer_linked_assignment.value;
  }, [settings, dataView]);

  const pgmStart = useMemo(() => {
    return (
      settings.cong_settings.midweek_meeting.find(
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
      schedule.midweek_meeting?.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView, noSchedule]);

  const languageWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting?.week_type.find(
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
    if (hideTiming) return;

    if ((!schedule && !source) || noSchedule) return;

    let meetingStart = pgmStart;

    if (!use24) {
      const date = generateDateFromTime(pgmStart);
      meetingStart = formatDate(date, 'h:mm');
    }

    const result = schedulesMidweekGetTiming({
      schedule,
      dataView: dataView,
      pgmStart: meetingStart,
      source,
      lang,
    });

    return result;
  }, [
    hideTiming,
    schedule,
    source,
    dataView,
    pgmStart,
    lang,
    use24,
    noSchedule,
  ]);

  return {
    week,
    showAuxCounselor,
    weekType,
    noMeetingInfo,
    myAssignmentsTotal,
    partTimings,
    openingPrayerLinked,
  };
};

export default useMidweekMeeting;
