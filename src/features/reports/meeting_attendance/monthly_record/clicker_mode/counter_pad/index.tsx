import { Box, ButtonBase } from '@mui/material';
import { IconAdd, IconRemove } from '@components/icons';
import { CounterPadProps } from './index.types';

const baseTile = {
  flex: 1,
  minWidth: 0,
  height: '128px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--accent-200)',
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
  // Pressed: the whole (already-rounded) tile fills and springs, so its own
  // corner radii scale with it — no clipping against a shared parent.
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

/**
 * The large minus / plus control. Each tile is its own independent, rounded
 * button (minus rounds the left corners, plus the right) so the press-spring
 * animation never clips against a shared clipping container.
 */
const CounterPad = ({
  onIncrement,
  onDecrement,
  decrementDisabled,
}: CounterPadProps) => {
  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      <ButtonBase
        disableRipple
        disabled={decrementDisabled}
        onClick={onDecrement}
        aria-label="decrement"
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
        onClick={onIncrement}
        aria-label="increment"
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
