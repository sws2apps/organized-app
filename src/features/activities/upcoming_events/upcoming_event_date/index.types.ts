import { Ref } from 'react';

export type UpcomingEventDateProps = {
  title: string;
  description?: string;
  disabled: boolean;
  date?: string;
  day?: string;
  range?: string;
  dayIndicatorSharedWidth?: number;
  dayIndicatorRef?: Ref<unknown>;
};
