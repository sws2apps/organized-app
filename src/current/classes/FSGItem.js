import appDb from '../../shared/indexedDb/mainDb';

export class FSGItemClass {
	constructor(uid) {
		this.fieldServiceGroup_uid = uid;
		this.isCurrent = false;
		this.groups = [];
		this.deleted = false;
		this.changes = [];
	}
}

FSGItemClass.prototype.loadDetails = async function () {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	this.isCurrent = appData.isCurrent || false;
	this.groups = appData.groups || [];
	this.deleted = appData.deleted || false;
	this.changes = appData.changes || [];

	return this;
};

FSGItemClass.prototype.addNewGroup = async function () {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const newUID = window.crypto.randomUUID();
	const newGroup = [...appData.groups, { group_uid: newUID, persons: [] }];

	this.changes.push({ date: new Date(), group_uid: newUID, type: 'added', index: appData.groups.length });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: newGroup, changes: this.changes });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.deleteGroup = async function (group_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const newGroup = appData.groups.filter((group) => group.group_uid !== group_uid);

	this.changes = this.changes.filter((record) => record.group_uid !== group_uid);
	this.changes.push({ date: new Date(), group_uid: group_uid, type: 'deleted' });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: newGroup, changes: this.changes });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.addPersonToGroup = async function (group_uid, person_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;
	const currentGroup = groups.find((group) => group.group_uid === group_uid);

	currentGroup.persons.push({
		person_uid: person_uid,
		isOverseer: false,
		isAssistant: false,
	});

	const newChanges = [];
	for (const record of this.changes) {
		if (record.group_uid === group_uid && record.person_uid === person_uid) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), group_uid, person_uid, type: 'person_added' });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.removePersonFromGroup = async function (group_uid, person_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;
	const currentGroup = groups.find((group) => group.group_uid === group_uid);
	currentGroup.persons = currentGroup.persons.filter((person) => person.person_uid !== person_uid);

	const newChanges = [];
	for (const record of this.changes) {
		if (record.group_uid === group_uid && record.person_uid === person_uid) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), group_uid, person_uid, type: 'person_removed' });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.makePersonOverseer = async function (group_uid, person_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;
	const currentGroup = groups.find((group) => group.group_uid === group_uid);
	const person = currentGroup.persons.find((person) => person.person_uid === person_uid);
	person.isOverseer = true;
	person.isAssistant = false;

	const newChanges = [];
	for (const record of this.changes) {
		if (
			record.group_uid === group_uid &&
			record.person_uid === person_uid &&
			(record.type === 'person_added' || record.type === 'person_modified')
		) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), group_uid, person_uid, isOverseer: true, type: 'person_modified' });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.makePersonAssistant = async function (group_uid, person_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;
	const currentGroup = groups.find((group) => group.group_uid === group_uid);
	const person = currentGroup.persons.find((person) => person.person_uid === person_uid);
	person.isAssistant = true;
	person.isOverseer = false;

	const newChanges = [];
	for (const record of this.changes) {
		if (
			record.group_uid === group_uid &&
			record.person_uid === person_uid &&
			(record.type === 'person_added' || record.type === 'person_modified')
		) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), group_uid, person_uid, isAssistant: true, type: 'person_modified' });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.removePersonOverseer = async function (group_uid, person_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;
	const currentGroup = groups.find((group) => group.group_uid === group_uid);
	const person = currentGroup.persons.find((person) => person.person_uid === person_uid);
	person.isOverseer = false;

	const newChanges = [];
	for (const record of this.changes) {
		if (
			record.group_uid === group_uid &&
			record.person_uid === person_uid &&
			(record.type === 'person_added' || record.type === 'person_modified')
		) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), group_uid, person_uid, type: 'person_modified' });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.removePersonAssistant = async function (group_uid, person_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;
	const currentGroup = groups.find((group) => group.group_uid === group_uid);
	const person = currentGroup.persons.find((person) => person.person_uid === person_uid);
	person.isAssistant = false;

	const newChanges = [];
	for (const record of this.changes) {
		if (
			record.group_uid === group_uid &&
			record.person_uid === person_uid &&
			(record.type === 'person_added' || record.type === 'person_modified')
		) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), group_uid, person_uid, type: 'person_modified' });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.moveGroupForward = async function (group_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;

	const fromIndex = groups.findIndex((group) => group.group_uid === group_uid);
	const toIndex = fromIndex + 1;

	const moved = groups[toIndex];

	const element = groups.splice(fromIndex, 1)[0];
	groups.splice(toIndex, 0, element);

	const newChanges = [];
	for (const record of this.changes) {
		if (record.group_uid === group_uid && (record.type === 'added' || record.type === 'modified')) {
			continue;
		}

		if (record.group_uid === moved.group_uid && (record.type === 'added' || record.type === 'modified')) {
			continue;
		}

		newChanges.push(record);
	}

	newChanges.push({ date: new Date(), group_uid, type: 'modified', index: toIndex });
	newChanges.push({ date: new Date(), group_uid: moved.group_uid, type: 'modified', index: fromIndex });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.moveGroupBackward = async function (group_uid) {
	const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
	const groups = appData.groups;

	const fromIndex = groups.findIndex((group) => group.group_uid === group_uid);
	const toIndex = fromIndex - 1;

	const moved = groups[toIndex];

	const element = groups.splice(fromIndex, 1)[0];
	groups.splice(toIndex, 0, element);

	const newChanges = [];
	for (const record of this.changes) {
		if (record.group_uid === group_uid && (record.type === 'added' || record.type === 'modified')) {
			continue;
		}

		if (record.group_uid === moved.group_uid && (record.type === 'added' || record.type === 'modified')) {
			continue;
		}

		newChanges.push(record);
	}
	newChanges.push({ date: new Date(), group_uid, type: 'modified', index: toIndex });
	newChanges.push({ date: new Date(), group_uid: moved.group_uid, type: 'modified', index: fromIndex });

	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups, changes: newChanges });

	await this.loadDetails();

	return this;
};

FSGItemClass.prototype.setAsCurrent = async function () {
	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { isCurrent: true });
	await this.loadDetails();
	return this;
};

FSGItemClass.prototype.setAsDraft = async function () {
	await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { isCurrent: false });
	await this.loadDetails();
	return this;
};

FSGItemClass.prototype.movePersonToGroup = async function (group_uid, new_group_uid, person_uid) {
	await this.removePersonFromGroup(group_uid, person_uid);
	await this.addPersonToGroup(new_group_uid, person_uid);
	return this;
};
