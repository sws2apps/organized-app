import { useCallback, useEffect, useState } from 'react';
import { useScrollFade } from '@hooks/index';

// matches the month header height, so the list fades right below the pin
export const PIN_HEIGHT = 44;

// how far below the pin a list header takes to fade back in
const HEADER_FADE = 32;

const SWAP_DURATION = 280;

type MonthPin = {
  index: number;
  previous: number;
  direction: 'up' | 'down';
};

/**
 * Keeps the header of the month being read pinned above a scrolling list.
 *
 * The pin swaps months with a short slide, and the list's own headers fade out
 * before they reach it, so no clipped copy ever shows below the pin.
 */
const useMonthPin = (resetKey: string) => {
  const fadeRef = useScrollFade();

  const [list, setList] = useState<HTMLDivElement | null>(null);
  const [pin, setPin] = useState<MonthPin>({
    index: 0,
    previous: -1,
    direction: 'down',
  });

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      fadeRef(el);
      setList(el);
    },
    [fadeRef]
  );

  useEffect(() => {
    if (!list) return;

    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    let current = 0;

    list.scrollTop = 0;
    setPin({ index: 0, previous: -1, direction: 'down' });

    const update = () => {
      frame = 0;

      const headers = list.querySelectorAll<HTMLElement>('[data-month-header]');

      let index = 0;

      headers.forEach((header, i) => {
        const top = header.offsetTop - list.scrollTop;

        if (top <= PIN_HEIGHT / 2) index = i;

        const opacity = (top - PIN_HEIGHT) / HEADER_FADE;
        header.style.opacity = Math.min(Math.max(opacity, 0), 1).toFixed(3);
      });

      if (index === current) return;

      const previous = current;
      current = index;

      setPin({
        index,
        previous,
        direction: index > previous ? 'down' : 'up',
      });

      clearTimeout(timer);
      timer = setTimeout(
        () => setPin((prev) => ({ ...prev, previous: -1 })),
        SWAP_DURATION
      );
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    list.addEventListener('scroll', handleScroll, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      list.removeEventListener('scroll', handleScroll);
    };
  }, [list, resetKey]);

  return { ref, pin };
};

export default useMonthPin;
