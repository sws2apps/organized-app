export type GroupSelectorProps = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  showEdit?: boolean;
  helperText?: string;
  includeLanguageGroup?: boolean;
  showServiceGroups?: boolean;
  readOnly?: boolean;
};
