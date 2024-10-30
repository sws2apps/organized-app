import { MutableRefObject } from 'react';
import { SwiperRef } from 'swiper/react';
import { ImageSlide } from '../index.types';

export type ImageViewerProps = {
  slides: ImageSlide[];
  current: number;
  swiperRef: MutableRefObject<SwiperRef>;
  onImageChange: (n: number) => void;
};
