import { BranchOfficeReportType, type BranchOfficePageStateType } from '../../index.types';

export type BranchOfficeReportToolbarProps = {
  pageState: BranchOfficePageStateType;
  onGenerateReport: (data: BranchOfficeReportToolbarData) => void;
  reportType: BranchOfficeReportType;
};

export type BranchOfficeReportToolbarData = {
  selectedYear: number;
  selectedMonth?: number;
};
