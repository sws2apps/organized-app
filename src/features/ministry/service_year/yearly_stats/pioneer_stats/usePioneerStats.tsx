import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';
import { formatDate } from '@services/dateformat';
import {
  computeMonthsDiff,
  currentMonthServiceYear,
  currentServiceYear,
} from '@utils/date';
import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const usePioneerStats = (year: string) => {
  const { person } = useCurrentUser();

  const { start_month, end_month, hours, yearlyReports } =
    useMinistryYearlyRecord(year);

  const currentReport = useMemo(() => {
    return currentMonthServiceYear();
  }, []);

  const { total_hours, minutes_remains } =
    useMinistryMonthlyRecord(currentReport);

  const current_hours = useMemo(() => {
    return `${total_hours}:${String(minutes_remains).padStart(2, '0')}`;
  }, [total_hours, minutes_remains]);

  const isCurrentSY = useMemo(() => {
    const currentSY = currentServiceYear();
    return year === currentSY;
  }, [year]);

  const goal = useMemo(() => {
    const enrollment = person!.person_data.enrollments.find((record) => {
      if (record._deleted) return false;

      if (record.enrollment === 'FR') {
        let startDate = formatDate(new Date(record.start_date), 'yyyy/MM');

        let endDate = '';

        if (record.end_date === null) {
          startDate = start_month;
          endDate = end_month;
        }

        if (record.end_date) {
          endDate = formatDate(new Date(record.end_date), 'yyyy/MM');
        }

        return startDate >= start_month && endDate <= end_month;
      }

      return false;
    });

    if (!enrollment) return 0;

    let tmpStart = formatDate(new Date(enrollment.start_date), 'yyyy/MM');

    if (tmpStart < start_month) {
      tmpStart = start_month;
    }

    const startDate = new Date(tmpStart);
    const endDate = new Date(`${end_month}/01`);

    const monthDiff = computeMonthsDiff(startDate, endDate) + 1;

    return monthDiff * 50;
  }, [person, start_month, end_month]);

  const hours_left = useMemo(() => {
    if (hours.total > goal) return 0;

    let sumHours = goal - hours.total;

    if (!isCurrentSY) return sumHours;

    sumHours = sumHours - total_hours;
    let sumMinutes = minutes_remains;

    if (sumMinutes > 0) {
      sumMinutes = 60 - sumMinutes;
      sumHours = sumHours - 1;
    }

    return `${sumHours}:${String(sumMinutes).padStart(2, '0')}`;
  }, [hours, goal, total_hours, minutes_remains, isCurrentSY]);

  const hours_balance = useMemo(() => {
    let balance = 0;

    for (const report of yearlyReports) {
      let totalHours = report.report_data.hours.field_service;

      if (report.report_data.hours.credit.approved > 0) {
        totalHours += report.report_data.hours.credit.approved;
      }

      if (report.report_data.hours.credit.approved === 0) {
        totalHours += report.report_data.hours.credit.value;
      }

      balance += totalHours - 50;
    }

    if (balance === 0) return 0;

    return balance > 0 ? `+${balance}` : balance.toString();
  }, [yearlyReports]);

  return { goal, hours_left, isCurrentSY, current_hours, hours_balance };
};

export default usePioneerStats;
