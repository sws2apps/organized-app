import { PersonType } from '../../../../definition/person';

export type MemberSelectorType = {
  options: PersonType[];
  label: string;
  selected?: string;
  isLast?: boolean;
  onAddMember?: () => void;
  onSelectPerson: (personId: string) => void;
  onRemovePerson: (personId?: string) => void;
};
