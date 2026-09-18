import {
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// a tap can be shorter than a frame
const MIN_PRESS = 70;

const PRESS_SCALE = 0.92;

// transitions, not keyframes, so a press mid-release continues without a jump
const PRESS_TRANSITION = 'transform 90ms cubic-bezier(0.2, 0, 0, 1)';
const RELEASE_TRANSITION = 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)';

const BACKGROUND_TRANSITION =
  'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)';

const isActivationKey = (key: string) => key === ' ' || key === 'Enter';

const usePressFeedback = () => {
  const [pressed, setPressed] = useState(false);

  const pressedAt = useRef(0);
  const releaseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const press = useCallback(() => {
    clearTimeout(releaseTimer.current);
    pressedAt.current = performance.now();
    setPressed(true);
  }, []);

  const release = useCallback(() => {
    clearTimeout(releaseTimer.current);

    const held = performance.now() - pressedAt.current;

    releaseTimer.current = setTimeout(
      () => setPressed(false),
      Math.max(0, MIN_PRESS - held)
    );
  }, []);

  useEffect(() => () => clearTimeout(releaseTimer.current), []);

  const pressHandlers = {
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button === 0) press();
    },
    onPointerUp: release,
    onPointerCancel: release,
    onPointerLeave: release,
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (isActivationKey(event.key) && !event.repeat) press();
    },
    onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (isActivationKey(event.key)) release();
    },
  };

  const pressSx = {
    transform: pressed ? `scale(${PRESS_SCALE})` : 'scale(1)',
    transition: `${pressed ? PRESS_TRANSITION : RELEASE_TRANSITION}, ${BACKGROUND_TRANSITION}`,
    '@media (prefers-reduced-motion: reduce)': {
      transform: 'none',
    },
  };

  return { pressed, pressHandlers, pressSx };
};

export default usePressFeedback;
