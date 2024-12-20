import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const DoubleFieldContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
}) as unknown as typeof Box;

export const PrimaryFieldContainer = styled(Box)({
  flex: 1,
}) as unknown as typeof Box;

export const SecondaryFieldContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}) as unknown as typeof Box;
