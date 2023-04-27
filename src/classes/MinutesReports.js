import appDb from '../indexedDb/mainDb';
import { MinutesReportClass } from './MinutesReport';
import { ServiceYear } from './ServiceYear';

class MinutesReportsClass {
  constructor() {
    this.reports = [];
  }
}

MinutesReportsClass.prototype.loadAll = async function () {
  this.reports.length = 0;
  const appData = await appDb.minutesReports.toArray();

  for (const report of appData) {
    const MinutesReport = new MinutesReportClass();
    MinutesReport.uid = report.uid;
    MinutesReport.person_uid = report.person_uid;
    MinutesReport.service_year = report.service_year;
    MinutesReport.month = report.month;
    this.reports.push(MinutesReport);
  }
};

MinutesReportsClass.prototype.find = function (person_uid, month) {
  return this.reports.find((report) => report.person_uid === person_uid && report.month === month);
};

MinutesReportsClass.prototype.add = async function (person_uid, month) {
  const isExist = this.find(person_uid, month);

  if (isExist) return;

  const newMinutes = new MinutesReportClass();
  newMinutes.month = month;
  newMinutes.service_year = ServiceYear.getByMonth(month).uid;
  newMinutes.person_uid = person_uid;

  await appDb.minutesReports.put({ ...newMinutes }, newMinutes.uid);
  this.reports.push(newMinutes);
};

MinutesReportsClass.prototype.remove = async function (person_uid, month) {
  const report = this.find(person_uid, month);

  if (!report) return;

  await appDb.minutesReports.delete(report.uid);

  const newReports = [];
  for (const report of this.reports) {
    if (report.person_uid === person_uid && report.month === month) {
      continue;
    }

    newReports.push(report);
  }

  this.reports.length = 0;
  this.reports = newReports;
};

export const MinutesReports = new MinutesReportsClass();
