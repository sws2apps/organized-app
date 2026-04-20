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

export const StyledNavigationArrowButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
  borderRadius: '50%',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'var(--accent-150)',
  },
  '&:active': {
    backgroundColor: 'var(--accent-200)',
  },
}) as unknown as typeof Box;
