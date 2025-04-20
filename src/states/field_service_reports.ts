/*
This file holds the source of the truth from the table "fieldServiceReports".
*/

import { atom } from 'jotai';
import {
  CongFieldServiceReportType,
  PersonFilterOption,
} from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';

export const fieldServiceReportsState = atom<CongFieldServiceReportType[]>([]);

export const congFieldServiceReportsState = atom((get) => {
  const reports = get(fieldServiceReportsState);

  const results = reports.filter(
    (record) => record.report_data._deleted === false
  );

  return results;
});

export const selectedMonthFieldServiceReportState = atom<string>(undefined);

export const personFilterFieldServiceReportState =
  atom<PersonFilterOption>('active');

export const selectedPublisherReportState = atom<string>(undefined);

export const personSearchFieldServiceReportState = atom<string>('');

export const publisherCurrentReportState = atom(
  structuredClone(congFieldServiceReportSchema)
);
