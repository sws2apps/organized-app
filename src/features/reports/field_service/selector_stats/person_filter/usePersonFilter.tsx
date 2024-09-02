import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { personFilterFieldServiceReportState } from '@states/field_service_reports';
import { PersonFilterOption } from './index.types';

const usePersonFilter = () => {
  const { t } = useAppTranslation();

  const [filter, setFilter] = useRecoilState(
    personFilterFieldServiceReportState
  );

  const filters: PersonFilterOption[] = useMemo(() => {
    return [
      {
        key: 'publishers',
        group: t('tr_publishers'),
        options: [
          { key: 'active', name: t('tr_activePublishers') },
          { key: 'inactive', name: t('tr_inactivePublishers') },
        ],
      },
    ];
  }, [t]);

  const handleChangeFilter = (value: string) => {
    console.log(value);
    setFilter(value);
  };

  return { filters, handleChangeFilter, filter };
};

export default usePersonFilter;
