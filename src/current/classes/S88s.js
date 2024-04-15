import { S88Class } from './S88';
import { ServiceYear } from './ServiceYear';

class S88sClass {
  constructor() {
    this.list = [];
  }
}

S88sClass.prototype.sort = function () {
  this.list.sort((a, b) => {
    return a.value > b.value ? 1 : -1;
  });
};

S88sClass.prototype.loadAll = async function () {
  for await (const SY of ServiceYear.list) {
    const S88 = new S88Class();
    S88.uid = SY.uid;
    S88.value = SY.value;
    await S88.loadMonths();

    this.list.push(S88);
  }

  this.sort();
};

S88sClass.prototype.get = function (uid) {
  return this.list.find((item) => item.uid === uid);
};

export const S88s = new S88sClass();
