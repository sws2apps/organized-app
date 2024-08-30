import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { promiseGetRecoil } from 'recoil-outside';
import {
  userFieldServiceDailyReportsState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { EventHoursType } from './index.types';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';

const useMinistryMonthlyRecord = (month: string) => {
  const bibleStudies = useRecoilValue(userBibleStudiesState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const dailyReports = useRecoilValue(userFieldServiceDailyReportsState);

  const monthReport = useMemo(() => {
    return monthlyReports.find((record) => record.report_date === month);
  }, [monthlyReports, month]);

  const monthDailyRecords = useMemo(() => {
    return dailyReports.filter((record) => record.report_date.includes(month));
  }, [dailyReports, month]);

  const minutes_remains = useMemo(() => {
    const hoursMinutes = monthDailyRecords
      .filter((record) => record.report_data.hours.length > 0)
      .map((record) => record.report_data.hours.split(':'));

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    return sumMinutes % 60;
  }, [monthDailyRecords]);

  const hours = useMemo(() => {
    // check if month reports already exists
    if (monthReport) {
      return monthReport.report_data.hours;
    }

    // default to daily reports to determine the value
    const hoursMinutes = monthDailyRecords
      .filter((record) => record.report_data.hours.length > 0)
      .map((record) => record.report_data.hours.split(':'));

    let sumHours = hoursMinutes.reduce(
      (prev, current) => prev + +current[0],
      0
    );

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    const remain = sumMinutes % 60;
    sumHours += (sumMinutes - remain) / 60;

    return sumHours;
  }, [monthReport, monthDailyRecords]);

  const approved_assignments = useMemo(() => {
    // check if month reports already exists
    if (monthReport) {
      return monthReport.report_data.hours_credits.approved_assignments;
    }

    // default to daily reports to determine the value
    const hoursMinutes = monthDailyRecords
      .filter((record) => record.report_data.approved_assignments.length > 0)
      .map((record) => record.report_data.approved_assignments.split(':'));

    let sumHours = hoursMinutes.reduce(
      (prev: number, current) => prev + +current[0],
      0
    );

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    sumHours += Math.round(sumMinutes / 60);

    return sumHours;
  }, [monthReport, monthDailyRecords]);

  const hours_credits = useMemo(() => {
    if (!monthReport) return [];

    const events = monthReport.report_data.hours_credits.events;
    const group = events.reduce((acc: EventHoursType[], current) => {
      const event = acc.find((record) => record.event === current.event);

      if (!event) {
        acc.push({ event: current.event, value: current.value });
      }

      if (event) {
        event.value += current.value;
      }

      return acc;
    }, []);

    return group;
  }, [monthReport]);

  const bible_studies_names = useMemo(() => {
    const results: string[] = [];

    const bibleStudiesWithNames = monthDailyRecords
      .filter((record) => record.report_data.bible_studies.records.length > 0)
      .reduce((names: string[], current) => {
        for (const name of current.report_data.bible_studies.records) {
          const found = names.find((record) => record === name);

          if (!found) {
            names.push(name);
          }
        }

        return names;
      }, []);

    for (const record of bibleStudiesWithNames) {
      const person = bibleStudies.find((study) => study.person_uid === record);
      if (person) {
        results.push(person.person_data.person_name);
      }
    }

    return results;
  }, [monthDailyRecords, bibleStudies]);

  const bible_studies = useMemo(() => {
    // check if month reports already exists
    if (monthReport) {
      return monthReport.report_data.bible_studies;
    }

    // check if we have named bible studies
    if (bible_studies_names.length > 0) {
      return bible_studies_names.length;
    }

    // otherwise calculate the average
    const values = monthDailyRecords
      .filter((record) => record.report_data.bible_studies.value > 0)
      .map((record) => record.report_data.bible_studies.value);

    if (values.length > 0) {
      const sumValues = values.reduce((total, current) => total + current, 0);
      return Math.round(sumValues / values.length);
    }

    return 0;
  }, [monthReport, monthDailyRecords, bible_studies_names]);

  const shared_ministry = useMemo(() => {
    // check if month reports already exists
    if (monthReport) {
      return monthReport.report_data.shared_ministry;
    }

    // default to daily reports to determine the value
    const sumHoursCredit = hours_credits.reduce(
      (acc, current) => acc + current.value,
      0
    );

    if (
      minutes_remains === 0 &&
      hours === 0 &&
      approved_assignments === 0 &&
      bible_studies === 0 &&
      sumHoursCredit === 0
    ) {
      return false;
    }

    return true;
  }, [
    monthReport,
    hours_credits,
    minutes_remains,
    hours,
    approved_assignments,
    bible_studies,
  ]);

  const refreshHours = (reports: UserFieldServiceDailyReportType[]) => {
    const hoursMinutes = reports
      .filter((record) => record.report_data.hours.length > 0)
      .map((record) => record.report_data.hours.split(':'));

    let sumHours = hoursMinutes.reduce(
      (prev, current) => prev + +current[0],
      0
    );

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    const remain = sumMinutes % 60;
    sumHours += (sumMinutes - remain) / 60;

    return sumHours;
  };

  const refreshApprovedAssignments = (
    reports: UserFieldServiceDailyReportType[]
  ) => {
    const hoursMinutes = reports
      .filter((record) => record.report_data.approved_assignments.length > 0)
      .map((record) => record.report_data.approved_assignments.split(':'));

    let sumHours = hoursMinutes.reduce(
      (prev: number, current) => prev + +current[0],
      0
    );

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    sumHours += Math.round(sumMinutes / 60);

    return sumHours;
  };

  const refreshBibleStudies = (reports: UserFieldServiceDailyReportType[]) => {
    const results: string[] = [];

    const bibleStudiesWithNames = reports
      .filter((record) => record.report_data.bible_studies.records.length > 0)
      .reduce((names: string[], current) => {
        for (const name of current.report_data.bible_studies.records) {
          const found = names.find((record) => record === name);

          if (!found) {
            names.push(name);
          }
        }

        return names;
      }, []);

    for (const record of bibleStudiesWithNames) {
      const person = bibleStudies.find((study) => study.person_uid === record);
      if (person) {
        results.push(person.person_data.person_name);
      }
    }

    if (results.length > 0) {
      return bible_studies_names.length;
    }

    // otherwise calculate the average
    const values = reports
      .filter((record) => record.report_data.bible_studies.value > 0)
      .map((record) => record.report_data.bible_studies.value);

    if (values.length > 0) {
      const sumValues = values.reduce((total, current) => total + current, 0);
      return Math.round(sumValues / values.length);
    }

    return 0;
  };

  const refreshMonthlyReport = async () => {
    const reports: UserFieldServiceDailyReportType[] = await promiseGetRecoil(
      userFieldServiceDailyReportsState
    );

    const dailyReports = reports.filter((record) =>
      record.report_date.includes(month)
    );

    const report = structuredClone(monthReport);
    report.report_data.hours = refreshHours(dailyReports);
    report.report_data.hours_credits.approved_assignments =
      refreshApprovedAssignments(dailyReports);
    report.report_data.bible_studies = refreshBibleStudies(dailyReports);
    report.report_data.updatedAt = new Date().toISOString();

    return report;
  };

  const comments = useMemo(() => {
    if (!monthReport) return '';

    return monthReport.report_data.comments;
  }, [monthReport]);

  return {
    shared_ministry,
    hours,
    minutes_remains,
    approved_assignments,
    hours_credits,
    bible_studies_names,
    bible_studies,
    comments,
    refreshMonthlyReport,
  };
};

export default useMinistryMonthlyRecord;
