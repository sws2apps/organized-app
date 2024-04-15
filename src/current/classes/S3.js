import appDb from '../../shared/indexedDb/mainDb';

export class S3Class {
	constructor() {
		this.uid = '';
		this.service_year = '';
		this.month_value = '';
		this.midweek_meeting = [];
		this.weekend_meeting = [];
		this.changes = [];
	}
}

S3Class.prototype.save = async function (type, meetingIndex, value) {
	if (type === 'midweek') {
		const filtered = this.midweek_meeting.filter((attendance) => attendance.index !== meetingIndex);
		filtered.push({ index: meetingIndex, count: value });
		this.midweek_meeting = [...filtered];

		const newChanges = [];
		for (const record of this.changes) {
			if (record.type === 'midweek' && record.index === meetingIndex) {
				continue;
			}

			newChanges.push(record);
		}

		newChanges.push({ date: new Date(), type, index: meetingIndex, count: value });

		this.changes = newChanges;

		await appDb.meetingAttendance.update(this.uid, { midweek_meeting: this.midweek_meeting, changes: this.changes });
	}

	if (type === 'weekend') {
		const filtered = this.weekend_meeting.filter((attendance) => attendance.index !== meetingIndex);
		filtered.push({ index: meetingIndex, count: value });
		this.weekend_meeting = [...filtered];

		const newChanges = [];
		for (const record of this.changes) {
			if (record.type === 'weekend' && record.index === meetingIndex) {
				continue;
			}

			newChanges.push(record);
		}

		newChanges.push({ date: new Date(), type, index: meetingIndex, count: value });

		this.changes = newChanges;

		await appDb.meetingAttendance.update(this.uid, { weekend_meeting: this.weekend_meeting, changes: this.changes });
	}
};

S3Class.prototype.summaryMeeting = function (type) {
	const data = {
		count: '',
		total: '',
		average: '',
	};

	const meetings = type === 'midweek' ? this.midweek_meeting : this.weekend_meeting;

	let cnMeeting = 0;
	let tmpTotal = 0;
	for (const meeting of meetings) {
		if (meeting.count !== '') {
			cnMeeting++;
			tmpTotal += +meeting.count;
		}
	}

	if (cnMeeting > 0) {
		data.count = cnMeeting;
		data.total = tmpTotal;
		data.average = tmpTotal === 0 ? 0 : Math.round(tmpTotal / cnMeeting);
	}

	return data;
};
