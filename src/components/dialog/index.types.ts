import { PropsWithChildren, ReactNode } from 'react';
import { PaperProps as MUIPaperProps, SxProps, Theme } from '@mui/material';

export type DialogProps = PropsWithChildren & {
  open: boolean;
  disableEnforceFocus?: boolean;
  onClose: VoidFunction;
  sx?: SxProps<Theme>;
  PaperProps?: Partial<MUIPaperProps>;

  title?: string;

  description?: ReactNode;

  closable?: boolean;

  // takes the place of `title` and `description`
  header?: ReactNode;

  // pinned below the content, for buttons that sit inside a component
  actions?: ReactNode;
};
