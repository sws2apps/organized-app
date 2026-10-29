import { PropsWithChildren } from 'react';

export type QuickSettingsProps = PropsWithChildren & {
  open: boolean;
  onClose: VoidFunction;
  title: string;
  description?: string;
  showCancel?: boolean;
};
