import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { fieldGroupsState } from '@states/field_service_groups';
import { currentReportMonth } from '@utils/date';
import { SpecificRecordsProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import ActivePublishers from './active_publishers';
import FieldServiceGroups from './field_service_groups';
import InactivePublishers from './inactive_publishers';

const useSpecificRecords = ({ onClose, onExport }: SpecificRecordsProps) => {
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
        Component: <ActivePublishers onClose={onClose} onExport={onExport} />,
      },
    ];

    if (groups.length > 0) {
      result.push({
        label: t('tr_fieldServiceGroups'),
        Component: <FieldServiceGroups onClose={onClose} onExport={onExport} />,
      });
    }

    if (inactive.length > 0) {
      result.push({
        label: t('tr_inactive'),
        Component: <InactivePublishers onClose={onClose} onExport={onExport} />,
      });
    }

    return result;
  }, [t, groups, inactive, onClose, onExport]);

  return { tabs };
};

export default useSpecificRecords;
