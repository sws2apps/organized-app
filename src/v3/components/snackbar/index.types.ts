import { ReactElement } from 'react';

export type SnackbarPropsType = {
  open: boolean;
  messageHeader: string;
  message: string;
  variant: 'error' | 'success' | 'message-with-button';
  messageIcon?: ReactElement;
  actionIcon?: ReactElement;
  actionClick?: VoidFunction;
  actionText?: string;
  position?: 'bottom-center' | 'top-center';
  onClose?: VoidFunction;
};
