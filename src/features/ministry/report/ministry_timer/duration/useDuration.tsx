import { useMemo } from 'react';
import { DurationProps } from './index.types';
import useCurrentUser from '@hooks/useCurrentUser';

const useDuration = ({ time }: DurationProps) => {
  const { isGroup } = useCurrentUser();

  const { first, second, isHour } = useMemo(() => {
    const seconds = time % 60;

    const minutesTotal = (time - seconds) / 60;
    const minutes = minutesTotal % 60;

    const hoursTotal = time - seconds - minutes * 60;
    const hours = hoursTotal / 3600;

    if (hours === 0) {
      return {
        first: String(minutes).padStart(2, '0'),
        second: String(seconds).padStart(2, '0'),
      };
    }

    if (hours > 0) {
      return {
        first: hours,
        second: String(minutes).padStart(2, '0'),
        isHour: true,
      };
    }
  }, [time]);

  const defaultColor = useMemo(() => {
    if (first === '00' && second === '00') {
      if (isGroup) {
        return 'rgba(var(--red-main-base), 0.3)';
      }

      if (!isGroup) {
        return 'var(--accent-300)';
      }
    }

    return 'var(--accent-dark)';
  }, [isGroup, first, second]);

  const hoverColor = useMemo(() => {
    if (first === '00' && second === '00') {
      if (isGroup) {
        return 'rgba(var(--red-main-base), 0.5)';
      }

      if (!isGroup) {
        return 'var(--accent-350)';
      }
    }

    return 'var(--accent-main)';
  }, [isGroup, first, second]);

  const activeColor = useMemo(() => {
    if (first === '00' && second === '00') {
      if (isGroup) {
        return 'rgba(var(--red-main-base), 0.6)';
      }

      if (!isGroup) {
        return 'var(--accent-400)';
      }
    }

    return 'var(--accent-click)';
  }, [isGroup, first, second]);

  return { first, second, isHour, defaultColor, hoverColor, activeColor };
};

export default useDuration;
