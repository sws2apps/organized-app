/*
This file holds the source of the truth from the table "user_bible_studies".
*/

import { atom } from 'jotai';
import { UserBibleStudyType } from '@definition/user_bible_studies';

export const userBibleStudiesState = atom<UserBibleStudyType[]>([]);

export const bibleStudyEditorOpenState = atom(false);

export const currentBibleStudyState = atom<UserBibleStudyType>(undefined);
