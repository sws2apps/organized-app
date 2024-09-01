import { PioneerEventType } from '@definition/user_field_service_reports';

export type HourCreditItemType = {
  event: PioneerEventType | 'approved_assignment';
  value: number;
};
