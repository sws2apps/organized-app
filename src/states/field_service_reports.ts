/*
This file holds the source of the truth from the table "fieldServiceReports".
*/

import { atom, selector } from 'recoil';
import {
  CongFieldServiceReportType,
  PersonFilterOption,
} from '@definition/cong_field_service_reports';

export const fieldServiceReportsState = atom<CongFieldServiceReportType[]>({
  key: 'fieldServiceReports',
  default: [],
});

export const congFieldServiceReportsState = selector({
  key: 'congFieldServiceReports',
  get: ({ get }) => {
    const reports = get(fieldServiceReportsState);

    const results = reports.filter(
      (record) => record.report_data._deleted === false
    );
    return results;
  },
});

export const selectedMonthFieldServiceReportState = atom<string>({
  key: 'selectedMonthFieldServiceReport',
  default: undefined,
});

export const personFilterFieldServiceReportState = atom<PersonFilterOption>({
  key: 'personFilterFieldServiceReport',
  default: 'active',
});

export const selectedPublisherReportState = atom<string>({
  key: 'selectedPublisherReport',
  default: undefined,
});

export const personSearchFieldServiceReportState = atom<string>({
  key: 'personSearchFieldServiceReport',
  default: '',
});