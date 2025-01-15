import { Box, styled } from '@mui/material';

export const StyledMonthlyViewRow = styled(Box)({
  flexDirection: 'row',
  alignItems: 'stretch',
  display: 'flex',
  gap: '16px',
});

export const StyledMonthlyViewColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'space-between',
  height: '100%',
});

export const StyledMonthlyViewTitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});
