import type { TerritoryWireRecord } from '@definition/territory_sync';
import type { Territory } from '@definition/territory';
export type TerritoryRecord = {
  id: string;
  dataView: string;
  updatedAt: string;
  deleted: boolean;
  data: Territory;
  remote?: TerritoryWireRecord;
};
