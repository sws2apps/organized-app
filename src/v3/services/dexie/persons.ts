import { PersonType } from '@definition/person';
import { getTranslation } from '@services/i18n/translation';
import { appDb } from '.';

export const dbSavePerson = async (person: PersonType) => {
  // CHECK FOR MULTIPLE RECORDS HISTORY FOR ALL SPIRITUAL STATUS
  const baptizedActive = person.baptizedPublisher.history.filter(
    (record) => record._deleted === null && record.endDate.value === null
  ).length;

  if (baptizedActive > 1) {
    throw new Error(getTranslation({ key: 'tr_baptizedActiveMultiple' }));
  }

  const unbaptizedActive = person.unbaptizedPublisher.history.filter(
    (record) => record._deleted === null && record.endDate.value === null
  ).length;

  if (unbaptizedActive > 1) {
    throw new Error(getTranslation({ key: 'tr_unbaptizedActiveMultiple' }));
  }

  const midweekActive = person.midweekMeetingStudent.history.filter(
    (record) => record._deleted === null && record.endDate.value === null
  ).length;

  if (midweekActive > 1) {
    throw new Error(getTranslation({ key: 'tr_midweekActiveMultiple' }));
  }

  // CHECK FOR ACTIVE RECORDS IN INACTIVE STATUSES
  if (!person.baptizedPublisher.active.value) {
    if (baptizedActive > 0) {
      throw new Error(getTranslation({ key: 'tr_baptizedInvalidRecords' }));
    }
  }

  if (!person.unbaptizedPublisher.active.value) {
    if (unbaptizedActive > 0) {
      throw new Error(getTranslation({ key: 'tr_unbaptizedInvalidRecords' }));
    }
  }

  if (!person.midweekMeetingStudent.active.value) {
    if (midweekActive > 0) {
      throw new Error(getTranslation({ key: 'tr_midweekInvalidRecords' }));
    }
  }

  // CHECK FOR MULTIPLE ACTIVE PRIVILEGES
  const privilegesActive = person.privileges.filter(
    (record) => record._deleted === null && record.endDate.value === null
  ).length;

  if (privilegesActive > 1) {
    throw new Error(getTranslation({ key: 'tr_privilegesActiveMultiple' }));
  }

  // CHECK FOR MULTIPLE ACTIVE ENROLLMENTS
  const enrollmentsActive = person.enrollments.filter(
    (record) => record._deleted === null && record.endDate.value === null
  ).length;

  if (enrollmentsActive > 1) {
    throw new Error(getTranslation({ key: 'tr_enrollemntsActiveMultiple' }));
  }

  // SAVING DATA
  await appDb.persons.put(person, person.person_uid);
};

export const dbDeletePerson = async (person: PersonType) => {
  const newPerson = structuredClone(person);
  newPerson._deleted = new Date().toISOString();

  await appDb.persons.put(newPerson, newPerson.person_uid);
};
