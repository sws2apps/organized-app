import { TooltipProps } from '@mui/material';

/**
 * Props for the CustomTooltip component.
 */
export type CustomTooltipProps = TooltipProps & {
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
