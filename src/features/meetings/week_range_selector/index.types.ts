import { ScheduleMeetingType } from '@definition/app';

export type WeekRangeSelectorType = {
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  meeting: ScheduleMeetingType;
};

export type WeekOptionsType = {
  value: string;
  label: string;
};
