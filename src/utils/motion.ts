import { useLayoutEffect, useRef } from 'react';
import { keyframes } from '@mui/material';

// Material 3 motion tokens, so every view change in the app moves alike
export const EASE_STANDARD = 'cubic-bezier(0.2, 0, 0, 1)';
export const EASE_DECELERATE = 'cubic-bezier(0.05, 0.7, 0.1, 1)';
// iOS's sheet and page curve: quick start, long soft landing
export const EASE_GLIDE = 'cubic-bezier(0.32, 0.72, 0, 1)';
export const DURATION_SHORT = 200;
export const DURATION_MEDIUM = 300;

const rise = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

// for a view kept mounted and switched with `hidden`: each time it is shown
// again it rises into place, as the animation restarts with the display
export const revealSx = {
  '&:not([hidden])': {
    animation: `${rise} ${DURATION_MEDIUM}ms ${EASE_DECELERATE}`,
  },
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
};

// slides an element's new content in from the side it was chosen on, like
// iOS segmented views: forward from the right, back from the left. `step`
// is the position of what is shown (tab index, view index); it runs as the
// new content commits, so its first frame already starts offset
export const useSlideIn = (step: number) => {
  const ref = useRef<HTMLElement>(null);
  const last = useRef(step);

  useLayoutEffect(() => {
    const from = last.current;
    last.current = step;
    const element = ref.current;
    if (from === step || !element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // a short glide that settles softly; the content never fades out
    // fully, so the swap doesn't blink
    const side = step > from ? 1 : -1;
    element.animate(
      [
        { opacity: 0.6, transform: `translateX(${side * 16}px)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 380, easing: EASE_GLIDE }
    );
  }, [step]);

  return ref;
};
