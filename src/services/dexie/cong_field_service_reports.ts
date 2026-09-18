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
  await markTransferBackfillOverride(report);
  await appDb.cong_field_service_reports.put(report);
  await dbUpdateCongFieldReportMetadata();
};

// Marks reports added into an already-submitted month so they stay editable
// (transfer backfills, see #5420). Runs on every congregation report save so
// no editor surface can forget it. Never clears an existing mark, never marks
// late reports, and never marks reports that already shared before this save.
const markTransferBackfillOverride = async (
  report: CongFieldServiceReportType
) => {
  if (report.report_data.lock_override) return;

  if (report.report_data.late.value) return;

  const prev = report.report_id
    ? await appDb.cong_field_service_reports.get(report.report_id)
    : undefined;

  if (prev?.report_data.shared_ministry) return;

  const branchReports = await appDb.branch_field_service_reports.toArray();

  const branch = branchReports.find(
    (record) =>
      record.report_date === report.report_data.report_date &&
      !record.report_data._deleted
  );

  if (branch?.report_data.submitted) {
    report.report_data.lock_override = true;
  }
};

// Single source of truth for the submitted-month edit lock. A stored override
// mark is checked first: reports added after submission (transfer backfills,
// see #5420) stay editable without the late workflow. Once the mark is set it
// persists on the record, so the lock cannot drift mid-session and late
// hydration cannot unlock submitted reports. Late comes from the editing draft
// so clearing late relocks immediately and marking late unlocks immediately.
// Shared comes from the persisted record so entering hours does not lock the
// remaining fields mid-session.
export const isCongReportLocked = (
  persistedReport: CongFieldServiceReportType | undefined,
  branchSubmitted: boolean | undefined,
  draftLate?: CongFieldServiceReportType['report_data']['late'],
  draftOverride?: boolean
) => {
  const override =
    draftOverride ?? persistedReport?.report_data.lock_override;

  if (override) return false;

  if (!branchSubmitted) return false;

  const late = draftLate ?? persistedReport?.report_data.late;

  const isLate = late?.value && late?.submitted.length === 0;

  if (isLate) return false;

  const shared = persistedReport?.report_data.shared_ministry;

  if (!shared) return false;

  return true;
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

    // allow transfer backfill: unshared records never counted in a
    // submission sync without the late workflow. Already-shared incoming
    // records stay out so a submitted month cannot be flipped to shared.
    if (
      branch?.report_data.submitted &&
      !findReport?.report_data.shared_ministry &&
      !record.shared_ministry
    ) {
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

export const dbFieldServiceReportsClear = async () => {
  const records = await appDb.cong_field_service_reports.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record.report_data._deleted = true;
    record.report_data.updatedAt = new Date().toISOString();
  }

  await appDb.cong_field_service_reports.bulkPut(records);
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
      const duplicateMonths = person.months.filter(
        (record) => record.reports.length > 1
      );

      for await (const month of duplicateMonths) {
        const lastReport = month.reports
          .sort((a, b) =>
            b.report_data.updatedAt.localeCompare(a.report_data.updatedAt)
          )
          .at(0);

        const reportsToDelete = month.reports
          .filter((record) => record.report_id !== lastReport.report_id)
          .map((record) => {
            record.report_data._deleted = true;
            record.report_data.updatedAt = new Date().toISOString();

            return record;
          });

        await dbFieldServiceReportsBulkSave(reportsToDelete);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
