/*
This file holds the source of the truth from the table "fieldServiceReports".
*/

import { atom } from 'recoil';

export const branchReportsState = atom({
  key: 'branchReports',
  default: [],
});
