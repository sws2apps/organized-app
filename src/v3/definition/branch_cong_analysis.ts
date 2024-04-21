export type BranchCongAnalysisType = {
  id?: string;
  updateAt: string;
  month_date: string;
  isSubmitted: { value: boolean; updatedAt: string };
  average_meeting_attendace: {
    weekend: number;
    midweek: number;
  };
  congregation_totals: {
    active_publishers: number;
    inactive_publishers: number;
    reactivated_publishers: number;
    deaf_publishers: number;
    blind_publihsers: number;
    incarcerated_publishers: number;
  };
  territory_coverage: {
    total: number;
    not_worked: number;
  };
};
