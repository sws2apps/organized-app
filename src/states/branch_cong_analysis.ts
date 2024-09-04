/*
This file holds the source of the truth from the table "branch_cong_analysis".
*/

import { atom, selector } from 'recoil';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';

export const branchCongAnalysisReportsState = atom<BranchCongAnalysisType[]>({
  key: 'branchCongAnalysisReports',
  default: [],
});

export const branchCongAnalysisState = selector({
  key: 'branchCongAnalysis',
  get: ({ get }) => {
    const reports = get(branchCongAnalysisReportsState);

    const results = reports.filter(
      (record) => record.report_data._deleted === false
    );
    return results;
  },
});
