import { FieldServiceGroupMemberType } from '@definition/field_service_groups';

export type RemovePersonProps = {
  open: boolean;
  onClose: VoidFunction;
  action: VoidFunction;
  member: FieldServiceGroupMemberType;
  index: number;
  group_id: string;
};
