import { Table } from 'dexie';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';

export type SpeakersCongregationsTable = {
  speakers_congregations: Table<SpeakersCongregationsType>;
};

export const speakersCongregationsSchema = {
  speakers_congregations:
    '&cong_number, _deleted, cong_id, cong_name, cong_circuit, cong_location, midweek_meeting, weekend_meeting, public_talk_coordinator, coordinator, request_status, notification_dismissed',
};
