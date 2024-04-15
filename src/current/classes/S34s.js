import appDb from '../../shared/indexedDb/mainDb';
import { S34Class } from './S34';
import { Schedules } from './Schedules';
import { Setting } from './Setting';

class S34sClass {
	constructor() {
		this.talks = [];
	}
}

S34sClass.prototype.sort = function () {
	this.talks.sort((a, b) => {
		return a.talk_number > b.talk_number ? 1 : -1;
	});
};

S34sClass.prototype.loadAll = async function () {
	this.talks.length = 0;

	const talks = await appDb.public_talks.toArray();

	for (const talk of talks) {
		const S34 = new S34Class(talk.talk_number);
		await S34.loadDetails();
		this.talks.push(S34);
	}

	this.sort();
};

S34sClass.prototype.reset = async function (talks) {
	for (const talk of talks) {
		let S34;

		S34 = this.get(talk.talk_number);

		if (!S34) {
			S34 = new S34Class(talk.talk_number);
		}

		delete talk.id;
		delete talk.talk_number;

		for (const [language, value] of Object.entries(talk)) {
			const incomingTitle = value.title;
			const incomingModified = value.modified;

			let hasChange = false;
			const currentModified = S34.talk_title[language]?.modified || '';

			if (currentModified === '') hasChange = true;
			if (currentModified !== '') {
				const incomingDate = new Date(incomingModified);
				const currentDate = new Date(currentModified);

				if (incomingDate > currentDate) hasChange = true;
			}

			if (hasChange) {
				S34.talk_title = { ...S34.talk_title, [language]: { title: incomingTitle, modified: incomingModified } };
				await appDb.public_talks.put({ ...S34 }, S34.talk_number);

				this.talks = this.talks.filter((talk) => talk.talk_number !== S34.talk_number);
				this.talks.push(S34);
			}
		}
	}

	this.sort();
	Schedules.buildTalkHistory();
};

S34sClass.prototype.getLocal = function () {
	const result = [];
	const lang = Setting.source_lang.toUpperCase();

	for (const talk of this.talks) {
		result.push({
			talk_number: talk.talk_number,
			talk_title: talk.talk_title[lang]?.title || '',
			talk_modified: talk.talk_title[lang]?.modified || '',
		});
	}

	return result;
};

S34sClass.prototype.get = function (talk_number) {
	return this.talks.find((record) => record.talk_number === talk_number);
};

S34sClass.prototype.findLocal = function (talk_number) {
	const talks = this.getLocal();
	const found = talks.find((talk) => talk.talk_number === talk_number);
	return found.talk_title;
};

export const S34s = new S34sClass();
