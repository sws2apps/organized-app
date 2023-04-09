import appDb from '../indexedDb/mainDb';
import { FSGItemClass } from './FSGItem';

class FSGListClass {
  constructor() {
    this.list = [];
  }
}

FSGListClass.prototype.loadAll = async function () {
  this.list.length = 0;
  const appData = await appDb.fieldServiceGroup.toArray();

  for (const fieldServiceGroup of appData) {
    const fsg = new FSGItemClass(fieldServiceGroup.fieldServiceGroup_uid);
    await fsg.loadDetails();
    this.list.push(fsg);
  }
};

FSGListClass.prototype.add = async function () {
  const newFsg = {
    fieldServiceGroup_uid: window.crypto.randomUUID(),
    isCurrent: false,
    groups: [],
  };

  await appDb.fieldServiceGroup.add(newFsg);
  const fsg = new FSGItemClass(newFsg.fieldServiceGroup_uid);
  await fsg.loadDetails();

  this.list.push(fsg);
};

FSGListClass.prototype.get = function (uid) {
  return this.list.find((fsg) => fsg.fieldServiceGroup_uid === uid);
};

FSGListClass.prototype.setCurrentList = async function (uid) {
  for await (const fsgItem of this.list) {
    await fsgItem.setAsDraft();
  }

  const currentList = this.get(uid);
  await currentList.setAsCurrent();
};

FSGListClass.prototype.delete = async function (uid) {
  const isExist = this.get(uid);
  if (isExist) {
    await appDb.fieldServiceGroup.delete(uid);
  }

  this.list = this.list.filter((list) => list.fieldServiceGroup_uid !== uid);
};

export const FSGList = new FSGListClass();
