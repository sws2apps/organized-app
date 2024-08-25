import { useEffect, useMemo, useState } from 'react';
import { buildServiceYearsList, currentServiceYear } from '@utils/date';

const useMonthlyHistory = () => {
  const [value, setValue] = useState<number | boolean>(false);

  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  const months = useMemo(() => {
    if (typeof value === 'boolean') return [];

    const year = serviceYears.at(value).year;

    return serviceYears.find((record) => record.year === year)?.months || [];
  }, [value, serviceYears]);

  const handleTabChange = (value: number) => setValue(value);

  useEffect(() => {
    const currentSY = currentServiceYear();
    const findIndex = serviceYears.findIndex(
      (record) => record.year === currentSY
    );
    setValue(findIndex);
  }, [serviceYears]);

  return { value, handleTabChange, months };
};

export default useMonthlyHistory;
