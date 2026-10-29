import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';

export type MeetingItemProps = {
  meeting: FieldServiceMeetingFormattedType;
  canEdit?: boolean;
  onEdit?: () => void;
};
