import { Dispatch, MutableRefObject, SetStateAction } from 'react';

/**
 * Props for the CustomTimeTextField component.
 */
export type CustomTimeTextFieldProps = {
  /**
   * Delimiter to use between time segments (e.g., ':', '-').
   * @default ':'
   */
  delimiter?: string;

  /**
   * Time format type: either '12' for 12-hour format or '24' for 24-hour format.
   */
  timeFormat?: '12' | '24';

  /**
   * Specific time format to use: 'hh:mm', 'mm:ss', or 'hh:mm:ss'.
   */
  format?: 'hh:mm' | 'mm:ss' | 'hh:mm:ss';

  /**
   * Initial hours value.
   */
  hours?: number;

  /**
   * Initial minutes value.
   */
  minutes?: number;

  /**
   * Initial seconds value.
   */
  seconds?: number;

  /**
   * Callback function to be called when the time changes.
   * @param hours - The updated hours value.
   * @param minutes - The updated minutes value.
   * @param seconds - The updated seconds value.
   */
  onChange?: (hours: number, minutes: number, seconds: number) => void;
};

/**
 * Maximum values for hours, minutes, and seconds.
 */
export const TimeMaxs = {
  /**
   * Maximum values for hours based on the time format.
   * For 12-hour format, the maximum is 12.
   * For 24-hour format, the maximum is 24.
   */
  hours: [12, 24],

  /**
   * Maximum value for minutes.
   * @default 60
   */
  minutes: 60,

  /**
   * Maximum value for seconds.
   * @default 60
   */
  seconds: 60,
};

/**
 * Props for the CustomSmallTimeTextField component.
 */
export type CustomSmallTimeTextFieldProps = {
  /**
   * Reference to the input element.
   */
  reference?: MutableRefObject<any>;

  /**
   * Current value of the time segment (hours, minutes, or seconds).
   */
  value?: number;

  /**
   * Maximum allowable value for the time segment.
   */
  maxValue?: number;

  /**
   * Reference to the next input element for keyboard navigation.
   */
  nextElementRef?: MutableRefObject<any>;

  /**
   * Function to set the time value.
   * @param value - The new time value.
   */
  setTimeFunc: Dispatch<SetStateAction<number>>;
};
