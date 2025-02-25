export type PersonOption = {
  person_uid: string;
  person_name: string;
};

export type LanguageGroupMembersProps = {
  readOnly: boolean;
  admins: string[];
  members: string[];
  onAdminsChange: (value: string[]) => void;
  onMembersChange: (value: string[]) => void;
  onAdminDelete: (value: string) => void;
  onMemberDelete: (value: string) => void;
};
