import { BranchReportType } from '@definition/branch_report';

export type ReportSelectorProps = {
  value: BranchReportType;
  onChange: (value: BranchReportType) => void;
};

export type ReportOption = {
  value: BranchReportType;
  name: string;
};
