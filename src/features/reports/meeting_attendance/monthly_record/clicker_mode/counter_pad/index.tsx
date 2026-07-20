import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useState,
} from 'react';
import { Box, ButtonBase } from '@mui/material';
import { IconAdd, IconRemove } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CounterPadProps } from './index.types';

// The pressed look lives in an `is-pressed` class we toggle from React, not in
// `:active`: the browser skips `:active` for the first press right after focus
// moves (e.g. switching tabs), which left that press styled as idle.
const pressedVisual = {
  backgroundColor: 'var(--accent-main)',
  transform: 'scale(0.96)',
  '& svg, & svg g, & svg g path': { fill: 'var(--always-white)' },
};

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
  '&.is-pressed:not(.Mui-disabled)': pressedVisual,
  '&:active:not(.Mui-disabled)': pressedVisual,
  '&.Mui-disabled': { opacity: 0.5 },
  '&:focus-visible': {
    outline: 'var(--accent-main) auto 1px',
    outlineOffset: '-2px',
  },
};

type PressedTile = 'decrement' | 'increment' | null;

const CounterPad = ({
  onIncrement,
  onDecrement,
  decrementDisabled,
}: CounterPadProps) => {
  const { t } = useAppTranslation();

  const [pressed, setPressed] = useState<PressedTile>(null);

  // Count on pointer-down: a click is eaten when focus has just moved, e.g.
  // right after switching tabs. Keyboard sends a click with detail 0. The
  // pressed class mirrors that so the first press is styled as clicked too.
  const pressHandlers = (tile: Exclude<PressedTile, null>, action: () => void) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      setPressed(tile);
      action();
    },
    onPointerUp: () => setPressed(null),
    onPointerLeave: () => setPressed(null),
    onPointerCancel: () => setPressed(null),
    onClick: (event: ReactMouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) action();
    },
  });

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      <ButtonBase
        disableRipple
        disabled={decrementDisabled}
        className={pressed === 'decrement' ? 'is-pressed' : undefined}
        {...pressHandlers('decrement', onDecrement)}
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
        className={pressed === 'increment' ? 'is-pressed' : undefined}
        {...pressHandlers('increment', onIncrement)}
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
