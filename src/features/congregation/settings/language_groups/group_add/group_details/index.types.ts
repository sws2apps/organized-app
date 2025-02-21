import { LanguageGroupType } from '@definition/settings';

export type GroupDetailsProps = {
  onClose: VoidFunction;
  group: LanguageGroupType;
  onChange: (group: LanguageGroupType) => void;
  onAction: VoidFunction;
};
