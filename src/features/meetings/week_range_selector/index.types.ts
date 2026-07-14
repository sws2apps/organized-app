import { MeetingType } from '@definition/app';

export type WeekRangeSelectorType = {
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  meeting: MeetingType;
};

export type WeekOptionsType = {
  value: string;
  label: string;
};
