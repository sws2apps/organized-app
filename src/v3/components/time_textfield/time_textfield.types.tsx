export type CustomTimeTextfieldProps = {
  delimiter?: string;

  timeFormat?: '12' | '24';
  format?: 'hh:mm' | 'mm:ss' | 'hh:mm:ss';

  hours?: number;
  minutes?: number;
  seconds?: number;

  onChange?: (hours: number, minutes: number, seconds: number) => void;
};
