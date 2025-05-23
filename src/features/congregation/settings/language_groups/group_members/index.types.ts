export type PersonOption = {
  person_uid: string;
  person_name: string;
};

export type LanguageGroupMembersProps = {
  readOnly: boolean;
  overseers: string[];
  members: string[];
  onOverseersChange: (value: string[]) => void;
  onMembersChange: (value: string[]) => void;
  onOverseerDelete: (value: string) => void;
  onMemberDelete: (value: string) => void;
};
