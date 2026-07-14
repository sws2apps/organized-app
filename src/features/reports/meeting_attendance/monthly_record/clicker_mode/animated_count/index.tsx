import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useRef, useState } from 'react';
import Typography from '@components/typography';
import Confetti from '../confetti';
import { AnimatedCountProps } from './index.types';

const H = 96; // height of one digit cell
const ROLL = 300; // digit roll duration (ms)
const TWEEN = 550; // count-down/up tween for multi-step jumps (ms)
const CAPACITY = 4; // digit columns always mounted (handles up to 9999)

// 1914 — the Kingdom year, and the counter's ceiling. Landing on it celebrates.
const MILESTONE = 1914;

// The strip is a repeating, descending ribbon of digits. `cellDigit` gives the
// digit shown at ribbon index `i`; going *up* the ribbon (lower index) shows a
// higher digit, so an increment rolls the new digit in from the top — and the
// 9→0 wrap keeps rolling the same way instead of snapping back.
const COPIES = 3;
const TOTAL_CELLS = COPIES * 10;
const MID_BASE = 10; // start index of the middle copy
const cellDigit = (i: number) => (10 - (i % 10)) % 10;
const CELLS = Array.from({ length: TOTAL_CELLS }, (_, i) => cellDigit(i));

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

/**
 * One digit column. Rolls along the repeating ribbon in the operation's
 * direction — increments always roll top→bottom (wrap included), decrements
 * bottom→top — then silently re-centers to the middle copy before the next
 * roll so the ribbon never runs out. Independent per column, so a units change
 * never interrupts the tens' animation.
 */
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

    const base = baseIndex(prev); // middle copy, still showing the old digit
    const forward = (digit - prev + 10) % 10;
    const backward = (prev - digit + 10) % 10;
    const target = dir === 'up' ? base - forward : base + backward;

    // Frame 1: jump to the centered old-digit position without transitioning
    // (invisible — same digit). Frame 2: roll to the new digit.
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
        {CELLS.map((d, i) => (
          <Typography
            key={i}
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
            {d}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

/**
 * Large count display: a per-digit ribbon odometer with consistent roll
 * direction, leading-zero columns that collapse in/out, a value tween so a
 * reset counts down, a "1 914" hair space, an accent-colored number and
 * confetti on the Kingdom year, and a denial shake when the ceiling rejects
 * another increment.
 */
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

  // Roll direction for the ribbon columns, derived from the previous committed
  // display. The ref is updated after commit (below) so this stays a pure render
  // calc rather than a write during render.
  const dir: Direction = display < prevDisplayRef.current ? 'down' : 'up';
  useEffect(() => {
    prevDisplayRef.current = display;
  }, [display]);

  // Denial shake — replayed on every `shake` bump (each rejected increment at
  // the ceiling), but never on mount, so reopening after hitting the ceiling
  // doesn't wiggle. The Web Animations API starts a fresh animation per call, so
  // it retriggers reliably in rapid succession — unlike a toggled CSS class.
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

  // Fire a confetti burst only when the count crosses *into* the milestone —
  // not on mount (so opening a field already holding 1914 stays calm). Once
  // fired it remains mounted, replaying on each fresh crossing.
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

      {/* The odometer is a stack of every digit 0-9 per column, which reads as
          noise to a screen reader — hide it and expose the real value instead. */}
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
            // Feather the top/bottom so rolling digits fade in and out.
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
