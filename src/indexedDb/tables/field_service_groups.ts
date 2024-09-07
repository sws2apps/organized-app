import { Table } from 'dexie';
import { FieldServiceGroupType } from '@definition/field_service_groups';

export type FieldServiceGroupsTable = {
  field_service_groups: Table<FieldServiceGroupType>;
};

export const fieldServiceGroupsSchema = {
  field_service_groups: '&group_id, group_data',
};
