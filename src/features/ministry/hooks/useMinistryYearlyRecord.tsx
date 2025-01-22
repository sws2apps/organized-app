import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { userFieldServiceMonthlyReportsState } from '@states/user_field_service_reports';
import { useCurrentUser } from '@hooks/index';
import { personIsEnrollmentActive } from '@services/app/persons';
import { formatDate } from '@services/dateformat';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { userLocalUIDState } from '@states/settings';

const useMinistryYearlyRecord = (year: string) => {
  const { person } = useCurrentUser();

  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const congReports = useRecoilValue(congFieldServiceReportsState);
  const userUID = useRecoilValue(userLocalUIDState);

  const start_month = useMemo(() => {
    const yearStart = +year - 1;
    return `${yearStart}/09`;
  }, [year]);

  const end_month = useMemo(() => {
    return `${year}/08`;
  }, [year]);

  const yearlyCongReports = useMemo(() => {
    const results = congReports.filter(
      (record) =>
        record.report_data.person_uid === userUID &&
        record.report_data.report_date <= end_month &&
        record.report_data.report_date >= start_month
    );

    return results;
  }, [congReports, start_month, end_month, userUID]);

  const yearlyUserReports = useMemo(() => {
    const results = reports.filter(
      (record) =>
        record.report_date <= end_month &&
        record.report_date >= start_month &&
        record.report_data.status !== 'pending' &&
        yearlyCongReports.some(
          (report) => report.report_data.report_date === record.report_date
        ) === false
    );

    return results;
  }, [reports, start_month, end_month, yearlyCongReports]);

  const hours_field_service = useMemo(() => {
    const congTotal = yearlyCongReports.reduce(
      (acc, current) => acc + current.report_data.hours.field_service,
      0
    );

    const userTotal = yearlyUserReports.reduce((acc, current) => {
      if (typeof current.report_data.hours.field_service === 'number') {
        acc += current.report_data.hours.field_service;
      }

      if (current.report_data.hours.field_service.monthly) {
        const daily = current.report_data.hours.field_service.daily;
        const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
        const totalDaily = hoursDaily * 60 + (minutesDaily || 0);

        const monthly = current.report_data.hours.field_service.monthly;
        const [hoursMonthly, minutesMonthly] = monthly.split(':').map(Number);
        const totalMonthly = hoursMonthly * 60 + (minutesMonthly || 0);

        const finalValue = totalDaily + totalMonthly;
        const minutesRemain = finalValue % 60;
        const hoursValue = (finalValue - minutesRemain) / 60;

        acc += hoursValue;
      }

      return acc;
    }, 0);

    return congTotal + userTotal;
  }, [yearlyCongReports, yearlyUserReports]);

  const hours_credit = useMemo(() => {
    const congTotal = yearlyCongReports.reduce(
      (acc, current) => acc + current.report_data.hours.credit.approved,
      0
    );

    const userTotal = yearlyUserReports.reduce((acc, current) => {
      if (current.report_data.hours.credit['approved']) {
        const approved = current.report_data.hours.credit['approved'] as number;

        if (approved > 0) {
          acc += approved;
        }

        if (approved === 0) {
          const value = current.report_data.hours.credit['value'] as number;
          acc += value;
        }
      }

      if (current.report_data.hours.credit.monthly) {
        const daily = current.report_data.hours.credit.daily;
        const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
        const totalDaily = hoursDaily * 60 + (minutesDaily || 0);

        const monthly = current.report_data.hours.credit.monthly;
        const [hoursMonthly, minutesMonthly] = monthly.split(':').map(Number);
        const totalMonthly = hoursMonthly * 60 + (minutesMonthly || 0);

        const finalValue = totalDaily + totalMonthly;
        const minutesRemain = finalValue % 60;
        const hoursValue = (finalValue - minutesRemain) / 60;

        acc += hoursValue;
      }

      return acc;
    }, 0);

    return congTotal + userTotal;
  }, [yearlyCongReports, yearlyUserReports]);

  const total_hours = useMemo(() => {
    return hours_field_service + hours_credit;
  }, [hours_field_service, hours_credit]);

  const hours = useMemo(() => {
    let avg = 0;

    const totalReports = yearlyCongReports.length + yearlyUserReports.length;

    if (totalReports > 0) {
      avg = Math.round(total_hours / totalReports);
    }

    return {
      total: total_hours,
      average: avg,
      field: hours_field_service,
      credit: hours_credit,
    };
  }, [
    yearlyCongReports,
    yearlyUserReports,
    total_hours,
    hours_field_service,
    hours_credit,
  ]);

  const bible_studies = useMemo(() => {
    const congStudies = yearlyCongReports.map(
      (record) => record.report_data.bible_studies
    );

    const userStudies = yearlyUserReports.map((record) => {
      if (typeof record.report_data.bible_studies === 'number') {
        return record.report_data.bible_studies as number;
      }

      if (record.report_data.bible_studies.monthly) {
        const records = record.report_data.bible_studies.records.length;
        const daily = record.report_data.bible_studies.daily;
        const monthly = record.report_data.bible_studies.monthly;
        const total = daily + monthly;

        return total < records ? records : total;
      }
    });

    const studies = [...congStudies, ...userStudies].sort((a, b) => b - a);

    const sumStudies = studies.reduce((acc, current) => acc + current, 0);

    let avg = 0;

    if (studies.length > 0) {
      avg = Math.round(sumStudies / studies.length);
    }

    return { average: avg, peak: studies.at(0) || 0 };
  }, [yearlyCongReports, yearlyUserReports]);

  const isFR = useMemo(() => {
    let value = false;
    let currentMonth = start_month;

    do {
      value = personIsEnrollmentActive(person, 'FR', currentMonth);

      if (value) break;

      const date = new Date(`${currentMonth}/01`);
      date.setMonth(date.getMonth() + 1);

      currentMonth = formatDate(date, 'yyyy/MM');
    } while (currentMonth <= end_month);

    return value;
  }, [person, start_month, end_month]);

  const isFS = useMemo(() => {
    let value = false;
    let currentMonth = start_month;

    do {
      value = personIsEnrollmentActive(person, 'FS', currentMonth);

      if (value) break;

      const date = new Date(`${currentMonth}/01`);
      date.setMonth(date.getMonth() + 1);

      currentMonth = formatDate(date, 'yyyy/MM');
    } while (currentMonth <= end_month);

    return value;
  }, [person, start_month, end_month]);

  const isFMF = useMemo(() => {
    let value = false;
    let currentMonth = start_month;

    do {
      value = personIsEnrollmentActive(person, 'FMF', currentMonth);

      if (value) break;

      const date = new Date(`${currentMonth}/01`);
      date.setMonth(date.getMonth() + 1);

      currentMonth = formatDate(date, 'yyyy/MM');
    } while (currentMonth <= end_month);

    return value;
  }, [person, start_month, end_month]);

  const hoursEnabled = useMemo(() => {
    return isFR || isFMF || isFS;
  }, [isFR, isFS, isFMF]);

  return {
    start_month,
    end_month,
    hours,
    bible_studies,
    hoursEnabled,
    isFR,
    yearlyReports: yearlyUserReports,
    yearlyCongReports,
  };
};

export default useMinistryYearlyRecord;
