/*
This file holds the source of the truth from the table "delegated_field_service_reports".
*/

import { atom, selector } from 'recoil';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';

export const delegatedFieldServiceReportsDbState = atom<
  UserFieldServiceMonthlyReportType[]
>({
  key: 'delegatedFieldServiceReports',
  default: [],
});

export const delegatedFieldServiceReportsState = selector({
  key: 'delegatedFieldServiceMonthlyReports',
  get: ({ get }) => {
    const reports = get(delegatedFieldServiceReportsDbState);

    return reports.filter((record) => !record.report_data._deleted);
  },
});
