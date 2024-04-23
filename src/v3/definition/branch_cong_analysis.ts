type AverageMeetingAttendance = {
  weekend: number;
  midweek: number;
};

type CongregationTotals = {
  active_publishers: number;
  inactive_publishers: number;
  reactivated_publishers: number;
  deaf_publishers: number;
  blind_publishers: number;
  incarcerated_publishers: number;
};

type TerritoryCoverage = {
  total: number;
  not_worked: number;
};

export type BranchCongAnalysisType = {
  id?: string;
  updatedAt: string;
  month_date: string;
  isSubmitted: { value: boolean; updatedAt: string };
  average_meeting_attendace: AverageMeetingAttendance;
  congregation_totals: CongregationTotals;
  territory_coverage: TerritoryCoverage;
};
