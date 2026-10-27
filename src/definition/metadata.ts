import type { TerritorySyncState } from '@definition/territory_sync';
export type MetadataRecordType = {
  id: number;
  territorySync?: TerritorySyncState;
  metadata: Record<
    string,
    {
      version: string;
      send_local: boolean;
    }
  >;
};
