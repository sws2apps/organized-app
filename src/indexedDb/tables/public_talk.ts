import { Table } from 'dexie';
import { PublicTalkType } from '@definition/public_talks';

export type PublicTalkTable = {
  public_talks: Table<PublicTalkType>;
};

export const publicTalkSchema = {
  public_talks: '&talk_number, talk_title',
};
