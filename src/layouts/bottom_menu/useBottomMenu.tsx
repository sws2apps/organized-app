import { useEffect, useRef } from 'react';

const RESIZE_DURATION = 240;
const GROW_EASING = 'cubic-bezier(0.2, 1.25, 0.35, 1)';
// no undershoot: the menu is only as wide as its buttons, a dip cuts a label
const SHRINK_EASING = 'cubic-bezier(0.2, 0.9, 0.3, 1)';

// Animates the menu between the widths its changing sets of buttons ask for.
const useBottomMenu = () => {
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu || typeof menu.animate !== 'function') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let previousWidth = menu.getBoundingClientRect().width;
    let animation: Animation | null = null;

    const observer = new ResizeObserver(() => {
      // ignore the sizes the running animation reports
      if (animation) return;

      const width = menu.getBoundingClientRect().width;
      const from = previousWidth;

      previousWidth = width;

      if (reduceMotion.matches || from === 0 || width === 0 || from === width) {
        return;
      }

      animation = menu.animate(
        [{ width: `${from}px` }, { width: `${width}px` }],
        {
          duration: RESIZE_DURATION,
          easing: width > from ? GROW_EASING : SHRINK_EASING,
        }
      );

      animation.finished
        .then(() => {
          previousWidth = menu.getBoundingClientRect().width;
        })
        .catch(() => null)
        .finally(() => {
          animation = null;
        });
    });

    observer.observe(menu);

    return () => {
      animation?.cancel();
      observer.disconnect();
    };
  }, []);

  return { menuRef };
};

export default useBottomMenu;
