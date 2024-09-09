import { FieldServiceGroupType } from '@definition/field_service_groups';

export type NewGroupMembersProps = {
  action: VoidFunction;
  onBack: VoidFunction;
  group: FieldServiceGroupType;
  onChange: (group: FieldServiceGroupType) => void;
};
