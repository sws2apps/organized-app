/**
 * Represents the props that can be passed to a custom pop-up component.
 */
export type PopUpForEditOrCreateBibleStudyProps = {
  /**
   * Specifies the variant of the pop-up. It can be either 'add' or 'edit'.
   * - 'add': Indicates that the pop-up is for adding a new item.
   * - 'edit': Indicates that the pop-up is for editing an existing item.
   */
  variant?: 'add' | 'edit';

  /**
   * Indicates whether the pop-up is open or closed.
   */
  open: boolean;

  /**
   * Represents the initial value to be displayed in the pop-up.
   */
  value?: string;

  /**
   * Callback function invoked when the save button is clicked.
   * @param value - The value entered or modified in the pop-up.
   */
  saveButtonClick?: (value: string) => void;

  /**
   * Callback function invoked when the cancel button is clicked.
   */
  cancelButtonClick?: VoidFunction;

  /**
   * Specifies the width of the pop-up.
   */
  width?: string;

  /**
   * Callback function invoked when the close button is clicked.
   */
  closeButtonClick?: VoidFunction;
};
