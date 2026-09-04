import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { PaneSwitcherProps } from './index.types';

// mirrors the --motion-base token the panes animate with
const SWITCH_DURATION = 240;

// panes slide out by their own width, plus the page padding when they are
// allowed to leave the container, so they clear the edge of the screen
const getPaneOffset = (distance: number, fullBleed?: boolean) => {
  if (distance === 0) return 'none';

  const padding = fullBleed ? ` + ${distance} * var(--page-padding)` : '';

  return `translateX(calc(${distance * 100}%${padding}))`;
};

/**
 * Component that slides between panes that share the same spot on a page.
 * @param {PaneSwitcherProps} props - Props for the PaneSwitcher component.
 * @returns {JSX.Element} PaneSwitcher component.
 */
const PaneSwitcher = ({ panes, value, fullBleed, sx }: PaneSwitcherProps) => {
  const paneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [height, setHeight] = useState<number>();
  const [isSwitching, setIsSwitching] = useState(false);
  const isFirstValue = useRef(true);

  useLayoutEffect(() => {
    const pane = paneRefs.current[value];

    if (!pane) return;

    const observer = new ResizeObserver(() => {
      setHeight(pane.offsetHeight);
    });

    observer.observe(pane);

    return () => observer.disconnect();
  }, [value]);

  // while the panes slide past each other both of them need their full height,
  // otherwise the taller one gets cut in the middle of the animation
  useLayoutEffect(() => {
    // nothing slides on mount, so reserving the tallest pane would only make
    // the page jump once the reservation ends
    if (isFirstValue.current) {
      isFirstValue.current = false;
      return;
    }

    setIsSwitching(true);

    const timer = setTimeout(() => setIsSwitching(false), SWITCH_DURATION);

    return () => clearTimeout(timer);
  }, [value]);

  const paneHeights = paneRefs.current.map((pane) => pane?.offsetHeight ?? 0);

  const containerHeight = isSwitching
    ? Math.max(height ?? 0, ...paneHeights)
    : height;

  useEffect(() => {
    for (const [index, pane] of paneRefs.current.entries()) {
      if (!pane) continue;

      pane.inert = index !== value;
    }
  }, [value, panes.length]);

  return (
    <Box
      sx={{
        display: 'grid',
        overflow: 'clip',
        width: '100%',
        height: containerHeight ? `${containerHeight}px` : 'auto',
        ...(fullBleed && {
          width: 'calc(100% + var(--page-padding) * 2)',
          marginInline: 'calc(var(--page-padding) * -1)',
          paddingInline: 'var(--page-padding)',
        }),
        ...sx,
      }}
    >
      {panes.map((pane, index) => (
        <Box
          key={pane.key}
          ref={(element: HTMLDivElement | null) => {
            paneRefs.current[index] = element;
          }}
          aria-hidden={index !== value}
          sx={{
            gridArea: '1 / 1',
            alignSelf: 'start',
            opacity: index === value ? 1 : 0,
            transform: getPaneOffset(index - value, fullBleed),
            transition:
              'transform var(--motion-base) var(--ease-standard), opacity var(--motion-fast) var(--ease-standard)',
            '@media (prefers-reduced-motion: reduce)': {
              transform: 'none',
              transition: 'none',
              visibility: index === value ? 'visible' : 'hidden',
            },
          }}
        >
          {pane.content}
        </Box>
      ))}
    </Box>
  );
};

export default PaneSwitcher;
