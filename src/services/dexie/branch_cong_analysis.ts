import appDb from '@db/appDb';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';

const dbUpdateBranchCongAnalysisMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.branch_cong_analysis = {
    ...metadata.metadata.branch_cong_analysis,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbBranchCongAnalysisSave = async (
  analysis: BranchCongAnalysisType
) => {
  await appDb.branch_cong_analysis.put(analysis);
  await dbUpdateBranchCongAnalysisMetadata();
};
