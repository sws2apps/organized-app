type GroupColor =
  | `group-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`
  | 'accent-main';

export type GroupBadgeProps = {
  label: string;
  color?: GroupColor;
  variant?: 'solid' | 'outlined';
};
