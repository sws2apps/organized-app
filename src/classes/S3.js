import appDb from '../indexedDb/mainDb';

export class S3Class {
  constructor() {
    this.uid = '';
    this.service_year = '';
    this.month_value = '';
    this.midweek_meeting = [];
    this.weekend_meeting = [];
  }
}

S3Class.prototype.save = async function (type, meetingIndex, value) {
  if (type === 'midweek') {
    const filtered = this.midweek_meeting.filter((attendance) => attendance.index !== meetingIndex);
    filtered.push({ index: meetingIndex, count: value });
    this.midweek_meeting = [...filtered];

    await appDb.meetingAttendance.update(this.uid, { midweek_meeting: this.midweek_meeting });
  }

  if (type === 'weekend') {
    const filtered = this.weekend_meeting.filter((attendance) => attendance.index !== meetingIndex);
    filtered.push({ index: meetingIndex, count: value });
    this.weekend_meeting = [...filtered];

    await appDb.meetingAttendance.update(this.uid, { weekend_meeting: this.weekend_meeting });
  }
};
