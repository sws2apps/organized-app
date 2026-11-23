import { ScheduleMeetingType } from '@definition/app';

export type WeekRangeSelectorType = {
  disabled?: boolean;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  meeting: ScheduleMeetingType;
  startWeek?: string;
  endWeek?: string;
};

export type WeekOptionsType = {
  value: string;
  label: string;
};
