import { RefObject, useCallback, useEffect, useState } from 'react';
import * as maplibregl from 'maplibre-gl';

const useFullscreen = (
  wrapper: RefObject<HTMLDivElement | null>,
  map: RefObject<maplibregl.Map | null>
) => {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      setFullscreen(false);
      return;
    }

    if (fullscreen) {
      setFullscreen(false);
      return;
    }

    try {
      wrapper.current?.requestFullscreen().catch(() => undefined);
    } catch {
      // an embedded web view may refuse the API; the overlay still covers the page
    }

    setFullscreen(true);
  }, [fullscreen, wrapper]);

  useEffect(() => {
    const handle = () => {
      setFullscreen(document.fullscreenElement === wrapper.current);
      window.setTimeout(() => map.current?.resize(), 150);
    };

    document.addEventListener('fullscreenchange', handle);

    return () => document.removeEventListener('fullscreenchange', handle);
  }, [wrapper, map]);

  // a transform (even a filled animation at none) traps position: fixed inside the page
  useEffect(() => {
    if (!fullscreen) return;

    const patched: HTMLElement[] = [];
    const cancelled: Animation[] = [];

    let node = wrapper.current?.parentElement;

    while (node && node !== document.body) {
      const { transform, filter, perspective } = getComputedStyle(node);

      for (const animation of node.getAnimations()) {
        if (animation.playState !== 'finished') continue;

        animation.cancel();
        cancelled.push(animation);
      }

      if (transform !== 'none' || filter !== 'none' || perspective !== 'none') {
        patched.push(node);
        node.style.setProperty('transform', 'none', 'important');
        node.style.setProperty('filter', 'none', 'important');
        node.style.setProperty('perspective', 'none', 'important');
      }

      node = node.parentElement;
    }

    return () => {
      for (const element of patched) {
        element.style.removeProperty('transform');
        element.style.removeProperty('filter');
        element.style.removeProperty('perspective');
      }

      for (const animation of cancelled) animation.finish();
    };
  }, [fullscreen, wrapper]);

  // the overlay fallback has no browser shortcut of its own to leave it
  useEffect(() => {
    if (!fullscreen) return;

    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.fullscreenElement) {
        setFullscreen(false);
      }
    };

    document.addEventListener('keydown', handle);

    return () => document.removeEventListener('keydown', handle);
  }, [fullscreen]);

  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;

    const observer = new ResizeObserver(() => map.current?.resize());

    observer.observe(element);

    return () => observer.disconnect();
  }, [fullscreen, wrapper, map]);

  return { fullscreen, toggleFullscreen };
};

export default useFullscreen;
