/*
This file holds the source of the truth from the table "minutesReports".
*/

import { atom } from 'recoil';

export const minutesReportsState = atom({
  key: 'minutesReports',
  default: [],
});
