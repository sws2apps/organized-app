import { useEffect, useMemo, useState } from 'react';
import {
  currentReportMonth,
  getMonthServiceYear,
  buildServiceYearsList,
} from '@utils/date';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  selectedMonthFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';

const useSelectorStats = () => {
  const setSelectedPublisher = useSetRecoilState(selectedPublisherReportState);

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
    setSelectedPublisher(undefined);

    setYear(value);

    const month = serviceYears
      .find((record) => record.year === value)
      .months.at(0);

    setMonth(month.value);
  };

  const handleMonthChange = (value: string) => {
    setSelectedPublisher(undefined);

    setMonth(value);
  };

  useEffect(() => {
    setMonth(monthDefault);
  }, [setMonth, monthDefault]);

  return { year, month, handleYearChange, handleMonthChange };
};

export default useSelectorStats;
