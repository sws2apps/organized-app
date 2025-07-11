import { SourceAssignmentType } from '@definition/sources';

export type MeetingPartType = {
  week: string;
  type: SourceAssignmentType;
  color: string;
  isOverwrite?: boolean;
  isEdit?: boolean;
  dataView: string;
};
