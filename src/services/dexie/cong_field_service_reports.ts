import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { IncomingReport } from '@definition/ministry';
import appDb from '@db/appDb';
import { congFieldServiceReportSchema } from './schema';

const dbUpdateCongFieldReportMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.cong_field_service_reports = {
    ...metadata.metadata.cong_field_service_reports,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbFieldServiceReportsSave = async (
  report: CongFieldServiceReportType
) => {
  await appDb.cong_field_service_reports.put(report);
  await dbUpdateCongFieldReportMetadata();
};

export const dbFieldServiceReportsBulkSave = async (
  reports: CongFieldServiceReportType[]
) => {
  await appDb.cong_field_service_reports.bulkPut(reports);
  await dbUpdateCongFieldReportMetadata();
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
      (r) =>
        r.report_data.report_date === record.report_month &&
        r.report_data.person_uid === record.person_uid
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
    if (record._deleted && findReport) {
      const report = structuredClone(findReport);

      report.report_data._deleted = true;
      report.report_data.updatedAt = record.updatedAt;

      await dbFieldServiceReportsSave(report);
    }

    // add new report
    if (!record._deleted) {
      const pubReport = congReportsAll.find(
        (r) =>
          r.report_data.report_date === record.report_month &&
          r.report_data.person_uid === record.person_uid
      );

      let report: CongFieldServiceReportType;

      if (!pubReport) {
        report = structuredClone(congFieldServiceReportSchema);
        report.report_id = crypto.randomUUID();
        report.report_data.person_uid = record.person_uid;
      }

      if (pubReport) {
        report = structuredClone(pubReport);
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
      report.report_data._deleted = false;

      await dbFieldServiceReportsSave(report);
    }
  }
};

export const dbRemoveDuplicateReports = async () => {
  try {
    const congReportsAll = await appDb.cong_field_service_reports.toArray();

    const congReports = congReportsAll.filter(
      (record) => !record.report_data._deleted
    );

    type recType = {
      person_uid: string;
      months: {
        report_date: string;
        reports: CongFieldServiceReportType[];
      }[];
    }[];

    const personReportsByMonth = congReports.reduce((acc: recType, record) => {
      const personRecord = acc.find(
        (p) => p.person_uid === record.report_data.person_uid
      );

      if (!personRecord) {
        acc.push({
          person_uid: record.report_data.person_uid,
          months: [
            {
              report_date: record.report_data.report_date,
              reports: [record],
            },
          ],
        });
      }

      if (personRecord) {
        const monthReport = personRecord.months.find(
          (r) => r.report_date === record.report_data.report_date
        );

        if (!monthReport) {
          personRecord.months.push({
            report_date: record.report_data.report_date,
            reports: [record],
          });
        }

        if (monthReport) {
          monthReport.reports.push(record);
        }
      }

      return acc;
    }, []);

    const duplicateReports = personReportsByMonth.filter((record) =>
      record.months.find((month) => month.reports.length > 1)
    );

    for await (const person of duplicateReports) {
      for await (const month of person.months) {
        const leastReport = month.reports
          .sort((a, b) =>
            a.report_data.updatedAt.localeCompare(b.report_data.updatedAt)
          )
          .at(0);

        const report = structuredClone(leastReport);
        report.report_data._deleted = true;
        report.report_data.updatedAt = new Date().toISOString();

        await dbFieldServiceReportsSave(report);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const dbFieldServiceReportsClear = async () => {
  const records = await appDb.cong_field_service_reports.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record.report_data._deleted = true;
    record.report_data.updatedAt = new Date().toISOString();
  }

  await appDb.cong_field_service_reports.bulkPut(records);
};
