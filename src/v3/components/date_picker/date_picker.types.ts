export type CustomDatePickerView = 'button' | 'input';
export interface CustomDatePickerProps {
  value?: Date;
  view?: CustomDatePickerView;
  label?: string;
  limitYear?: boolean;
  disablePast?: boolean;
  longDateFormat?: string;
  shortDateFormat?: string;
  onChange?: (value: Date) => void | Promise<void>;
  minDate?: Date | null;
  maxDate?: Date | null;
}
