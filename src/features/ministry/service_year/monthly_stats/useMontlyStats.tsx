import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { buildServiceYearsList } from '@utils/date';
import { serviceYearSelectedState } from '@states/user_field_service_reports';

const useMonthlyStats = () => {
  const { first_report, person } = useCurrentUser();

  const selectedYear = useAtomValue(serviceYearSelectedState);

  const monthsList = useMemo(() => {
    if (!selectedYear) return [];

    if (!first_report) return [];

    const years = buildServiceYearsList();
    const validYears = years.find((record) => record.year === selectedYear);

    const result = validYears.months.filter(
      (month) => month.value >= first_report
    );

    return result;
  }, [selectedYear, first_report]);

  return { monthsList, person };
};

export default useMonthlyStats;
