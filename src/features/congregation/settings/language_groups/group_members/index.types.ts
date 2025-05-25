import { FieldServiceGroupType } from '@definition/field_service_groups';

export type PersonOption = {
  person_uid: string;
  person_name: string;
};

export type LanguageGroupMembersProps = {
  readOnly: boolean;
  group: FieldServiceGroupType;
  onChange: (group: FieldServiceGroupType) => void;
};
