import { FieldServiceGroupType } from '@definition/field_service_groups';

export type GroupMembersProps = {
  onClose: VoidFunction;
  onAction: () => Promise<void>;
  group: FieldServiceGroupType;
  onChange: (group: FieldServiceGroupType) => void;
};

export type PersonOption = {
  person_uid: string;
  person_name: string;
};
