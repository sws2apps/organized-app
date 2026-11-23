import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const ConductorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '16px',
  [theme.breakpoints.up('desktop')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})) as unknown as typeof Box;

export const SwitchColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.up('desktop')]: {
    flex: 65,
  },
})) as unknown as typeof Box;

export const SelectColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.up('desktop')]: {
    flex: 35,
  },
})) as unknown as typeof Box;
