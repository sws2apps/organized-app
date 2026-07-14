/**
 * Props for the {@link ClickerSuggestion} button.
 */
export type ClickerSuggestionProps = {
  /**
   * Whether the suggestion is shown. Toggling it animates the button in
   * (slide up + fade) or out (slide down + fade).
   */
  open: boolean;

  /**
   * Opens the clicker overlay. Fired on click; pointer-down keeps the focused
   * field from blurring first.
   */
  onOpen: () => void;

  /**
   * Button label (e.g. the translated "Clicker mode").
   */
  label: string;
};
