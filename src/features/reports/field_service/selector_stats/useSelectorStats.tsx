import { useEffect, useMemo, useState } from 'react';
import {
  currentReportMonth,
  getMonthServiceYear,
  buildServiceYearsList,
} from '@utils/date';
import { useRecoilState } from 'recoil';
import { selectedMonthFieldServiceReportState } from '@states/field_service_reports';

const useSelectorStats = () => {
  const monthDefault = useMemo(() => {
    return currentReportMonth();
  }, []);

  const yearDefault = useMemo(() => {
    return getMonthServiceYear(monthDefault);
  }, [monthDefault]);

  const [month, setMonth] = useRecoilState(
    selectedMonthFieldServiceReportState
  );

  const [year, setYear] = useState(yearDefault);

  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  const handleYearChange = (value: string) => {
    setYear(value);

    const month = serviceYears
      .find((record) => record.year === value)
      .months.at(0);

    setMonth(month.value);
  };

  const handleMonthChange = (value: string) => setMonth(value);

  useEffect(() => {
    setMonth(monthDefault);
  }, [setMonth, monthDefault]);

  return { year, month, handleYearChange, handleMonthChange };
};

export default useSelectorStats;
