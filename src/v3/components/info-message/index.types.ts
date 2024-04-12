import { SxProps, Theme } from '@mui/material/styles';
import { ReactElement } from 'react';

export type InfoMessagePropsType = {
  variant: 'error' | 'success' | 'message-with-button';
  actionClick?: VoidFunction;
  actionText?: string;
  messageIcon?: ReactElement;
  actionIcon?: ReactElement;
  messageHeader: string;
  message: string;
  onClose: VoidFunction;

  sx?: SxProps<Theme>;
};
