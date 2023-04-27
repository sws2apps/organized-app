import appDb from '../indexedDb/mainDb';
import { addMonths } from '../utils/app';
import { Setting } from './Setting';

class ServiceYearClass {
  constructor() {
    this.list = [];
  }
}

ServiceYearClass.prototype.sort = function () {
  this.list.sort((a, b) => {
    return a.value > b.value ? 1 : -1;
  });
};

ServiceYearClass.prototype.loadAll = async function () {
  this.list.length = 0;
  const appData = await appDb.serviceYear.toArray();

  for (const sy of appData) {
    this.list.push(sy);
  }

  this.sort();
};

ServiceYearClass.prototype.add = async function (startYear) {
  const newSY = {
    uid: window.crypto.randomUUID(),
    value: `${startYear}-${+startYear + 1}`,
  };

  await appDb.serviceYear.add(newSY);

  this.list.push(newSY);
  this.sort();
};

ServiceYearClass.prototype.first = function () {
  return this.list[0];
};

ServiceYearClass.prototype.getByValue = function (value) {
  return this.list.find((service) => service.value === value);
};

ServiceYearClass.prototype.get = function (uid) {
  return this.list.find((service) => service.uid === uid);
};

ServiceYearClass.prototype.getCurrent = function () {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  let current;

  if (currentMonth < 9) current = `${+currentYear - 1}-${currentYear}`;
  if (currentMonth >= 9) current = `${currentYear}-${+currentYear + 1}`;

  const found = this.getByValue(current);
  return found;
};

ServiceYearClass.prototype.currentReportMonth = function () {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  let month;
  if (currentDate > 20) {
    month = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/01`;
  }

  if (currentDate <= 20) {
    const previousMonthDate = addMonths(new Date(), -1);
    month = `${previousMonthDate.getFullYear()}/${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}/01`;
  }

  return month;
};

ServiceYearClass.prototype.checkCurrent = async function () {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  let current;

  if (currentMonth < 9) current = `${+currentYear - 1}-${currentYear}`;
  if (currentMonth >= 9) current = `${currentYear}-${+currentYear + 1}`;

  const found = this.getByValue(current);
  if (!found) {
    const addYear = current.split('-')[0];
    await this.add(addYear);
  }
};

ServiceYearClass.prototype.getByMonth = function (month) {
  const currentYear = new Date(month).getFullYear();
  const currentMonth = new Date(month).getMonth();
  let current;

  if (currentMonth < 9) current = `${+currentYear - 1}-${currentYear}`;
  if (currentMonth >= 9) current = `${currentYear}-${+currentYear + 1}`;

  const found = this.getByValue(current);

  return found;
};

ServiceYearClass.prototype.getMonths = function (uid) {
  const SY = this.get(uid);

  const options = [];

  let a = 8;
  for (let i = 0; i < 12; i++) {
    const year = a < 8 ? SY.value.split('-')[1] : SY.value.split('-')[0];

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

export const ServiceYear = new ServiceYearClass();
