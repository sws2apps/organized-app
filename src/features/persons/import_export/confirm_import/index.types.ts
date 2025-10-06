import { ImportFileData } from '../index.types';
import { PersonType } from '@definition/person';
//import { FieldServiceGroupType } from '@definition/field_service_groups';
export type ConfirmImportProps = {
  filedata: ImportFileData;
  onBack: VoidFunction;
  onClose: VoidFunction;
};

export interface ImportResult {
  successCount: number;
  totalCount: number;
  errorReason: string;
  successfullyImported: PersonType[];
}

export interface ImportResultGroups {
  successMembersCount: number;
  successCountGroups: number;
  totalCountGroups: number;
  errorReasonGroups: string;
  // successfullyImportedGroups: FieldServiceGroupType[];
}
