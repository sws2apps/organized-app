import { UpdateSpec } from 'dexie';
import { SettingsType } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
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

export const dbFieldServiceGroupClear = async () => {
  const records = await appDb.field_service_groups.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record.group_data._deleted = true;
    record.group_data.updatedAt = new Date().toISOString();
  }

  await appDb.field_service_groups.bulkPut(records);
};

/** Save related settings and the group together, without restoring a tombstone. */
export const dbFieldServiceGroupSaveWithSettings = (
  group: FieldServiceGroupType,
  changes: UpdateSpec<SettingsType>
) => {
  return appDb.transaction(
    'rw',
    [appDb.field_service_groups, appDb.app_settings, appDb.metadata],
    async () => {
      const current = await appDb.field_service_groups.get(group.group_id);

      if (
        !current ||
        (current.group_data._deleted && !group.group_data._deleted)
      ) {
        return false;
      }

      await dbAppSettingsUpdate(changes);
      await dbFieldServiceGroupSave(group);
      return true;
    }
  );
};
