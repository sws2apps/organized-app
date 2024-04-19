/**
 * Props for the CustomTimePicker component.
 */
export interface CustomTimePickerProps {
  /**
   * Whether to use the 12-hour clock (true) or the 24-hour clock (false).
   */
  ampm: boolean;
  /**
   * The value of the time picker. It should be a Date object.
   */
  value?: Date | null;
  /**
   * The label displayed above the time picker input.
   */
  label?: string;
  /**
   * Function to be called when the value of the time picker changes.
   */
  onChange?: () => void;
  /**
   * Indicates if the value should be displayed when the time picker opens.
   */
  isValueOnOpen?: boolean;
}
