import { FieldServiceGroupType } from '@definition/field_service_groups';
import appDb from '@db/appDb';

export const dbFieldServiceGroupSave = async (group: FieldServiceGroupType) => {
  await appDb.field_service_groups.put(group);
};
