import appDb from '@db/appDb';
import { PersonType } from '@definition/person';
import { getTranslation } from '@services/i18n/translation';

const dbUpdatePersonMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.persons = {
    ...metadata.metadata.persons,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbPersonsSave = async (person: PersonType, isNew?: boolean) => {
  const setting = await appDb.app_settings.get(1);

  if (setting.user_settings.account_type === 'vip') {
    // CHECK FOR MULTIPLE RECORDS HISTORY FOR ALL SPIRITUAL STATUS
    const baptizedActive = person.person_data.publisher_baptized.history.filter(
      (record) => record._deleted === false && record.end_date === null
    ).length;

    if (baptizedActive > 1) {
      throw new Error(getTranslation({ key: 'tr_baptizedActiveMultiple' }));
    }

    const unbaptizedActive =
      person.person_data.publisher_unbaptized.history.filter(
        (record) => record._deleted === false && record.end_date === null
      ).length;

    if (unbaptizedActive > 1) {
      throw new Error(getTranslation({ key: 'tr_unbaptizedActiveMultiple' }));
    }

    const midweekActive =
      person.person_data.midweek_meeting_student.history.filter(
        (record) => record._deleted === false && record.end_date === null
      ).length;

    if (midweekActive > 1) {
      throw new Error(getTranslation({ key: 'tr_midweekActiveMultiple' }));
    }

    // CHECK FOR ACTIVE RECORDS IN INACTIVE STATUSES
    if (!person.person_data.publisher_baptized.active.value) {
      if (baptizedActive > 0) {
        throw new Error(getTranslation({ key: 'tr_baptizedInvalidRecords' }));
      }
    }

    if (!person.person_data.publisher_unbaptized.active.value) {
      if (unbaptizedActive > 0) {
        throw new Error(getTranslation({ key: 'tr_unbaptizedInvalidRecords' }));
      }
    }

    if (!person.person_data.midweek_meeting_student.active.value) {
      if (midweekActive > 0) {
        throw new Error(getTranslation({ key: 'tr_midweekInvalidRecords' }));
      }
    }

    // CHECK FOR MULTIPLE ACTIVE PRIVILEGES
    const privilegesActive = person.person_data.privileges.filter(
      (record) => record._deleted === false && record.end_date === null
    ).length;

    if (privilegesActive > 1) {
      throw new Error(getTranslation({ key: 'tr_privilegesActiveMultiple' }));
    }

    // CHECK FOR MULTIPLE ACTIVE ENROLLMENTS
    const enrollmentsActive = person.person_data.enrollments.filter(
      (record) => record._deleted === false && record.end_date === null
    ).length;

    if (enrollmentsActive > 1) {
      throw new Error(getTranslation({ key: 'tr_enrollemntsActiveMultiple' }));
    }

    // CHECK FOR EXISTING RECORD IF NEW
    if (isNew) {
      const personsActive = await dbPersonsGetActive();
      const found = personsActive.find(
        (record) =>
          record.person_data.person_firstname.value ===
            person.person_data.person_firstname.value &&
          record.person_data.person_lastname.value ===
            person.person_data.person_lastname.value
      );

      if (found) {
        throw new Error(getTranslation({ key: 'tr_personRecordExists' }));
      }
    }
  }

  await appDb.persons.put(person);
  await dbUpdatePersonMetadata();
};

export const dbPersonsDelete = async (person_uid: string) => {
  try {
    const person = await appDb.persons.get(person_uid);
    person._deleted = { value: true, updatedAt: new Date().toISOString() };

    await appDb.persons.put(person);
    await dbUpdatePersonMetadata();
  } catch (err) {
    throw new Error(err);
  }
};

export const dbPersonsGetAll = async () => {
  const persons = await appDb.persons.toArray();
  return persons;
};

export const dbPersonsGetActive = async () => {
  const persons = await appDb.persons
    .filter((record) => !record._deleted.value)
    .toArray();

  return persons;
};

export const dbPersonsBulkSave = async (persons: PersonType[]) => {
  await appDb.persons.bulkPut(persons);
  await dbUpdatePersonMetadata();
};
