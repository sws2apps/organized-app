/**
 * Props for the {@link AnimatedCount} display.
 */
export type AnimatedCountProps = {
  /**
   * Target value to display. Changes are animated (rolled) from the previous
   * value to this one.
   */
  value: number;

  /**
   * Caption rendered above the number (e.g. the translated "Count" label).
   */
  label: string;

  /**
   * Bump this to trigger a denial shake (e.g. when the ceiling rejects another
   * increment).
   */
  shake?: number;
};
