import { FullnameOption } from '@definition/settings';

// sentinel for "follow the in-app format"; deliberately not a FullnameOption
// member so it can never be persisted as a real format
export const NAME_FORMAT_INHERIT = 0 as FullnameOption;

export type NameFormatSelectType = {
  label: string;
  value: FullnameOption;
  onChange: (value: FullnameOption) => void;
  readOnly: boolean;
  inherit?: boolean;
};
