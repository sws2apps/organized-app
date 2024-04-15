import appDb from '../../shared/indexedDb/mainDb';
import { LateReportClass } from './LateReport';
import { ServiceYear } from './ServiceYear';

class LateReportsClass {
	constructor() {
		this.reports = [];
	}
}

LateReportsClass.prototype.loadAll = async function () {
	this.reports.length = 0;
	const allData = await appDb.lateReports.toArray();

	const appData = allData.filter((record) => record.deleted !== true);

	for (const report of appData) {
		const LateReport = new LateReportClass();
		LateReport.uid = report.uid;
		LateReport.person_uid = report.person_uid;
		LateReport.service_year = report.service_year;
		LateReport.month = report.month;
		LateReport.deleted = report.deleted || false;
		this.reports.push(LateReport);
	}
};

LateReportsClass.prototype.find = function (person_uid, month) {
	return this.reports.find((report) => report.person_uid === person_uid && report.month === month);
};

LateReportsClass.prototype.add = async function (person_uid, month) {
	const isExist = this.find(person_uid, month);

	if (isExist) return;

	const newLateReport = new LateReportClass();
	newLateReport.month = month;
	newLateReport.service_year = ServiceYear.getByMonth(month).uid;
	newLateReport.person_uid = person_uid;
	newLateReport.deleted = false;

	await appDb.lateReports.put({ ...newLateReport }, newLateReport.uid);
	this.reports.push(newLateReport);
};

LateReportsClass.prototype.remove = async function (person_uid, month) {
	const report = this.find(person_uid, month);

	if (!report) return;

	const update = { ...report, deleted: true };
	await appDb.lateReports.put({ ...update }, update.uid);

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

LateReportsClass.prototype.cleanDeleted = async function () {
	const allData = await appDb.lateReports.toArray();
	const appData = allData.filter((record) => record.deleted === true);

	for await (const report of appData) {
		await appDb.lateReports.delete(report.uid);
	}
};

export const LateReports = new LateReportsClass();
