import React from 'react';

export type ReminderItemProps = {
  title: string;
  description: string;
  link: string;
  key?: number;
};

export type RemindersProps = {
  children?: React.ReactElement<ReminderItemProps> | React.ReactElement<ReminderItemProps>[];
};
