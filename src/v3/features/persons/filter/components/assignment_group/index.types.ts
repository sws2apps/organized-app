import { AssignmentCheckListColors } from '@definition/app';

export type AssignmentGroupType = {
  id: string;
  header: string;
  color: AssignmentCheckListColors;
  items: { id: string; name: string; borderTop?: boolean }[];
  onChange?: (boolean, string) => void;
};
