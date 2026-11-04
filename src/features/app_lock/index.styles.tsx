import { Box, styled } from '@mui/material';
import { keyframes } from '@emotion/react';

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

export const AppLockPage = styled(Box)({
  height: '100dvh',
  overflowY: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: 'clamp(48px, 12vh, 120px) var(--page-padding) 24px',
  backgroundColor: 'var(--accent-100)',
  outline: 'none',
});

export const AppLockCard = styled(Box)({
  width: '100%',
  maxWidth: '440px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '24px',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-300)',
  backgroundColor: 'var(--white)',
  boxShadow: 'var(--big-card-shadow)',
  animation: `${slideUpFadeIn} 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,

  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
});
