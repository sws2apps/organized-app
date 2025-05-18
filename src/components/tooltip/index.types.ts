import { ReactElement, ReactNode } from 'react';

/**
 * Props for the CustomTooltip component.
 */
export type CustomTooltipProps = {
  children?: ReactElement;
  title: ReactNode;
  followCursor?: boolean;
  enterDelay?: number;
  /**
   * Speed of the tooltip's appearance delay.
   * - 'slow' - Slower delay for tooltip appearance.
   * - 'fast' - Faster delay for tooltip appearance.
   */
  delaySpeed?: 'slow' | 'fast';

  /**
   * Show tooltip if hover on child element
   */
  show?: boolean;
};
