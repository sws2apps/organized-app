/*
This file holds the source of the truth from the table "lateReports".
*/

import { atom } from 'recoil';

export const lateReportsState = atom({
  key: 'lateReports',
  default: [],
});
