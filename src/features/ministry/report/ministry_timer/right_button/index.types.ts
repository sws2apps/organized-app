import { TimerState } from '../index.types';

export type RightButtonProps = {
  state: TimerState;
  onClick?: VoidFunction;
  disabled?: boolean;
};
