/*
This file holds the source of the truth from the table "fieldServiceReports".
*/

import { atom } from 'recoil';

export const fieldServiceReportsState = atom({
  key: 'fieldServiceReports',
  default: [],
});

export const selectedMonthFieldServiceReportState = atom<string>({
  key: 'selectedMonthFieldServiceReport',
  default: undefined,
});

export const personFilterFieldServiceReportState = atom<string>({
  key: 'personFilterFieldServiceReport',
  default: undefined,
});
