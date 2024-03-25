import { promiseGetRecoil } from 'recoil-outside';
import { appDb } from '.';
import { comparePerson, getPerson } from '@services/app/persons';
import { personsState } from '@states/persons';
import { PersontType } from '@definition/person';

export const resetPersons = async (cong_persons: []) => {
  await appDb.persons.clear();

  for await (const person of cong_persons) {
    await appDb.persons.put(person);
  }
};

export const savePerson = async (data: PersontType) => {
  const { person_uid, person_name, person_displayName } = data;

  if (person_name && person_displayName) {
    if (person_uid) {
      const currentPerson = await getPerson(data.person_uid);

      if (!data.isMoved) {
        data.changes = comparePerson(currentPerson, data);
        data.changes = data.changes.filter((item) => item.field !== 'lastAssignment');
      }

      await appDb.persons.put(data);
    }

    if (!person_uid) {
      const newPerson = {
        person_uid: window.crypto.randomUUID(),
        isMoved: false,
        isDisqualified: false,
        ...data,
      };

      await appDb.persons.put(newPerson);

      return newPerson.person_uid;
    }

    return true;
  } else {
    return false;
  }
};

export const deletePerson = async (uid: string) => {
  const oldPersons = await promiseGetRecoil(personsState);
  const persons = structuredClone(oldPersons);

  const person = persons.find((p) => p.person_uid === uid);

  if (person) {
    person.is_deleted = true;

    await appDb.persons.put(person);
  }
};
