import { FieldServiceGroupType } from '@definition/field_service_groups';

export type GroupMembersProps = {
  group: FieldServiceGroupType;
  onChange: (group: FieldServiceGroupType) => void;
};

export type UsersOption = {
  person_uid: string;
  person_name: string;
};

export type MemberType = {
  id: string;
};
