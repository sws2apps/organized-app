import dateFormat from 'dateformat';
import appDb from '../../shared/indexedDb/mainDb';
import { addMonths, monthDiff, sortHistoricalDateDesc } from '../utils/app';
import { Persons } from './Persons';
import { Schedules } from './Schedules';
import { Sources } from './Sources';
import { S21s } from './S21s';
import { ServiceYear } from './ServiceYear';
import { Setting } from './Setting';
import { checkAYFExplainingBeliefsAssignment } from '../utils/sourceMaterial';

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
    this.firstMonthReport = null;
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
  this.firstMonthReport = appData.firstMonthReport || null;
  return this;
};

PersonClass.prototype.save = async function (personData) {
  await appDb.table('persons').update(this.person_uid, personData);
  if (personData.isMoved) {
    Persons.list = Persons.list.filter((person) => person.person_uid !== this.person_uid);
    return;
  }
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
  this.firstMonthReport = personData.firstMonthReport;
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
    const [varYear, varMonth, varDay] = schedule.weekOf.split('/');
    const lDate = new Date(varYear, varMonth - 1, varDay);
    const dateFormatted = dateFormat(lDate, Setting.shortDateFormat());
    const cnAss = [{ iAss: 1 }, { iAss: 2 }, { iAss: 3 }];
    const varClasses = [{ classLabel: 'A' }, { classLabel: 'B' }];

    //AYF Assigment History
    for (const assignment of cnAss) {
      let weekFld = 'mwb_ayf_part' + assignment.iAss + '_type';
      const srcField = 'mwb_ayf_part' + assignment.iAss;
      const assType = weekData[weekFld];
      const src = weekData[srcField];

      const isExplainTalk = assType === 126 ? checkAYFExplainingBeliefsAssignment(src) : false;

      if (
        assType === 101 ||
        assType === 102 ||
        assType === 103 ||
        assType === 108 ||
        (assType >= 140 && assType < 170) ||
        (assType >= 170 && assType < 200) ||
        assType === 123 ||
        assType === 124 ||
        assType === 125 ||
        (assType === 126 && !isExplainTalk)
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

PersonClass.prototype.canBeAuxiliaryPioneer = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  if (this.isDisqualified) return false;
  if (!this.isBaptized) return false;
  if (this.isRegularPioneer(month)) return false;

  if (this.isAuxiliaryPioneer(month)) return false;

  const auxPionnerCurrent = this.otherService.find(
    (service) => service.service === 'auxiliaryPioneer' && service.endDate === null
  );

  let result = true;

  if (auxPionnerCurrent) result = false;

  const tmpDiff = monthDiff(this.immersedDate, month);
  if (tmpDiff <= 0) result = false;

  return result;
};

PersonClass.prototype.isAuxiliaryPioneer = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const auxPionnerDates = this.otherService?.filter((service) => service.service === 'auxiliaryPioneer') || [];

  for (const service of auxPionnerDates) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(service.startDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate > varDate) {
      continue;
    }

    if (service.endDate === null) {
      result = true;
      break;
    }

    const endDate = new Date(service.endDate);
    if (varDate < endDate) {
      result = true;
      break;
    }
  }

  return result;
};

PersonClass.prototype.isElder = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const elderDates = this.spiritualStatus?.filter((status) => status.status === 'elder') || [];

  for (const service of elderDates) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(service.startDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate > varDate) {
      continue;
    }

    if (service.endDate === null) {
      result = true;
      break;
    }

    const endDate = new Date(service.endDate);
    if (varDate < endDate) {
      result = true;
      break;
    }
  }

  return result;
};

PersonClass.prototype.isMS = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const msDates = this.spiritualStatus?.filter((status) => status.status === 'ms') || [];

  for (const service of msDates) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(service.startDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate > varDate) {
      continue;
    }

    if (service.endDate === null) {
      result = true;
      break;
    }

    const endDate = new Date(service.endDate);
    if (varDate < endDate) {
      result = true;
      break;
    }
  }

  return result;
};

PersonClass.prototype.isRegularPioneer = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const regPionnerDates = this.otherService?.filter((service) => service.service === 'regularPioneer') || [];

  for (const service of regPionnerDates) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(service.startDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate > varDate) {
      continue;
    }

    if (service.endDate === null) {
      result = true;
      break;
    }

    const endDate = new Date(service.endDate);
    if (varDate < endDate) {
      result = true;
      break;
    }
  }

  return result;
};

PersonClass.prototype.isSpecialPioneer = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const specialPioneerDates = this.otherService?.filter((service) => service.service === 'specialPioneer') || [];

  for (const service of specialPioneerDates) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(service.startDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate > varDate) {
      continue;
    }

    if (service.endDate === null) {
      result = true;
      break;
    }

    const endDate = new Date(service.endDate);
    if (varDate < endDate) {
      result = true;
      break;
    }
  }

  return result;
};

PersonClass.prototype.isValidPublisher = function (month) {
  // default month to current month if undefined
  const currentDate = new Date();
  if (!month) month = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/01`;

  let isValid = true;
  if (this.firstMonthReport !== null) {
    const dateCheck = new Date(month);
    const firstReport = new Date(this.firstMonthReport);
    if (dateCheck < firstReport) isValid = false;
  }

  return isValid;
};

PersonClass.prototype.isPublisher = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const publisherDates = this.spiritualStatus?.filter((status) => status.status === 'publisher') || [];

  for (const service of publisherDates) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(service.startDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate > varDate) {
      continue;
    }

    if (service.endDate === null) {
      result = true;
      break;
    }

    const endDate = new Date(service.endDate);
    if (varDate < endDate) {
      result = true;
      break;
    }
  }

  return result;
};

PersonClass.prototype.isBaptizedDate = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;

  if (this.isBaptized) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(this.immersedDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate <= varDate) {
      result = true;
    }
  }

  return result;
};

PersonClass.prototype.setAuxiliaryPioneer = async function (startDate, endDate) {
  const obj = {
    serviceId: window.crypto.randomUUID(),
    service: 'auxiliaryPioneer',
    startDate,
    endDate: endDate ? endDate : null,
  };

  if (this.otherService === undefined) this.otherService = [];
  const newServices = [...this.otherService, obj];
  const newPerson = { ...this, otherService: newServices };

  await Persons.preSave(newPerson);
};

PersonClass.prototype.hasReport = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;

  const serviceYear = ServiceYear.getByMonth(month).uid;

  const currentS21 = S21s.get(serviceYear, this.person_uid);
  if (currentS21) {
    result = currentS21.hasReport(month);
  }

  return result;
};

PersonClass.prototype.isActivePublisher = function (month) {
  // default month to current month if undefined
  const currentDate = new Date();
  if (!month) month = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/01`;

  let isActive = false;
  let countReport = 0;
  let SY = ServiceYear.getByMonth(month);
  let serviceYear;

  do {
    if (SY) {
      const isValid = this.isValidPublisher(month);

      if (!isValid) {
        isActive = true;
        break;
      }

      serviceYear = SY.uid;
      const currentS21 = S21s.get(serviceYear, this.person_uid);
      if (currentS21) {
        if (currentS21.hasReport(month)) {
          isActive = true;
          break;
        }
      }

      const prevMonth = addMonths(new Date(month), -1);
      month = `${prevMonth.getFullYear()}/${String(prevMonth.getMonth() + 1).padStart(2, '0')}/01`;
      SY = ServiceYear.getByMonth(month);
    }

    if (!SY) {
      isActive = true;
      break;
    }

    countReport++;
  } while (countReport <= 5);

  return isActive;
};

PersonClass.prototype.isRegularPublisher = function (month) {
  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let isRegular = true;
  let countReport = 0;
  let serviceYear = ServiceYear.getByMonth(month).uid;
  do {
    const currentS21 = S21s.get(serviceYear, this.person_uid);
    if (currentS21 && !currentS21.hasReport(month)) {
      isRegular = false;
      break;
    }
    const prevMonth = addMonths(new Date(month), -1);
    month = `${prevMonth.getFullYear()}/${String(prevMonth.getMonth() + 1).padStart(2, '0')}/01`;
    serviceYear = ServiceYear.getByMonth(month).uid;

    countReport++;
  } while (countReport <= 5);

  return isRegular;
};
