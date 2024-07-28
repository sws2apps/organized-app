/**
 * Props for the TimeAlreadyInServiceModalWindow component.
 */
export type TimeAlreadyInServiceModalWindowProps = {
  /**
   * Callback function invoked when the cancel button is clicked.
   */
  cancelButtonClick?: VoidFunction;

  /**
   * Callback function invoked when the add button is clicked, with the conflicting time as a parameter.
   * @param time The conflicting time that the user attempted to add.
   */
  addButtonClick?: (time: number) => void;
};
