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

  return `${sumHours}:${String(remain).padStart(2, '0')}`;
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

  const remain = sumMinutes % 60;
  sumHours += (sumMinutes - remain) / 60;

  return `${sumHours}:${String(remain).padStart(2, '0')}`;
};

const refreshBibleStudies = (reports: UserFieldServiceDailyReportType[]) => {
  const values = reports
    .filter((record) => record.report_data.bible_studies.value > 0)
    .map((record) => record.report_data.bible_studies.value);

  const count = values.length;
  const total = values.reduce((total, current) => total + current, 0);

  const average = Math.round(total / count);

  const bsRecords = reports
    .filter((record) => record.report_data.bible_studies.records.length > 0)
    .map((record) => record.report_data.bible_studies.records)
    .reduce((acc, current) => {
      acc.push(...current);
      return acc;
    }, []);

  const nonDupRecords = Array.from(new Set(bsRecords)).length;

  return {
    count: average > nonDupRecords ? average : nonDupRecords,
    records: bsRecords,
  };
};

export const refreshSharedMinistry = (
  report: UserFieldServiceMonthlyReportType
) => {
  let hours = 0;
  let hoursCredit = 0;
  let bibleStudies = 0;

  // support previous data format
  if (typeof report.report_data.hours.field_service === 'number') {
    hours = report.report_data.hours.field_service;
  }

  if (
    report.report_data.hours.credit['value'] &&
    typeof report.report_data.hours.credit['value'] === 'number'
  ) {
    hoursCredit = report.report_data.hours.credit['value'];
  }

  if (typeof report.report_data.bible_studies === 'number') {
    bibleStudies = report.report_data.bible_studies;
  }

  // new data format
  if (report.report_data.hours.field_service?.daily) {
    const [dailyHours, dailyMinutes] =
      report.report_data.hours.field_service.daily.split(':').map(Number);
    hours = dailyHours + dailyMinutes / 60;
  }

  if (report.report_data.hours.field_service?.monthly) {
    const [monthlyHours, monthlyMinutes] =
      report.report_data.hours.field_service.monthly.split(':').map(Number);
    hours += monthlyHours + monthlyMinutes / 60;
  }

  if (report.report_data.hours.credit?.daily) {
    const [dailyHours, dailyMinutes] = report.report_data.hours.credit.daily
      .split(':')
      .map(Number);
    hoursCredit = dailyHours + dailyMinutes / 60;
  }

  if (report.report_data.hours.credit?.monthly) {
    const [monthlyHours, monthlyMinutes] =
      report.report_data.hours.credit.monthly.split(':').map(Number);
    hoursCredit += monthlyHours + monthlyMinutes / 60;
  }

  if (report.report_data.bible_studies?.daily) {
    const daily = report.report_data.bible_studies.daily;
    const monthly = report.report_data.bible_studies?.monthly || 0;
    const total = daily + monthly;

    const recordsLength = report.report_data.bible_studies?.records.length || 0;

    bibleStudies = total < recordsLength ? recordsLength : total;
  }

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

  monthReport.report_data.hours.field_service.daily =
    refreshHours(dailyReports);

  monthReport.report_data.hours.credit.daily = refreshHoursCredit(dailyReports);

  const bs = refreshBibleStudies(dailyReports);

  monthReport.report_data.bible_studies.daily = bs.count;

  const names = monthReport.report_data.bible_studies.records;

  monthReport.report_data.bible_studies.records = Array.from(
    new Set([...names, ...bs.records])
  );

  if (!monthReport.report_data.shared_ministry) {
    monthReport.report_data.shared_ministry =
      refreshSharedMinistry(monthReport);
  }

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
