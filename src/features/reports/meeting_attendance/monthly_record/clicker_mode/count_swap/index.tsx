import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import AnimatedCount from '../animated_count';
import { CountSwapProps } from './index.types';

const DURATION = 400;
const DISTANCE = 80;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const keyframes = {
  '@keyframes clicker-count-enter-left': {
    from: { opacity: 0, transform: `translateX(-${DISTANCE}px)` },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  '@keyframes clicker-count-enter-right': {
    from: { opacity: 0, transform: `translateX(${DISTANCE}px)` },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  '@keyframes clicker-count-exit-left': {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: `translateX(-${DISTANCE}px)` },
  },
  '@keyframes clicker-count-exit-right': {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: `translateX(${DISTANCE}px)` },
  },
};

const side = (tab: string) => (tab === 'online' ? 'right' : 'left');

type Model = {
  tab: CountSwapProps['tab'];
  value: number;
  seq: number;
  exiting: { seq: number; tab: CountSwapProps['tab']; value: number } | null;
};

const CountSwap = ({ tab, value, label, shake }: CountSwapProps) => {
  const [model, setModel] = useState<Model>({ tab, value, seq: 0, exiting: null });

  // Derived during render so old + new appear in one commit — no flicker.
  if (model.tab !== tab) {
    setModel((prev) => ({
      tab,
      value,
      seq: prev.seq + 1,
      exiting: { seq: prev.seq + 1, tab: prev.tab, value: prev.value },
    }));
  } else if (model.value !== value) {
    setModel((prev) => ({ ...prev, value }));
  }

  useEffect(() => {
    if (!model.exiting) return;
    const exitingSeq = model.exiting.seq;
    const id = setTimeout(() => {
      setModel((prev) =>
        prev.exiting?.seq === exitingSeq ? { ...prev, exiting: null } : prev
      );
    }, DURATION);

    return () => clearTimeout(id);
  }, [model.exiting]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        justifyContent: 'center',
        ...keyframes,
      }}
    >
      <Box
        key={`in-${model.tab}-${model.seq}`}
        sx={{
          // No enter animation on first mount (seq 0) — only on a real switch.
          animation:
            model.seq > 0
              ? `clicker-count-enter-${side(model.tab)} ${DURATION}ms ${EASING}`
              : 'none',
        }}
      >
        <AnimatedCount value={model.value} label={label} shake={shake} />
      </Box>

      {model.exiting && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            key={`out-${model.exiting.seq}`}
            sx={{
              animation: `clicker-count-exit-${side(model.exiting.tab)} ${DURATION}ms ${EASING} forwards`,
            }}
          >
            <AnimatedCount value={model.exiting.value} label={label} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CountSwap;
