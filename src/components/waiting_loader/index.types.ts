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
   * The size of the component.
   */
  size?: number;

  type?: 'circular' | 'lottie';

  color?: string;
};
