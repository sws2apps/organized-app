import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { personFilterFieldServiceReportState } from '@states/field_service_reports';

const usePersonFilter = () => {
  const { t } = useAppTranslation();

  const [filter, setFilter] = useRecoilState(
    personFilterFieldServiceReportState
  );

  const filters = useMemo(() => {
    return [
      {
        key: 'publishers',
        options: [
          { key: 'active', name: t('tr_activePublishers') },
          { key: 'inactive', name: t('tr_inactivePublishers') },
          { key: 'unbaptized', name: t('tr_unbaptizedPublishers') },
          { key: 'baptized', name: t('tr_baptizedPublishers') },
          { key: 'not_submitted', name: t('tr_reportNotSubmitted') },
          { key: 'appointed', name: t('tr_appointedBrothers') },
        ],
      },
      {
        key: 'pioneers',
        options: [
          { key: 'AP', name: t('tr_APs') },
          { key: 'FR', name: t('tr_FRs') },
        ],
      },
    ];
  }, [t]);

  const handleChangeFilter = (value: string) => setFilter(value);

  return { filters, handleChangeFilter, filter };
};

export default usePersonFilter;
