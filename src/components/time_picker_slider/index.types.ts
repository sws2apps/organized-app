export type TimePickerSliderProps = {
  value: number;
  onChange: (seconds: number) => void;
};

export type TimeUnitProps = {
  defaultValue: number;
  max: number;
  onChange: (value: number) => void;
};
