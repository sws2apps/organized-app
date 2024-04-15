import appDb from '../../shared/indexedDb/mainDb';
import { FSGItemClass } from './FSGItem';

class FSGListClass {
	constructor() {
		this.list = [];
	}
}

FSGListClass.prototype.loadAll = async function () {
	this.list.length = 0;
	const appData = await appDb.fieldServiceGroup.toArray();

	const data = appData.filter((record) => !record.deleted);

	for (const fieldServiceGroup of data) {
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
		deleted: false,
		changes: [],
	};

	await appDb.fieldServiceGroup.add(newFsg);
	const fsg = new FSGItemClass(newFsg.fieldServiceGroup_uid);
	await fsg.loadDetails();

	this.list.push(fsg);
};

FSGListClass.prototype.get = function (uid) {
	return this.list.find((fsg) => fsg.fieldServiceGroup_uid === uid);
};

FSGListClass.prototype.getCurrent = function () {
	return this.list.find((fsg) => fsg.isCurrent === true);
};

FSGListClass.prototype.setCurrentList = async function (uid) {
	for await (const fsgItem of this.list) {
		await fsgItem.setAsDraft();
	}

	const currentList = this.get(uid);
	await currentList.setAsCurrent();
};

FSGListClass.prototype.delete = async function (uid) {
	const current = this.get(uid);
	if (current) {
		await appDb.fieldServiceGroup.update(uid, { deleted: true });
	}

	this.list = this.list.filter((list) => list.fieldServiceGroup_uid !== uid);
};

FSGListClass.prototype.cleanDeleted = async function () {
	const allData = await appDb.fieldServiceGroup.toArray();
	const appData = allData.filter((record) => record.deleted === true);

	for await (const record of appData) {
		await appDb.fieldServiceGroup.delete(record.fieldServiceGroup_uid);
	}
};

export const FSGList = new FSGListClass();
