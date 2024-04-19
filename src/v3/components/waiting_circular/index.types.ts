/**
 * Props for specifying variant, height, and width.
 */
export type VariantProps = {
  /**
   * The variant of the component.
   * - 'fixed': Fixed variant.
   * - 'standard': Standard variant.
   */
  variant?: 'fixed' | 'standard';

  /**
   * The height of the component.
   */
  height?: number;

  /**
   * The width of the component.
   */
  width?: number;
};
