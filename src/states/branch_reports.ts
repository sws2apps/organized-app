import { atom } from 'jotai';
import { BranchReportType } from '@definition/branch_report';

export const branchSelectedReportState = atom<BranchReportType>('S-1');

export const branchSelectedYearState = atom('');

export const branchSelectedMonthState = atom('');
