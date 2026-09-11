import { PropsWithChildren } from 'react';
import { DialogProps as MUIDialogProps, SxProps, Theme } from '@mui/material';

export type DialogProps = PropsWithChildren & {
  open: boolean;
  fullScreen?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onClose: VoidFunction;
  sx?: SxProps<Theme>;
  PaperProps?: MUIDialogProps['PaperProps'];
};
