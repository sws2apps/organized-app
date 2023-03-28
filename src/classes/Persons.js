import appDb from '../indexedDb/mainDb';
import { comparePerson } from '../utils/compare';
import { AssignmentType } from './AssignmentType';
import { PersonClass } from './Person';

class PersonsClass {
  constructor() {
    this.list = [];
  }
}

PersonsClass.prototype.sort = function () {
  this.list.sort((a, b) => {
    return a.person_name > b.person_name ? 1 : -1;
  });
};

PersonsClass.prototype.loadAll = async function () {
  this.list.length = 0;
  const data = await appDb.persons.toArray();

  const appData = data.filter((person) => person.isMoved === false);

  for (const person of appData) {
    const Person = new PersonClass(person.person_uid);
    await Person.loadDetails();
    this.list.push(Person);
  }

  this.sort();
};

PersonsClass.prototype.filter = function (data) {
  const { txtSearch, isMale, isFemale, isUnassigned, assTypes } = data;

  const firstPassFiltered = [];
  for (const person of this.list) {
    if (person.person_name.toLowerCase().includes(txtSearch.toLowerCase())) {
      if (isMale === isFemale) {
        firstPassFiltered.push(person);
      }

      if (isMale !== isFemale) {
        if (person.isMale === isMale && person.isFemale === isFemale) {
          firstPassFiltered.push(person);
        }
      }
    }
  }

  const secondPassFiltered = [];
  for (const person of firstPassFiltered) {
    const assignments = person.assignments;

    let passed = true;

    if (isUnassigned) {
      if (assignments.length > 0) {
        passed = false;
      }
    }

    if (!isUnassigned) {
      for (const type of assTypes) {
        const found = assignments.find((assignment) => assignment.code === type);
        if (!found) {
          passed = false;
          break;
        }
      }
    }

    if (passed) secondPassFiltered.push(person);
  }

  return secondPassFiltered;
};

PersonsClass.prototype.delete = async function (uid) {
  await appDb.persons.delete(uid);

  const data = {
    table: 'persons',
    date: new Date().toISOString(),
    ref: uid,
  };

  await appDb.deleted.add(data);

  this.list = this.list.filter((person) => person.person_uid !== uid);
};

PersonsClass.prototype.add = async function (personData) {
  await appDb.persons.add({
    person_uid: personData.person_uid,
    person_name: personData.person_name,
    person_displayName: personData.person_displayName,
    isMale: personData.isMale,
    isFemale: personData.isFemale,
    isUnavailable: personData.isUnavailable || false,
    changes: personData.changes || [],
    assignments: personData.assignments || [],
    isMoved: personData.isMoved || false,
    isDisqualified: personData.isDisqualified || false,
  });

  const person = new PersonClass(personData.person_uid);
  await person.loadDetails();

  this.list.push(person);
  this.sort();
};

PersonsClass.prototype.get = function (uid) {
  return this.list.find((person) => person.person_uid === uid);
};

PersonsClass.prototype.getByDisplayName = function (displayName) {
  return this.list.find((person) => person.person_displayName === displayName);
};

PersonsClass.prototype.recentPersons = function (data) {
  const recentPersons = data ? JSON.parse(data) : [];

  const result = [];
  if (this.list.length === 0) {
    localStorage.removeItem('recentPersons');
  } else {
    let temp = recentPersons;
    recentPersons.forEach((recent) => {
      const findPerson = this.list.find((person) => person.person_uid === recent);
      if (findPerson) {
        result.push(findPerson);
      } else {
        temp = temp.filter((tmp) => tmp !== recent);
        localStorage.setItem('recentPersons', JSON.stringify(temp));
      }
    });
  }

  return result;
};

PersonsClass.prototype.preSave = async function (data) {
  const { person_uid, person_name, person_displayName } = data;
  if (person_name && person_displayName) {
    if (person_uid) {
      if (data.historyAssignments) delete data.historyAssignments;
      const person = Persons.get(data.person_uid);
      data.changes = comparePerson(person, data);

      data.changes = data.changes.filter((item) => item.field !== 'lastAssignment');
      data.changes = data.changes.filter((item) => item.field !== 'assignments');

      await person.save(data);
    } else {
      const obj = {
        person_uid: window.crypto.randomUUID(),
        isMoved: false,
        isDisqualified: false,
        ...data,
      };
      await this.add(obj);
    }

    return true;
  } else {
    return false;
  }
};

PersonsClass.prototype.isExist = function (name) {
  return this.list.find((person) => person.person_name === name) ? true : false;
};

PersonsClass.prototype.getByAssignment = function (assType, stuForAssistant, gender, txtSearch) {
  // check is assType is linked to another type

  const assTypeList = AssignmentType.types;

  const linkTo = assTypeList.find((item) => item.code === assType)?.linkTo;
  assType = linkTo ? linkTo : assType;

  const data = Persons.list;

  // remove disqualified students
  let appData = data.filter((person) => person.isDisqualified === false);

  // filter by gender
  if (assType === 101 || assType === 102 || assType === 103) {
    if (gender === 'male') {
      appData = appData.filter((person) => person.isMale === true);
    }

    if (gender === 'female') {
      appData = appData.filter((person) => person.isFemale === true);
    }
  }

  // search
  if (txtSearch && txtSearch.length > 0) {
    appData = appData.filter((person) => person.person_name.toLowerCase().indexOf(txtSearch.toLowerCase()) !== -1);
  }

  let dbPersons = [];
  if (assType === 'isAssistant') {
    if (stuForAssistant) {
      const main = Persons.getByDisplayName(stuForAssistant);
      dbPersons = appData.filter(
        (person) =>
          person.isMale === main.isMale &&
          person.isFemale === main.isFemale &&
          (person.assignments.find((assignment) => assignment.code === 101) ||
            person.assignments.find((assignment) => assignment.code === 102) ||
            person.assignments.find((assignment) => assignment.code === 103))
      );
    } else {
      dbPersons = appData.filter(
        (person) =>
          person.assignments.find((assignment) => assignment.code === 101) ||
          person.assignments.find((assignment) => assignment.code === 102) ||
          person.assignments.find((assignment) => assignment.code === 103)
      );
    }
  } else {
    dbPersons = appData.filter((person) => person.assignments.find((assignment) => assignment.code === assType));
  }

  const persons = [];

  for (const person of dbPersons) {
    const obj = {};
    obj.person_uid = person.person_uid;
    obj.lastAssignment = person.lastAssignment();
    obj.lastAssignmentFormat = person.lastAssignmentFormatted();
    obj.person_displayName = person.person_displayName;
    obj.timeAway = person.timeAway;
    obj.isMale = person.isMale;
    obj.isFemale = person.isFemale;
    persons.push(obj);
  }

  persons.sort((a, b) => {
    if (a.lastAssignment === '') return -1;
    if (b.lastAssignment === '') return 1;
    if (a.lastAssignment === b.lastAssignment) return 0;
    const dateA =
      a.lastAssignment.split('/')[2] + '/' + a.lastAssignment.split('/')[0] + '/' + a.lastAssignment.split('/')[1];
    const dateB =
      b.lastAssignment.split('/')[2] + '/' + b.lastAssignment.split('/')[0] + '/' + b.lastAssignment.split('/')[1];
    return dateA > dateB ? 1 : -1;
  });
  return persons;
};

export const Persons = new PersonsClass();
