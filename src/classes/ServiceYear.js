import appDb from '../indexedDb/mainDb';

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

ServiceYearClass.prototype.getByValue = function (value) {
  return this.list.find((service) => service.value === value);
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

export const ServiceYear = new ServiceYearClass();
