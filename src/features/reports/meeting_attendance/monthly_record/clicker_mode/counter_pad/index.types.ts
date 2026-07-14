/**
 * Props for the {@link CounterPad} — the large minus / plus control.
 */
export type CounterPadProps = {
  /**
   * Called when the plus tile is pressed.
   */
  onIncrement: () => void;

  /**
   * Called when the minus tile is pressed.
   */
  onDecrement: () => void;

  /**
   * Disables the minus tile (e.g. when the value is already zero).
   */
  decrementDisabled?: boolean;
};
