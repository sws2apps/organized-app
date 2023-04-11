import appDb from '../indexedDb/mainDb';
import { S3Class } from './S3';
import { Setting } from './Setting';

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

    this.months.push(S3);
  }

  this.sort();
};

S88Class.prototype.getServiceYearMonths = function () {
  const options = [];

  let a = 8;
  for (let i = 0; i < 12; i++) {
    const year = a < 8 ? this.value.split('-')[1] : this.value.split('-')[0];

    options.push({
      index: a,
      value: `${year}/${String(a + 1).padStart(2, 0)}/01`,
      label: `${Setting.monthNames()[a]} ${year}`,
    });

    a++;
    if (a === 12) a = 0;
  }

  return options;
};
