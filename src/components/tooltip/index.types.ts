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

  /**
   * The variant of the tooltip, which changes its appearance or behavior.
   * - 'any' - Default variant, a general tooltip style.
   * - 'icon' - A variant designed for tooltips that are associated with icons.
   */
  variant?: 'any' | 'icon';

  /**
   * Customization for icon tooltips.
   * This prop is used when the `variant` is set to 'icon'. It allows customization of the icon's color on different states.
   */
  icon?: {
    /**
     * The default color of the icon when it is not being hovered over.
     */
    defaultColor?: string;

    /**
     * The color of the icon when it is hovered over.
     */
    hoverColor?: string;
  };
};
