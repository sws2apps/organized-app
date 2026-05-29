import { Box, styled } from '@mui/material';
import { keyframes } from '@emotion/react';
import { EXIT_DURATION_MS } from './animations';

// --- Entrance animations ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUpFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Exit animations ---

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const zoomFadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(1.04);
  }
`;

export const AppLockPage = styled(Box)<{ exiting?: boolean }>(({ exiting }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1200,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '24px',
  paddingTop: 'clamp(48px, 12vh, 120px)',
  paddingBottom: '24px',
  backgroundColor: 'var(--accent-100)',
  overflowY: 'auto',
  '@supports (height: 100dvh)': {
    height: '100dvh',
    bottom: 'auto',
  },
  animation: exiting
    ? `${fadeOut} ${EXIT_DURATION_MS}ms ease-in-out both`
    : `${fadeIn} 300ms ease-out both`,
})) as unknown as typeof Box;

export const AppLockCard = styled(Box)<{ exiting?: boolean }>(({ exiting }) => ({
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
  animation: exiting
    ? `${zoomFadeOut} ${EXIT_DURATION_MS - 50}ms cubic-bezier(0.4, 0, 1, 1) both`
    : `${slideUpFadeIn} 400ms cubic-bezier(0.16, 1, 0.3, 1) 40ms both`,
})) as unknown as typeof Box;

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
