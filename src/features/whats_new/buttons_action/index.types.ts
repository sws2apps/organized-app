import { ImageSlide } from '../index.types';

export type ButtonsActionProps = {
  slides: ImageSlide[];
  current: number;
  onClose: VoidFunction;
  onNext: VoidFunction;
  onBack: VoidFunction;
};
