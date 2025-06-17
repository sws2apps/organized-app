import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { WeeklyAttendance } from '@definition/meeting_attendance';
import { AttendanceSummaryProps } from './index.types';

const useAttendanceSummary = ({
  month,
  summary,
  type,
}: AttendanceSummaryProps) => {
  const { isGroup, languageGroup } = useCurrentUser();

  const attendances = useAtomValue(meetingAttendanceState);

  const attendance = useMemo(() => {
    return attendances.find((record) => record.month_date === month);
  }, [attendances, month]);

  const value = useMemo(() => {
    if (!attendance) return 0;

    const values: number[] = [];

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData[type];

      let total = 0;

      for (const data of meetingData) {
        if (isGroup && languageGroup && data.type !== languageGroup.group_id)
          continue;

        if (data?.present || data?.online) {
          total += data?.present || 0;
          total += data?.online || 0;
        }
      }

      if (total > 0) {
        values.push(total);
      }
    }

    const grandTotal = values.reduce((value, current) => {
      return value + current;
    }, 0);

    if (summary === 'total') {
      return grandTotal;
    }

    const cnMeet = values.length;
    return grandTotal === 0 ? 0 : Math.round(grandTotal / cnMeet);
  }, [attendance, summary, type, isGroup, languageGroup]);

  return { value };
};

export default useAttendanceSummary;
