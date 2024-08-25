import { useMemo } from 'react';
import { buildServiceYearsList } from '@utils/date';

const useYearSelector = () => {
  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  const tabs = useMemo(() => {
    return serviceYears.map((record) => {
      return {
        label: record.year,
      };
    });
  }, [serviceYears]);

  return { tabs };
};

export default useYearSelector;
