export type CPEDatePickerView = 'button' | 'input';
export interface CPEDatePickerProps {
  initDate?: Date;
  view: CPEDatePickerView;
  label?: string;
  limitYear?: boolean;
  disablePast?: boolean;
}
