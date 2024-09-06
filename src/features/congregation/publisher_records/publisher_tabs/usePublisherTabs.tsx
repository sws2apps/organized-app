import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import ListByGroups from './list_by_groups';

const usePublisherTabs = () => {
  const { t } = useAppTranslation();

  const tabs = useMemo(() => {
    return [
      {
        label: t('tr_activePublishers'),
        Component: <ListByGroups type="active" />,
      },
      {
        label: t('tr_inactivePublishers'),
        Component: <ListByGroups type="inactive" />,
      },
    ];
  }, [t]);

  return { tabs };
};

export default usePublisherTabs;
