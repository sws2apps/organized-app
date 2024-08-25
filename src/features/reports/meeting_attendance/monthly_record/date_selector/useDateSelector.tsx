import { useMemo } from 'react';
import { buildServiceYearsList } from '@utils/date';

const useDateSelector = (year: string) => {
  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  const months = useMemo(() => {
    return serviceYears.find((record) => record.year === year)?.months || [];
  }, [year, serviceYears]);

  return { serviceYears, months };
};

export default useDateSelector;
