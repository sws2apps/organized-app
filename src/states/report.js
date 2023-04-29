import { atom } from 'recoil';

export const refreshReportState = atom({
  key: 'refreshReport',
  default: true,
});

export const isAddSYOpenState = atom({
  key: 'isAddSYOpen',
  default: false,
});
