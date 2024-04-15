import { promiseGetRecoil } from 'recoil-outside';
import appDb from '../../shared/indexedDb/mainDb';
import { Persons } from './Persons';
import { S34s } from './S34s';
import { Schedules } from './Schedules';
import { Setting } from './Setting';
import { VisitingSpeakerClass } from './VisitingSpeaker';
import { congSpeakersRequestsStatusState } from '../states/congregation';

class VisitingSpeakersClass {
	constructor() {
		this.congregations = [];
		this.speakers = [];
	}
}

VisitingSpeakersClass.prototype.loadAll = async function () {
	this.congregations.length = 0;
	this.speakers.length = 0;

	const tmp = await appDb.visiting_speakers.toArray();
	const appData = tmp.filter((record) => !record.is_deleted);

	for (const cong of appData) {
		const tmpSpeakers = structuredClone(cong.cong_speakers);

		cong.cong_speakers.length = 0;

		const isSelf = cong.cong_number === +Setting.cong_number;

		for (const speaker of tmpSpeakers) {
			const Speaker = new VisitingSpeakerClass(speaker.person_uid);
			Speaker.person_name = isSelf ? Persons.get(speaker.person_uid).person_name : speaker.person_name;
			Speaker.person_displayName = isSelf
				? Persons.get(speaker.person_uid).person_displayName
				: speaker.person_displayName;
			Speaker.talks = speaker.talks;
			Speaker.is_local = cong.is_local;
			Speaker.cong_number = cong.cong_number;
			Speaker.cong_id = cong.cong_id;
			Speaker.cong_name = cong.cong_name || '';
			Speaker.is_elder = isSelf ? Persons.get(speaker.person_uid).isElder() : speaker.is_elder;
			Speaker.is_ms = isSelf ? Persons.get(speaker.person_uid).isMS() : speaker.is_ms;
			Speaker.email = isSelf ? Persons.get(speaker.person_uid).email : speaker.email;
			Speaker.phone = isSelf ? Persons.get(speaker.person_uid).phone : speaker.phone;

			this.speakers.push(Speaker);
			cong.cong_speakers.push(Speaker);
		}

		this.congregations.push(cong);
	}
};

VisitingSpeakersClass.prototype.getCongregation = function (cong_number) {
	return this.congregations.find((record) => record.cong_number === +cong_number);
};

VisitingSpeakersClass.prototype.getCongregationById = function (id) {
	return this.congregations.find((record) => record.cong_id === id);
};

VisitingSpeakersClass.prototype.createLocalCongregation = async function () {
	const data = {
		cong_name: Setting.cong_name,
		cong_number: +Setting.cong_number,
		cong_speakers: [],
		is_local: true,
		is_deleted: false,
		request_status: 'approved',
		changes: [],
	};

	await appDb.visiting_speakers.add(data);

	this.congregations.push(data);

	return data;
};

VisitingSpeakersClass.prototype.createCongregation = async function ({ cong_id, cong_name, cong_number }) {
	const data = {
		cong_name: cong_name,
		cong_number: +cong_number,
		cong_speakers: [],
		is_local: cong_id ? false : true,
		is_deleted: false,
		request_status: cong_id ? 'pending' : 'approved',
		changes: [],
	};

	if (cong_id) {
		data.cong_id = cong_id;
	}

	const appData = await appDb.visiting_speakers.toArray();
	const isDeleted = appData.find((record) => record.cong_number === +cong_number);

	if (!isDeleted) {
		await appDb.visiting_speakers.add(data);
	}

	if (isDeleted) {
		await appDb.visiting_speakers.update(+cong_number, {
			is_deleted: false,
		});
	}

	this.congregations.push(data);

	return data;
};

VisitingSpeakersClass.prototype.getSelf = function () {
	const cong = this.congregations.find((record) => record.cong_number === +Setting.cong_number);
	return (
		cong?.cong_speakers
			.filter((record) => !record.is_deleted)
			.sort((a, b) => {
				return a.person_name > b.person_name ? 1 : -1;
			}) || []
	);
};

VisitingSpeakersClass.prototype.getSpeakers = function (cong_number) {
	const cong = this.congregations.find((record) => record.cong_number === +cong_number);
	return (
		cong?.cong_speakers
			.filter((record) => !record.is_deleted)
			.sort((a, b) => {
				return a.person_name > b.person_name ? 1 : -1;
			}) || []
	);
};

VisitingSpeakersClass.prototype.add = async function ({
	person_uid,
	person_name,
	person_displayName,
	is_elder,
	is_ms,
	talks,
	is_self,
	cong_number,
	email,
	phone,
}) {
	let cong;

	if (is_self) {
		// check if local congregation exists
		cong = this.congregations.find((record) => record.cong_number === +Setting.cong_number);
		if (!cong) {
			cong = await this.createLocalCongregation();
		}
	}

	if (!is_self) {
		cong = this.congregations.find((record) => record.cong_number === cong_number);
	}

	// create new speaker record
	const Speaker = new VisitingSpeakerClass(person_uid);
	Speaker.person_name = is_self ? Persons.get(person_uid).person_name : person_name;
	Speaker.person_displayName = is_self ? Persons.get(person_uid).person_displayName : person_displayName;
	Speaker.talks = talks || [];
	Speaker.is_local = cong.cong_id ? false : true;
	Speaker.cong_number = is_self ? +Setting.cong_number : cong_number;
	Speaker.cong_id = cong.cong_id || '';
	Speaker.cong_name = is_self ? Setting.cong_name : cong.cong_name;
	Speaker.is_elder = is_self ? false : is_elder;
	Speaker.is_ms = is_self ? false : is_ms;
	Speaker.is_deleted = false;
	Speaker.is_unavailable = false;
	Speaker.email = is_self ? '' : email;
	Speaker.phone = is_self ? '' : phone;

	// remove sibling record
	cong.cong_speakers = cong.cong_speakers.filter((speaker) => speaker.person_uid !== person_uid);

	// add record to db
	const newSpeakers = cong.cong_speakers.concat({
		person_uid: Speaker.person_uid,
		person_name: is_self ? '' : Speaker.person_name,
		person_displayName: is_self ? '' : Speaker.person_displayName,
		talks: [],
		is_deleted: false,
		is_unavailable: false,
		is_elder: is_self ? false : Speaker.is_elder,
		is_ms: is_self ? false : Speaker.is_ms,
		email: is_self ? '' : Speaker.email,
		phone: is_self ? '' : Speaker.phone,
		changes: [],
	});

	await appDb.visiting_speakers.update(cong.cong_number, {
		cong_speakers: newSpeakers,
	});

	cong.cong_speakers.push(Speaker);
	this.speakers.push(Speaker);
};

VisitingSpeakersClass.prototype.updateSpeakerTalks = async function ({ talks, person_uid, cong_number }) {
	talks = talks.map((talk) => {
		return talk.talk_number;
	});

	const currentCong = this.getCongregation(cong_number);
	const speaker = currentCong.cong_speakers.find((record) => record.person_uid === person_uid);
	speaker.updateTalks(talks);

	const isSelf = currentCong.cong_number === +Setting.cong_number;

	const newSpeakers = currentCong.cong_speakers.map((speaker) => {
		const tmp = structuredClone(speaker);

		delete tmp.cong_name;
		delete tmp.cong_number;
		delete tmp.cong_id;
		delete tmp.is_local;

		if (isSelf) {
			tmp.person_displayName = '';
			tmp.person_name = '';
			tmp.is_elder = false;
			tmp.is_ms = false;
			tmp.email = '';
			tmp.phone = '';
		}

		return tmp;
	});

	await appDb.visiting_speakers.update(cong_number, {
		cong_speakers: newSpeakers,
	});
};

VisitingSpeakersClass.prototype.updateSpeakerDetails = async function ({
	fieldName,
	fieldValue,
	person_uid,
	cong_number,
}) {
	const currentCong = this.getCongregation(cong_number);
	const speaker = currentCong.cong_speakers.find((record) => record.person_uid === person_uid);
	speaker.updateDetails(fieldName, fieldValue);

	const isSelf = currentCong.cong_number === +Setting.cong_number;

	const newSpeakers = currentCong.cong_speakers.map((speaker) => {
		const tmp = structuredClone(speaker);

		delete tmp.cong_name;
		delete tmp.cong_number;
		delete tmp.cong_id;
		delete tmp.is_local;

		if (isSelf) {
			tmp.person_displayName = '';
			tmp.person_name = '';
			tmp.is_elder = false;
			tmp.is_ms = false;
			tmp.email = '';
			tmp.phone = '';
		}

		return tmp;
	});

	await appDb.visiting_speakers.update(cong_number, {
		cong_speakers: newSpeakers,
	});
};

VisitingSpeakersClass.prototype.getRemoteCongregations = function () {
	const result = [];

	for (const cong of this.congregations) {
		if (!cong.is_local) {
			result.push(cong.cong_id);
		}
	}

	return result;
};

VisitingSpeakersClass.prototype.acknowledgeApproval = async function (cong_number) {
	cong_number = +cong_number;

	const currentCong = this.getCongregation(cong_number);

	await appDb.visiting_speakers.update(cong_number, {
		notif_dismissed: true,
		request_status: 'approved',
	});

	currentCong.notif_dismissed = true;
	currentCong.request_status = 'approved';
};

VisitingSpeakersClass.prototype.visitingSpeakersCongregations = function () {
	const result = [];

	for (const cong of this.congregations) {
		if (!cong.is_local && cong.request_status === 'approved') {
			result.push(cong.cong_id);
		}
	}

	return result;
};

VisitingSpeakersClass.prototype.getSpeaker = function (cong_number, speaker_uid) {
	const cong = this.congregations.find((record) => record.cong_number === +cong_number);
	const speaker = cong.cong_speakers.find((record) => record.person_uid === speaker_uid);
	return speaker;
};

VisitingSpeakersClass.prototype.getSpeakerByUid = function (speaker_uid) {
	return this.speakers.find((speaker) => speaker.person_uid === speaker_uid);
};

VisitingSpeakersClass.prototype.updateIncomingSpeaker = async function ({
	person_uid,
	person_name,
	person_displayName,
	is_elder,
	is_ms,
	talks,
	cong_number,
	email,
	phone,
}) {
	const cong = this.getCongregation(cong_number);

	const Speaker = this.getSpeaker(cong_number, person_uid);
	Speaker.person_name = person_name;
	Speaker.person_displayName = person_displayName;
	Speaker.talks = talks;
	Speaker.is_elder = is_elder;
	Speaker.is_ms = is_ms;
	Speaker.email = email;
	Speaker.phone = phone;
	Speaker.changes = [];

	// add record to db
	const newSpeakers = cong.cong_speakers.map((speaker) => {
		const tmp = structuredClone(speaker);

		delete tmp.cong_name;
		delete tmp.cong_number;
		delete tmp.cong_id;
		delete tmp.is_local;

		return tmp;
	});

	await appDb.visiting_speakers.update(cong_number, {
		cong_speakers: newSpeakers,
	});
};

VisitingSpeakersClass.prototype.updateIncomingSpeakers = async function (data) {
	for await (const cong of data) {
		const currentCong = this.getCongregationById(cong.cong_id);

		for await (const speaker of cong.speakers) {
			const speakerExist = this.getSpeaker(currentCong.cong_number, speaker.speaker_uid);

			if (!speakerExist) {
				await this.add({
					person_uid: speaker.speaker_uid,
					person_name: speaker.speaker_name,
					person_displayName: speaker.speaker_displayName,
					is_elder: speaker.speaker_isElder,
					is_ms: speaker.speaker_isMS,
					email: speaker.speaker_email,
					phone: speaker.speaker_phone,
					talks: speaker.speaker_talks,
					cong_number: currentCong.cong_number,
				});
			}

			if (speakerExist) {
				await this.updateIncomingSpeaker({
					person_uid: speaker.speaker_uid,
					person_name: speaker.speaker_name,
					person_displayName: speaker.speaker_displayName,
					is_elder: speaker.speaker_isElder,
					is_ms: speaker.speaker_isMS,
					email: speaker.speaker_email,
					phone: speaker.speaker_phone,
					talks: speaker.speaker_talks,
					cong_number: currentCong.cong_number,
				});
			}
		}
	}
};

VisitingSpeakersClass.prototype.getSpeakerByTalk = function (talk_number) {
	const result = [];

	const speakers = this.speakers.filter((speaker) => speaker.cong_number !== +Setting.cong_number);

	for (const speaker of speakers) {
		const isOK = speaker.talks.find((talk) => talk === talk_number);
		if (isOK) {
			result.push(speaker);
		}
	}

	return result;
};

VisitingSpeakersClass.prototype.incomingSpeakersTalks = function (talk) {
	let tmpTalks = [];

	if (!talk) {
		const speakers = this.speakers.filter((speaker) => speaker.cong_number !== +Setting.cong_number);
		for (const speaker of speakers) {
			tmpTalks = tmpTalks.concat(speaker.talks);
		}

		tmpTalks = tmpTalks.filter((v, i, a) => a.findIndex((v2) => v2 === v) === i);
		tmpTalks.sort((a, b) => (a > b ? 1 : -1));
	}

	if (talk) {
		tmpTalks = [talk];
	}

	const talks = [];

	const allTalks = S34s.getLocal();

	for (const talk of tmpTalks) {
		const obj = {};
		obj.talk_number = talk;
		obj.talk_title = allTalks.find((record) => record.talk_number === talk).talk_title;
		const currentTalk = Schedules.talkHistory.find((record) => record.talk_number === talk);
		obj.last_delivered = currentTalk.last_delivered;
		obj.last_delivered_formatted = currentTalk.last_delivered_formatted;
		obj.incoming_speakers = this.getSpeakerByTalk(talk);
		talks.push(obj);
	}

	return talks;
};

VisitingSpeakersClass.prototype.updateSpeakersRequestsStatus = async function (congregations) {
	for await (const cong of congregations) {
		const cong_number = +cong.cong_number;

		const currentCong = this.getCongregation(cong_number);

		const obj = { request_status: cong.request_status };

		if (cong.request_status === 'disapproved') {
			obj.cong_speakers = [];
		}

		await appDb.visiting_speakers.update(cong_number, obj);

		currentCong.request_status = cong.request_status;

		if (cong.request_status === 'disapproved') {
			currentCong.cong_speakers = [];
			this.speakers = this.speakers.filter((speaker) => speaker.cong_number !== cong_number);
		}
	}
};

VisitingSpeakersClass.prototype.deleteCongregation = async function (cong_number) {
	cong_number = +cong_number;

	await appDb.visiting_speakers.update(cong_number, {
		cong_speakers: [],
		changes: [],
		request_status: '',
		notif_dismissed: false,
		is_deleted: true,
	});

	this.congregations = this.congregations.filter((record) => record.cong_number !== cong_number);
	this.speakers = this.speakers.filter((record) => record.cong_number !== cong_number);
};

VisitingSpeakersClass.prototype.getCongregationsApprovedNew = async function () {
	const requests = await promiseGetRecoil(congSpeakersRequestsStatusState);

	const result = [];

	for (const request of requests) {
		if (request.request_status === 'approved') {
			const cong = this.getCongregation(request.cong_number);

			if (!cong.notif_dismissed) {
				result.push(request);
			}
		}
	}

	return result;
};

VisitingSpeakersClass.prototype.deleteSpeaker = async function ({ person_uid, cong_number }) {
	const currentCong = this.getCongregation(cong_number);
	const speaker = currentCong.cong_speakers.find((record) => record.person_uid === person_uid);
	speaker.is_deleted = true;

	const isSelf = currentCong.cong_number === +Setting.cong_number;

	const newSpeakers = currentCong.cong_speakers.map((speaker) => {
		const tmp = structuredClone(speaker);

		delete tmp.cong_name;
		delete tmp.cong_number;
		delete tmp.cong_id;
		delete tmp.is_local;

		if (isSelf) {
			tmp.person_displayName = '';
			tmp.person_name = '';
			tmp.is_elder = false;
			tmp.is_ms = false;
			tmp.email = '';
			tmp.phone = '';
		}

		return tmp;
	});

	await appDb.visiting_speakers.update(cong_number, {
		cong_speakers: newSpeakers,
	});
};

export const VisitingSpeakers = new VisitingSpeakersClass();
