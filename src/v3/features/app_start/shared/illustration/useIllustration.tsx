import { useRef, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { SwiperRef } from 'swiper/react';

const useIllustration = () => {
  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>();

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const [index, setIndex] = useState(0);

  const dotSize = laptopUp ? { active: 16, inactive: 12 } : { active: 12, inactive: 8 };

  const handleSlide = (n) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(n);
    }
  };

  return { index, dotSize, setIndex, handleSlide, swiperRef };
};

export default useIllustration;
