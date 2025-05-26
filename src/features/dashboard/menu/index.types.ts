import { ReactElement } from 'react';

export type DashboardMenuProps = {
  icon: ReactElement;
  primaryText: string;
  secondaryText?: string;
  badgeText?: string;
  hoverColor?: string;
  accentHoverColor?: string;
  activeColor?: string;
  onClick?: VoidFunction;
  path?: string;
  actionComponent?: ReactElement;
  height?: string;
  small?: boolean;
};
