import appDb from '@db/appDb';
import { PersonType } from '@definition/person';
import { getTranslation } from '@services/i18n/translation';

export const dbPersonsSave = async (person: PersonType, isNew?: boolean) => {
  try {
    // CHECK FOR MULTIPLE RECORDS HISTORY FOR ALL SPIRITUAL STATUS
    const baptizedActive = person.publisher_baptized.history.filter(
      (record) => record._deleted === null && record.end_date.value === null
    ).length;

    if (baptizedActive > 1) {
      throw new Error(getTranslation({ key: 'tr_baptizedActiveMultiple' }));
    }

    const unbaptizedActive = person.publisher_unbaptized.history.filter(
      (record) => record._deleted === null && record.end_date.value === null
    ).length;

    if (unbaptizedActive > 1) {
      throw new Error(getTranslation({ key: 'tr_unbaptizedActiveMultiple' }));
    }

    const midweekActive = person.midweek_meeting_student.history.filter(
      (record) => record._deleted === null && record.end_date.value === null
    ).length;

    if (midweekActive > 1) {
      throw new Error(getTranslation({ key: 'tr_midweekActiveMultiple' }));
    }

    // CHECK FOR ACTIVE RECORDS IN INACTIVE STATUSES
    if (!person.publisher_baptized.active.value) {
      if (baptizedActive > 0) {
        throw new Error(getTranslation({ key: 'tr_baptizedInvalidRecords' }));
      }
    }

    if (!person.publisher_unbaptized.active.value) {
      if (unbaptizedActive > 0) {
        throw new Error(getTranslation({ key: 'tr_unbaptizedInvalidRecords' }));
      }
    }

    if (!person.midweek_meeting_student.active.value) {
      if (midweekActive > 0) {
        throw new Error(getTranslation({ key: 'tr_midweekInvalidRecords' }));
      }
    }

    // CHECK FOR MULTIPLE ACTIVE PRIVILEGES
    const privilegesActive = person.privileges.filter(
      (record) => record._deleted === null && record.end_date.value === null
    ).length;

    if (privilegesActive > 1) {
      throw new Error(getTranslation({ key: 'tr_privilegesActiveMultiple' }));
    }

    // CHECK FOR MULTIPLE ACTIVE ENROLLMENTS
    const enrollmentsActive = person.enrollments.filter(
      (record) => record._deleted === null && record.end_date.value === null
    ).length;

    if (enrollmentsActive > 1) {
      throw new Error(getTranslation({ key: 'tr_enrollemntsActiveMultiple' }));
    }

    // CHECK FOR EXISTING RECORD IF NEW
    if (isNew) {
      const personsAll = await dbPersonsGetAll();
      const found = personsAll.find(
        (record) =>
          record.person_firstname.value === person.person_firstname.value &&
          record.person_lastname.value === person.person_lastname.value
      );

      if (found) {
        throw new Error(getTranslation({ key: 'tr_personRecordExists' }));
      }
    }

    await appDb.persons.put(person);
  } catch (err) {
    throw new Error(err);
  }
};

export const dbPersonsDelete = async (person_uid: string) => {
  try {
    const person = await appDb.persons.get(person_uid);
    person._deleted = new Date().toISOString();

    await appDb.persons.put(person);
  } catch (err) {
    throw new Error(err);
  }
};

export const dbPersonsGetAll = async () => {
  const persons = await appDb.persons.toArray();
  return persons;
};
