import { Table } from 'dexie';
import { UserBibleStudyType } from '@definition/user_bible_studies';

export type UserBibleStudiesTable = {
  user_bible_studies: Table<UserBibleStudyType>;
};

export const userBibleStudiesSchema = {
  user_bible_studies: '&person_uid, person_data',
};
