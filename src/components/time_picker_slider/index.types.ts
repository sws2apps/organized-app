/**
 * Props for the TimePickerSlider component.
 */
export interface TimePickerSliderProps {
  /**
   * Boolean flag indicating whether the component should include an AM/PM selector.
   */
  ampm: boolean;

  value: number;

  /**
   * Callback function invoked when the selected time changes.
   * @param seconds - The selected time in seconds since midnight.
   */
  onChange: (seconds: number) => void;
}
