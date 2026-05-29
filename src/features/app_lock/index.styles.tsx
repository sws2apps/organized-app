import { Box, styled } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUpFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AppLockPage = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  paddingTop: '120px',
  backgroundColor: 'var(--accent-100)',
  overflowY: 'auto',
  animation: `${fadeIn} 200ms ease-out both`,
}) as unknown as typeof Box;

export const AppLockCard = styled(Box)({
  width: '100%',
  maxWidth: '440px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  backgroundColor: 'var(--white)',
  boxShadow: 'var(--big-card-shadow)',
  animation: `${slideUpFadeIn} 250ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both`,
}) as unknown as typeof Box;

export const PinFieldStack = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  paddingTop: '16px',
  paddingBottom: '8px',
}) as unknown as typeof Box;

export const DialogActionsStack = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}) as unknown as typeof Box;
