import { FieldServiceGroupType } from '@definition/field_service_groups';
import appDb from '@db/appDb';

const dbUpdateFieldServiceGroupsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.field_service_groups = {
    ...metadata.metadata.field_service_groups,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbFieldServiceGroupSave = async (group: FieldServiceGroupType) => {
  await appDb.field_service_groups.put(group);
  await dbUpdateFieldServiceGroupsMetadata();
};

export const dbFieldServiceGroupBulkSave = async (
  groups: FieldServiceGroupType[]
) => {
  await appDb.field_service_groups.bulkPut(groups);
  await dbUpdateFieldServiceGroupsMetadata();
};
