import { FieldServiceGroupType } from '@definition/field_service_groups';

export type GroupInfoProps = {
  open: boolean;
  onClose: VoidFunction;
  group: FieldServiceGroupType;
};
