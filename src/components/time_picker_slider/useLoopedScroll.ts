import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { haptic } from '@services/haptics';
import { CASE_SIZE } from './index.styles';

type LoopedScrollOptions = {
  defaultValue: number;
  max: number;
  onChange: (value: number) => void;
};

const MIN_TRACK_LENGTH = 12000;
const SETTLE_DURATION = 450;
const SCROLL_IDLE = 150;

const wrap = (value: number, max: number) => ((value % max) + max) % max;

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

const prefersReducedMotion = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * Loops a natively scrolled list by repeating its values. Once a scroll stops,
 * the list settles on the nearest row and jumps back to the same value in the
 * middle copy, which looks identical.
 */
const useLoopedScroll = ({
  defaultValue,
  max,
  onChange,
}: LoopedScrollOptions) => {
  const ref = useRef<HTMLDivElement>(null);

  const cycles = Math.ceil(MIN_TRACK_LENGTH / (max * CASE_SIZE) / 2) * 2 + 1;
  const middle = Math.floor(cycles / 2) * max;

  const [index, setIndex] = useState(middle + defaultValue);

  const indexRef = useRef(index);
  const targetRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = indexRef.current * CASE_SIZE;
  }, []);

  const recenter = useCallback(() => {
    const element = ref.current;

    if (!element) return;

    const current = Math.round(element.scrollTop / CASE_SIZE);

    element.scrollTop += (middle + wrap(current, max) - current) * CASE_SIZE;
  }, [max, middle]);

  const scrollToIndex = useCallback(
    (next: number) => {
      const element = ref.current;

      if (!element) return;

      cancelAnimationFrame(frameRef.current);
      targetRef.current = next;

      const from = element.scrollTop;
      const distance = next * CASE_SIZE - from;
      const start = performance.now();
      const duration = prefersReducedMotion() ? 0 : SETTLE_DURATION;

      const step = (now: number) => {
        const progress = duration ? Math.min((now - start) / duration, 1) : 1;

        element.scrollTop = from + distance * easeOutQuart(progress);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step);
          return;
        }

        targetRef.current = null;
        recenter();
      };

      frameRef.current = requestAnimationFrame(step);
    },
    [recenter]
  );

  const stepBy = useCallback(
    (steps: number) =>
      scrollToIndex((targetRef.current ?? indexRef.current) + steps),
    [scrollToIndex]
  );

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const supportsScrollEnd = 'onscrollend' in element;

    let frame = 0;
    let idleTimer: ReturnType<typeof setTimeout>;

    const update = () => {
      frame = 0;

      const current = Math.round(element.scrollTop / CASE_SIZE);

      if (current === indexRef.current) return;

      const changed = wrap(current, max) !== wrap(indexRef.current, max);

      indexRef.current = current;
      setIndex(current);

      if (!changed) return;

      haptic('tick');
      onChangeRef.current(wrap(current, max));
    };

    const settle = () => {
      if (targetRef.current !== null) return;

      const nearest = Math.round(element.scrollTop / CASE_SIZE);

      if (Math.abs(element.scrollTop - nearest * CASE_SIZE) < 0.5) recenter();
      else scrollToIndex(nearest);
    };

    const interrupt = () => {
      cancelAnimationFrame(frameRef.current);
      targetRef.current = null;
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);

      if (!supportsScrollEnd) {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(settle, SCROLL_IDLE);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') stepBy(-1);
      else if (event.key === 'ArrowDown') stepBy(1);
      else return;

      event.preventDefault();
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    element.addEventListener('scrollend', settle);
    element.addEventListener('wheel', interrupt, { passive: true });
    element.addEventListener('touchstart', interrupt, { passive: true });
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(frameRef.current);
      clearTimeout(idleTimer);

      element.removeEventListener('scroll', handleScroll);
      element.removeEventListener('scrollend', settle);
      element.removeEventListener('wheel', interrupt);
      element.removeEventListener('touchstart', interrupt);
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [max, recenter, scrollToIndex, stepBy]);

  return {
    ref,
    value: wrap(index, max),
    count: cycles * max,
    scrollToIndex,
    stepBy,
  };
};

export default useLoopedScroll;
