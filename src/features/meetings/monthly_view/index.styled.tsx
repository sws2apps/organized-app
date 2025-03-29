import { Box, styled } from '@mui/material';

export const StyledMonthlyViewRow = styled(Box)({
  flexDirection: 'row',
  alignItems: 'stretch',
  display: 'flex',
  gap: '16px',
}) as unknown as typeof Box;

export const StyledMonthlyViewColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'space-between',
  height: '100%',
}) as unknown as typeof Box;

export const StyledMonthlyViewTitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
}) as unknown as typeof Box;
