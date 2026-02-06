import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { WeeklyAttendance } from '@definition/meeting_attendance';
import { MeetingType } from '@definition/app';

const useYearlyAttendance = (year: string) => {
  const attendances = useAtomValue(meetingAttendanceState);

  const startMonth = useMemo(() => `${+year - 1}/09`, [year]);
  const endMonth = useMemo(() => `${year}/08`, [year]);

  const reports = useMemo(() => {
    return attendances.filter(
      (record) =>
        record.month_date >= startMonth && record.month_date <= endMonth
    );
  }, [attendances, startMonth, endMonth]);

  const getMeetingAverage = (meeting: MeetingType) => {
    if (reports.length === 0) return 0;

    const monthlyAverages = reports.map((monthlyAttendance) => {
      const weekKeys = Object.keys(monthlyAttendance).filter((key) =>
        key.startsWith('week_')
      );

      const weeklyTotals = weekKeys
        .map((weekKey) => {
          const weeklyAttendanceData = monthlyAttendance[
            weekKey
          ] as WeeklyAttendance;
          const meetingAttendances = weeklyAttendanceData[meeting] ?? [];
          return meetingAttendances.reduce(
            (acc, current) =>
              acc + (current?.online ?? 0) + (current?.present ?? 0),
            0
          );
        })
        .filter((total) => total > 0);

      if (!weeklyTotals.length) return 0;

      return weeklyTotals.reduce((a, b) => a + b, 0) / weeklyTotals.length;
    });

    const validMonthlyAverages = monthlyAverages.filter((avg) => avg > 0);
    if (!validMonthlyAverages.length) return 0;

    return Math.round(
      validMonthlyAverages.reduce((a, b) => a + b, 0) /
        validMonthlyAverages.length
    );
  };

  return { getMeetingAverage };
};

export default useYearlyAttendance;
