import { Table } from 'dexie';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type VisitingSpeakersTable = {
  visiting_speakers: Table<VisitingSpeakerType>;
};

export const visitingSpeakersSchema = {
  visiting_speakers: '&person_uid, _deleted, speaker_data',
};
