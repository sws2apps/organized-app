import { PropsWithChildren, ReactNode } from 'react';
import { DialogProps as MUIDialogProps, SxProps, Theme } from '@mui/material';

export type DialogProps = PropsWithChildren & {
  open: boolean;
  onClose: VoidFunction;
  sx?: SxProps<Theme>;
  PaperProps?: MUIDialogProps['PaperProps'];

  /**
   * Title row, pinned above the scrollable content.
   */
  header?: ReactNode;

  /**
   * Actions row, pinned below the scrollable content so the buttons stay
   * reachable however long the content is.
   */
  actions?: ReactNode;
};
