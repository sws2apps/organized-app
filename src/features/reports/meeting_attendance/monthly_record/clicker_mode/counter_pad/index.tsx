import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { Box, ButtonBase } from '@mui/material';
import { IconAdd, IconRemove } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CounterPadProps } from './index.types';

const baseTile = {
  flex: 1,
  minWidth: 0,
  height: '128px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--accent-200)',
  userSelect: 'none',
  touchAction: 'manipulation',
  transition:
    'background-color 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '& svg': { width: '48px', height: '48px' },
  '& svg, & svg g, & svg g path': {
    fill: 'var(--accent-main)',
    transition: 'fill 0.18s ease',
  },
  '&:hover:not(.Mui-disabled)': {
    '@media (hover: hover)': {
      backgroundColor: 'var(--accent-main)',
      '& svg, & svg g, & svg g path': { fill: 'var(--always-white)' },
    },
  },
  '&:active:not(.Mui-disabled)': {
    backgroundColor: 'var(--accent-main)',
    transform: 'scale(0.96)',
    '& svg, & svg g, & svg g path': { fill: 'var(--always-white)' },
  },
  '&.Mui-disabled': { opacity: 0.5 },
  '&:focus-visible': {
    outline: 'var(--accent-main) auto 1px',
    outlineOffset: '-2px',
  },
};

const CounterPad = ({
  onIncrement,
  onDecrement,
  decrementDisabled,
}: CounterPadProps) => {
  const { t } = useAppTranslation();

  // Count on pointer-down: a click is eaten when focus has just moved, e.g.
  // right after switching tabs. Keyboard sends a click with detail 0.
  const pressHandlers = (action: () => void) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      action();
    },
    onClick: (event: ReactMouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) action();
    },
  });

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      <ButtonBase
        disableRipple
        disabled={decrementDisabled}
        {...pressHandlers(onDecrement)}
        aria-label={t('tr_decrease')}
        sx={{
          ...baseTile,
          borderRadius:
            'var(--radius-xxl) var(--radius-s) var(--radius-s) var(--radius-xxl)',
        }}
      >
        <IconRemove />
      </ButtonBase>

      <ButtonBase
        disableRipple
        {...pressHandlers(onIncrement)}
        aria-label={t('tr_increase')}
        sx={{
          ...baseTile,
          borderRadius:
            'var(--radius-s) var(--radius-xxl) var(--radius-xxl) var(--radius-s)',
        }}
      >
        <IconAdd />
      </ButtonBase>
    </Box>
  );
};

export default CounterPad;
