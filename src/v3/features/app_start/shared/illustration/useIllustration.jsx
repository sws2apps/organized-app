import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const useIllustration = () => {
  const sliderRef = useRef();

  const theme = useTheme();

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const [index, setIndex] = useState(1);

  const dotSize = laptopUp ? { active: 16, inactive: 12 } : { active: 12, inactive: 8 };

  const startSlideShow = useCallback(() => {
    sliderRef.current = setInterval(() => {
      setIndex((prev) => {
        const tmp = prev === 4 ? 1 : prev + 1;
        return tmp;
      });
    }, 10000);
  }, []);

  const stopSlideShow = () => {
    clearInterval(sliderRef.current);
  };

  const handleSetImage = (value) => {
    stopSlideShow();
    setIndex(value);
    startSlideShow();
  };

  useEffect(() => {
    startSlideShow();

    return () => stopSlideShow();
  }, [startSlideShow]);

  useEffect(() => {
    for (let i = 1; i <= 4; i++) {
      const div = document.querySelector(`#illustration${i}`);
      if (div.classList.contains('illustration-active')) {
        div.classList.remove('illustration-active');
        div.classList.add('illustration-inactive');
      }
    }

    const div = document.querySelector(`#illustration${index}`);

    setTimeout(() => {
      div.classList.add('illustration-active');

      for (let i = 1; i <= 4; i++) {
        const div = document.querySelector(`#illustration${i}`);
        if (div.classList.contains('illustration-inactive')) {
          div.classList.remove('illustration-inactive');
        }
      }
    }, 1000);
  }, [index]);

  return { index, dotSize, handleSetImage };
};

export default useIllustration;
