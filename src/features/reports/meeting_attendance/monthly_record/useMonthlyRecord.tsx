import { useEffect, useMemo, useState } from 'react';
import { MeetingType } from '@definition/app';
import {
  buildServiceYearsList,
  currentMonthServiceYear,
  currentServiceYear,
} from '@utils/date';

const useMonthlyRecord = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const meetings: MeetingType[] = ['midweek', 'weekend'];

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

  const handleMonthChange = (value: string) => {
    setMonth(value);
  };

  useEffect(() => {
    const currentSY = currentServiceYear();
    setYear(currentSY);

    const monthValue = currentMonthServiceYear();
    setMonth(monthValue);
  }, []);

  return { meetings, year, month, handleYearChange, handleMonthChange };
};

export default useMonthlyRecord;
