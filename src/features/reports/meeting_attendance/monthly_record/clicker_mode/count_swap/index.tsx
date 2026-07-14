import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import AnimatedCount from '../animated_count';
import { CountSwapProps } from './index.types';

const DURATION = 400; // ms — enter and exit share this
const DISTANCE = 80; // px — how far each counter travels

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Each counter belongs to its tab's side: "present" enters from and leaves
// toward the left, "online" the right. Switching therefore crossfades — the old
// count slides off one way while the new slides in the other — so the two totals
// read as separate counters set a distance apart, not one number morphing.
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
 * Crossfading wrapper around {@link AnimatedCount}. On a tab change it keeps the
 * outgoing counter mounted so it can slide + fade out toward its side while the
 * incoming counter slides + fades in from its own — instead of the value simply
 * rolling from one total to an unrelated one.
 */
const CountSwap = ({ tab, value, label, shake }: CountSwapProps) => {
  const [model, setModel] = useState<Model>({ tab, value, seq: 0, exiting: null });

  // Derive the transition while rendering, so the outgoing counter appears in
  // the same commit the incoming one mounts — no flicker between them.
  if (model.tab !== tab) {
    setModel((prev) => ({
      tab,
      value,
      seq: prev.seq + 1,
      exiting: { seq: prev.seq + 1, tab: prev.tab, value: prev.value },
    }));
  } else if (model.value !== value) {
    // Same counter, value changed (a tap): update in place so it rolls.
    setModel((prev) => ({ ...prev, value }));
  }

  // Drop the outgoing counter once it has finished animating out.
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
          // Animate the slide-in only on an actual tab switch (seq > 0), never
          // on the first mount — so opening the overlay shows the count still,
          // whether it's 0 or an existing value.
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
