import { BranchReportType } from '@definition/branch_report';

export type DateSelectorProps = {
  report: BranchReportType;
  year: string;
  onYearChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
};
