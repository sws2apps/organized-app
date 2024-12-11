import { Table } from 'dexie';
import { MetadataRecordType } from '@definition/metadata';

export type MetadataTable = {
  metadata: Table<MetadataRecordType>;
};

export const metadataSchema = {
  metadata: '&id, tables',
};
