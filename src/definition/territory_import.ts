import type { Territory, TerritoryAssignment } from '@definition/territory';

export const MAX_TERRITORY_IMPORT_BYTES = 20 * 1024 * 1024;
export const MAX_TERRITORY_IMPORT_ROWS = 20000;
export const MAX_TERRITORY_IMPORT_CAMPAIGN_NAME = 120;
export const MAX_TERRITORY_IMPORT_POINTS = 10000;
export type TerritoryImportDateOrder = 'iso' | 'day' | 'month';
export type TerritoryImportNotice = {
  key: string;
  values?: Record<string, string | number>;
};
export type TerritoryImportEntry = {
  number: string;
  sourceId?: string;
  values: Partial<
    Pick<
      Territory,
      | 'name'
      | 'city'
      | 'type'
      | 'households'
      | 'notes'
      | 'boundary'
      | 'cardLost'
      | 'assignments'
      | 'doNotCalls'
      | 'phoneNumbers'
    >
  >;
};
export type TerritoryImportReference = {
  number: string;
  sourceId?: string;
};
export type TerritoryImportData = {
  entries: TerritoryImportEntry[];
  assignments: {
    reference: TerritoryImportReference;
    value: TerritoryAssignment;
  }[];
  addresses: {
    reference: TerritoryImportReference;
    values: TerritoryImportEntry['values'];
  }[];
  notices: TerritoryImportNotice[];
};
