/*
This file holds the source of the truth from the table "user_bible_studies".
*/

import { atom } from 'recoil';
import { UserBibleStudyType } from '@definition/user_bible_studies';

export const userBibleStudiesState = atom<UserBibleStudyType[]>({
  key: 'userBibleStudies',
  default: [],
});

export const bibleStudyEditorOpenState = atom({
  key: 'bibleStudyEditorOpen',
  default: false,
});

export const currentBibleStudyState = atom<UserBibleStudyType>({
  key: 'currentBibleStudy',
  default: undefined,
});
