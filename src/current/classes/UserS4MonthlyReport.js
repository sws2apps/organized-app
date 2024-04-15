import {
  apiSendUserFieldServiceReports,
  apiUnpostUserFieldServiceReports,
  apiSendPocketFieldServiceReports,
  apiUnpostPocketFieldServiceReports,
} from '../api';
import { reportsFieldSum } from '../utils/app';
import { S21s } from './S21s';
import { ServiceYear } from './ServiceYear';
import { Setting } from './Setting';
import { UserS4DailyReportClass } from './UserS4DailyReport';
import { UserS4Records } from './UserS4Records';

class UserS4MonthlyReportClass {
  constructor() {
    this.report_uid = '';
    this.month = '';
    this.placements = 0;
    this.videos = 0;
    this.hours = 0;
    this.returnVisits = 0;
    this.bibleStudies = 0;
    this.comments = '';
    this.isSubmitted = false;
    this.isPending = true;
    this.reports = [];
  }
}

UserS4MonthlyReportClass.prototype.get = async function (month) {
  const S4Record = UserS4Records.list.find((record) => record.month === month && record.isS4 === true);

  if (S4Record) {
    this.report_uid = S4Record.report_uid;
    this.month = month;
    this.placements = S4Record.placements;
    this.videos = S4Record.videos;
    this.hours = S4Record.duration;
    this.returnVisits = S4Record.returnVisits;
    this.bibleStudies = S4Record.bibleStudies;
    this.comments = S4Record.comments;
    this.isSubmitted = S4Record.isSubmitted;
    this.isPending = S4Record.isPending;
    this.reports = UserS4Records.list
      .filter((record) => record.month === month && record.isS4 === false && record.isS21 === false)
      .sort((a, b) => {
        return a.month_date > b.month_date ? 1 : -1;
      });

    return this;
  }

  // initialize month
  const dailyRecord = new UserS4DailyReportClass();
  dailyRecord.month = month;
  dailyRecord.isS4 = true;
  dailyRecord.isPending = true;
  dailyRecord.bibleStudies = 0;
  await dailyRecord.save();

  UserS4Records.list.push(dailyRecord);

  this.report_uid = dailyRecord.report_uid;
  this.month = month;
  this.placements = 0;
  this.videos = 0;
  this.hours = 0;
  this.returnVisits = 0;
  this.bibleStudies = 0;
  this.comments = '';
  this.reports = [];

  return this;
};

UserS4MonthlyReportClass.prototype.generate = async function () {
  this.placements = reportsFieldSum(this.reports, 'placements', 0) || '';
  this.videos = reportsFieldSum(this.reports, 'videos', 0) || '';
  this.returnVisits = reportsFieldSum(this.reports, 'returnVisits', 0) || '';

  // calculate total duration
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  for (const report of this.reports) {
    if (report.duration) {
      seconds += +report.duration.split(':')[2];
      minutes += +report.duration.split(':')[1];
      hours += +report.duration.split(':')[0];
    }
  }

  minutes += (seconds - (seconds % 60)) / 60;
  seconds = seconds % 60;

  if (seconds >= 30) minutes += 1;

  hours += (minutes - (minutes % 60)) / 60;
  minutes = minutes % 60;

  if (hours > 0) {
    if (minutes >= 30) {
      hours += 1;
      minutes = 0;
    }

    if (minutes < 30) minutes = 0;
  }

  if (hours === 0) {
    if (minutes > 7 && minutes < 23) minutes = 15;
    if (minutes >= 23 && minutes < 38) minutes = 30;
    if (minutes >= 38) minutes = 45;
  }

  this.hours = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  // calculate total bible studies
  let bibleStudies = [];
  for (const report of this.reports) {
    if (report.bibleStudies) {
      bibleStudies = bibleStudies.concat(report.bibleStudies);
    }
  }

  bibleStudies = bibleStudies.filter((v, i, a) => a.findIndex((v2) => v2 === v) === i);
  this.bibleStudies = bibleStudies.length || '';

  // save
  const dailyRecord = UserS4Records.getS4(this.month);
  dailyRecord.placements = this.placements;
  dailyRecord.videos = this.videos;
  dailyRecord.duration = this.hours;
  dailyRecord.returnVisits = this.returnVisits;
  dailyRecord.bibleStudies = this.bibleStudies;
  dailyRecord.changes = [{ date: new Date() }];

  await dailyRecord.save();

  return this;
};

UserS4MonthlyReportClass.prototype.saveComments = async function (comments) {
  const dailyRecord = UserS4Records.getS4(this.month);
  dailyRecord.comments = comments;
  dailyRecord.changes = [{ date: new Date() }];

  await dailyRecord.save();

  this.comments = comments;

  return this;
};

UserS4MonthlyReportClass.prototype.submit = async function () {
  const S4 = UserS4Records.getS4(this.month);
  S4.isSubmitted = true;
  S4.isPending = true;
  S4.changes = [{ date: new Date() }];

  const secretaryRole = Setting.cong_role.includes('secretary');
  const vipRole = !secretaryRole && Setting.account_type === 'vip';
  const pocketRole = !secretaryRole && Setting.account_type === 'pocket';

  if (vipRole) {
    await apiSendUserFieldServiceReports(S4);
  }

  if (pocketRole) {
    await apiSendPocketFieldServiceReports(S4);
  }

  // local handling if secretary
  if (secretaryRole) {
    const currentServiceYear = ServiceYear.getByMonth(this.month).uid;
    const localUid = Setting.user_local_uid;

    let currentS21 = S21s.get(currentServiceYear, localUid);
    if (!currentS21) {
      currentS21 = await S21s.add(currentServiceYear, localUid);
    }

    const hours = S4.duration === '' ? '' : +S4.duration.split(':')[0];

    await currentS21.initializeMonth(this.month);
    await currentS21.saveMonthReport(this.month, { field: 'placements', value: this.placements });
    await currentS21.saveMonthReport(this.month, { field: 'videos', value: this.videos });
    await currentS21.saveMonthReport(this.month, { field: 'hours', value: hours });
    await currentS21.saveMonthReport(this.month, { field: 'returnVisits', value: this.returnVisits });
    await currentS21.saveMonthReport(this.month, { field: 'bibleStudies', value: this.bibleStudies });
    await currentS21.saveMonthReport(this.month, { field: 'comments', value: this.comments });
  }

  await S4.save();

  this.isSubmitted = true;

  return this;
};

UserS4MonthlyReportClass.prototype.undoSubmit = async function () {
  const dailyRecord = UserS4Records.getS4(this.month);
  dailyRecord.isSubmitted = false;
  dailyRecord.isPending = true;
  dailyRecord.changes = [{ date: new Date() }];

  const secretaryRole = Setting.cong_role.includes('secretary');
  const vipRole = !secretaryRole && Setting.account_type === 'vip';
  const pocketRole = !secretaryRole && Setting.account_type === 'pocket';

  // http request if vip
  if (vipRole) {
    await apiUnpostUserFieldServiceReports(this.month);
  }

  // http request if pocket
  if (pocketRole) {
    await apiUnpostPocketFieldServiceReports(this.month);
  }

  await dailyRecord.save();

  this.isSubmitted = false;

  return this;
};

export const UserS4MonthlyReport = new UserS4MonthlyReportClass();
