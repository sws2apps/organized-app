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

  const { start_month, end_month, hours, yearlyReports, yearlyCongReports } =
    useMinistryYearlyRecord(year);

  const currentReport = useMemo(() => {
    return currentMonthServiceYear();
  }, []);

  const { hours_total } = useMinistryMonthlyRecord({
    month: currentReport,
    person_uid: person.person_uid,
    publisher: true,
  });

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

    const sumHours = goal - hours.total;

    if (!isCurrentSY) return sumHours;

    const remainingMinutes = sumHours * 60;

    const [hoursCurrent, minutesCurrent] = hours_total.split(':').map(Number);
    const currentMinutes = hoursCurrent * 60 + (minutesCurrent || 0);

    const finalMinutes = remainingMinutes - currentMinutes;

    const minutesValue = finalMinutes % 60;
    const hoursValue = (finalMinutes - minutesValue) / 60;

    return `${hoursValue}:${String(minutesValue).padStart(2, '0')}`;
  }, [hours, goal, hours_total, isCurrentSY]);

  const hours_balance = useMemo(() => {
    let balance = 0;

    for (const report of yearlyCongReports) {
      let totalHours = report.report_data.hours.field_service;

      const approved = report.report_data.hours.credit.approved;

      if (approved > 0) {
        totalHours += approved;
      }

      if (approved === 0) {
        const value = report.report_data.hours.credit.value;
        totalHours += value;
      }

      balance += totalHours - 50;
    }

    for (const report of yearlyReports) {
      let totalHours = 0;

      if (typeof report.report_data.hours.field_service === 'number') {
        totalHours = report.report_data.hours.field_service as number;

        const approved = report.report_data.hours.credit['approved'] as number;

        if (approved > 0) {
          totalHours += approved;
        }

        if (approved === 0) {
          const value = report.report_data.hours.credit['value'] as number;
          totalHours += value;
        }
      }

      if (report.report_data.hours.field_service.monthly) {
        const daily = report.report_data.hours.field_service.daily;
        const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
        const totalDaily = hoursDaily * 60 + (minutesDaily || 0);

        const monthly = report.report_data.hours.field_service.monthly;
        const [hoursMonthly, minutesMonthly] = monthly.split(':').map(Number);
        const totalMonthly = hoursMonthly * 60 + (minutesMonthly || 0);

        const finalValue = totalDaily + totalMonthly;
        const minutesRemain = finalValue % 60;
        totalHours = (finalValue - minutesRemain) / 60;
      }

      balance += totalHours - 50;
    }

    if (balance === 0) return 0;

    return balance > 0 ? `+${balance}` : balance.toString();
  }, [yearlyReports, yearlyCongReports]);

  return { goal, hours_left, isCurrentSY, hours_total, hours_balance };
};

export default usePioneerStats;
