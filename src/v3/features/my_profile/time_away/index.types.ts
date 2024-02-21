export type TimeAwayItemProps = {
  timeAway: {
    id: string;
    startDate: string;
    endDate?: string;
    comments?: string;
  };
  lastItem?: boolean;
  onAdd: VoidFunction;
  onDelete: VoidFunction;
  tabletDown: boolean;
};
