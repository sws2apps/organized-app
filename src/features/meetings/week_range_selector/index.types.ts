export type WeekRangeSelectorType = {
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  meeting: 'midweek' | 'weekend';
  startWeek?: string;
  endWeek?: string;
  startWeekError?: boolean;
  endWeekError?: boolean;
  startWeekHelperText?: string;
  endWeekHelperText?: string;
};

export type WeekOptionsType = {
  value: string;
  label: string;
};
