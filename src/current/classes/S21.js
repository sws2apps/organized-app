import appDb from '../../shared/indexedDb/mainDb';
import { LateReports } from './LateReports';
import { S4Class } from './S4';

export class S21Class {
	constructor(uid) {
		this.uid = uid;
		this.service_year = '';
		this.person_uid = '';
		this.months = [];
	}
}

S21Class.prototype.sort = function () {
	this.months.sort((a, b) => {
		return a.month_value > b.month_value ? 1 : -1;
	});
};

S21Class.prototype.loadDetails = async function () {
	const data = await appDb.fieldServiceReports.get(this.uid);

	this.service_year = data.service_year;
	this.person_uid = data.person_uid;

	for await (const month of data.months) {
		const S4 = new S4Class();
		S4.uid = month.uid;
		S4.month_value = month.month_value;
		S4.placements = month.placements;
		S4.videos = month.videos;
		S4.hours = month.hours;
		S4.hourCredit = month.hourCredit || '';
		S4.minutes = month.minutes;
		S4.returnVisits = month.returnVisits;
		S4.bibleStudies = month.bibleStudies;
		S4.comments = month.comments;
		S4.changes = month.changes || [];

		this.months.push(S4);
	}

	this.sort();
};

S21Class.prototype.initializeMonth = async function (month) {
	const found = this.months.find((item) => item.month_value === month);

	if (!found) {
		const newMonth = new S4Class(month);
		this.months.push(newMonth);

		await appDb.fieldServiceReports.update(this.uid, { months: this.months });

		this.sort();
	}
};

S21Class.prototype.saveMonthReport = async function (month, data) {
	const currentMonth = this.months.find((item) => item.month_value === month);
	currentMonth[data.field] = data.value;

	const newChanges = [];
	for (const record of currentMonth.changes) {
		if (record.field === data.field) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), field: data.field, value: data.value });
	currentMonth.changes = newChanges;

	await appDb.fieldServiceReports.update(this.uid, { months: this.months });
};

S21Class.prototype.hasReport = function (month) {
	const currentMonth = this.months.find((item) => item.month_value === month);

	let exist = false;
	if (currentMonth) {
		if (currentMonth.hours !== '') {
			return true;
		}

		if (currentMonth.minutes !== '') {
			return true;
		}
	}

	return exist;
};

S21Class.prototype.hasLateReport = function (month) {
	return LateReports.find(this.person_uid, month) ? true : false;
};
