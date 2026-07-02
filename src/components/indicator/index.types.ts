import { ReactNode } from 'react';

export type IndicatorProps = {
  /**
   * The text or content to display inside the indicator badge.
   */
  children: ReactNode;

  /**
   * Optional tooltip text to show on hover.
   */
  tooltip?: string;

  /**
   * Optional flag to show/hide the tooltip.
   */
  showTooltip?: boolean;
};
