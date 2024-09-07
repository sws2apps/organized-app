import { atom } from 'recoil';
import { BranchReportType } from '@definition/branch_report';

export const branchSelectedReportState = atom<BranchReportType>({
  key: 'branchSelectedReport',
  default: 'S-1',
});

export const branchSelectedYearState = atom({
  key: 'branchSelectedYear',
  default: '',
});

export const branchSelectedMonthState = atom({
  key: 'branchSelectedMonth',
  default: '',
});
