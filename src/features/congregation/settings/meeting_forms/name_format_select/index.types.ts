import { FullnameOption } from '@definition/settings';

export type NameFormatSelectType = {
  label: string;
  value: FullnameOption;
  onChange: (value: FullnameOption) => void;
  readOnly: boolean;
};
