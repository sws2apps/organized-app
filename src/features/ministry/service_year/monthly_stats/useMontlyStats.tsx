import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useCurrentUser } from '@hooks/index';
import { buildServiceYearsList } from '@utils/date';
import { serviceYearSelectedState } from '@states/user_field_service_reports';

const useMonthlyStats = () => {
  const { first_report, person } = useCurrentUser();

  const selectedYear = useRecoilValue(serviceYearSelectedState);

  const monthsList = useMemo(() => {
    if (!selectedYear) return [];

    const firstMonthReport = first_report;
    const date = new Date(firstMonthReport);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const miniMonth = `${year}/${String(month).padStart(2, '0')}`;

    const years = buildServiceYearsList();
    const validYears = years.find((record) => record.year === selectedYear);

    const result = validYears.months.filter(
      (month) => month.value >= miniMonth
    );

    return result;
  }, [selectedYear, first_report]);

  return { monthsList, person };
};

export default useMonthlyStats;
