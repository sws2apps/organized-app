import dateFormat from 'dateformat';
import appDb from '../indexedDb/mainDb';
import { sortHistoricalDateDesc } from '../utils/app';
import { Persons } from './Persons';
import { Schedules } from './Schedules';
import { Sources } from './Sources';

export class PersonClass {
  constructor(uid) {
    this.person_uid = uid;
    this.person_name = '';
    this.person_displayName = '';
    this.isMale = true;
    this.isFemale = true;
    this.birthDate = null;
    this.isAnointed = false;
    this.isOtherSheep = true;
    this.isBaptized = false;
    this.immersedDate = null;
    this.isUnavailable = false;
    this.assignments = [];
    this.timeAway = [];
    this.isMoved = false;
    this.isDisqualified = false;
    this.email = '';
    this.address = '';
    this.phone = '';
    this.spiritualStatus = [];
    this.otherService = [];
    this.changes = [];
  }
}

PersonClass.prototype.loadDetails = async function () {
  const appData = await appDb.persons.get({ person_uid: this.person_uid });
  this.person_name = appData.person_name || '';
  this.person_displayName = appData.person_displayName || '';
  this.isMale = appData.isMale === undefined ? true : appData.isMale;
  this.isFemale = appData.isFemale === undefined ? false : appData.isFemale;
  this.birthDate = appData.birthDate === undefined ? null : appData.birthDate;
  this.isAnointed = appData.isAnointed === undefined ? false : appData.isAnointed;
  this.isOtherSheep = appData.isOtherSheep === undefined ? true : appData.isOtherSheep;
  this.isBaptized = appData.isBaptized === undefined ? false : appData.isBaptized;
  this.immersedDate = appData.immersedDate === undefined ? null : appData.immersedDate;
  this.isUnavailable = appData.isUnavailable === undefined ? false : appData.isUnavailable;
  this.isMoved = appData.isMoved === undefined ? false : appData.isMoved;
  this.isDisqualified = appData.isDisqualified === undefined ? false : appData.isDisqualified;
  this.assignments = appData.assignments || [];
  this.timeAway = appData.timeAway ? sortHistoricalDateDesc(appData.timeAway) : [];
  this.changes = appData.changes || [];
  this.email = appData.email || '';
  this.address = appData.address || '';
  this.phone = appData.phone || '';
  this.spiritualStatus = appData.spiritualStatus || [];
  this.otherService = appData.otherService || [];
  return this;
};

PersonClass.prototype.save = async function (personData) {
  await appDb.table('persons').update(personData.person_uid, personData);
  this.person_name = personData.person_name;
  this.person_displayName = personData.person_displayName;
  this.isMale = personData.isMale;
  this.isFemale = personData.isFemale;
  this.birthDate = personData.birthDate;
  this.isAnointed = personData.isAnointed;
  this.isOtherSheep = personData.isOtherSheep;
  this.isBaptized = personData.isBaptized;
  this.immersedDate = personData.immersedDate;
  this.isUnavailable = personData.isUnavailable;
  this.isMoved = personData.isMoved;
  this.isDisqualified = personData.isDisqualified;
  this.assignments = personData.assignments;
  this.timeAway = personData.timeAway;
  this.changes = personData.changes;
  this.email = personData.email;
  this.address = personData.address;
  this.phone = personData.phone;
  this.spiritualStatus = personData.spiritualStatus;
  this.otherService = personData.otherService;
};

PersonClass.prototype.lastAssignment = function () {
  return Schedules.personLastAssignment(this.person_uid);
};

PersonClass.prototype.lastAssignmentFormatted = function () {
  return Schedules.personLastAssignmentFormatted(this.person_uid);
};

PersonClass.prototype.historyAssignments = function () {
  return Schedules.personAssignments(this.person_uid);
};

PersonClass.prototype.assistantHistory = function () {
  const dbHistory = [];

  for (const schedule of Schedules.list) {
    const weekData = Sources.get(schedule.weekOf).local();
    const [varMonth, varDay, varYear] = schedule.weekOf.split('/');
    const lDate = new Date(varYear, varMonth - 1, varDay);
    const dateFormatted = dateFormat(lDate, 'dd/mm/yyyy');
    const cnAss = [{ iAss: 1 }, { iAss: 2 }, { iAss: 3 }];
    const varClasses = [{ classLabel: 'A' }, { classLabel: 'B' }];

    //AYF Assigment History
    for (const assignment of cnAss) {
      let weekFld = 'ass' + assignment.iAss + '_type';
      const assType = weekData[weekFld];

      if (
        assType === 101 ||
        assType === 102 ||
        assType === 103 ||
        assType === 108 ||
        (assType >= 140 && assType < 170) ||
        (assType >= 170 && assType < 200)
      ) {
        for (const classItem of varClasses) {
          const fldName = 'ass' + assignment.iAss + '_stu_' + classItem.classLabel;

          if (typeof schedule[fldName] !== 'undefined' && schedule[fldName] !== '') {
            if (schedule[fldName] === this.person_uid) {
              const assFldName = 'ass' + assignment.iAss + '_ass_' + classItem.classLabel;
              if (typeof schedule[assFldName] !== 'undefined' && schedule[assFldName] !== '') {
                let assistant = {};
                assistant.ID = crypto.randomUUID();
                assistant.weekOf = schedule.weekOf;
                assistant.weekOfFormatted = dateFormatted;
                assistant.mainStuID = schedule[fldName];
                assistant.assistantStuID = schedule[assFldName];
                const person = Persons.get(assistant.assistantStuID);
                assistant.assistantName = person.person_displayName;
                dbHistory.push(assistant);
                assistant = null;
              }
            }
          }
        }
      }
    }
  }

  return dbHistory;
};
