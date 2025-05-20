import { LanguageGroupType } from '@definition/settings';

export type GroupInfoProps = {
  open: boolean;
  onClose: VoidFunction;
  group: LanguageGroupType;
};
