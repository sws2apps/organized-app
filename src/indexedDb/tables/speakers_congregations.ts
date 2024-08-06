import { Table } from 'dexie';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';

export type SpeakersCongregationsTable = {
  speakers_congregations: Table<SpeakersCongregationsType>;
};

export const speakersCongregationsSchema = {
  speakers_congregations: '&id, _deleted, cong_data',
};
