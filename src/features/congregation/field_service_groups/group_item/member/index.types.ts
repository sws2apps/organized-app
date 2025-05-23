import { FieldServiceGroupMemberType } from '@definition/field_service_groups';

export type GroupMemberProps = {
  group_id: string;
  index: number;
  member: FieldServiceGroupMemberType;
  editable: boolean;
};
