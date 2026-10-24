import { ReactNode } from 'react';
export type WeekSelectorPanelProps = {
  title: string;
  expanded: boolean;
  sortDown: boolean;
  onToggleExpand: VoidFunction;
  onToggleSort: VoidFunction;
  children: ReactNode;
};
