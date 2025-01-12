import { ReactNode } from 'react';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { PersonType } from '@definition/person';

export type PersonSelectorType = {
  label: string;
  week: string;
  type?: AssignmentCode;
  assignment: AssignmentFieldType;
  readOnly?: boolean;
  showIcon?: boolean;
  visitingSpeaker?: boolean;
  talk?: number;
  helperNode?: ReactNode;
  circuitOverseer?: boolean;
  jwStreamRecording?: boolean;
  schedule_id?: string;
};

export type PersonOptionsType = PersonType & {
  person_name?: string;
  weekOf?: string;
  last_assignment?: string;
  last_assistant?: string;
  last_assistant_weekOf?: string;
  hall?: string;
};
