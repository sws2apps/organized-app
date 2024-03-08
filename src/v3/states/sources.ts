/*
This file holds the source of the truth from the table "sources".
*/

import { atom } from 'recoil';

export const sourcesState = atom({
  key: 'sources',
  default: [],
});

export const epubFileState = atom<File>({
  key: 'epubFile',
  default: null,
});

export const isImportJWOrgState = atom({
  key: 'isImportJWOrg',
  default: false,
});

export const isImportEPUBState = atom({
  key: 'isImportEPUB',
  default: false,
});

export const currentWeekState = atom({
  key: 'currentWeek',
  default: '',
});
