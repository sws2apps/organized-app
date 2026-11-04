import { PublicWitnessingArrangementType } from '@definition/public_witnessing';
import { Table } from 'dexie';

export type PublicWitnessingArrangementsTable = {
  public_witnessing_arrangements: Table<PublicWitnessingArrangementType>;
};

export const publicWitnessingArrangementsSchema = {
  public_witnessing_arrangements: '&arrangement_uid, arrangement_data',
};
