/*
This file holds the source of the truth from the table "user_field_service_reports".
*/

import { atom, selector } from 'recoil';
import {
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
  UserFieldServiceReportType,
} from '@definition/user_field_service_reports';

export const userFieldServiceReportsState = atom<UserFieldServiceReportType[]>({
  key: 'userFieldServiceReports',
  default: [],
});

export const reportUserSelectedMonthState = atom({
  key: 'reportUserSelectedMonth',
  default: '',
});

export const reportUserDraftState = atom<UserFieldServiceDailyReportType>({
  key: 'reportUserDraftState',
  default: undefined,
});

export const userFieldServiceDailyReportsState = selector({
  key: 'userFieldServiceDailyReports',
  get: ({ get }) => {
    const reports = get(userFieldServiceReportsState);

    const dailyRecords = reports.filter(
      (record) =>
        record.report_data.record_type === 'daily' &&
        record.report_data._deleted === false
    );

    return dailyRecords as UserFieldServiceDailyReportType[];
  },
});

export const userFieldServiceMonthlyReportsState = selector({
  key: 'userFieldServiceMonthlyReports',
  get: ({ get }) => {
    const reports = get(userFieldServiceReportsState);

    const dailyRecords = reports.filter(
      (record) =>
        record.report_data.record_type === 'monthly' &&
        record.report_data._deleted === false
    );

    return dailyRecords as UserFieldServiceMonthlyReportType[];
  },
});

export const serviceYearSelectedState = atom<string>({
  key: 'serviceYearSelected',
  default: undefined,
});
