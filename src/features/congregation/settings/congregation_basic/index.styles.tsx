import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '8px',
  flexDirection: 'column',
  [theme.breakpoints.up('desktop')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
})) as unknown as typeof Box;

export const FieldsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  [theme.breakpoints.up('desktop')]: {
    flexDirection: 'row',
    width: 'auto',
  },
})) as unknown as typeof Box;

export const DeleteRow = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '8px',
}) as unknown as typeof Box;
