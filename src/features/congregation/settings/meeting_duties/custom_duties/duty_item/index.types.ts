import { CustomDutyIconType } from '@definition/duties';

export type DutyItemProps = {
  id: string;
  icon?: CustomDutyIconType;
  name: string;
  amount: number;
};
