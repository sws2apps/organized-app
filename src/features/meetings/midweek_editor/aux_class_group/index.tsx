import { useAppTranslation } from '@hooks/index';
import { AuxClassGroupProps } from './index.types';
import useAuxClassGroup from './useAuxClassGroup';
import GroupSelector from '@features/congregation/field_service_groups/group_selector';

const AuxClassGroup = (props: AuxClassGroupProps) => {
  const { t } = useAppTranslation();

  const { value, handleGroupChange } = useAuxClassGroup(props);

  return (
    <GroupSelector
      label={t('tr_assignedGroupAuxClassroom')}
      value={value}
      onChange={handleGroupChange}
    />
  );
};

export default AuxClassGroup;
