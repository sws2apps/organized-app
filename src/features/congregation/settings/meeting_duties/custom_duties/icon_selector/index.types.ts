import { CustomDutyIconType } from '@definition/duties';

export type DutyIconSelectorProps = {
  value: CustomDutyIconType;
  disabled?: boolean;
  onChange: (value: CustomDutyIconType) => void;
};
