import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  userFieldServiceDailyReportsState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { monthNamesState } from '@states/app';

const useMinistryMonthlyRecord = (month: string) => {
  const bibleStudies = useRecoilValue(userBibleStudiesState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const dailyReports = useRecoilValue(userFieldServiceDailyReportsState);
  const monthNames = useRecoilValue(monthNamesState);

  const monthname = useMemo(() => {
    if (!month) return '';

    const monthIndex = +month.split('/')[1] - 1;
    return monthNames[monthIndex];
  }, [monthNames, month]);

  const monthReport = useMemo(() => {
    return monthlyReports.find((record) => record.report_date === month);
  }, [monthlyReports, month]);

  const monthDailyRecords = useMemo(() => {
    return dailyReports.filter((record) => record.report_date.includes(month));
  }, [dailyReports, month]);

  const minutes_remains = useMemo(() => {
    const hoursMinutes = monthDailyRecords
      .filter((record) => record.report_data.hours.field_service.length > 0)
      .map((record) => record.report_data.hours.field_service.split(':'));

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    return sumMinutes % 60;
  }, [monthDailyRecords]);

  const hours = useMemo(() => {
    if (!monthReport) return 0;

    return monthReport.report_data.hours.field_service;
  }, [monthReport]);

  const hours_credit = useMemo(() => {
    if (!monthReport) return 0;

    const approved = monthReport.report_data.hours.credit.approved;

    if (approved > 0) {
      return approved;
    }

    return monthReport.report_data.hours.credit.value;
  }, [monthReport]);

  const total_hours = useMemo(() => {
    return hours + hours_credit;
  }, [hours, hours_credit]);

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
    if (!monthReport) return 0;

    return monthReport.report_data.bible_studies;
  }, [monthReport]);

  const shared_ministry = useMemo(() => {
    if (!monthReport) return false;

    return monthReport.report_data.shared_ministry;
  }, [monthReport]);

  const comments = useMemo(() => {
    if (!monthReport) return '';

    return monthReport.report_data.comments;
  }, [monthReport]);

  const status = useMemo(() => {
    if (!monthReport) return 'pending';

    return monthReport.report_data.status;
  }, [monthReport]);

  return {
    shared_ministry,
    hours,
    minutes_remains,
    bible_studies_names,
    bible_studies,
    comments,
    monthname,
    status,
    hours_credit,
    total_hours,
  };
};

export default useMinistryMonthlyRecord;
