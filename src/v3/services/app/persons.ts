import { personsActiveState, personsState } from '@states/persons';
import { promiseGetRecoil } from 'recoil-outside';
import { getServiceYearByMonth } from './serviceYear';
import { getPublisherS21, isPublisherHasReport } from './fieldServiceReports';
import { addMonths } from '@utils/date';

const excludeFields = ['changes', 'id', 'lastAssignment', 'person_uid'];

const compareNonArray = (source, modified, changes) => {
  const localExclude = [...excludeFields, 'timeAway', 'assignments', 'spiritualStatus', 'otherService'];

  for (const [key, value] of Object.entries(modified)) {
    if (localExclude.indexOf(key) === -1) {
      if (value !== source[key]) {
        const findIndex = changes.findIndex((item) => item.field === key);
        if (findIndex !== -1) changes.splice(findIndex, 1);
        changes.push({ date: new Date().toISOString(), field: key, value });
      }
    }
  }

  return changes;
};

const compareAssignments = (source, modified, changes) => {
  // check added or deleted assignment
  if (modified.assignments) {
    for (const updated of modified.assignments) {
      const findSource = source.assignments?.find((item) => item.code === updated.code);
      // new assignment
      if (!findSource) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'assignments' && item.value.code === updated.code) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'assignments', isAdded: true, value: updated });
      }
    }
  }

  // check deleted assignment
  if (source.assignments) {
    for (const original of source.assignments) {
      const findModified = modified.assignments?.find((item) => item.code === original.code);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'assignments' && item.value.code === original.code) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'assignments', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};

const compareTimeAway = (source, modified, changes) => {
  // check added or modified time away
  if (modified.timeAway) {
    for (const updated of modified.timeAway) {
      const findSource = source.timeAway?.find((item) => item.timeAwayId === updated.timeAwayId);
      // time away modified
      if (findSource) {
        const excludeArrayFields = ['timeAwayId', 'isActive'];
        let arrayFieldChanged = false;
        for (const [arrayKey, arrayValue] of Object.entries(updated)) {
          if (excludeArrayFields.indexOf(arrayKey) === -1) {
            if (arrayValue !== findSource[arrayKey]) {
              arrayFieldChanged = true;
              break;
            }
          }
        }

        if (arrayFieldChanged) {
          const filteredChanges = [];
          changes.forEach((item) => {
            if (item.field === 'timeAway' && item.value.timeAwayId === updated.timeAwayId) {
              return;
            }
            filteredChanges.push(item);
          });
          changes = [...filteredChanges];
          changes.push({ date: new Date().toISOString(), field: 'timeAway', isModified: true, value: updated });
        }
      }

      // new time away
      if (!findSource) {
        changes.push({ date: new Date().toISOString(), field: 'timeAway', isAdded: true, value: updated });
      }
    }
  }

  // check deleted timeAway
  if (source.timeAway) {
    for (const original of source.timeAway) {
      const findModified = modified.timeAway?.find((item) => item.timeAwayId === original.timeAwayId);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'timeAway' && item.value.timeAwayId === original.timeAwayId) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'timeAway', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};

const compareSpiritualStatus = (source, modified, changes) => {
  // check added or modified status
  if (modified.spiritualStatus) {
    for (const updated of modified.spiritualStatus) {
      const findSource = source.spiritualStatus?.find((item) => item.statusId === updated.statusId);
      // status modified
      if (findSource) {
        const excludeArrayFields = ['statusId', 'isActive'];
        let arrayFieldChanged = false;
        for (const [arrayKey, arrayValue] of Object.entries(updated)) {
          if (excludeArrayFields.indexOf(arrayKey) === -1) {
            if (arrayValue !== findSource[arrayKey]) {
              arrayFieldChanged = true;
              break;
            }
          }
        }
        if (arrayFieldChanged) {
          const filteredChanges = [];
          changes.forEach((item) => {
            if (item.field === 'spiritualStatus' && item.value.statusId === updated.statusId) {
              return;
            }
            filteredChanges.push(item);
          });
          changes = [...filteredChanges];
          changes.push({ date: new Date().toISOString(), field: 'spiritualStatus', isModified: true, value: updated });
        }
      }

      // new status
      if (!findSource) {
        changes.push({ date: new Date().toISOString(), field: 'spiritualStatus', isAdded: true, value: updated });
      }
    }
  }

  // check deleted spiritualStatus
  if (source.spiritualStatus) {
    for (const original of source.spiritualStatus) {
      const findModified = modified.spiritualStatus?.find((item) => item.statusId === original.statusId);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'spiritualStatus' && item.value.statusId === original.statusId) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'spiritualStatus', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};

const compareOtherService = (source, modified, changes) => {
  // check added or modified service
  if (modified.otherService) {
    for (const updated of modified.otherService) {
      const findSource = source.otherService?.find((item) => item.serviceId === updated.serviceId);
      // service modified
      if (findSource) {
        const excludeArrayFields = ['serviceId', 'isActive'];
        let arrayFieldChanged = false;
        for (const [arrayKey, arrayValue] of Object.entries(updated)) {
          if (excludeArrayFields.indexOf(arrayKey) === -1) {
            if (arrayValue !== findSource[arrayKey]) {
              arrayFieldChanged = true;
              break;
            }
          }
        }
        if (arrayFieldChanged) {
          const filteredChanges = [];
          changes.forEach((item) => {
            if (item.field === 'otherService' && item.value.serviceId === updated.serviceId) {
              return;
            }
            filteredChanges.push(item);
          });
          changes = [...filteredChanges];
          changes.push({ date: new Date().toISOString(), field: 'otherService', isModified: true, value: updated });
        }
      }

      // new service
      if (!findSource) {
        changes.push({ date: new Date().toISOString(), field: 'otherService', isAdded: true, value: updated });
      }
    }
  }

  // check deleted otherService
  if (source.otherService) {
    for (const original of source.otherService) {
      const findModified = modified.otherService?.find((item) => item.serviceId === original.serviceId);
      if (!findModified) {
        const filteredChanges = [];
        changes.forEach((item) => {
          if (item.field === 'otherService' && item.value.serviceId === original.serviceId) {
            return;
          }
          filteredChanges.push(item);
        });
        changes = [...filteredChanges];
        changes.push({ date: new Date().toISOString(), field: 'otherService', isDeleted: true, value: original });
      }
    }
  }

  return changes;
};

export const comparePerson = (source, modified) => {
  let changes = source.changes ? [...source.changes] : [];

  changes = compareNonArray(source, modified, changes);
  changes = compareAssignments(source, modified, changes);
  changes = compareTimeAway(source, modified, changes);
  changes = compareSpiritualStatus(source, modified, changes);
  changes = compareOtherService(source, modified, changes);

  return changes;
};

export const getRecentPersons = async (data) => {
  const recentPersons = data ? JSON.parse(data) : [];
  const persons = await promiseGetRecoil(personsState);

  const result = [];
  if (persons.length === 0) {
    localStorage.removeItem('recentPersons');
  } else {
    let temp = recentPersons;
    for await (const recent of recentPersons) {
      const findPerson = persons.find((person) => person.person_uid === recent);

      if (findPerson) {
        result.push(findPerson);
      } else {
        temp = temp.filter((tmp) => tmp !== recent);
        localStorage.setItem('recentPersons', JSON.stringify(temp));
      }
    }
  }

  return result;
};

export const getPerson = async (uid) => {
  const persons = await promiseGetRecoil(personsActiveState);
  const person = persons.find((p) => p.person_uid === uid);

  return person;
};

export const personIsPublisher = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const publisherDates = person.spiritualStatus?.filter((status) => status.status === 'publisher') || [];

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

export const personIsAuxiliaryPioneer = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const auxPionnerDates = person.otherService?.filter((service) => service.service === 'auxiliaryPioneer') || [];

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

export const personIsElder = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const elderDates = person.spiritualStatus?.filter((status) => status.status === 'elder') || [];

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

export const personIsMS = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const msDates = person.spiritualStatus?.filter((status) => status.status === 'ms') || [];

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

export const personIsRegularPioneer = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const regPionnerDates = person.otherService?.filter((service) => service.service === 'regularPioneer') || [];

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

export const personIsSpecialPioneer = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;
  const specialPioneerDates = person.otherService?.filter((service) => service.service === 'specialPioneer') || [];

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

export const personIsBaptized = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  if (!month) month = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/01`;

  let result = false;

  if (person.isBaptized) {
    const varDate = new Date(month);
    const tmpStartDate = new Date(person.immersedDate);
    const startDate = new Date(tmpStartDate.getFullYear(), tmpStartDate.getMonth(), 1);

    if (startDate <= varDate) {
      result = true;
    }
  }

  return result;
};

export const personIsValidPublisher = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  const currentDate = new Date();
  if (!month) month = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/01`;

  let isValid = true;
  if (person.firstMonthReport !== null) {
    const dateCheck = new Date(month);
    const firstReport = new Date(person.firstMonthReport);
    if (dateCheck < firstReport) isValid = false;
  }

  return isValid;
};

export const personIsActivePublisher = async (uid: string, month?: string) => {
  const persons = await promiseGetRecoil(personsState);
  const person = persons.find((p) => p.person_uid === uid);

  // default month to current month if undefined
  const currentDate = new Date();
  if (!month) month = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/01`;

  let isActive = false;
  let countReport = 0;
  let SY = await getServiceYearByMonth(month);
  let serviceYear;

  do {
    if (SY) {
      const isValid = await personIsValidPublisher(uid, month);

      if (!isValid) {
        isActive = true;
        break;
      }

      serviceYear = SY.uid;
      const currentS21 = await getPublisherS21(serviceYear, person.person_uid);
      if (currentS21) {
        const hasReport = await isPublisherHasReport({
          service_year: serviceYear,
          person_uid: person.person_uid,
          month,
        });
        if (hasReport) {
          isActive = true;
          break;
        }
      }

      const prevMonth = addMonths(new Date(month), -1);
      month = `${prevMonth.getFullYear()}/${String(prevMonth.getMonth() + 1).padStart(2, '0')}/01`;
      SY = await getServiceYearByMonth(month);
    }

    if (!SY) {
      isActive = true;
      break;
    }

    countReport++;
  } while (countReport <= 5);

  return isActive;
};

export const personsFilter = async ({ persons, data }) => {
  const txtSearch = data.txtSearch || '';
  const filter = data.filter || 'allPersons';
  const assTypes = data.assTypes || [];

  let firstPassFiltered = [];
  if (filter === 'allPersons') {
    firstPassFiltered = structuredClone(persons);
  }

  const allPublishers = [];
  for await (const person of persons) {
    if (person.isValid && (person.isElder || person.isMS || person.isPublisher)) {
      allPublishers.push(person);
    }
  }

  if (filter === 'allPublishers') {
    firstPassFiltered = structuredClone(allPublishers);
  }

  if (filter === 'baptizedPublishers') {
    for await (const person of allPublishers) {
      if (person.isBaptized && (person.isElder || person.isMS || person.isPublisher)) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'unbaptizedPublishers') {
    for (const person of allPublishers) {
      if (!person.isBaptized && person.isPublisher) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'appointedBrothers') {
    for await (const person of allPublishers) {
      if (person.isElder || person.isMS) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'elders') {
    for (const person of allPublishers) {
      if (person.isElder) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'auxiliaryPioneers') {
    for await (const person of allPublishers) {
      if (person.isAuxP) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'regularPioneers') {
    for await (const person of allPublishers) {
      if (person.isFR) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'inactivePublishers') {
    for await (const person of allPublishers) {
      if (!person.isActive) {
        firstPassFiltered.push(person);
      }
    }
  }

  if (filter === 'activePublishers') {
    for await (const person of allPublishers) {
      if (person.isActive) {
        firstPassFiltered.push(person);
      }
    }
  }

  const secondPassFiltered = [];
  for (const person of firstPassFiltered) {
    const assignments = person.assignments;

    let passed = true;

    for (const type of assTypes) {
      const found = assignments.find((assignment) => assignment.code === type);
      if (!found) {
        passed = false;
        break;
      }
    }

    if (passed) secondPassFiltered.push(person);
  }

  const thirdPassFiltered = [];
  for (const person of secondPassFiltered) {
    if (person.person_name.toLowerCase().includes(txtSearch.toLowerCase())) {
      thirdPassFiltered.push(person);
    }
  }

  thirdPassFiltered.sort((a, b) => {
    return a.person_name > b.person_name ? 1 : -1;
  });

  return thirdPassFiltered;
};
