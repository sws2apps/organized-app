import { debounce } from '@utils/common';
import {
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
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
    .filter((record) => record.report_data.hours.field_service.length > 0)
    .map((record) => record.report_data.hours.field_service.split(':'));

  let sumHours = hoursMinutes.reduce((prev, current) => prev + +current[0], 0);

  const sumMinutes = hoursMinutes.reduce(
    (prev, current) => prev + +current[1],
    0
  );

  const remain = sumMinutes % 60;
  sumHours += (sumMinutes - remain) / 60;

  return sumHours;
};

const refreshHoursCredit = (reports: UserFieldServiceDailyReportType[]) => {
  const hoursMinutes = reports
    .filter((record) => record.report_data.hours.credit.length > 0)
    .map((record) => record.report_data.hours.credit.split(':'));

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
  const values = reports
    .filter((record) => record.report_data.bible_studies.value > 0)
    .map((record) => record.report_data.bible_studies.value);

  const total = values.reduce((total, current) => total + current, 0);

  return total;
};

export const refreshSharedMinistry = (
  report: UserFieldServiceMonthlyReportType
) => {
  const hours = report.report_data.hours.field_service;

  const hoursCredit = report.report_data.hours.credit.value;

  const bibleStudies = report.report_data.bible_studies;

  if (hours === 0 && hoursCredit === 0 && bibleStudies === 0) {
    return false;
  }

  return true;
};

export const handleSaveDailyFieldServiceReport = async (
  report: UserFieldServiceDailyReportType
) => {
  let comments = report.report_data.comments;

  const dailyReport = structuredClone(report);
  dailyReport.report_data.comments = '';

  await dbUserFieldServiceReportsSave(dailyReport);

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

  monthReport.report_data.hours.field_service = refreshHours(dailyReports);
  monthReport.report_data.hours.credit.value = refreshHoursCredit(dailyReports);
  monthReport.report_data.bible_studies = refreshBibleStudies(dailyReports);
  monthReport.report_data.shared_ministry = refreshSharedMinistry(monthReport);
  monthReport.report_data.updatedAt = new Date().toISOString();

  if (comments.length > 0) {
    const monthComments = monthReport.report_data.comments;
    comments = comments.replace(
      '{{ hours }}',
      report.report_data.hours.credit.split(':')[0]
    );

    if (monthComments.length === 0) {
      monthReport.report_data.comments = comments;
    }

    if (monthComments.length > 0) {
      monthReport.report_data.comments = `${comments}; ${monthComments}`;
    }
  }

  await dbUserFieldServiceReportsSave(monthReport);
};
