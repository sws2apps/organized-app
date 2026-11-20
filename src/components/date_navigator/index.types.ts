import { SxProps, Theme } from '@mui/material';
import { CustomClassName } from '@definition/app';

export type DateNavigatorDirection = 'back' | 'next';

export type DateNavigatorBadgeAction = {
  text: string;
  ariaLabel: string;
  onClick: VoidFunction;
};

export type DateNavigatorPeriodBadgeProps = {
  text: string;
  current: boolean;
  action: DateNavigatorBadgeAction;
  interactive: boolean;
};

export type DateNavigatorType = {
  value: string;
  onBack?: VoidFunction;
  onNext?: VoidFunction;
  disableBack?: boolean;
  disableNext?: boolean;
  labelClassName?: CustomClassName;
  labelMinWidth?: string | number;
  badgeText?: string;
  badgeVisible?: boolean;
  badgeAction?: DateNavigatorBadgeAction;
  truncateLabel?: boolean;
  sx?: SxProps<Theme>;
};
