/**
 * Represents the style of the month item.
 */
export type MonthItemStyle = 'pioneer' | 'publisher';

/**
 * Represents the properties for a month item component.
 */
export type MonthItemProps = {
  /**
   * The title of the month item.
   */
  title: string;

  /**
   * An optional comment for the month item.
   */
  comment?: string;

  /**
   * The style of the month item. It can be either 'pioneer' or 'publisher'.
   */
  style?: MonthItemStyle;

  /**
   * The number of hours spent in ministry for the month.
   */
  hours?: number;

  /**
   * The number of Bible studies conducted for the month.
   */
  bibleStudies?: number;

  /**
   * Indicates whether the auxiliary pioneer status is active for the month.
   */
  auxiliaryPioneer?: boolean;

  /**
   * Indicates whether the month item is related to ministry activities.
   */
  ministry?: boolean;

  /**
   * Indicates whether the month item is in progress.
   */
  inProgress?: boolean;

  /**
   * Indicates whether the month item is ahead of schedule or expectations.
   */
  ahead?: boolean;
};
