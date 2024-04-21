import { Table } from 'dexie';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type VisitingSpeakersTable = {
  visiting_speakers: Table<VisitingSpeakerType>;
};

export const visitingSpeakersSchema = {
  visiting_speakers:
    '&cong_number, _deleted, cong_id, cong_name, cong_address, weekend_meeting_day, weekend_meeting_time, cong_public_talk_coordinator_name, cong_public_talk_coordinator_email, cong_public_talk_coordinator_phone, cong_coordinator_name, cong_coordinator_email, cong_coordinator_phone, request_status, notification_dismissed, cong_speakers',
};
