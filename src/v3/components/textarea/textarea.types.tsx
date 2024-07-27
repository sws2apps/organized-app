import { ChangeEvent } from 'react';

/**
 * CustomTextareaProps Type
 *
 * Represents the props accepted by the CustomTextarea component.
 */
export type CustomTextareaProps = {
  /**
   * Placeholder text displayed when the textarea is empty.
   */
  placeholder?: string;

  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  /**
   * The value of the `input` element, required for a controlled component.
   */
  value?: unknown;
};
