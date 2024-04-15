import { atom } from 'recoil';

export const isImportJWOrgState = atom({
  key: 'isImportJWOrg',
  default: false,
});

export const isImportEPUBState = atom({
  key: 'isImportEPUB',
  default: false,
});

export const epubFileState = atom({
  key: 'epubFile',
  default: {},
});

export const isRerenderSourceState = atom({
  key: 'isRerenderSource',
  default: false,
});

export const currentYearState = atom({
  key: 'currentYear',
  default: '',
});

export const currentWeekState = atom({
  key: 'currentWeek',
  default: '',
});

export const refreshWeeksListState = atom({
  key: 'refreshWeeksList',
  default: false,
});

export const publicTalksState = atom({
  key: 'publicTalks',
  default: [],
});
