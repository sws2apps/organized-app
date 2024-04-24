import { Table } from 'dexie';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';

export type SpeakersCongregationsTable = {
  speakers_congregations: Table<SpeakersCongregationsType>;
};

export const speakersCongregationsSchema = {
  speakers_congregations:
    '&cong_number, _deleted, cong_id, cong_name, cong_address, weekend_meeting_day, weekend_meeting_time, cong_public_talk_coordinator_name, cong_public_talk_coordinator_email, cong_public_talk_coordinator_phone, cong_coordinator_name, cong_coordinator_email, cong_coordinator_phone, request_status, notification_dismissed',
};
