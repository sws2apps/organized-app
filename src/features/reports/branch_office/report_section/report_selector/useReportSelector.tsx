import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import { ReportOption } from './index.types';

const useReportSelector = () => {
  const { t } = useAppTranslation();

  const REPORTS = useMemo(() => {
    const result: ReportOption[] = [
      { value: 'S-1', name: t('tr_s1Report') },
      { value: 'S-10', name: t('tr_s10Report') },
    ];

    return result;
  }, [t]);

  return { REPORTS };
};

export default useReportSelector;
