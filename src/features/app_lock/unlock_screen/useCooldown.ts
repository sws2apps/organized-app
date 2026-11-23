import { useEffect, useState } from 'react';

const secondsUntil = (until?: number) =>
  until ? Math.max(0, Math.ceil((until - Date.now()) / 1000)) : 0;

const useCooldown = (until?: number) => {
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(until));
  const [trackedUntil, setTrackedUntil] = useState(until);

  if (until !== trackedUntil) {
    setTrackedUntil(until);
    setSecondsLeft(secondsUntil(until));
  }

  useEffect(() => {
    if (secondsUntil(until) === 0) return;

    const timer = setInterval(() => {
      const left = secondsUntil(until);

      setSecondsLeft(left);
      if (left === 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [until]);

  return secondsLeft;
};

export default useCooldown;
