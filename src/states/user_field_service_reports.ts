/*
This file holds the source of the truth from the table "user_field_service_reports".
*/

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import {
  TimerRecordType,
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
  UserFieldServiceReportType,
} from '@definition/user_field_service_reports';
import { TIMER_KEY } from '@constants/index';

export const userFieldServiceReportsState = atom<UserFieldServiceReportType[]>(
  []
);

export const reportUserSelectedMonthState = atom('');

export const reportUserDraftState = atom<UserFieldServiceDailyReportType>();

export const userFieldServiceDailyReportsState = atom((get) => {
  const reports = get(userFieldServiceReportsState);

  const dailyRecords = reports.filter(
    (record) =>
      record.report_data.record_type === 'daily' &&
      record.report_data._deleted === false
  );

  return dailyRecords as UserFieldServiceDailyReportType[];
});

export const userFieldServiceMonthlyReportsState = atom((get) => {
  const reports = get(userFieldServiceReportsState);

  const dailyRecords = reports.filter(
    (record) =>
      record.report_data.record_type === 'monthly' &&
      record.report_data._deleted === false
  );

  return dailyRecords as UserFieldServiceMonthlyReportType[];
});

export const serviceYearSelectedState = atom<string>();

export const userMinistryTimerState = atomWithStorage<TimerRecordType>(
  TIMER_KEY,
  { start: 0, state: 'not_started', value: 0 }
);
