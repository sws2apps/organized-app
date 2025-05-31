import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { fieldWithLanguageGroupsNoStudentsState } from '@states/field_service_groups';

const useFieldServiceGroups = () => {
  const { desktopUp, tablet688Up, desktopLargeUp } = useBreakpoints();

  const groups_list = useAtomValue(fieldWithLanguageGroupsNoStudentsState);

  const masonry_columns = useMemo(() => {
    if (!tablet688Up) return 1;

    if (!desktopUp) return 2;

    if (!desktopLargeUp) return 3;

    return 4;
  }, [tablet688Up, desktopUp, desktopLargeUp]);

  return { masonry_columns, groups_list };
};

export default useFieldServiceGroups;
