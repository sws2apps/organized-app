import { FC } from 'react';
import { keyframes, styled } from '@mui/system';
import { Box, BoxProps } from '@mui/material';
import { NavigationDirection } from './useCongregationSettings';

/** Top-level page wrapper — vertical column with 16px gap. */
export const PageContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
}) as unknown as typeof Box;

/** Horizontal split layout for sidebar + content on desktop/tablet. */
export const SplitLayout = styled(Box)({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',
}) as unknown as typeof Box;

/** Content area that fills the remaining space next to the sidebar. */
export const ContentArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: 0,
}) as unknown as typeof Box;

/** Center-aligned wrapper for action buttons (e.g. Delete). */
export const CenteredAction = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '8px',
}) as unknown as typeof Box;

const SUBPAGE_OFFSET = '28px';
const SUBPAGE_DURATION = '340ms';
const SUBPAGE_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';

const enterForward = keyframes({
  from: { opacity: 0, transform: `translate3d(${SUBPAGE_OFFSET}, 0, 0)` },
  to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
});

const enterBackward = keyframes({
  from: { opacity: 0, transform: `translate3d(-${SUBPAGE_OFFSET}, 0, 0)` },
  to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
});

/**
 * Wrapper that slides the mobile list and its subpages in from the side the
 * navigation came from. Only the arriving view animates, so the two never
 * overlap and the page height never jumps.
 */
export const NavigationView = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'direction',
})<{ direction: NavigationDirection }>(({ direction }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  willChange: direction === 'none' ? undefined : 'opacity, transform',
  animation:
    direction === 'none'
      ? 'none'
      : `${direction === 'forward' ? enterForward : enterBackward} ${SUBPAGE_DURATION} ${SUBPAGE_EASING} both`,
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
})) as unknown as FC<BoxProps & { direction: NavigationDirection }>;
