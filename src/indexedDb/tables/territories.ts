import { Table } from 'dexie';
import { TerritoryRecord } from '@definition/territory_record';
export type TerritoriesTable = { territories: Table<TerritoryRecord> };
export const territoriesSchema = { territories: '&id, dataView' };
