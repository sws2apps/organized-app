import { ChangeEventHandler } from 'react';

export type CustomTimeTextFieldProps = {
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value?: string;

  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * The color of the `input` element.
   * This optional prop can be used to set a specific color for the input field.
   */
  color?: string;
};
