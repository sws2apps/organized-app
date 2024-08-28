/*
This file holds the source of the truth from the table "user_field_service_reports".
*/

import { atom } from 'recoil';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';

export const userFieldServiceReportsState = atom<UserFieldServiceReportType[]>({
  key: 'userFieldServiceReports',
  default: [],
});

export const reportUserSelectedMonthState = atom({
  key: 'reportUserSelectedMonth',
  default: '',
});
