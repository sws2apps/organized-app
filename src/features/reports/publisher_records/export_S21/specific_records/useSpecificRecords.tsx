import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';
import { currentReportMonth } from '@utils/date';
import { SpecificRecordsProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import ActivePublishers from './active_publishers';

const useSpecificRecords = ({ onClose }: SpecificRecordsProps) => {
  const { t } = useAppTranslation();

  const { getPublishersInactive } = usePersons();

  const groups = useRecoilValue(fieldGroupsState);

  const inactive = useMemo(() => {
    const month = currentReportMonth();
    const result = getPublishersInactive(month);

    return result;
  }, [getPublishersInactive]);

  const tabs = useMemo(() => {
    const result = [
      {
        label: t('tr_active'),
        Component: <ActivePublishers onClose={onClose} />,
      },
    ];

    if (inactive.length > 0) {
      result.push({ label: t('tr_inactive'), Component: <></> });
    }

    if (groups.length > 0) {
      result.push({ label: t('tr_fieldServiceGroups'), Component: <></> });
    }

    return result;
  }, [t, groups, inactive, onClose]);

  return { tabs };
};

export default useSpecificRecords;
