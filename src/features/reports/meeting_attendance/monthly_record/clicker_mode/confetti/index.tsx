import { Box } from '@mui/material';

const COLORS = [
  'var(--accent-main)',
  'var(--orange-main)',
  'var(--green-main)',
  'var(--red-main)',
  'var(--accent-dark)',
];

// Deterministic per-piece config. `sway` = drift, `fall` = vertical distance.
const PIECES = [
  { left: 6, sway: 30, fall: 900, rot: 300, dur: 2.4, delay: 0, size: 9, ci: 0 },
  { left: 14, sway: -24, fall: 860, rot: -260, dur: 2.7, delay: 0.15, size: 7, ci: 1 },
  { left: 23, sway: 36, fall: 920, rot: 220, dur: 2.3, delay: 0.05, size: 10, ci: 2 },
  { left: 32, sway: -28, fall: 880, rot: -320, dur: 2.9, delay: 0.22, size: 8, ci: 3 },
  { left: 40, sway: 22, fall: 840, rot: 180, dur: 2.5, delay: 0.38, size: 6, ci: 4 },
  { left: 49, sway: -34, fall: 900, rot: 280, dur: 2.8, delay: 0.28, size: 8, ci: 0 },
  { left: 58, sway: 26, fall: 860, rot: -240, dur: 2.4, delay: 0.08, size: 7, ci: 1 },
  { left: 67, sway: -30, fall: 920, rot: 320, dur: 2.7, delay: 0.18, size: 10, ci: 2 },
  { left: 76, sway: 32, fall: 880, rot: -300, dur: 2.3, delay: 0.26, size: 9, ci: 3 },
  { left: 85, sway: -22, fall: 840, rot: 200, dur: 2.6, delay: 0.12, size: 7, ci: 4 },
  { left: 93, sway: 28, fall: 900, rot: -180, dur: 2.9, delay: 0.34, size: 8, ci: 0 },
] as const;

/** Brief confetti shower (mount keyed to replay); falls from the top at a steady pace. */
const Confetti = () => {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: (theme) => theme.zIndex.modal + 1,
        '@keyframes confetti-fall': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: 0 },
          '5%': { opacity: 1 },
          '25%': {
            transform:
              'translate(var(--sway), calc(var(--fall) * 0.25)) rotate(calc(var(--rot) * 0.25))',
          },
          '50%': {
            transform:
              'translate(calc(var(--sway) * -0.6), calc(var(--fall) * 0.5)) rotate(calc(var(--rot) * 0.5))',
          },
          '75%': {
            transform:
              'translate(calc(var(--sway) * 0.8), calc(var(--fall) * 0.75)) rotate(calc(var(--rot) * 0.75))',
          },
          '92%': {
            transform:
              'translate(calc(var(--sway) * -0.2), calc(var(--fall) * 0.92)) rotate(calc(var(--rot) * 0.92))',
            opacity: 1,
          },
          '100%': {
            transform:
              'translate(calc(var(--sway) * 0.2), var(--fall)) rotate(var(--rot))',
            opacity: 0,
          },
        },
      }}
    >
      {PIECES.map((piece) => (
        <Box
          key={piece.left}
          sx={{
            position: 'absolute',
            top: '-16px',
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            borderRadius: '2px',
            backgroundColor: COLORS[piece.ci],
            animation: `confetti-fall ${piece.dur}s linear ${piece.delay}s both`,
            '--sway': `${piece.sway}px`,
            '--fall': `${piece.fall}px`,
            '--rot': `${piece.rot}deg`,
          }}
        />
      ))}
    </Box>
  );
};

export default Confetti;
