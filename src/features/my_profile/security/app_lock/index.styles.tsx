import { Box, styled } from '@mui/material';

export const AppLockHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  justifyContent: 'space-between',
  flexGrow: 1,
  flexDirection: 'column',
  [theme.breakpoints.up('laptop')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})) as unknown as typeof Box;

export const AppLockLabelStack = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}) as unknown as typeof Box;

export const ChangePinTrigger = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  color: 'var(--accent-main)',
}) as unknown as typeof Box;

export const AppLockSecondRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
  alignItems: 'stretch',
  [theme.breakpoints.up('laptop')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})) as unknown as typeof Box;

export const BiometricRow = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  flexGrow: 1,
}) as unknown as typeof Box;

export const BiometricLabelStack = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}) as unknown as typeof Box;
