import { ReactNode } from 'react';

export type SubpageNavbarProps = {
  title: string;
  // Falls back to the parent page's navbar title when omitted.
  secondaryTitle?: string;
  onBack: () => void;
  backLabel: string;
  trailing?: ReactNode;
};
