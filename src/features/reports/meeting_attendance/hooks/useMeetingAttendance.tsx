import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { meetingAttendanceGetStats } from '@services/app/meeting_attendance';

const useMeetingAttendance = (month: string) => {
  const { isGroup, languageGroup } = useCurrentUser();

  const attendances = useAtomValue(meetingAttendanceState);

  const attendance = useMemo(() => {
    return attendances.find((record) => record.month_date === month);
  }, [attendances, month]);

  const category = isGroup ? languageGroup?.group_id : undefined;

  const midweek = useMemo(() => {
    return meetingAttendanceGetStats(attendance, 'midweek', category);
  }, [attendance, category]);

  const weekend = useMemo(() => {
    return meetingAttendanceGetStats(attendance, 'weekend', category);
  }, [attendance, category]);

  return { midweek, weekend, hasRecord: !!attendance };
};

export default useMeetingAttendance;
