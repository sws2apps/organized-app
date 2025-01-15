import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { PersonType } from '@definition/person';
import { SxProps } from '@mui/material';

export type PersonSelectorType = {
  label: string;
  week: string;
  type?: AssignmentCode;
  assignment: AssignmentFieldType;
  readOnly?: boolean;
  showIcon?: boolean;
  showAssignmentsHistory?: boolean;
  visitingSpeaker?: boolean;
  talk?: number;
  helperNode?: ReactNode;
  circuitOverseer?: boolean;
  flex?: boolean;
  jwStreamRecording?: boolean;
  schedule_id?: string;
  endIcon?: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  selectorBoxSx?: SxProps;
};

export type PersonOptionsType = PersonType & {
  person_name?: string;
  weekOf?: string;
  last_assignment?: string;
  last_assistant?: string;
  last_assistant_weekOf?: string;
  hall?: string;
};
