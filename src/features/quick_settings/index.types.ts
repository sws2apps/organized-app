import { PropsWithChildren } from 'react';

export type QuickSettingsProps = PropsWithChildren & {
  open: boolean;
  onClose: VoidFunction;
  title: string;
};
