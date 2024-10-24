import { SliderCard } from '../index.types';

export type ButtonsActionProps = {
  slides: SliderCard[];
  current: number;
  onClose: VoidFunction;
};
