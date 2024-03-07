/*
This file holds the source of the truth from the table "sources".
*/

import { atom } from 'recoil';

export const sourcesState = atom({
  key: 'sources',
  default: [],
});

export const epubFileState = atom({
  key: 'epubFile',
  default: {},
});

export const isImportJWOrgState = atom({
  key: 'isImportJWOrg',
  default: true,
});

export const isImportEPUBState = atom({
  key: 'isImportEPUB',
  default: false,
});

export const currentWeekState = atom({
  key: 'currentWeek',
  default: '',
});
