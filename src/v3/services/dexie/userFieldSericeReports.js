import { promiseGetRecoil } from 'recoil-outside';
import { userFieldServiceReportsState } from '@states/userFieldServiceReports';
import appDb from './db';

export const mergeUserFieldServiceReportsFromBackup = async (reportsBackup) => {
  const userFieldServiceReports = await promiseGetRecoil(userFieldServiceReportsState);

  for await (const report of reportsBackup) {
    // remove deleted records
    if (report.isDeleted) {
      const isExist = userFieldServiceReports.find((r) => r.report_uid === report.report_uid);

      if (isExist) {
        await appDb.user_field_service_reports.delete(report.report_uid);
      }

      continue;
    }

    // update existing record
    const oldRecord = userFieldServiceReports.find((r) => r.report_uid === report.report_uid);

    // add new record and continue loop
    if (!oldRecord) {
      const dailyRecord = {};
      dailyRecord.report_uid = report.report_uid;
      dailyRecord.month = report.month;
      dailyRecord.month_date = report.month_date;
      dailyRecord.placements = report.placements;
      dailyRecord.videos = report.videos;
      dailyRecord.duration = report.duration;
      dailyRecord.duration_start = report.duration_start;
      dailyRecord.returnVisits = report.returnVisits;
      dailyRecord.bibleStudies = report.bibleStudies;
      dailyRecord.comments = report.comments;
      dailyRecord.isDeleted = report.isDeleted;
      dailyRecord.isSubmitted = report.isSubmitted;
      dailyRecord.isPending = report.isPending;
      dailyRecord.isS4 = report.isS4;
      dailyRecord.isS21 = report.isS21;
      dailyRecord.changes = report.changes;

      await appDb.user_field_service_reports.put(dailyRecord);

      continue;
    }

    // update existing
    if (oldRecord) {
      const newChanges = report.changes || [];
      const oldChanges = oldRecord.changes || [];

      for (const change of newChanges) {
        // update S4 and S21 records
        if (report.isS4 || report.isS21) {
          const oldDate = oldChanges[0] ? new Date(oldChanges[0].date) : undefined;
          const newDate = new Date(change.date);

          let isUpdate = false;

          if (!oldDate) isUpdate = true;
          if (oldDate && oldDate < newDate) isUpdate = true;

          if (isUpdate) {
            oldRecord.changes = [];
            oldRecord.changes.push(change);

            for (const [key, value] of Object.entries(report)) {
              if (key !== 'changes') oldRecord[key] = value;
            }
          }
        }

        // update daily records
        if (!report.isS4 && !report.isS21) {
          const oldChange = oldChanges.find((item) => item.field === change.field);

          if (!oldChange) {
            oldRecord[change.field] = change.value;
            if (!oldRecord.changes) oldRecord.changes = [];
            oldRecord.changes.push(change);
          }

          if (oldChange) {
            const oldDate = new Date(oldChange.date);
            const newDate = new Date(change.date);

            if (newDate > oldDate) {
              oldRecord[change.field] = change.value;
              oldRecord.changes = oldRecord.changes.filter((item) => item.field !== change.field);
              oldRecord.changes.push(change);
            }
          }
        }
      }

      await appDb.user_field_service_reports.put(oldRecord);
    }
  }
};

export const cleanUserFieldServiceReportsDeleted = async () => {
  const allData = await appDb.user_field_service_reports.toArray();
  const appData = allData.filter((record) => record.isDeleted === true);

  for await (const record of appData) {
    await appDb.user_field_service_reports.delete(record.report_uid);
  }
};
