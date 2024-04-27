import { Table } from 'dexie';
import { UserBibleStudyType } from '@definition/user_bible_studies';

export type UserBibleStudiesTable = {
  user_bible_studies: Table<UserBibleStudyType>;
};

export const userBibleStudiesSchema = {
  user_bible_studies: '++id, _deleted, person_name',
};
