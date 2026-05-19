import { FieldServiceGroupType } from '@definition/settings';

export type GroupInfoProps = {
  open: boolean;
  onClose: VoidFunction;
  group: FieldServiceGroupType;
  inline?: boolean;
};
