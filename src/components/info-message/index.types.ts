import { SxProps, Theme } from '@mui/material/styles';
import { ReactElement } from 'react';

/**
 * Defines the props for the InfoMessage component.
 */
export type InfoMessagePropsType = {
  /**
   * The variant of the info message.
   */
  variant: 'error' | 'success' | 'message-with-button';

  /**
   * The function to be executed when the action button is clicked.
   */
  actionClick?: VoidFunction;

  /**
   * The text for the action button.
   */
  actionText?: string;

  /**
   * The icon element for the message.
   */
  messageIcon?: ReactElement;

  /**
   * The icon element for the action button.
   */
  actionIcon?: ReactElement;

  /**
   * The header text of the message.
   */
  messageHeader: string;

  /**
   * The content of the message.
   */
  message: string;

  /**
   * The function to be executed when the message is closed.
   */
  onClose: VoidFunction;

  /**
   * Additional styles for the InfoMessage component.
   */
  sx?: SxProps<Theme>;
};
