import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { RollingDigitProps } from './index.types';

// Same feel as the clicker counter's rolling digits, but a short roll: the
// new digit drops in from just above and the old one slips below, both fading,
// instead of a full-height scroll.
const DURATION = 320;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DISTANCE = '0.45em';

// The old digit has to be gone about as fast as the new one lands, or it
// lingers under it and reads as the stronger of the two. It fades first,
// barely moving, and only slips the rest of its shorter way once nearly
// invisible.
const EXIT_DURATION = 200;
const EXIT_DISTANCE = '0.3em';

const enter = keyframes`
  from { opacity: 0; transform: translateY(-${DISTANCE}); }
  to { opacity: 1; transform: translateY(0); }
`;

const exit = keyframes`
  0% { opacity: 1; transform: translateY(0); }
  40% { opacity: 0.15; transform: translateY(0.08em); }
  100% { opacity: 0; transform: translateY(${EXIT_DISTANCE}); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

type Model = {
  current: string;
  previous: string | null;
  seq: number;
};

const RollingDigit = ({ char, animate }: RollingDigitProps) => {
  const [model, setModel] = useState<Model>({
    current: char,
    previous: null,
    seq: 0,
  });

  // Derived during render so the old and new digit appear in the same commit.
  if (model.current !== char) {
    setModel((prev) => ({
      current: char,
      previous: animate ? prev.current : null,
      seq: prev.seq + 1,
    }));
  }

  useEffect(() => {
    if (model.previous === null) return;

    const seq = model.seq;
    const id = setTimeout(() => {
      setModel((prev) =>
        prev.seq === seq ? { ...prev, previous: null } : prev
      );
    }, DURATION);

    return () => clearTimeout(id);
  }, [model.seq, model.previous]);

  const rolling = model.previous !== null;

  return (
    <Box
      component="span"
      sx={{ position: 'relative', display: 'inline-block' }}
    >
      <Box
        component="span"
        key={`in-${model.seq}`}
        sx={{
          display: 'inline-block',
          animation: rolling ? `${enter} ${DURATION}ms ${EASING}` : 'none',
          '@media (prefers-reduced-motion: reduce)': {
            animation: rolling ? `${fadeIn} ${DURATION}ms ease` : 'none',
          },
        }}
      >
        {model.current}
      </Box>

      {rolling && (
        <Box
          component="span"
          aria-hidden
          key={`out-${model.seq}`}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            animation: `${exit} ${EXIT_DURATION}ms linear forwards`,
            '@media (prefers-reduced-motion: reduce)': {
              animation: `${fadeOut} ${EXIT_DURATION}ms ease forwards`,
            },
          }}
        >
          {model.previous}
        </Box>
      )}
    </Box>
  );
};

export default RollingDigit;
