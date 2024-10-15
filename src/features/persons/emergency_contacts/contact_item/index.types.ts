export type ContactItemType = {
  id: string;
  name: string;
  contact: string;
  onNameChange: (id: string, value: string) => void;
  onContactChange: (id: string, value: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  isLast: boolean;
  readOnly?: boolean;
};
