import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Select, Button } from '@components/index';
import { BranchOfficeReportType } from '../../index.types';

export const StyledSelect = styled(Select)<{ reportType: BranchOfficeReportType }>(({ reportType }) => ({
  flex: reportType === 's1' ? 0.33333 : 1,
}));

export const StyledButton = styled(Button)<{ reportType: BranchOfficeReportType }>(({ reportType }) => ({
  flex: reportType === 's1' ? 0.33333 : 1,
}));
export const StyledBox = styled(Box)(({ laptopView }: { laptopView: boolean }) => ({
  display: 'flex',
  gap: '16px',
  flexDirection: laptopView ? 'row' : 'column',
}));
