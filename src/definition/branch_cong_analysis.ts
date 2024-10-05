export type BranchCongAnalysisType = {
  report_date: string;
  report_data: {
    _deleted: boolean;
    updatedAt: string;
    meeting_average: {
      midweek: number;
      weekend: number;
    };
    publishers: {
      active: number;
      inactive: number;
      reactivated: number;
    };
    territories: {
      total: number;
      uncovered: number;
    };
    submitted: boolean;
  };
};
