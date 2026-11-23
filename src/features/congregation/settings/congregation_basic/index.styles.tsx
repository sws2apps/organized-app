import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: '24px',
  [theme.breakpoints.up('desktop')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '16px',
  },
})) as unknown as typeof Box;

export const FieldsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  [theme.breakpoints.up('tablet')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.up('desktop')]: {
    width: 'auto',
  },
})) as unknown as typeof Box;

export const DeleteRow = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '8px',
}) as unknown as typeof Box;
