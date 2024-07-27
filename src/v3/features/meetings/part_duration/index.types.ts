import { SourceAssignmentType } from '@definition/sources';

export type PartDurationType = {
  length: number;
  defaultValue?: number;
  type: SourceAssignmentType;
  week: string;
};
