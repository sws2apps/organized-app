import { FieldServiceGroupType } from '@definition/field_service_groups';

export type EditDeleteDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  type: 'edit' | 'delete';
  onDelete: VoidFunction;
  group: FieldServiceGroupType;
  index: number;
};
