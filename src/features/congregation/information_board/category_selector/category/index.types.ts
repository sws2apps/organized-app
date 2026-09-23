import { ReactElement } from 'react';

export type CategoryProps = {
  onClick: VoidFunction;
  isActive: boolean;
  isCollapsed: boolean;
  icon: ReactElement;
  title: string;
  entries: string[];
};
