import { debounce } from '@utils/common';
import {
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
  UserFieldServiceReportType,
} from '@definition/user_field_service_reports';
import {
  dbUserFieldServiceReportsGet,
  dbUserFieldServiceReportsSave,
} from '@services/dexie/user_field_service_reports';
import { userFieldServiceMonthlyReportSchema } from '@services/dexie/schema';

const handleSaveUserFieldServiceReports = async (
  report: UserFieldServiceMonthlyReportType
) => {
  await dbUserFieldServiceReportsSave(report);
};

export const debounceUserFieldServiceSave = debounce(
  handleSaveUserFieldServiceReports,
  500
);

const refreshHours = (reports: UserFieldServiceDailyReportType[]) => {
  const hoursMinutes = reports
    .filter((record) => record.report_data.hours.length > 0)
    .map((record) => record.report_data.hours.split(':'));

  let sumHours = hoursMinutes.reduce((prev, current) => prev + +current[0], 0);

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
  const results = reports
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

  if (results.length > 0) {
    return results.length;
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

export const handleSaveDailyFieldServiceReport = async (
  report: UserFieldServiceReportType
) => {
  await dbUserFieldServiceReportsSave(report);

  // refresh monthly
  const reports = await dbUserFieldServiceReportsGet();

  const month = report.report_date.slice(0, 7);
  let monthReport = reports.find(
    (record) => record.report_date === month
  ) as UserFieldServiceMonthlyReportType;

  if (!monthReport) {
    monthReport = structuredClone(userFieldServiceMonthlyReportSchema);
    monthReport.report_date = month;
  }

  if (monthReport) {
    monthReport = structuredClone(monthReport);
  }

  const dailyReports = reports.filter(
    (record) =>
      record.report_date.includes(month) && record.report_date !== month
  ) as UserFieldServiceDailyReportType[];

  monthReport.report_data.hours = refreshHours(dailyReports);
  monthReport.report_data.hours_credits.approved_assignments.total =
    refreshApprovedAssignments(dailyReports);
  monthReport.report_data.bible_studies = refreshBibleStudies(dailyReports);
  monthReport.report_data.updatedAt = new Date().toISOString();
  monthReport.report_data.shared_ministry = refreshSharedMinistry(monthReport);

  await dbUserFieldServiceReportsSave(monthReport);
};
