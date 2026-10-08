import { useState } from 'react';
import { Box, keyframes } from '@mui/material';

// squeezed by the press, then springing past its size and settling
const pop = (turn: number) => keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(0.84); }
  65% { transform: scale(1.08); }
  100% { transform: scale(1); --turn: ${turn}; }
`;

// two otherwise equal animations taken in turns: a new name restarts the
// pop on every change, even mid-way through the last one
const POPS = [pop(0), pop(1)];

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const DRAW = 'cubic-bezier(0.65, 0, 0.15, 1)';
const WIPE = 'cubic-bezier(0.4, 0, 1, 1)';

export type CheckMarkState = 'unchecked' | 'checked' | 'indeterminate';

// one icon for every state, so a change animates in and out instead of
// swapping icons
const CheckMark = ({
  state,
  disabled = false,
}: {
  state: CheckMarkState;
  disabled?: boolean;
}) => {
  const on = state !== 'unchecked';
  // a box that loads checked stays still; only a change pops
  const [seen, setSeen] = useState(state);
  const [changes, setChanges] = useState(0);
  if (seen !== state) {
    setSeen(state);
    setChanges(changes + 1);
  }
  const color = disabled
    ? 'var(--accent-300)'
    : on
      ? 'var(--accent-main)'
      : 'var(--accent-350)';

  const stroke = (shown: boolean) => ({
    fill: 'none',
    stroke: 'var(--always-white)',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: 1,
    // drawn in with a flick once the box has filled, wiped out quickly
    strokeDashoffset: shown ? 0 : 1,
    transform: shown ? 'scale(1)' : 'scale(0.7)',
    transition: shown
      ? `stroke-dashoffset 300ms ${DRAW} 90ms, transform 420ms ${SPRING} 60ms`
      : `stroke-dashoffset 140ms ${WIPE}, transform 160ms ${WIPE}`,
  });

  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={{
        width: 24,
        height: 24,
        display: 'block',
        transformOrigin: 'center',
        animation: changes
          ? `${POPS[changes % 2]} 380ms cubic-bezier(0.22, 1, 0.36, 1)`
          : 'none',
        '& *': { transformOrigin: 'center', transformBox: 'view-box' },
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          '& *': { transition: 'none !important' },
        },
      }}
    >
      <Box
        component="rect"
        x={4.25}
        y={4.25}
        width={15.5}
        height={15.5}
        rx={1.05}
        sx={{
          fill: on ? color : 'transparent',
          stroke: color,
          strokeWidth: 1.5,
          transition: `fill 200ms ${DRAW}, stroke 200ms ${DRAW}`,
        }}
      />
      <Box
        component="path"
        d="M7.4 12.1 10.6 15.2 16.6 8.9"
        pathLength={1}
        sx={stroke(state === 'checked')}
      />
      <Box
        component="path"
        d="M8 12H16"
        pathLength={1}
        sx={stroke(state === 'indeterminate')}
      />
    </Box>
  );
};

export default CheckMark;
