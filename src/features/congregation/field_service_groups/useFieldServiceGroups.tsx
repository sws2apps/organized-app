import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useBreakpoints } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';

const useFieldServiceGroups = () => {
  const { desktopUp, tablet688Up, desktopLargeUp } = useBreakpoints();

  const groups = useRecoilValue(fieldGroupsState);

  const masonry_columns = useMemo(() => {
    if (!tablet688Up) return 1;

    if (!desktopUp) return 2;

    if (!desktopLargeUp) return 3;

    return 4;
  }, [tablet688Up, desktopUp, desktopLargeUp]);

  return { groups, masonry_columns };
};

export default useFieldServiceGroups;
