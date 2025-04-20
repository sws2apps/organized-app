/*
This file holds the source of the truth from the table "branch_cong_analysis".
*/

import { atom } from 'jotai';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';

export const branchCongAnalysisReportsState = atom<BranchCongAnalysisType[]>(
  []
);

export const branchCongAnalysisState = atom((get) => {
  const reports = get(branchCongAnalysisReportsState);

  const results = reports.filter(
    (record) => record.report_data._deleted === false
  );
  return results;
});
