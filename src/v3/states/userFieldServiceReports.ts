/*
This file holds the source of the truth from the table "user_field_service_reports".
*/

import { atom } from 'recoil';

export const userFieldServiceReportsState = atom({
  key: 'userFieldServiceReports',
  default: [],
});
