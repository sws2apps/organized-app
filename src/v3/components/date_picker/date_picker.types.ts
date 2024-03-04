export type CPEDatePickerView = 'button' | 'input';
export interface CPEDatePickerProps {
  value?: Date;
  view?: CPEDatePickerView;
  label?: string;
  limitYear?: boolean;
  disablePast?: boolean;
  longDateFormat?: string;
  shortDateFormat?: string;
  onChange?: (value: Date) => VoidFunction | Promise<void>;
}
