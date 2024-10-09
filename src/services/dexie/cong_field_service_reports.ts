import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { IncomingReport } from '@definition/ministry';
import appDb from '@db/appDb';
import { congFieldServiceReportSchema } from './schema';

export const dbFieldServiceReportsSave = async (
  report: CongFieldServiceReportType
) => {
  await appDb.cong_field_service_reports.put(report);
};

export const dbFieldServiceReportsBulkSave = async (
  reports: CongFieldServiceReportType[]
) => {
  await appDb.cong_field_service_reports.bulkPut(reports);
};

export const dbHandleIncomingReports = async (reports: IncomingReport[]) => {
  const congReportsAll = await appDb.cong_field_service_reports.toArray();
  const congReports = congReportsAll.filter(
    (record) => !record.report_data._deleted
  );

  const branchReportsAll = await appDb.branch_field_service_reports.toArray();
  const branchReports = branchReportsAll.filter(
    (record) => !record.report_data._deleted
  );

  for await (const record of reports) {
    const branch = branchReports.find(
      (b) => b.report_date === record.report_month
    );

    const findReport = congReports.find(
      (r) => r.report_id === record.report_id
    );

    let allowAdd = false;

    // allow add if branch report not created or not submitted
    if (!branch || branch?.report_data.submitted === false) {
      allowAdd = true;
    }

    // allow add if report is late
    if (branch?.report_data.submitted && findReport?.report_data.late.value) {
      allowAdd = true;
    }

    if (!allowAdd) continue;

    allowAdd = false;

    if (!findReport) {
      allowAdd = true;
    }

    if (findReport?.report_data.updatedAt < record.updatedAt) {
      allowAdd = true;
    }

    if (!allowAdd) continue;

    // remove deleted report on current
    if (record._deleted) {
      const report = structuredClone(findReport);

      report.report_data._deleted = true;
      report.report_data.updatedAt = record.updatedAt;

      await dbFieldServiceReportsSave(report);

      continue;
    }

    // add new report
    let report: CongFieldServiceReportType;

    if (!findReport) {
      report = structuredClone(congFieldServiceReportSchema);
      report.report_id = record.report_id;
      report.report_data.person_uid = record.person_uid;
    }

    if (findReport) {
      report = structuredClone(findReport);
    }

    report.report_data.updatedAt = record.updatedAt;
    report.report_data.bible_studies = record.bible_studies;
    report.report_data.comments = record.comments;
    report.report_data.hours.field_service = record.hours;
    report.report_data.hours.credit = {
      approved: 0,
      value: record.hours_credits,
    };
    report.report_data.report_date = record.report_month;
    report.report_data.shared_ministry = record.shared_ministry;
    report.report_data.status = 'received';

    await dbFieldServiceReportsSave(report);
  }
};
