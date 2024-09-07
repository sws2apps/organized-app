import appDb from '@db/appDb';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';

export const dbBranchCongAnalysisSave = async (
  analysis: BranchCongAnalysisType
) => {
  await appDb.branch_cong_analysis.put(analysis);
};
