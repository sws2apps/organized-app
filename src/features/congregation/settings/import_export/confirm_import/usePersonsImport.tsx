import { PersonType } from '@definition/person';
import { updatedAtOverride } from '@utils/common';
import appDb from '@db/appDb';

const usePersonsImport = () => {
  const getPersons = async (persons: PersonType[]) => {
    const result: PersonType[] = [];

    result.push(...persons);

    const oldPersons = await appDb.persons.toArray();

    for (const oldPerson of oldPersons) {
      const newPerson = persons.find(
        (record) => record.person_uid === oldPerson.person_uid
      );

      if (!newPerson) {
        oldPerson._deleted = {
          value: true,
          updatedAt: new Date().toISOString(),
        };
        result.push(oldPerson);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };
  return { getPersons };
};

export default usePersonsImport;
