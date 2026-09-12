import { useCallback, useEffect, useRef } from 'react';

// the scroll distance over which an edge reveals its fade
const REVEAL = 8;

/**
 * Reveals the `scroll-fade-y` fades of an element by how far its content has
 * scrolled past each edge, writing the amounts straight to the CSS variables
 * the fades read: no re-render, no transition to wait on.
 *
 * Attached by callback ref, so content that mounts late is picked up.
 */
const useScrollFade = () => {
  const cleanup = useRef<VoidFunction>(null);

  const ref = useCallback((el: HTMLDivElement | null) => {
    cleanup.current?.();
    cleanup.current = null;

    if (!el) return;

    let frame = 0;

    const update = () => {
      const hiddenAbove = el.scrollTop;
      const hiddenBelow = el.scrollHeight - el.clientHeight - el.scrollTop;

      const reveal = (hidden: number) =>
        Math.min(Math.max(hidden, 0) / REVEAL, 1).toFixed(3);

      el.style.setProperty('--scroll-fade-top', reveal(hiddenAbove));
      el.style.setProperty('--scroll-fade-bottom', reveal(hiddenBelow));
    };

    // scrolling asks for at most one update per frame
    const onScroll = () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    // the scrollbar keeps its own strip of the mask, so it is not faded
    const measureGutter = () => {
      el.style.setProperty(
        '--scroll-fade-gutter',
        `${el.offsetWidth - el.clientWidth}px`
      );
    };

    const observer = new ResizeObserver(() => {
      measureGutter();
      update();
    });

    const observeChildren = () => {
      // re-observing from scratch drops children that have gone
      observer.disconnect();
      observer.observe(el);

      for (const child of el.children) observer.observe(child);
    };

    // images, translations and query results land after the first render
    const children = new MutationObserver(() => {
      observeChildren();
      update();
    });

    observeChildren();
    children.observe(el, { childList: true });
    el.addEventListener('scroll', onScroll, { passive: true });
    measureGutter();
    update();

    cleanup.current = () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      observer.disconnect();
      children.disconnect();
    };
  }, []);

  useEffect(() => () => cleanup.current?.(), []);

  return ref;
};

export default useScrollFade;
