import appDb from '@db/appDb';
import { PersonType } from '@definition/person';
import { personsUpdateAssignments } from '@services/app/persons';
import { getTranslation } from '@services/i18n/translation';
import { getRandomArrayItem, getRandomNumber } from '@utils/common';
import { computeYearsDiff } from '@utils/date';

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

export const dbPersonsClear = async () => {
  const records = await appDb.persons.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record._deleted = { value: true, updatedAt: new Date().toISOString() };
  }

  await appDb.persons.bulkPut(records);
};

export const dbPersonsUpdateAssignments = async () => {
  const persons = await appDb.persons.toArray();

  const personsToSave = persons.filter((record) => {
    if (!record.person_data.assignments) return false;

    return (
      record.person_data.assignments.length === 0 ||
      record.person_data.assignments.some((assignment) => 'code' in assignment)
    );
  });

  if (personsToSave.length > 0) {
    personsUpdateAssignments(personsToSave);
    await dbPersonsBulkSave(personsToSave);
  }
};

export const dbPersonsAssignFamilyHeads = async () => {
  const personsToSave: PersonType[] = [];

  const groups = await appDb.field_service_groups.toArray();
  const persons = await appDb.persons.toArray();

  for (const group of groups) {
    // assign family heads
    const familyHeads: PersonType[] = [];

    const groupPersons = group.group_data.members.map((member) =>
      persons.find((person) => person.person_uid === member.person_uid)
    );

    for (let i = 1; i <= 5; i++) {
      const elligibles = groupPersons.filter((person) => {
        if (person.person_data.female.value) return false;

        if (familyHeads.some((h) => h.person_uid === person.person_uid))
          return false;

        const age = +computeYearsDiff(person.person_data.birth_date.value);

        return age >= 27;
      });

      if (elligibles.length === 0) break;

      const select = getRandomArrayItem(elligibles);
      familyHeads.push(select);
    }

    // assign members
    for (const record of familyHeads) {
      const person = groupPersons.find(
        (p) => p.person_uid === record.person_uid
      );

      const members: string[] = [];
      const maxMembers = getRandomNumber(1, 5);

      for (let i = 1; i <= maxMembers; i++) {
        const elligibles = groupPersons.filter((a) => {
          const isHead = familyHeads.some((h) => h.person_uid === a.person_uid);

          if (isHead) return false;

          const isFamilyMembers = groupPersons.some((h) =>
            h.person_data.family_members.members.includes(a.person_uid)
          );

          if (isFamilyMembers) return false;

          if (members.includes(a.person_uid)) return false;

          const headAge = +computeYearsDiff(
            person.person_data.birth_date.value
          );
          const familyAge = +computeYearsDiff(a.person_data.birth_date.value);

          return familyAge <= headAge;
        });

        if (elligibles.length === 0) break;

        const member = getRandomArrayItem(elligibles);
        members.push(member.person_uid);
      }

      person.person_data.family_members = {
        head: true,
        members,
        updatedAt: new Date().toISOString(),
      };

      personsToSave.push(person);
    }
  }

  await dbPersonsBulkSave(personsToSave);
};

export const dbPersonsCleanUp = async () => {
  const records = await appDb.persons.toArray();

  if (records.length === 0) return;

  const recordsToUpdate = records.reduce((acc: PersonType[], current) => {
    if (
      current.person_data.family_members &&
      typeof current.person_data.family_members === 'string'
    ) {
      const person = structuredClone(current);
      delete person.person_data.family_members;

      acc.push(person);
    }

    return acc;
  }, []);

  if (recordsToUpdate.length > 0) {
    await appDb.persons.bulkPut(recordsToUpdate);
  }
};
