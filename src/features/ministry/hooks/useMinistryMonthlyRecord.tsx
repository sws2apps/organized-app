import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  userFieldServiceDailyReportsState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import {
  PioneerMonthlyEventReportType,
  UserFieldServiceMonthlyReportType,
} from '@definition/user_field_service_reports';
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
      .filter((record) => record.report_data.hours.length > 0)
      .map((record) => record.report_data.hours.split(':'));

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    return sumMinutes % 60;
  }, [monthDailyRecords]);

  const hours = useMemo(() => {
    if (!monthReport) return 0;

    return monthReport.report_data.hours;
  }, [monthReport]);

  const approved_assignments = useMemo(() => {
    if (!monthReport) return 0;

    return monthReport.report_data.hours_credits.approved_assignments.total;
  }, [monthReport]);

  const approved_assignments_included = useMemo(() => {
    if (!monthReport) return 0;

    return monthReport.report_data.hours_credits.approved_assignments.credit;
  }, [monthReport]);

  const hours_credits = useMemo(() => {
    if (!monthReport) return [];

    const events = monthReport.report_data.hours_credits.events;
    const group = events.reduce(
      (acc: PioneerMonthlyEventReportType[], current) => {
        const event = acc.find((record) => record.event === current.event);

        if (!event) {
          acc.push({ event: current.event, value: current.value });
        }

        if (event) {
          event.value += current.value;
        }

        return acc;
      },
      []
    );

    return group;
  }, [monthReport]);

  const hours_credits_total = useMemo(() => {
    const total = hours_credits.reduce(
      (acc, current) => acc + current.value,
      0
    );
    return total;
  }, [hours_credits]);

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

    return 0;
  }, [monthReport, bible_studies_names]);

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

  const refreshSharedMinistry = (report: UserFieldServiceMonthlyReportType) => {
    const hours = report.report_data.hours;
    const approvedAssignments =
      report.report_data.hours_credits.approved_assignments.total;
    const hoursCredits = report.report_data.hours_credits.events.reduce(
      (acc, current) => acc + current.value,
      0
    );
    const bibleStudies = report.report_data.bible_studies;

    if (
      hours === 0 &&
      approvedAssignments === 0 &&
      hoursCredits === 0 &&
      bibleStudies === 0
    ) {
      return false;
    }

    return true;
  };

  return {
    shared_ministry,
    hours,
    minutes_remains,
    approved_assignments,
    hours_credits,
    bible_studies_names,
    bible_studies,
    comments,
    refreshSharedMinistry,
    approved_assignments_included,
    monthname,
    hours_credits_total,
    status,
  };
};

export default useMinistryMonthlyRecord;
