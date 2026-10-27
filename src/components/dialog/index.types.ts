import { PropsWithChildren, ReactNode } from 'react';
import { DialogProps as MUIDialogProps, SxProps, Theme } from '@mui/material';
import { TransitionProps as MUITransitionProps } from '@mui/material/transitions';

export type DialogProps = PropsWithChildren & {
  open: boolean;
  onClose: VoidFunction;
  sx?: SxProps<Theme>;
  PaperProps?: MUIDialogProps['PaperProps'];
  TransitionProps?: MUITransitionProps;

  title?: string;

  description?: ReactNode;

  closable?: boolean;

  // takes the place of `title` and `description`
  header?: ReactNode;

  // pinned below the content, for buttons that sit inside a component
  actions?: ReactNode;
};
