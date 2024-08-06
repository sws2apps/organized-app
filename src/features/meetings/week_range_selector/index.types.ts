export type WeekRangeSelectorType = {
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  meeting: 'midweek' | 'weekend';
};

export type WeekOptionsType = {
  value: string;
  label: string;
};
