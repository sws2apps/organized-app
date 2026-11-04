import type { ReactNode } from 'react';
export type MonthRowProps = {
  label: string;
  expanded: boolean;
  onToggle: VoidFunction;
  assigned: number;
  total: number;
  children: ReactNode;
};
