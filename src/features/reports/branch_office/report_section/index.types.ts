import { BranchReportType } from '@definition/branch_report';

export type ReportSectionProps = {
  report: BranchReportType;
  onReportChange: (value: BranchReportType) => void;
  year: string;
  onYearChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
};
