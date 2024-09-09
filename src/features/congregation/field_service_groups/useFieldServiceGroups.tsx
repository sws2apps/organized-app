import { useRecoilValue } from 'recoil';
import { fieldGroupsState } from '@states/field_service_groups';

const useFieldServiceGroups = () => {
  const groups = useRecoilValue(fieldGroupsState);

  return { groups };
};

export default useFieldServiceGroups;
