import { FieldServiceGroupType } from '@definition/field_service_groups';

export type GroupDetailsProps = {
  action: VoidFunction;
  onClose: VoidFunction;
  group: FieldServiceGroupType;
  onChange: (group: FieldServiceGroupType) => void;
};

export type UsersOption = {
  person_uid: string;
  person_name: string;
  elder: boolean;
};
