import appDb from '../../shared/indexedDb/mainDb';
import { S1Class } from './S1';

class S1sClass {
	constructor() {
		this.reports = [];
	}
}

S1sClass.prototype.loadAll = async function () {
	const allReports = await appDb.branchReports.toArray();

	const appData = allReports.filter((record) => record.report === 'S1');

	for (const report of appData) {
		const S1 = new S1Class(report.report_uid);
		await S1.loadDetails();
		this.reports.push(S1);
	}
};

S1sClass.prototype.get = function (month) {
	return this.reports.find((report) => report.month === month);
};

S1sClass.prototype.create = async function (service_year, month) {
	const isExist = this.get(month);
	if (isExist) return;

	const newS1 = new S1Class(window.crypto.randomUUID());
	newS1.service_year = service_year;
	newS1.month = month;
	await appDb.branchReports.put({ ...newS1 }, newS1.report_uid);
	await newS1.loadDetails();
	this.reports.push(newS1);

	const data = await appDb.branchReports.toArray();
	const months = data.filter((report) => report.month === month);
	if (months.length === 2) {
		const uid = months[1].report_uid;
		await appDb.branchReports.delete(uid);
		this.reports = this.reports.filter((report) => report.report_uid !== uid);
	}
};

export const S1s = new S1sClass();
