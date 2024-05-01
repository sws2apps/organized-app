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
   * Callback function triggered when the textarea value changes.
   *
   * @param {string} value - The new value of the textarea.
   */
  onChange?: (value: string) => void;
};
