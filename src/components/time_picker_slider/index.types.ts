export type TimePickerSliderProps = {
  value: number;
  onChange: (seconds: number) => void;
};

export type TimeUnitProps = {
  value: string;
  prevValue: string;
  nextValue: string;
  onIncrement: () => void;
  onDecrement: () => void;
};
