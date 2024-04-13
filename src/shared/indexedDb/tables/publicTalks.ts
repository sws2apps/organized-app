import { Table } from 'dexie';
import { TalkType } from '@definition/sources';

export type PublicTalksTable = {
  public_talks: Table<TalkType>;
};

export const publicTalksSchema = {
  public_talks: '&talk_number, talk_title',
};
