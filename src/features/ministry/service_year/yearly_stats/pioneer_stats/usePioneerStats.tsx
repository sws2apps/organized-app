import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import {
  computeMonthsDiff,
  convertMinutesToLongTime,
  createArrayFromMonths,
  currentMonthServiceYear,
  currentServiceYear,
  formatDate,
} from '@utils/date';
import { userFieldServiceMonthlyReportsState } from '@states/user_field_service_reports';
import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import usePerson from '@features/persons/hooks/usePerson';

const usePioneerStats = (year: string) => {
  const { person } = useCurrentUser();

  const { personIsEnrollmentActive } = usePerson();

  const {
    start_month,
    end_month,
    hours_fulltime,
    yearlyReports,
    yearlyCongReports,
  } = useMinistryYearlyRecord(year);

  const reports = useAtomValue(userFieldServiceMonthlyReportsState);

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

  const minutes_left = useMemo(() => {
    if (hours_fulltime.total > goal) return 0;

    const sumHours = goal - hours_fulltime.total;

    if (!isCurrentSY) return sumHours * 60;

    const remainingMinutes = sumHours * 60;

    const [hoursCurrent, minutesCurrent] = hours_total.split(':').map(Number);
    const currentMinutes = hoursCurrent * 60 + (minutesCurrent || 0);

    return Math.max(remainingMinutes - currentMinutes, 0);
  }, [hours_fulltime, goal, hours_total, isCurrentSY]);

  const hours_left = useMemo(() => {
    return convertMinutesToLongTime(minutes_left);
  }, [minutes_left]);

  const hours_balance = useMemo(() => {
    let balance = 0;

    for (const report of yearlyCongReports) {
      const isFR = personIsEnrollmentActive(
        person,
        'FR',
        report.report_data.report_date
      );

      if (!isFR) continue;

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

      const isFR = personIsEnrollmentActive(person, 'FR', report.report_date);

      if (!isFR) continue;

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
  }, [yearlyReports, yearlyCongReports, personIsEnrollmentActive, person]);

  const monthly_goal = useMemo(() => {
    if (!isCurrentSY) return '0';

    const currentMonth = formatDate(new Date(), 'yyyy/MM');
    const endDate = formatDate(new Date(`${end_month}/01`), 'yyyy/MM');

    let months = createArrayFromMonths(currentMonth, endDate);

    months = months.filter((month) => {
      const foundReport = reports.find(
        (report) => report.report_date === month
      );

      if (!foundReport) return true;

      return foundReport.report_data.status === 'pending';
    });

    if (months.length === 0) return '0:00';

    const value = Math.round(minutes_left / months.length);

    return convertMinutesToLongTime(value);
  }, [end_month, reports, minutes_left, isCurrentSY]);

  return {
    goal,
    hours_left,
    isCurrentSY,
    hours_balance,
    monthly_goal,
  };
};

export default usePioneerStats;
