import appDb from '../../shared/indexedDb/mainDb';
import { S3Class } from './S3';

export class S88Class {
	constructor() {
		this.uid = '';
		this.value = '';
		this.months = [];
	}
}

S88Class.prototype.sort = function () {
	this.months.sort((a, b) => {
		return a.month_value > b.month_value ? 1 : -1;
	});
};

S88Class.prototype.loadMonths = async function () {
	const data = await appDb.meetingAttendance.toArray();
	const filteredMonths = data.filter((record) => record.service_year === this.uid);

	for await (const month of filteredMonths) {
		const S3 = new S3Class();
		S3.uid = month.uid;
		S3.service_year = month.service_year;
		S3.month_value = month.month_value;
		S3.midweek_meeting = month.midweek_meeting;
		S3.weekend_meeting = month.weekend_meeting;
		S3.changes = month.changes || [];

		this.months.push(S3);
	}

	this.sort();
};

S88Class.prototype.initializeMonth = async function (month) {
	const found = this.months.find((item) => item.month_value === month);
	if (!found) {
		const data = {
			uid: window.crypto.randomUUID(),
			service_year: this.uid,
			month_value: month,
			midweek_meeting: [],
			weekend_meeting: [],
			changes: [],
		};

		await appDb.meetingAttendance.add(data);

		const S3 = new S3Class();
		S3.uid = data.uid;
		S3.service_year = data.service_year;
		S3.month_value = data.month_value;
		S3.midweek_meeting = data.midweek_meeting;
		S3.weekend_meeting = data.weekend_meeting;
		S3.changes = data.changes;

		this.months.push(S3);
		this.sort();
	}
};
