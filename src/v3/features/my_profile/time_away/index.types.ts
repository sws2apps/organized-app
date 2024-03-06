import { TimeAwayType } from '@definition/app';

export type TimeAwayItemProps = {
  timeAway: TimeAwayType;
  lastItem?: boolean;
  onAdd: VoidFunction;
  onDelete: VoidFunction;
  tabletDown: boolean;
};
