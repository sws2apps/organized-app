import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const useIllustration = () => {
  const sliderRef = useRef();

  const theme = useTheme();

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const [index, setIndex] = useState(1);
  const [prevIndex, setPrevIndex] = useState(1);

  const dotSize = laptopUp ? { active: 16, inactive: 12 } : { active: 12, inactive: 8 };

  useEffect(() => {
    sliderRef.current = setInterval(() => {
      setIndex((prev) => {
        setPrevIndex(prev);

        let tmp = prev + 1;
        if (tmp > 4) tmp = 1;

        return tmp;
      });
    }, 20000);

    return () => {
      if (sliderRef.current) {
        clearInterval(sliderRef.current);
      }
    };
  }, []);

  useEffect(() => {
    for (let i = 1; i < 4; i++) {
      if (i !== prevIndex || i !== index) {
        const div = document.querySelector(`#illustration${i}`);
        div.classList.remove('illustration-inactive');
        div.classList.remove('illustration-active');
      }
    }

    const prevDiv = document.querySelector(`#illustration${prevIndex}`);
    const div = document.querySelector(`#illustration${index}`);

    prevDiv.classList.add('illustration-inactive');
    prevDiv.classList.remove('illustration-active');

    setTimeout(() => {
      prevDiv.classList.remove('illustration-inactive');
    }, 1000);

    setTimeout(() => {
      div.classList.add('illustration-active');
    }, 1000);
  }, [index, prevIndex]);

  return { index, dotSize };
};

export default useIllustration;
