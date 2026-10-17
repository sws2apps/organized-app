import { store } from '@states/index';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { userLocalUIDState } from '@states/settings';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { debounce } from '@utils/common';
import { addMonths, formatDate } from '@utils/date';
import {
  TimerRecordType,
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
} from '@definition/user_field_service_reports';
import {
  dbUserFieldServiceReportsGet,
  dbUserFieldServiceReportsSave,
  dbUserFieldServiceReportsTransaction,
} from '@services/dexie/user_field_service_reports';
import {
  userFieldServiceDailyReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';

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
  let comments = report.report_data.comments ?? '';

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

  if (typeof monthReport.report_data.hours.field_service === 'number') {
    monthReport.report_data.hours.field_service = { daily: '', monthly: '' };
  }

  monthReport.report_data.hours.field_service.daily =
    refreshHours(dailyReports);

  if (typeof monthReport.report_data.hours.credit === 'number') {
    monthReport.report_data.hours.credit = { daily: '', monthly: '' };
  }

  monthReport.report_data.hours.credit.daily = refreshHoursCredit(dailyReports);

  const bs = refreshBibleStudies(dailyReports);

  if (typeof monthReport.report_data.bible_studies === 'number') {
    monthReport.report_data.bible_studies = {
      daily: 0,
      monthly: 0,
      records: [],
    };
  }

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
    const monthComments = monthReport.report_data.comments ?? '';
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

/**
 * Splits a measured session into the hours and minutes a report is kept in.
 *
 * The seconds are rounded rather than dropped, so that a session stopped a few
 * seconds short of a minute is still worth reporting.
 */
export const fieldServiceTimeFromSeconds = (seconds: number) => {
  const measured = Math.max(0, seconds);

  const hours = Math.floor(measured / 3600);
  const minutes = Math.round((measured - hours * 3600) / 60);

  return { hours, minutes };
};

/**
 * Elapsed seconds of a ministry timer session, always derived from the moment
 * the timer was started so that a throttled or suspended tab cannot lose time.
 */
export const ministryTimerElapsed = (timer: TimerRecordType, now: number) => {
  if (timer.state !== 'started') return timer.value;

  return timer.value + Math.max(0, Math.floor((now - timer.start) / 1000));
};

/**
 * Keeps what a running session has already measured when the device clock is
 * corrected backwards, by banking the time up to the last moment the session
 * was seen and counting again from the corrected clock.
 *
 * A clock that moved behind the start of the running segment while nothing was
 * watching cannot tell how long that segment ran, so counting restarts from
 * the corrected clock instead of waiting for it to catch up with the start.
 */
export const ministryTimerCorrectClock = (
  timer: TimerRecordType,
  lastSeen: number,
  now: number
) => {
  if (timer.state !== 'started') return timer;

  if (now >= lastSeen && now >= timer.start) return timer;

  const newValue = structuredClone(timer);
  newValue.value =
    timer.value + Math.max(0, Math.floor((lastSeen - timer.start) / 1000));
  newValue.start = now;

  return newValue;
};

/**
 * The day a session is reported on is the day it started, so that a session
 * running past midnight stays in the month the publisher went out. The day is
 * kept in the timer record, and a record saved before the day was stored
 * falls back to the start of its running segment.
 */
export const ministryTimerSessionDate = (
  timer: TimerRecordType,
  now: number
) => {
  const date =
    timer.state === 'not_started' ? now : timer.date || timer.start || now;

  return formatDate(new Date(date), 'yyyy/MM/dd');
};

/** Whether the congregation already confirmed the publisher's report. */
export const userFieldServiceMonthConfirmed = (
  reports: CongFieldServiceReportType[],
  person_uid: string,
  month: string
) =>
  reports.some(
    (record) =>
      record.report_data.report_date === month &&
      record.report_data.person_uid === person_uid &&
      record.report_data.status === 'confirmed'
  );

/**
 * The day a session is reported on: its own day, or the first day of the
 * first later month still open, up to the current month. Undefined when every
 * one of those months is locked.
 */
export const ministryTimerReportDate = (
  session_date: string,
  isLocked: (month: string) => boolean,
  now = Date.now()
) => {
  let month = session_date.slice(0, 7);

  if (!isLocked(month)) return session_date;

  const currentMonth = formatDate(new Date(now), 'yyyy/MM');

  while (month < currentMonth) {
    month = formatDate(addMonths(`${month}/01`, 1), 'yyyy/MM');

    if (!isLocked(month)) return `${month}/01`;
  }

  return undefined;
};

/**
 * Adds a measured session to the daily report of the day it belongs to.
 *
 * The report is read from the database rather than from the view, so that the
 * time is added to whatever has already been saved for that day. The read and
 * every write share one transaction, so a failed save leaves nothing behind
 * that a retry would add again, and two saves cannot overwrite each other.
 */
export const handleAddFieldServiceTime = async (
  report_date: string,
  seconds: number
) => {
  const { hours, minutes } = fieldServiceTimeFromSeconds(seconds);

  const confirmed = userFieldServiceMonthConfirmed(
    store.get(congFieldServiceReportsState),
    store.get(userLocalUIDState),
    report_date.slice(0, 7)
  );

  if (confirmed) throw new Error('error_app_generic-desc');

  return dbUserFieldServiceReportsTransaction(async () => {
    const reports = await dbUserFieldServiceReportsGet();

    const current = reports.find(
      (record) =>
        record.report_date === report_date &&
        record.report_data.record_type === 'daily'
    ) as UserFieldServiceDailyReportType;

    const report = current
      ? structuredClone(current)
      : structuredClone(userFieldServiceDailyReportSchema);

    report.report_date = report_date;

    const [savedHours, savedMinutes] = report.report_data.hours.field_service
      .split(':')
      .map(Number);

    let newHours = (savedHours || 0) + hours;
    let newMinutes = (savedMinutes || 0) + minutes;

    if (newMinutes >= 60) {
      newHours++;
      newMinutes = newMinutes - 60;
    }

    report.report_data.hours.field_service = `${newHours}:${String(newMinutes).padStart(2, '0')}`;
    report.report_data._deleted = false;
    report.report_data.updatedAt = new Date().toISOString();

    await handleSaveDailyFieldServiceReport(report);

    return report;
  });
};
