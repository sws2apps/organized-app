import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { userFieldServiceMonthlyReportsState } from '@states/user_field_service_reports';
import { useCurrentUser } from '@hooks/index';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { userLocalUIDState } from '@states/settings';
import { formatDate } from '@utils/date';
import usePerson from '@features/persons/hooks/usePerson';

const useMinistryYearlyRecord = (year: string) => {
  const { person } = useCurrentUser();

  const { personIsEnrollmentActive } = usePerson();

  const reports = useAtomValue(userFieldServiceMonthlyReportsState);
  const congReports = useAtomValue(congFieldServiceReportsState);
  const userUID = useAtomValue(userLocalUIDState);

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

  const yearlyCongReportsFulltime = useMemo(() => {
    const results = congReports.filter((record) => {
      if (record.report_data.person_uid !== userUID) return false;

      const isFR = personIsEnrollmentActive(
        person,
        'FR',
        record.report_data.report_date
      );

      if (!isFR) return false;

      return (
        record.report_data.report_date <= end_month &&
        record.report_data.report_date >= start_month
      );
    });

    return results;
  }, [
    congReports,
    start_month,
    end_month,
    userUID,
    personIsEnrollmentActive,
    person,
  ]);

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

  const yearlyUserReportsFulltime = useMemo(() => {
    const results = reports.filter((record) => {
      if (record.report_data.status === 'pending') return false;

      if (
        yearlyCongReports.some(
          (report) => report.report_data.report_date === record.report_date
        )
      ) {
        return false;
      }

      const isFR = personIsEnrollmentActive(person, 'FR', record.report_date);

      if (!isFR) return false;

      return (
        record.report_date <= end_month && record.report_date >= start_month
      );
    });

    return results;
  }, [
    reports,
    start_month,
    end_month,
    yearlyCongReports,
    personIsEnrollmentActive,
    person,
  ]);

  const hours_field_service = useMemo(() => {
    const congTotal = yearlyCongReports.reduce((acc, current) => {
      const isAP = personIsEnrollmentActive(
        person,
        'AP',
        current.report_data.report_date
      );

      const isFR = personIsEnrollmentActive(
        person,
        'FR',
        current.report_data.report_date
      );

      const isFS = personIsEnrollmentActive(
        person,
        'FS',
        current.report_data.report_date
      );

      const isFMF = personIsEnrollmentActive(
        person,
        'FMF',
        current.report_data.report_date
      );

      if (!isAP && !isFR && !isFS && !isFMF) {
        return acc;
      }

      return acc + current.report_data.hours.field_service;
    }, 0);

    const userTotal = yearlyUserReports.reduce((acc, current) => {
      const isAP = personIsEnrollmentActive(person, 'AP', current.report_date);

      const isFR = personIsEnrollmentActive(person, 'FR', current.report_date);

      const isFS = personIsEnrollmentActive(person, 'FS', current.report_date);

      const isFMF = personIsEnrollmentActive(
        person,
        'FMF',
        current.report_date
      );

      if (!isAP && !isFR && !isFS && !isFMF) {
        return acc;
      }

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
  }, [yearlyCongReports, yearlyUserReports, person, personIsEnrollmentActive]);

  const hours_fulltime_field_service = useMemo(() => {
    const congTotal = yearlyCongReportsFulltime.reduce((acc, current) => {
      return acc + current.report_data.hours.field_service;
    }, 0);

    const userTotal = yearlyUserReportsFulltime.reduce((acc, current) => {
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
  }, [yearlyCongReportsFulltime, yearlyUserReportsFulltime]);

  const hours_credit = useMemo(() => {
    const congTotal = yearlyCongReports.reduce((acc, current) => {
      const isFR = personIsEnrollmentActive(
        person,
        'FR',
        current.report_data.report_date
      );

      if (!isFR) return acc;

      return acc + current.report_data.hours.credit.approved;
    }, 0);

    const userTotal = yearlyUserReports.reduce((acc, current) => {
      const isFR = personIsEnrollmentActive(person, 'FR', current.report_date);

      if (!isFR) return acc;

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
  }, [yearlyCongReports, yearlyUserReports, personIsEnrollmentActive, person]);

  const total_hours = useMemo(() => {
    return hours_field_service + hours_credit;
  }, [hours_field_service, hours_credit]);

  const total_fulltime_hours = useMemo(() => {
    return hours_fulltime_field_service + hours_credit;
  }, [hours_fulltime_field_service, hours_credit]);

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

  const hours_fulltime = useMemo(() => {
    let avg = 0;

    const totalReports =
      yearlyCongReportsFulltime.length + yearlyUserReportsFulltime.length;

    if (totalReports > 0) {
      avg = Math.round(total_fulltime_hours / totalReports);
    }

    return {
      total: total_fulltime_hours,
      average: avg,
      field: hours_fulltime_field_service,
      credit: hours_credit,
    };
  }, [
    yearlyCongReportsFulltime,
    yearlyUserReportsFulltime,
    total_fulltime_hours,
    hours_fulltime_field_service,
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
  }, [person, start_month, end_month, personIsEnrollmentActive]);

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
  }, [person, start_month, end_month, personIsEnrollmentActive]);

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
  }, [person, start_month, end_month, personIsEnrollmentActive]);

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
    hours_fulltime,
  };
};

export default useMinistryYearlyRecord;
