import { format } from 'date-fns';
import appDb from '../indexedDb/mainDb';
import { UserS4DailyReportClass } from './UserS4DailyReport';

class UserS4RecordsClass {
  constructor() {
    this.list = [];
  }
}

UserS4RecordsClass.prototype.loadAll = async function () {
  this.list.length = 0;

  const allData = await appDb.user_field_service_reports.toArray();
  const appData = allData.filter((record) => record.isDeleted !== true);

  for (const record of appData) {
    const S4Daily = new UserS4DailyReportClass();
    S4Daily.report_uid = record.report_uid;
    S4Daily.month = record.month;
    S4Daily.month_date = record.month_date;
    S4Daily.placements = record.placements;
    S4Daily.videos = record.videos;
    S4Daily.duration = record.duration;
    S4Daily.duration_start = record.duration_start;
    S4Daily.returnVisits = record.returnVisits;
    S4Daily.bibleStudies = record.bibleStudies;
    S4Daily.comments = record.comments;
    S4Daily.isDeleted = record.isDeleted;
    S4Daily.isSubmitted = record.isSubmitted;
    S4Daily.isPending = record.isPending;
    S4Daily.isS4 = record.isS4;
    S4Daily.isS21 = record.isS21;
    S4Daily.changes = record.changes;
    this.list.push(S4Daily);
  }
};

UserS4RecordsClass.prototype.get = async function (month_date) {
  const tmpMonthValue = new Date(month_date);
  const record = this.list.find((record) => record.month_date === month_date);

  if (record) return record;

  if (!record) {
    const monthStart = new Date(tmpMonthValue.getFullYear(), tmpMonthValue.getMonth(), 1);

    const dailyRecord = new UserS4DailyReportClass();
    dailyRecord.month = format(monthStart, 'yyyy/MM/dd');
    dailyRecord.month_date = month_date;
    await dailyRecord.save();

    this.list.push(dailyRecord);

    return dailyRecord;
  }
};

UserS4RecordsClass.prototype.getS4 = function (month) {
  const record = this.list.find((record) => record.month === month && record.isS4 === true);
  return record;
};

UserS4RecordsClass.prototype.getS21 = function (month) {
  const record = this.list.find((record) => record.month === month && record.isS21 === true);
  return record;
};

UserS4RecordsClass.prototype.cleanDeleted = async function () {
  const allData = await appDb.user_field_service_reports.toArray();
  const appData = allData.filter((record) => record.isDeleted === true);

  for await (const record of appData) {
    await appDb.user_field_service_reports.delete(record.report_uid);
  }
};

export const UserS4Records = new UserS4RecordsClass();
