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

export const dbBranchCongAnalysisClear = async () => {
  const records = await appDb.branch_cong_analysis.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record.report_data._deleted = true;
    record.report_data.updatedAt = new Date().toISOString();
  }

  await appDb.branch_cong_analysis.bulkPut(records);
};
