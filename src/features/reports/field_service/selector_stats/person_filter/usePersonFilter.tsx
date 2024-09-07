import { useMemo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  personFilterFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';
import { FilterType } from './index.types';
import { PersonFilterOption } from '@definition/cong_field_service_reports';

const usePersonFilter = () => {
  const { t } = useAppTranslation();

  const [filter, setFilter] = useRecoilState(
    personFilterFieldServiceReportState
  );

  const setSelectedPublisher = useSetRecoilState(selectedPublisherReportState);

  const filters = useMemo(() => {
    const result: FilterType[] = [];

    result.push(
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
      }
    );

    return result;
  }, [t]);

  const handleChangeFilter = (value: PersonFilterOption) => {
    setSelectedPublisher(undefined);

    setFilter(value);
  };

  return { filters, handleChangeFilter, filter };
};

export default usePersonFilter;
