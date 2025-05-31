/*
This file holds the source of the truth from the table "branch_field_service_reports".
*/

import { atom } from 'jotai';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';

export const branchFieldServiceReportsState = atom<
  BranchFieldServiceReportType[]
>([]);

export const branchFieldReportsState = atom((get) => {
  const reports = get(branchFieldServiceReportsState);

  const results = reports.filter(
    (record) => record.report_data._deleted === false
  );

  return results;
});
