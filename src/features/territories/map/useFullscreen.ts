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

    // in the app the overlay is enough: the web view's own full screen paints
    // the system bars white and drops the bar insets the overlay pads by
    if ('__TAURI_INTERNALS__' in window) {
      setFullscreen(true);
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
    let resizeTimer: number | undefined;

    const handle = () => {
      window.clearTimeout(resizeTimer);
      setFullscreen(document.fullscreenElement === wrapper.current);
      resizeTimer = window.setTimeout(() => map.current?.resize(), 150);
    };

    document.addEventListener('fullscreenchange', handle);

    return () => {
      window.clearTimeout(resizeTimer);
      document.removeEventListener('fullscreenchange', handle);
    };
  }, [wrapper, map]);

  // a transform (even a filled animation at none) traps position: fixed inside the page
  useEffect(() => {
    if (!fullscreen) return;

    const properties = ['transform', 'filter', 'perspective'] as const;
    const patched: {
      element: HTMLElement;
      styles: { property: string; value: string; priority: string }[];
    }[] = [];
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
        const element = node;
        patched.push({
          element,
          styles: properties.map((property) => ({
            property,
            value: element.style.getPropertyValue(property),
            priority: element.style.getPropertyPriority(property),
          })),
        });
        for (const property of properties) {
          element.style.setProperty(property, 'none', 'important');
        }
      }

      node = node.parentElement;
    }

    return () => {
      for (const { element, styles } of patched) {
        for (const { property, value, priority } of styles) {
          if (value) element.style.setProperty(property, value, priority);
          else element.style.removeProperty(property);
        }
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
