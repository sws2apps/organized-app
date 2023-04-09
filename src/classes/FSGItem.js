import appDb from '../indexedDb/mainDb';

export class FSGItemClass {
  constructor(uid) {
    this.fieldServiceGroup_uid = uid;
    this.isCurrent = false;
    this.groups = [];
  }
}

FSGItemClass.prototype.loadDetails = async function () {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  this.isCurrent = appData.isCurrent || false;
  this.groups = appData.groups || [];

  return this;
};

FSGItemClass.prototype.addNewGroup = async function () {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  const newGroup = [...appData.groups, { group_uid: window.crypto.randomUUID(), persons: [] }];
  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: newGroup });

  await this.loadDetails();

  return this;
};

FSGItemClass.prototype.deleteGroup = async function (group_uid) {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  const newGroup = appData.groups.filter((group) => group.group_uid !== group_uid);
  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: newGroup });

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

  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

  await this.loadDetails();

  return this;
};

FSGItemClass.prototype.removePersonFromGroup = async function (group_uid, person_uid) {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  const groups = appData.groups;
  const currentGroup = groups.find((group) => group.group_uid === group_uid);
  currentGroup.persons = currentGroup.persons.filter((person) => person.person_uid !== person_uid);
  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

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

  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

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

  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

  await this.loadDetails();

  return this;
};

FSGItemClass.prototype.removePersonOverseer = async function (group_uid, person_uid) {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  const groups = appData.groups;
  const currentGroup = groups.find((group) => group.group_uid === group_uid);
  const person = currentGroup.persons.find((person) => person.person_uid === person_uid);
  person.isOverseer = false;

  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

  await this.loadDetails();

  return this;
};

FSGItemClass.prototype.removePersonAssistant = async function (group_uid, person_uid) {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  const groups = appData.groups;
  const currentGroup = groups.find((group) => group.group_uid === group_uid);
  const person = currentGroup.persons.find((person) => person.person_uid === person_uid);
  person.isAssistant = false;

  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

  await this.loadDetails();

  return this;
};

FSGItemClass.prototype.moveGroupForward = async function (group_uid) {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  const groups = appData.groups;

  const fromIndex = groups.findIndex((group) => group.group_uid === group_uid);
  const toIndex = fromIndex + 1;

  const element = groups.splice(fromIndex, 1)[0];
  groups.splice(toIndex, 0, element);

  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

  await this.loadDetails();

  return this;
};

FSGItemClass.prototype.moveGroupBackward = async function (group_uid) {
  const appData = await appDb.fieldServiceGroup.get(this.fieldServiceGroup_uid);
  const groups = appData.groups;

  const fromIndex = groups.findIndex((group) => group.group_uid === group_uid);
  const toIndex = fromIndex - 1;

  const element = groups.splice(fromIndex, 1)[0];
  groups.splice(toIndex, 0, element);

  await appDb.fieldServiceGroup.update(this.fieldServiceGroup_uid, { groups: groups });

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
