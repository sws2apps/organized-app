import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { PersonType } from '@definition/person';

export type PersonSelectorType = {
  label: string;
  week: string;
  type: AssignmentCode;
  assignment: AssignmentFieldType;
  readOnly?: boolean;
  visitingSpeakear?: boolean;
};

export type GenderType = 'male' | 'female';

export type PersonOptionsType = PersonType & {
  last_assignment?: string;
  last_assistant?: string;
  hall?: string;
};
