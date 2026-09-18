export type RollingDigitProps = {
  /** The character shown in this position, usually a single digit. */
  char: string;

  /**
   * Roll the change in. When false (paused, stopped, time added by hand) the
   * new character simply replaces the old one.
   */
  animate: boolean;
};
