import { PublicWitnessingLocationType } from '@definition/public_witnessing';
import { Table } from 'dexie';

export type PublicWitnessingLocationsTable = {
  public_witnessing_locations: Table<PublicWitnessingLocationType>;
};

export const publicWitnessingLocationsSchema = {
  public_witnessing_locations: '&location_uid, location_data',
};
