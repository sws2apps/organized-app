import { useAppTranslation } from '@hooks/index';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { useAtomValue } from 'jotai';

const useSelectPublishers = () => {
  const { t } = useAppTranslation();
  const fieldGroups = useAtomValue(fieldWithLanguageGroupsState);

  const groups = fieldGroups.map((group) => {
    return {
      id: group.group_id,
      name: !group.group_data.name
        ? t('tr_groupName', {
            groupName: String(group.group_data.sort_index + 1),
          })
        : group.group_data.name,
    };
  });

  return { groups };
};

export default useSelectPublishers;
