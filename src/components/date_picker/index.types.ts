/**
 * Type representing the view options for the custom date picker.
 */
export type CustomDatePickerView = 'button' | 'input';

/**
 * Props for the CustomDatePicker component.
 */
export interface CustomDatePickerProps {
  /**
   * The selected date value.
   */
  value?: Date;

  /**
   * The view type of the date picker.
   */
  view?: CustomDatePickerView;

  /**
   * The label for the date picker.
   */
  label?: string;

  /**
   * Whether to limit the year range.
   */
  limitYear?: boolean;

  /**
   * Whether to disable selection of past dates.
   */
  disablePast?: boolean;

  /**
   * The format for long date display.
   */
  longDateFormat?: string;

  /**
   * The format for short date display.
   */
  shortDateFormat?: string;

  /**
   * Function called when the selected date changes.
   * @param value - The new selected date value.
   */
  onChange?: (value: Date) => void | Promise<void>;

  /**
   * The minimum selectable date.
   */
  minDate?: Date | null;

  /**
   * The maximum selectable date.
   */
  maxDate?: Date | null;

  readOnly?: boolean;

  hideNav?: boolean;
}
