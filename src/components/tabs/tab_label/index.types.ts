import { ReactNode } from 'react';

/**
 * Props for the TabLabel component.
 */
export type TabLabelProps = {
  /**
   * The label of the tab.
   */
  label: ReactNode;

  /**
   * The number displayed in a badge next to the label.
   */
  badge?: number;

  /**
   * A boolean indicating whether the tab is the selected one.
   */
  selected: boolean;
};
