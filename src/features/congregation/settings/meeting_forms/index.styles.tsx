import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const AutoUpdateRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'stretch',
  [theme.breakpoints.up('desktop')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})) as unknown as typeof Box;
