import { FC } from 'react';
import { keyframes, styled } from '@mui/system';
import { Box, BoxProps } from '@mui/material';
import { NavigationDirection } from '@pages/ministry/preaching_partner/usePreachingPartner';

// mirrors the congregation settings layout so both subpage flows move alike
export const SplitLayout = styled(Box)({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',
}) as unknown as typeof Box;

export const ContentArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: 0,
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

// only the arriving view animates, so the two never overlap
export const NavigationView = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'direction',
})<{ direction: NavigationDirection }>(({ direction }) => {
  const enter = direction === 'forward' ? enterForward : enterBackward;
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    willChange: direction === 'none' ? undefined : 'opacity, transform',
    animation:
      direction === 'none'
        ? 'none'
        : `${enter} ${SUBPAGE_DURATION} ${SUBPAGE_EASING} both`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  };
}) as unknown as FC<BoxProps & { direction: NavigationDirection }>;
