import appDb from '../../shared/indexedDb/mainDb';
import { comparePerson } from '../utils/compare';
import { AssignmentType } from './AssignmentType';
import { FSGList } from './FSGList';
import { PersonClass } from './Person';
import { Schedules } from './Schedules';

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
  const result = this.filterAdvanced(data);
  return result;
};

PersonsClass.prototype.filterBasic = function (data) {
  const txtSearch = data.txtSearch || '';
  const isMale = data.isMale || false;
  const isFemale = data.isFemale || false;
  const isUnassigned = data.isUnassigned || false;
  const assTypes = data.assTypes || [];

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

PersonsClass.prototype.filterAdvanced = function (data) {
  const txtSearch = data.txtSearch || '';
  const filter = data.filter || 'allPersons';
  const fsg = data.fsg || '';
  const month = data.month || `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  const initialData = this.filterBasic(data);

  let firstPassFiltered = [];
  if (filter === 'allPersons') {
    firstPassFiltered = [...initialData];
  }

  const allPublishers = [];
  for (const person of initialData) {
    const isElder = person.isElder(month);
    const isMS = person.isMS(month);
    const isPublisher = person.isPublisher(month);
    const isValid = person.isValidPublisher(month);

    if (isValid && (isElder || isMS || isPublisher)) {
      allPublishers.push(person);
    }
  }

  if (filter === 'allPublishers') {
    firstPassFiltered = [...allPublishers];
  }

  if (filter === 'baptizedPublishers') {
    for (const person of allPublishers) {
      const isElder = person.isElder(month);
      const isMS = person.isMS(month);
      const isPublisher = person.isPublisher(month);
      const isBaptized = person.isBaptizedDate(month);

      if (isBaptized && (isElder || isMS || isPublisher)) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'unbaptizedPublishers') {
    for (const person of allPublishers) {
      const isPublisher = person.isPublisher(month);
      const isBaptized = person.isBaptizedDate(month);

      if (!isBaptized && isPublisher) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'appointedBrothers') {
    for (const person of allPublishers) {
      const isElder = person.isElder(month);
      const isMS = person.isMS(month);

      if (isElder || isMS) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'elders') {
    for (const person of allPublishers) {
      const isElder = person.isElder(month);

      if (isElder) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'unpostedReports') {
    for (const person of allPublishers) {
      const isActive = person.isActivePublisher(month);
      if (isActive) {
        const hasReport = person.hasReport(month);

        if (!hasReport) {
          firstPassFiltered.push(person);
        }
      }
    }
  }

  if (filter === 'auxiliaryPioneers') {
    for (const person of allPublishers) {
      const isAuxP = person.isAuxiliaryPioneer(month);

      if (isAuxP) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'regularPioneers') {
    for (const person of allPublishers) {
      const isFR = person.isRegularPioneer(month);

      if (isFR) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'haveReports') {
    for (const person of allPublishers) {
      const hasReport = person.hasReport(month);

      if (hasReport) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'inactivePublishers') {
    for (const person of allPublishers) {
      const isActive = person.isActivePublisher(month);

      if (!isActive) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'activePublishers') {
    for (const person of allPublishers) {
      const isActive = person.isActivePublisher(month);

      if (isActive) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'fieldServiceGroup') {
    const currentFSG = FSGList.getCurrent();
    if (currentFSG) {
      const currentGroup = currentFSG.groups.find((group) => group.group_uid === fsg);

      if (currentGroup) {
        for (const person of allPublishers) {
          const isFound = currentGroup.persons.find((record) => record.person_uid === person.person_uid);

          if (isFound) {
            firstPassFiltered.push(person);
          }
        }
      }
    }
  }

  const secondPassFiltered = [];
  for (const person of firstPassFiltered) {
    if (person.person_name.toLowerCase().includes(txtSearch.toLowerCase())) {
      secondPassFiltered.push(person);
    }
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
    birthDate: personData.birthDate || null,
    isAnointed: personData.isAnointed || false,
    isOtherSheep: personData.isOtherSheep || true,
    isBaptized: personData.isBaptized || false,
    immersedDate: personData.immersedDate || null,
    email: personData.email || '',
    address: personData.address || '',
    phone: personData.phone || '',
    spiritualStatus: personData.spiritualStatus || [],
    otherService: personData.otherService || [],
    firstMonthReport: personData.firstMonthReport || null,
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

PersonsClass.prototype.getByName = function (person_name) {
  return this.list.find((person) => person.person_name === person_name);
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

      if (data.isMoved) {
        await appDb.table('persons').update(data.person_uid, data);
      }

      if (!data.isMoved) {
        const person = Persons.get(data.person_uid);
        data.changes = comparePerson(person, data);
        data.changes = data.changes.filter((item) => item.field !== 'lastAssignment');
        await person.save(data);
      }
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

PersonsClass.prototype.getByAssignment = function (payload) {
  let assType = payload.assType;
  const stuForAssistant = payload.stuForAssistant;
  const gender = payload.gender;
  const txtSearch = payload.txtSearch;
  const isLC = payload.isLC;
  const isElderPart = payload.isElderPart;
  const isAYFExplainTalk = payload.isAYFExplainTalk;

  // check is assType is linked to another type
  const assTypeList = AssignmentType.types;

  const linkTo = assTypeList.find((item) => item.code === assType)?.linkTo;
  assType = linkTo ? linkTo : assType;

  const data = Persons.list;

  // remove disqualified students
  let appData = data.filter((person) => person.isDisqualified === false);

  // filter by gender
  if (
    assType === 101 ||
    assType === 102 ||
    assType === 103 ||
    assType === 123 ||
    assType === 124 ||
    assType === 125 ||
    (assType === 126 && !isAYFExplainTalk)
  ) {
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
      const main = Persons.get(stuForAssistant);

      if (main) {
        dbPersons = appData.filter(
          (person) =>
            person.isMale === main.isMale &&
            person.isFemale === main.isFemale &&
            (person.assignments.find((assignment) => assignment.code === 101) ||
              person.assignments.find((assignment) => assignment.code === 102) ||
              person.assignments.find((assignment) => assignment.code === 103) ||
              person.assignments.find((assignment) => assignment.code === 123) ||
              person.assignments.find((assignment) => assignment.code === 124) ||
              person.assignments.find((assignment) => assignment.code === 125) ||
              person.assignments.find((assignment) => assignment.code === 126))
        );
      }
    }
  } else {
    if (assType === 121) {
      dbPersons = appData.filter((person) =>
        person.assignments.find((assignment) => assignment.code === 120 || assignment.code === 121)
      );
    } else {
      if (assType === 126 && isAYFExplainTalk) {
        dbPersons = appData.filter((person) =>
          person.assignments.find((assignment) => assignment.code === 126 && person.isMale)
        );
      } else {
        dbPersons = appData.filter((person) => person.assignments.find((assignment) => assignment.code === assType));
      }
    }
  }

  const persons = [];
  const uniqueAssignment = [100, 104, 110, 111, 112, 113, 114, 115, 116, 118, 119, 120, 121, 122];
  let isUnique = uniqueAssignment.find((item) => item === assType);

  if (assType === 126) {
    if (isAYFExplainTalk) isUnique = true;
  }

  const studentAssignment =
    assType === 101 ||
    (assType >= 140 && assType < 170) ||
    assType === 102 ||
    (assType >= 170 && assType < 200) ||
    assType === 103 ||
    assType === 108 ||
    assType === 123 ||
    assType === 124 ||
    assType === 125 ||
    (assType === 126 && !isAYFExplainTalk);

  // get elders only if applied
  let filteredElders = [];
  if (isLC && isElderPart) {
    const allElders = Persons.filterAdvanced({ txtSearch: '', assTypes: [], filter: 'elders' });

    if (allElders.length > 0) {
      for (const person of dbPersons) {
        const currentPerson = Persons.get(person.person_uid);
        const isElder = currentPerson.isElder();

        if (isElder) {
          filteredElders.push(person);
        }
      }

      dbPersons = filteredElders;
    }
  }

  for (const person of dbPersons) {
    const obj = {};
    obj.person_uid = person.person_uid;

    obj.lastAssignmentAll = person.lastAssignment();
    obj.lastAssignmentAllFormat = person.lastAssignmentFormatted();

    obj.lastAssignment = '';
    obj.lastAssignmentFormat = '';
    obj.lastAssistant = '';
    obj.lastAssistantFormat = '';

    if (assType) {
      let history;

      if (isUnique) {
        history = Schedules.history.find(
          (item) => item.studentID === person.person_uid && item.assignmentID === assType
        );
      }

      if (studentAssignment || assType === 'isAssistant') {
        history = Schedules.history.find(
          (item) =>
            item.studentID === person.person_uid &&
            (item.assignmentID === 101 ||
              (item.assignmentID >= 140 && item.assignmentID < 170) ||
              item.assignmentID === 102 ||
              (item.assignmentID >= 170 && item.assignmentID < 200) ||
              item.assignmentID === 103 ||
              item.assignmentID === 108 ||
              item.assignmentID === 123 ||
              item.assignmentID === 124 ||
              item.assignmentID === 125 ||
              item.assignmentID === 126)
        );

        const assistantHistory = Schedules.history.find(
          (item) => item.studentID === person.person_uid && item.assignmentID === 109
        );

        if (assistantHistory) {
          obj.lastAssistant = assistantHistory.weekOf;
          obj.lastAssistantFormat = assistantHistory.weekOfFormatted;
        }
      }

      if (history) {
        obj.lastAssignment = history.weekOf;
        obj.lastAssignmentFormat = history.weekOfFormatted;
      }
    }

    obj.person_displayName = person.person_displayName;
    obj.timeAway = person.timeAway;
    obj.isMale = person.isMale;
    obj.isFemale = person.isFemale;
    persons.push(obj);
  }

  persons.sort((a, b) => {
    let fldFilter = 'lastAssignment';
    if (assType === 'isAssistant') fldFilter = 'lastAssistant';

    if (a[fldFilter] === '') return -1;
    if (b[fldFilter] === '') return 1;
    if (a[fldFilter] === b[fldFilter]) return 0;

    return a[fldFilter] > b[fldFilter] ? 1 : -1;
  });

  return persons;
};

PersonsClass.prototype.getActivePublishers = function (month) {
  const activePublishers = [];
  for (const person of this.list) {
    const isValid = person.isValidPublisher(month);
    const isActive = person.isActivePublisher(month);
    if (isValid && isActive) {
      activePublishers.push(person);
    }
  }
  return activePublishers;
};

PersonsClass.prototype.getInactivePublishers = function (month) {
  const inactivePublishers = [];
  for (const person of this.list) {
    const isInactive = !person.isActivePublisher(month);
    if (isInactive) {
      inactivePublishers.push(person);
    }
  }

  return inactivePublishers;
};

PersonsClass.prototype.reset = async function () {
  await appDb.persons.clear();
  this.list.length = 0;
};

PersonsClass.prototype.cleanAdd = async function (data) {
  await this.add(data);
};

export const Persons = new PersonsClass();
