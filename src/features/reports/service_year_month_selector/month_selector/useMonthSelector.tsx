import { useMemo } from 'react';
import { buildServiceYearsList } from '@utils/date';

const useMonthSelector = (year: string) => {
  const serviceYears = useMemo(() => {
    return buildServiceYearsList();
  }, []);

  const months = useMemo(() => {
    return serviceYears.find((record) => record.year === year)?.months || [];
  }, [year, serviceYears]);

  return { serviceYears, months };
};

export default useMonthSelector;
