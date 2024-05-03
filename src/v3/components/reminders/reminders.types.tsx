import React from 'react';

/**
 * Props for the ReminderItem component.
 */
export type ReminderItemProps = {
  /**
   * The title of the reminder item.
   */
  title: string;

  /**
   * The description of the reminder item.
   */
  description: string;

  /**
   * The link associated with the reminder item.
   */
  link: string;

  /**
   * Optional key for identifying the reminder item.
   */
  key?: number;
};

/**
 * Props for the Reminders component.
 */
export type RemindersProps = {
  /**
   * Children elements representing reminder items.
   */
  children?: React.ReactElement<ReminderItemProps> | React.ReactElement<ReminderItemProps>[];
};
