import { useMemo } from 'react';
import { buildServiceYearsList } from '@utils/date';

const useYearSelector = () => {
  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  return { serviceYears };
};

export default useYearSelector;
