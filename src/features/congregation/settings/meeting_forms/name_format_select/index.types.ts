import { NameFormatSelection } from '@definition/settings';
export type NameFormatSelectType = {
  label: string;
  value: NameFormatSelection;
  onChange: (value: NameFormatSelection) => void;
  readOnly: boolean;
  inherit?: boolean;
};
