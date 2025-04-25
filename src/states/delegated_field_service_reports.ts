/*
This file holds the source of the truth from the table "delegated_field_service_reports".
*/

import { atom } from 'jotai';
import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';

export const delegatedFieldServiceReportsDbState = atom<
  DelegatedFieldServiceReportType[]
>([]);

export const delegatedFieldServiceReportsState = atom((get) => {
  const reports = get(delegatedFieldServiceReportsDbState);

  return reports.filter((record) => !record.report_data._deleted);
});
