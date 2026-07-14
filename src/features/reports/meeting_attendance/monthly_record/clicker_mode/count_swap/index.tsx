import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import AnimatedCount from '../animated_count';
import { CountSwapProps } from './index.types';

const DURATION = 400; // ms — enter and exit share this
const DISTANCE = 80; // px — how far each counter travels

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Each counter enters/leaves toward its own side (present = left, online =
// right), so a switch crossfades them past each other as two separate totals.
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

/**
 * Crossfading wrapper around {@link AnimatedCount}: on a tab change the outgoing
 * counter stays mounted to slide out while the incoming one slides in.
 */
const CountSwap = ({ tab, value, label, shake }: CountSwapProps) => {
  const [model, setModel] = useState<Model>({ tab, value, seq: 0, exiting: null });

  // Derived during render so the outgoing counter appears in the same commit the
  // incoming one mounts — no flicker.
  if (model.tab !== tab) {
    setModel((prev) => ({
      tab,
      value,
      seq: prev.seq + 1,
      exiting: { seq: prev.seq + 1, tab: prev.tab, value: prev.value },
    }));
  } else if (model.value !== value) {
    // Same counter, a tap: update in place so it rolls.
    setModel((prev) => ({ ...prev, value }));
  }

  // Drop the outgoing counter once it has animated out.
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
          // Slide in only on a real switch (seq > 0), never on first mount, so
          // the count opens still.
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
