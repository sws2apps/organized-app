import {
  UserFieldServiceDailyReportType,
  UserFieldServiceReportType,
} from '@definition/user_field_service_reports';
import { formatDate } from '@utils/date';
import { store } from '@states/index';
import { userMinistryTimerState } from '@states/user_field_service_reports';
import appDb from '@db/appDb';

const dbUpdateUserFieldServiceReportsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.user_field_service_reports = {
    ...metadata.metadata.user_field_service_reports,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbUserFieldServiceReportsGet = async () => {
  const data = await appDb.user_field_service_reports.toArray();
  return data.filter((record) => !record.report_data._deleted);
};

export const dbUserFieldServiceReportsSave = async (
  report: UserFieldServiceReportType
) => {
  await appDb.user_field_service_reports.put(report);
  await dbUpdateUserFieldServiceReportsMetadata();
};

export const dbUserFieldServiceReportsBulkSave = async (
  reports: UserFieldServiceReportType[]
) => {
  await appDb.user_field_service_reports.bulkPut(reports);
  await dbUpdateUserFieldServiceReportsMetadata();
};

export const dbUserFieldServiceReportsClear = async () => {
  const records = await appDb.user_field_service_reports.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record.report_data._deleted = true;
    record.report_data.updatedAt = new Date().toISOString();
  }

  await appDb.user_field_service_reports.bulkPut(records);
};

export const dbUserFieldServiceReportsRemoveEmpty = async () => {
  const records = await appDb.user_field_service_reports.toArray();

  const dailyRecords = records.filter(
    (record) => record.report_data.record_type === 'daily'
  ) as UserFieldServiceDailyReportType[];

  if (dailyRecords.length === 0) return;

  const emptyReports = dailyRecords.filter((report) => {
    const noHours =
      report.report_data.hours.field_service === '' &&
      report.report_data.hours.credit === '';

    const noStudies =
      report.report_data.bible_studies.value === 0 &&
      report.report_data.bible_studies.records.length === 0;

    const noTimerRan = report.report_data.timer.state === 'not_started';

    return noHours && noStudies && noTimerRan;
  });

  if (emptyReports.length === 0) return;

  const reportsToDelete = emptyReports.map((report) => {
    const newReport = structuredClone(report);

    newReport.report_data._deleted = true;
    newReport.report_data.updatedAt = new Date().toISOString();

    return newReport;
  });

  await dbUserFieldServiceReportsBulkSave(reportsToDelete);
};

export const dbUserSaveTimerToStorage = async () => {
  const today = formatDate(new Date(), 'yyyy/MM/dd');

  const records = await appDb.user_field_service_reports.toArray();

  if (records.length === 0) return;

  const report = records.find(
    (record) => record.report_date === today
  ) as UserFieldServiceDailyReportType;

  if (!report || report.report_data._deleted) return;

  if (report.report_data.timer.state === 'not_started') return;

  const timer = report.report_data.timer;
  store.set(userMinistryTimerState, timer);

  const newReport = structuredClone(report);
  newReport.report_data.timer = { start: 0, state: 'not_started', value: 0 };
  newReport.report_data.updatedAt = new Date().toISOString();

  await appDb.user_field_service_reports.put(newReport);
  await dbUpdateUserFieldServiceReportsMetadata();
};
