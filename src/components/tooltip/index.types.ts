import { ReactNode } from 'react';

/**
 * Props for the CustomTooltip component.
 */
export type CustomTooltipProps = {
  /**
   * The text label to display in the tooltip.
   */
  label: string;

  /**
   * The content to be wrapped by the tooltip, typically a React element.
   */
  children: ReactNode;

  /**
   * Speed of the tooltip's appearance delay.
   * - 'slow' - Slower delay for tooltip appearance.
   * - 'fast' - Faster delay for tooltip appearance.
   */
  delaySpeed: 'slow' | 'fast';

  /**
   * If true, the tooltip follows the cursor's position.
   * Optional, defaults to `false` if not provided.
   */
  folowCursor?: boolean;

  /**
   * Position of the tooltip relative to the wrapped element.
   * - 'bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start',
   *   'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top'
   * Optional, defaults to a standard position if not provided.
   */
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
};
