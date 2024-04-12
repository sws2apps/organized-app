import { TFunction } from 'i18next';
import { BranchOfficeReportType, type BranchOfficePageStateType } from '../../index.types';

export type BranchOfficeReportToolbarProps = {
  pageState: BranchOfficePageStateType;
  onGenerateReport: (data: BranchOfficeReportToolbarData, year: string, month: string) => void;
  reportType: BranchOfficeReportType;
  t: TFunction<'translation', undefined>;
};

export type BranchOfficeReportToolbarData = {
  selectedYear: number;
  selectedMonth?: number;
};
