export type BranchOfficePageStateType = 'initial' | 'generating' | 'generated' | 'error';

export type BranchOfficeReportType = 's1' | 's10';

export const BranchReportsList: BranchOfficeReportType[] = ['s1', 's10'];

export type BranchOfficeS1ReportResult = {
  activePublishers: number;
  weekendMeetingAttendanceAvg: number;
  totalReports: number;
  totalBibleStudies: number;
  auxPioneersReports: number;
  auxPioneersHours: number;
  auxPioneersBibleStudies: number;
  regPioneersReports: number;
  regPioneersHours: number;
  regPioneersBibleStudies: number;
};

export type BranchOfficeS10ReportResult = {
  midweekMeetingAttendanceAvg: number;
  weekendMeetingAttendanceAvg: number;
  activePublishers: number;
  inactivePublishers: number;
  reactivatedPublishers: number;
  totalTerritories: number;
  uncoveredTerritories: number;
};
