import { useEffect, useMemo, useState } from 'react';
import { MeetingType } from '@definition/app';
import { buildServiceYearsList, getWeekDate } from '@utils/date';

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
    const currentWeek = getWeekDate();
    let year = currentWeek.getFullYear().toString();
    const month = (currentWeek.getMonth() + 1).toString().padStart(2, '0');

    const monthValue = `${year}/${month}`;

    if (+month >= 9) {
      year = String(+year + 1).toString();
    }

    setYear(year);
    setMonth(monthValue);
  }, []);

  return { meetings, year, month, handleYearChange, handleMonthChange };
};

export default useMonthlyRecord;
