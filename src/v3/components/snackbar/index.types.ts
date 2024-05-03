import { ReactElement } from 'react';

/**
 * Props for the Snackbar component.
 */
export type SnackbarPropsType = {
  /**
   * Controls whether the Snackbar is open or closed.
   */
  open: boolean;

  /**
   * The header message of the Snackbar.
   */
  messageHeader: string;

  /**
   * The main message content of the Snackbar.
   */
  message: string;

  /**
   * The variant of the Snackbar.
   */
  variant: 'error' | 'success' | 'message-with-button';

  /**
   * The icon to display alongside the message.
   */
  messageIcon?: ReactElement;

  /**
   * The icon to display for the action button.
   */
  actionIcon?: ReactElement;

  /**
   * The function to be called when the action button is clicked.
   */
  actionClick?: VoidFunction;

  /**
   * The text to display on the action button.
   */
  actionText?: string;

  /**
   * The position of the Snackbar.
   */
  position?: 'bottom-center' | 'top-center';

  /**
   * Callback function invoked when the Snackbar is closed.
   */
  onClose?: VoidFunction;
};
