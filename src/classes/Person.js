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
    this.isUnavailable = false;
    this.assignments = [];
    this.timeAway = [];
    this.isMoved = false;
    this.isDisqualified = false;
    this.changes = [];
  }
}

PersonClass.prototype.loadDetails = async function () {
  const appData = await appDb.persons.get({ person_uid: this.person_uid });
  this.person_name = appData.person_name || '';
  this.person_displayName = appData.person_displayName || '';
  this.isMale = appData.isMale === undefined ? true : appData.isMale;
  this.isFemale = appData.isFemale === undefined ? false : appData.isFemale;
  this.isUnavailable = appData.isUnavailable === undefined ? false : appData.isUnavailable;
  this.isMoved = appData.isMoved === undefined ? false : appData.isMoved;
  this.isDisqualified = appData.isDisqualified === undefined ? false : appData.isDisqualified;
  this.assignments = appData.assignments || [];
  this.timeAway = appData.timeAway ? sortHistoricalDateDesc(appData.timeAway) : [];
  this.changes = appData.changes || [];
  return this;
};

PersonClass.prototype.save = async function (personData) {
  await appDb.table('persons').update(personData.person_uid, personData);
  this.person_name = personData.person_name;
  this.person_displayName = personData.person_displayName;
  this.isMale = personData.isMale;
  this.isFemale = personData.isFemale;
  this.isUnavailable = personData.isUnavailable;
  this.isMoved = personData.isMoved;
  this.isDisqualified = personData.isDisqualified;
  this.assignments = personData.assignments;
  this.timeAway = personData.timeAway;
  this.changes = personData.changes;
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
    for (let b = 0; b < cnAss.length; b++) {
      let weekFld = 'ass' + cnAss[b].iAss + '_type';
      const assType = weekData[weekFld];

      if (
        assType === 101 ||
        assType === 102 ||
        assType === 103 ||
        assType === 108 ||
        (assType >= 140 && assType < 170) ||
        (assType >= 170 && assType < 200)
      ) {
        for (let a = 0; a < varClasses.length; a++) {
          const fldName = 'ass' + cnAss[b].iAss + '_stu_' + varClasses[a].classLabel;

          if (typeof schedule[fldName] !== 'undefined') {
            if (schedule[fldName] === this.person_uid) {
              const assFldName = 'ass' + cnAss[b].iAss + '_ass_' + varClasses[a].classLabel;
              if (typeof schedule[assFldName] !== 'undefined') {
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
