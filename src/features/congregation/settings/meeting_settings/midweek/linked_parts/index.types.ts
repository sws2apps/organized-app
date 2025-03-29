import { AssignmentFieldType } from '@definition/assignment';

export type LinkedPartID = AssignmentFieldType | 'Do_Not_Link';

export type LinkedPartsOption = {
  id: LinkedPartID;
  name: string;
};
