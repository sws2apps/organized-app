import appDb from '../../shared/indexedDb/mainDb';
import { BibleStudies } from './BibleStudies';
import { UserS4Records } from './UserS4Records';

export class BibleStudyClass {
	constructor() {
		this.uid = window.crypto.randomUUID();
		this.person_name = '';
		this.person_active = true;
		this.person_addresses = '';
		this.person_contact = '';
		this.isDeleted = false;
		this.changes = [];
	}
}

BibleStudyClass.prototype.compare = function (data) {
	const excludeFields = ['changes', 'isDeleted', 'uid', 'person_active'];

	for (const [key, value] of Object.entries(this)) {
		if (excludeFields.indexOf(key) === -1) {
			if (value !== data[key]) {
				this.changes = this.changes.filter((record) => record.field !== key);
				this.changes.push({ date: new Date(), field: key, value: data[key] });
			}
		}
	}
};

BibleStudyClass.prototype.save = async function (data) {
	this.compare(data);

	await appDb.user_bible_studies.update(this.uid, { ...data, changes: this.changes });

	this.person_name = data.person_name;
	this.person_addresses = data.person_addresses;
	this.person_contact = data.person_contact;

	BibleStudies.sort();
};

BibleStudyClass.prototype.isActive = function () {
	const dailyReports = UserS4Records.list;
	let isActive = false;

	for (const record of dailyReports) {
		if (Array.isArray(record.bibleStudies)) {
			const active = record.bibleStudies.some((record) => record === this.uid);
			if (active) {
				isActive = true;
				break;
			}
		}
	}

	return isActive;
};

BibleStudyClass.prototype.setInactive = async function () {
	this.person_active = false;
	this.changes = this.changes.filter((record) => record.field !== 'person_active');
	this.changes.push({ date: new Date(), field: 'person_active', value: false });

	await appDb.user_bible_studies.update(this.uid, { ...this });
};

BibleStudyClass.prototype.setActive = async function () {
	this.person_active = true;
	this.changes = this.changes.filter((record) => record.field !== 'person_active');
	this.changes.push({ date: new Date(), field: 'person_active', value: true });

	await appDb.user_bible_studies.update(this.uid, { ...this });
};

BibleStudyClass.prototype.delete = async function () {
	this.isDeleted = true;
	await appDb.user_bible_studies.update(this.uid, { ...this });
};
