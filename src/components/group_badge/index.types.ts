type GroupColor =
  | `group-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`
  | 'accent-main';

export type GroupBadgeProps = {
  label: string;
  color?: GroupColor;
  variant?: 'solid' | 'outlined';
  /**
   * 'small' renders a more compact badge (smaller text and padding), useful in
   * dense layouts such as the month calendar cells.
   */
  size?: 'normal' | 'small';
  /**
   * When true the badge fills the available width and truncates a long label
   * to a single line with an ellipsis.
   */
  fullWidth?: boolean;
  /**
   * Horizontal alignment of the label. Defaults to 'left'.
   */
  align?: 'left' | 'center';
};
