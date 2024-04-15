import appDb from '../../shared/indexedDb/mainDb';
import { BibleStudyClass } from './BibleStudy';

class BibleStudiesClass {
	constructor() {
		this.list = [];
	}
}

BibleStudiesClass.prototype.sort = function () {
	this.list.sort((a, b) => {
		return a.person_name > b.person_name ? 1 : -1;
	});
};

BibleStudiesClass.prototype.loadAll = async function () {
	this.list.length = 0;
	const allData = await appDb.user_bible_studies.toArray();

	const appData = allData.filter((record) => record.isDeleted !== true);

	for (const person of appData) {
		const BibleStudy = new BibleStudyClass();
		BibleStudy.uid = person.uid;
		BibleStudy.person_name = person.person_name;
		BibleStudy.person_active = person.person_active;
		BibleStudy.person_addresses = person.person_addresses;
		BibleStudy.person_contact = person.person_contact;
		BibleStudy.changes = person.changes;
		this.list.push(BibleStudy);
	}

	this.sort();
};

BibleStudiesClass.prototype.get = function (uid) {
	return this.list.find((record) => record.uid === uid);
};

BibleStudiesClass.prototype.create = async function (data) {
	const BibleStudy = new BibleStudyClass();
	BibleStudy.person_name = data.person_name;
	BibleStudy.person_addresses = data.person_addresses;
	BibleStudy.person_contact = data.person_contact;
	BibleStudy.changes = [
		{ date: new Date(), field: 'person_name', value: data.person_name },
		{ date: new Date(), field: 'person_addresses', value: data.person_addresses },
		{ date: new Date(), field: 'person_contact', value: data.person_contact },
	];

	await appDb.user_bible_studies.put({ ...BibleStudy }, BibleStudy.uid);

	this.list.push(BibleStudy);
	this.sort();
};

BibleStudiesClass.prototype.delete = async function (uid) {
	const currentBS = BibleStudies.get(uid);
	await currentBS.delete();

	this.list = this.list.filter((record) => record.uid !== uid);
};

BibleStudiesClass.prototype.cleanDeleted = async function () {
	const allData = await appDb.user_bible_studies.toArray();
	const appData = allData.filter((record) => record.isDeleted === true);

	for await (const record of appData) {
		await appDb.user_bible_studies.delete(record.uid);
	}
};

export const BibleStudies = new BibleStudiesClass();
