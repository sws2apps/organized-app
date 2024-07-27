export type CustomDragListProps = {
  values: string[];
  variant: 'reorder' | 'publishers';
  onChange: (values) => void;
};

export type CustomDragListItemProps = {
  value: string;
  index: number;
  onDeleteButtonClick: VoidFunction;
};
