import { FieldServiceGroupType } from '@definition/field_service_groups';

export type GroupDetailsProps = {
  onClose: VoidFunction;
  group: FieldServiceGroupType;
  onChange: (group: FieldServiceGroupType) => void;
  onAction: VoidFunction;
  circuit: string;
  onCircuitChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
};
