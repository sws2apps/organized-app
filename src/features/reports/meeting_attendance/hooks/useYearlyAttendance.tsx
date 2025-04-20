import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { WeeklyAttendance } from '@definition/meeting_attendance';
import { MeetingType } from '@definition/app';

const useYearlyAttendance = (year: string) => {
  const attendances = useAtomValue(meetingAttendanceState);

  const startMonth = useMemo(() => {
    return `${+year - 1}/09`;
  }, [year]);

  const endMonth = useMemo(() => {
    return `${year}/08`;
  }, [year]);

  const reports = useMemo(() => {
    return attendances.filter(
      (record) =>
        record.month_date >= startMonth && record.month_date <= endMonth
    );
  }, [attendances, startMonth, endMonth]);

  const getMeetingAverage = (meeting: MeetingType) => {
    if (reports.length === 0) return 0;

    const values: number[] = [];

    for (const attendance of reports) {
      for (let i = 1; i <= 5; i++) {
        let total = 0;

        const weekData = attendance[`week_${i}`] as WeeklyAttendance;
        const meetingData = weekData[meeting];

        total += meetingData.reduce((acc, current) => {
          if (current?.online) {
            return acc + current.online;
          }

          if (current?.present) {
            return acc + current.present;
          }

          return acc;
        }, 0);

        if (total > 0) values.push(total);
      }
    }

    const sum = values.reduce((acc, current) => acc + current, 0);

    if (sum === 0) return 0;

    return Math.round(sum / values.length);
  };

  return { getMeetingAverage };
};

export default useYearlyAttendance;
