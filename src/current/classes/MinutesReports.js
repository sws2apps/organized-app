import appDb from '../../shared/indexedDb/mainDb';
import { reportsFieldSum } from '../utils/app';
import { MinutesReportClass } from './MinutesReport';
import { S21s } from './S21s';
import { ServiceYear } from './ServiceYear';

class MinutesReportsClass {
	constructor() {
		this.reports = [];
	}
}

MinutesReportsClass.prototype.loadAll = async function () {
	this.reports.length = 0;
	const allData = await appDb.minutesReports.toArray();

	const appData = allData.filter((record) => record.deleted !== true);

	for (const report of appData) {
		const MinutesReport = new MinutesReportClass();
		MinutesReport.uid = report.uid;
		MinutesReport.person_uid = report.person_uid;
		MinutesReport.service_year = report.service_year;
		MinutesReport.month = report.month;
		MinutesReport.deleted = report.deleted || false;
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
	newMinutes.deleted = false;

	await appDb.minutesReports.put({ ...newMinutes }, newMinutes.uid);
	this.reports.push(newMinutes);
};

MinutesReportsClass.prototype.remove = async function (person_uid, month) {
	const report = this.find(person_uid, month);

	if (!report) return;

	const update = { ...report, deleted: true };
	await appDb.minutesReports.put({ ...update }, report.uid);

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

MinutesReportsClass.prototype.cleanDeleted = async function () {
	const allData = await appDb.minutesReports.toArray();
	const appData = allData.filter((record) => record.deleted === true);

	for await (const report of appData) {
		await appDb.minutesReports.delete(report.uid);
	}
};

MinutesReportsClass.prototype.countTotal = function () {
	const reports = [];
	for (const minutesReport of this.reports) {
		const S21 = S21s.get(minutesReport.service_year, minutesReport.person_uid);
		if (S21.hasReport(minutesReport.month)) {
			const currentMonth = S21.months.find((item) => item.month_value === minutesReport.month);
			reports.push({
				person_uid: S21.person_uid,
				service_year: minutesReport.service_year,
				...currentMonth,
			});
		}
	}

	const minutesTotal = reportsFieldSum(reports, 'minutes');
	const hoursTotal = Math.round(minutesTotal / 60);

	return hoursTotal;
};

export const MinutesReports = new MinutesReportsClass();
