export type CustomDatePickerView = 'button' | 'input';
export interface CustomDatePickerProps {
  value?: Date;
  view?: CustomDatePickerView;
  label?: string;
  limitYear?: boolean;
  disablePast?: boolean;
  longDateFormat?: string;
  shortDateFormat?: string;
  isValueOnOpen?: boolean;
  onChange?: (value: Date) => VoidFunction | Promise<void>;
}
