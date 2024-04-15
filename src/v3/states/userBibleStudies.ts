/*
This file holds the source of the truth from the table "user_bible_studies".
*/

import { atom } from 'recoil';

export const userBibleStudiesState = atom({
  key: 'userBibleStudies',
  default: [],
});
