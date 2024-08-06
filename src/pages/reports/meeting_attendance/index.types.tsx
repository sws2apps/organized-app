export type MeetingAttendanceS1ReportResult = {
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

export type MeetingAttendanceS10ReportResult = {
  midweekMeetingAttendanceAvg: number;
  weekendMeetingAttendanceAvg: number;
  activePublishers: number;
  inactivePublishers: number;
  reactivatedPublishers: number;
  totalTerritories: number;
  uncoveredTerritories: number;
};
