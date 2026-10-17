import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { StepTextProps, StepTickerProps } from './index.types';
import Typography from '@components/typography';

const ROTATION_INTERVAL = 2500;
const ENTER_DELAY = 150;
const ENTER_DURATION = 600;
const EXIT_DURATION = 350;
const WORD_STAGGER = 45;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const keyframes = {
  '@keyframes step-ticker-word-in': {
    from: { opacity: 0, filter: 'blur(6px)', transform: 'translateY(4px)' },
    to: { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
  },
  '@keyframes step-ticker-out': {
    from: { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
    to: { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-4px)' },
  },
};

const reducedMotion = {
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
};

const StepText = ({ text, exiting }: StepTextProps) => {
  const words = text.split(' ');

  return (
    <Typography
      className="body-small-regular"
      color="var(--grey-400)"
      sx={{
        position: exiting ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        paddingBlock: '6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        pointerEvents: 'none',
        animation: exiting
          ? `step-ticker-out ${EXIT_DURATION}ms ${EASING} both`
          : undefined,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          visibility: exiting ? 'hidden' : 'visible',
        },
      }}
    >
      {words.map((word, index) => (
        <Box
          key={`${word}-${index}`}
          component="span"
          sx={{
            display: 'inline-block',
            whiteSpace: 'pre',
            animation: exiting
              ? undefined
              : `step-ticker-word-in ${ENTER_DURATION}ms ${EASING} ${ENTER_DELAY + index * WORD_STAGGER}ms both`,
            ...reducedMotion,
          }}
        >
          {index < words.length - 1 ? `${word} ` : `${word}...`}
        </Box>
      ))}
    </Typography>
  );
};

const StepTicker = ({ steps }: StepTickerProps) => {
  const [{ current, previous }, setStep] = useState<{
    current: number;
    previous: number | null;
  }>({ current: 0, previous: null });

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => ({
        current: (prev.current + 1) % steps.length,
        previous: prev.current,
      }));
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <Box
      aria-hidden
      sx={{ ...keyframes, position: 'relative', marginBlock: '-6px' }}
    >
      {previous !== null && (
        <StepText key={`exit-${previous}`} text={steps[previous]} exiting />
      )}
      <StepText key={`enter-${current}`} text={steps[current]} />
    </Box>
  );
};

export default StepTicker;
