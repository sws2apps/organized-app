import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useRef, useState } from 'react';
import Typography from '@components/typography';
import Confetti from '../confetti';
import { AnimatedCountProps } from './index.types';

const H = 96;
const ROLL = 300;
const TWEEN = 550;
const CAPACITY = 4;
const MILESTONE = 1914;

// Descending digit ribbon: increments always roll in from the top.
const COPIES = 3;
const TOTAL_CELLS = COPIES * 10;
const MID_BASE = 10;
const cellDigit = (i: number) => (10 - (i % 10)) % 10;
const CELLS = Array.from({ length: TOTAL_CELLS }, (_, i) => ({
  id: `cell-${i}`,
  digit: cellDigit(i),
}));

type Direction = 'up' | 'down';

const numberColor = (n: number) =>
  n > 0 ? 'var(--black)' : 'var(--accent-350)';

const baseIndex = (digit: number) => MID_BASE + ((10 - digit) % 10);

type DigitColumnProps = {
  digit: number;
  dir: Direction;
  collapsed: boolean;
  color: string;
  spaceAfter?: boolean;
};

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

    // Jump to the old digit without transition, then roll on the next frame.
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
        marginRight: collapsed || !spaceAfter ? 0 : '0.16em', // thousands separator
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

      <Box component="span" sx={visuallyHidden} aria-live="polite">
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
