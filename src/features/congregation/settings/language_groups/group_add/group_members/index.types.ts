import { LanguageGroupType } from '@definition/settings';

export type GroupMembersProps = {
  onClose: VoidFunction;
  onAction: VoidFunction;
  group: LanguageGroupType;
  onChange: (group: LanguageGroupType) => void;
  members: string[];
  onChangeMembers: (members: string[]) => void;
};

export type PersonOption = {
  person_uid: string;
  person_name: string;
};
