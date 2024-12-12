import { useCallback, useState } from 'react';

type GestureControlOptions = {
  onIncrement: () => void;
  onDecrement: () => void;
  sensitivity?: number;
};

export function useGestureControl({
  onIncrement,
  onDecrement,
  sensitivity = 10,
}: GestureControlOptions) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        onIncrement();
      } else {
        onDecrement();
      }
    },
    [onIncrement, onDecrement]
  );

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    setTouchStart(event.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();

      if (touchStart === null) return;

      const touchEnd = event.touches[0].clientY;
      const delta = touchStart - touchEnd;

      if (Math.abs(delta) >= sensitivity) {
        if (delta > 0) {
          onIncrement();
        } else {
          onDecrement();
        }
        setTouchStart(touchEnd);
      }
    },
    [touchStart, onIncrement, onDecrement, sensitivity]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  return {
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
