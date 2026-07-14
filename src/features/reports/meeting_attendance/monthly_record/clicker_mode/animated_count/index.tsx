import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useRef, useState } from 'react';
import Typography from '@components/typography';
import Confetti from '../confetti';
import { AnimatedCountProps } from './index.types';

const H = 96; // height of one digit cell (px)
const ROLL = 300; // digit roll duration (ms)
const TWEEN = 550; // multi-step count up/down duration (ms)
const CAPACITY = 4; // digit columns always mounted

const MILESTONE = 1914; // ceiling; landing here celebrates

// Descending ribbon: increments always roll in from the top (9→0 wrap included).
const COPIES = 3;
const TOTAL_CELLS = COPIES * 10;
const MID_BASE = 10; // start index of the middle copy
const cellDigit = (i: number) => (10 - (i % 10)) % 10;
const CELLS = Array.from({ length: TOTAL_CELLS }, (_, i) => ({
  id: `cell-${i}`,
  digit: cellDigit(i),
}));

type Direction = 'up' | 'down';

const numberColor = (n: number) =>
  n > 0 ? 'var(--black)' : 'var(--accent-350)';

// Ribbon index in the middle copy that shows `digit`.
const baseIndex = (digit: number) => MID_BASE + ((10 - digit) % 10);

type DigitColumnProps = {
  digit: number;
  dir: Direction;
  collapsed: boolean;
  color: string;
  spaceAfter?: boolean;
};

/** One digit column; rolls in the operation's direction, then re-centers. */
const DigitColumn = ({ digit, dir, collapsed, color, spaceAfter }: DigitColumnProps) => {
  const prevRef = useRef(digit);
  const [{ pos, animate }, setState] = useState(() => ({
    pos: baseIndex(digit),
    animate: false,
  }));
  const rafRef = useRef<number>(undefined);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === digit) return;
    prevRef.current = digit;

    const base = baseIndex(prev);
    const forward = (digit - prev + 10) % 10;
    const backward = (prev - digit + 10) % 10;
    const target = dir === 'up' ? base - forward : base + backward;

    // Frame 1: jump to the centered old digit without transition; frame 2: roll.
    setState({ pos: base, animate: false });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() =>
        setState({ pos: target, animate: true })
      );
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [digit, dir]);

  return (
    <Box
      sx={{
        height: `${H}px`,
        overflow: 'hidden',
        display: 'inline-flex',
        width: collapsed ? 0 : '1ch',
        // Hair space after the thousands digit, so 1000+ reads as "1 000".
        marginRight: collapsed || !spaceAfter ? 0 : '0.16em',
        opacity: collapsed ? 0 : 1,
        transition: 'width 0.3s ease, opacity 0.3s ease, margin 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${-(pos * H)}px)`,
          transition: animate
            ? `transform ${ROLL}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none',
        }}
      >
        {CELLS.map((cell) => (
          <Typography
            key={cell.id}
            className="huge-numbers"
            color={color}
            component="span"
            sx={{
              height: `${H}px`,
              lineHeight: `${H}px`,
              display: 'block',
              textAlign: 'center',
              transition: 'color 0.28s ease',
            }}
          >
            {cell.digit}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

/** Ribbon-odometer count with reset count-down, ceiling shake, and confetti. */
const AnimatedCount = ({ value, label, shake = 0 }: AnimatedCountProps) => {
  const safe = Math.max(0, value);

  const [display, setDisplay] = useState(safe);
  const displayRef = useRef(safe);
  const rafRef = useRef<number>(undefined);

  const prevDisplayRef = useRef(safe);

  useEffect(() => {
    const target = safe;
    const from = displayRef.current;

    if (from === target) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (Math.abs(target - from) <= 1) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }

    let startTs: number | null = null;
    const step = (ts: number) => {
      startTs ??= ts;
      const progress = Math.min((ts - startTs) / TWEEN, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);

      displayRef.current = current;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        displayRef.current = target;
        setDisplay(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [safe]);

  // Roll direction vs the previous committed display (ref updated post-commit).
  const dir: Direction = display < prevDisplayRef.current ? 'down' : 'up';
  useEffect(() => {
    prevDisplayRef.current = display;
  }, [display]);

  // Replays on each shake bump (not mount); WAAPI restarts cleanly every call.
  const shakeRef = useRef<HTMLDivElement>(null);
  const prevShakeRef = useRef(shake);
  useEffect(() => {
    if (shake === prevShakeRef.current) return;
    prevShakeRef.current = shake;
    shakeRef.current?.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 400, easing: 'ease' }
    );
  }, [shake]);

  // Fire only when crossing *into* the milestone, not on mount.
  const [confettiKey, setConfettiKey] = useState(0);
  const wasMilestoneRef = useRef(safe === MILESTONE);
  useEffect(() => {
    const isMilestone = display === MILESTONE;
    if (isMilestone && !wasMilestoneRef.current) {
      setConfettiKey((prev) => prev + 1);
    }
    wasMilestoneRef.current = isMilestone;
  }, [display]);

  const milestone = display === MILESTONE;
  const color = milestone ? 'var(--accent-main)' : numberColor(display);
  const places = Array.from({ length: CAPACITY }, (_, i) => CAPACITY - 1 - i);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        userSelect: 'none',
      }}
    >
      <Typography className="h4" color="var(--accent-350)">
        {label}
      </Typography>

      {/* Real value for screen readers; the digit ribbon below is decorative. */}
      <Box component="span" sx={visuallyHidden}>
        {display}
      </Box>

      <Box ref={shakeRef} aria-hidden>
        <Box
          sx={{
            display: 'inline-flex',
            height: `${H}px`,
            overflow: 'hidden',
            fontSize: '64px',
            fontVariantNumeric: 'tabular-nums',
            // Feather top/bottom so rolling digits fade in and out.
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 17%, #000 83%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 17%, #000 83%, transparent 100%)',
          }}
        >
          {places.map((place) => {
            const digit = Math.floor(display / 10 ** place) % 10;
            const collapsed = place > 0 && display < 10 ** place;

            return (
              <DigitColumn
                key={place}
                digit={digit}
                dir={dir}
                collapsed={collapsed}
                color={color}
                spaceAfter={place === 3}
              />
            );
          })}
        </Box>
      </Box>

      {confettiKey > 0 && <Confetti key={confettiKey} />}
    </Box>
  );
};

export default AnimatedCount;
