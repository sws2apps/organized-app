import appDb from '../../shared/indexedDb/mainDb';
import { S21Class } from './S21';

class S21sClass {
	constructor() {
		this.list = [];
	}
}

S21sClass.prototype.get = function (service_year, person_uid) {
	return this.list.find((item) => item.service_year === service_year && item.person_uid === person_uid);
};

S21sClass.prototype.getAll = function (service_year) {
	return this.list.filter((item) => item.service_year === service_year);
};

S21sClass.prototype.loadAll = async function () {
	this.list.length = 0;
	const appData = await appDb.fieldServiceReports.toArray();

	for (const report of appData) {
		const S21 = new S21Class(report.uid);
		await S21.loadDetails();
		this.list.push(S21);
	}
};

S21sClass.prototype.add = async function (service_year, person_uid) {
	const data = {
		uid: window.crypto.randomUUID(),
		service_year,
		person_uid,
		months: [],
	};
	await appDb.fieldServiceReports.add(data);

	const S21 = new S21Class(data.uid);
	await S21.loadDetails();
	this.list.push(S21);

	return S21;
};

export const S21s = new S21sClass();
