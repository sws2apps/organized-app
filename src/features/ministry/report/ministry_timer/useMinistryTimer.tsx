import { useEffect, useRef, useState } from 'react';
import { TimerState } from './index.types';

const useMinistryTimer = () => {
  const timerRef = useRef<NodeJS.Timeout>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState('00:00');
  const [timerState, setTimerState] = useState<TimerState>('not_started');

  const handleStart = () => {
    setTimerState('started');
  };

  const handlePause = () => {
    setTimerState('paused');
  };

  useEffect(() => {
    if (timerState === 'started') {
      console.log(timerState);

      timerRef.current = setInterval(() => {
        const newTime = time + 1;
        setTime(newTime);

        // Convert milliseconds to hours, minutes, and seconds
        const hours = Math.floor(newTime / (1000 * 60 * 60));
        const minutes = Math.floor((newTime % (1000 * 60 * 60)) / 60);
        const seconds = Math.floor(time % 60);

        let value: string;

        if (hours === 0) {
          value = `${minutes}:${String(seconds).padStart(2, '0')}`;
        }

        if (hours > 0) {
          value = `${hours}:${String(minutes).padStart(2, '0')}`;
        }

        setDuration(value);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerState, time]);

  return { duration, handleStart, handlePause, timerState };
};

export default useMinistryTimer;
