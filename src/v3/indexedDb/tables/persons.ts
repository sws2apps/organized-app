import { Table } from 'dexie';
import { PersonType } from '@definition/person';

export type PersonsTable = {
  persons: Table<PersonType>;
};

export const personsSchema = {
  persons: '&person_uid, _deleted, person_data',
};
