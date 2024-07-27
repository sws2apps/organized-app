import { TimeAwayType } from '@definition/person';

export type TimeAwayItemProps = {
  timeAway: TimeAwayType;
  lastItem?: boolean;
  onAdd: VoidFunction;
  onDelete: VoidFunction;
};
