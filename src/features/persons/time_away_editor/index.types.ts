import { TimeAwayType } from '@definition/person';

export type TimeAwayEditorProps = {
  items: TimeAwayType[];
  desc?: string;
  onAdd: VoidFunction;
  onStartDateChange: (id: string, value: Date) => void;
  onEndDateChange: (id: string, value: Date) => void;
  onCommentsChange: (id: string, value: string) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
};
