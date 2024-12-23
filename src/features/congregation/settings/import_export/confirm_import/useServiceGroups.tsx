import { FieldServiceGroupType } from '@definition/field_service_groups';
import { updatedAtOverride } from '@utils/common';
import appDb from '@db/appDb';

const useServiceGroups = () => {
  const getServiceGroups = async (groups: FieldServiceGroupType[]) => {
    const result: FieldServiceGroupType[] = [];

    result.push(...groups);

    const oldGroups = await appDb.field_service_groups.toArray();

    for (const oldGroup of oldGroups) {
      const newGroup = groups.find(
        (record) => record.group_id === oldGroup.group_id
      );

      if (!newGroup) {
        oldGroup.group_data._deleted = true;
        oldGroup.group_data.updatedAt = new Date().toISOString();

        result.push(oldGroup);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  return { getServiceGroups };
};

export default useServiceGroups;
