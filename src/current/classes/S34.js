import appDb from '../../shared/indexedDb/mainDb';
import { Setting } from './Setting';

export class S34Class {
	constructor(talk_number) {
		this.talk_number = talk_number;
		this.talk_title = {};
	}
}

S34Class.prototype.loadDetails = async function () {
	const appData = await appDb.public_talks.get(this.talk_number);
	this.talk_number = appData.talk_number;
	this.talk_title = appData.talk_title;
};

S34Class.prototype.save = async function (talk_title) {
	const sourceLang = Setting.source_lang.toUpperCase();

	let hasChange = true;

	if (this.talk_title[sourceLang] && this.talk_title[sourceLang].title) {
		hasChange = talk_title !== this.talk_title[sourceLang].title;
	}

	if (hasChange) {
		const talkTitle = { ...this.talk_title, [sourceLang]: { title: talk_title, modified: new Date().toISOString() } };
		await appDb.public_talks.update(this.talk_number, { ...this, talk_title: talkTitle });

		this.talk_title = talkTitle;
	}
};
