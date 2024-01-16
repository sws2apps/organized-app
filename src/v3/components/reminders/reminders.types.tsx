import React from 'react';

export type ReminderItemProps = {
  title: string;
  description: string;
  link: string;
};

export type RemindersProps = {
  children?: React.ReactElement<ReminderItemProps> | React.ReactElement<ReminderItemProps>[];
};
