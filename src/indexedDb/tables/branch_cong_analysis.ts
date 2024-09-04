import { Table } from 'dexie';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';

export type BranchCongAnalysisTable = {
  branch_cong_analysis: Table<BranchCongAnalysisType>;
};

export const branchCongAnalysisSchema = {
  branch_cong_analysis: '&report_date, report_data',
};
