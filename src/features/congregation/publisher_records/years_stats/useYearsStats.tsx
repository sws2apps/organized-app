import { useMemo } from 'react';
import { buildServiceYearsList, currentReportMonth } from '@utils/date';
import YearDetails from './year_details';

const useYearsStats = () => {
  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  const intial_value = useMemo(() => {
    const month = currentReportMonth();
    const year = month.split('/')[0];

    const findIndex = serviceYears.findIndex((record) => record.year === year);
    return findIndex;
  }, [serviceYears]);

  const tabs = useMemo(() => {
    return serviceYears.map((record) => {
      return {
        label: record.year,
        Component: <YearDetails year={record.year} />,
      };
    });
  }, [serviceYears]);

  return { tabs, intial_value };
};

export default useYearsStats;
