import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { buildPublisherReportMonths, currentReportMonth } from '@utils/date';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';

const useMonthlyReport = () => {
  const [selectedMonth, setSelectedMonth] = useRecoilState(
    reportUserSelectedMonthState
  );

  const [initialValue, setInitialValue] = useState<number | boolean>(false);

  const monthsList = useMemo(() => {
    const results = buildPublisherReportMonths();
    return results;
  }, []);

  const monthsTab = useMemo(() => {
    return monthsList.map((month) => {
      return {
        label: month.label,
      };
    });
  }, [monthsList]);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(monthsList.at(value).value);
  };

  useEffect(() => {
    setSelectedMonth('');

    setTimeout(() => {
      const current = currentReportMonth();

      const value = monthsList.findIndex((record) => record.value === current);
      setSelectedMonth(monthsList.at(value).value);

      setInitialValue(value);
    }, 500);
  }, [monthsList, setSelectedMonth]);

  return { monthsTab, initialValue, handleMonthChange, selectedMonth };
};

export default useMonthlyReport;
