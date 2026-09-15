import { RefObject } from 'react';
import { SwiperRef } from 'swiper/react';
import { ImageSlide } from '../index.types';

export type ImageViewerProps = {
  slides: ImageSlide[];
  current: number;
  swiperRef: RefObject<SwiperRef>;
  onImageChange: (n: number) => void;
};
