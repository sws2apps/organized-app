import { useEffect, useState } from 'react';
import { YearDetailsProps } from './index.types';

const useYearDetails = ({ year }: YearDetailsProps) => {
  const [wholeYear, setWholeYear] = useState(true);
  const [month, setMonth] = useState('');

  const handleMonthChange = (value: string) => setMonth(value);

  const handleToggleWholeYear = (value: boolean) => setWholeYear(value);

  useEffect(() => {
    if (wholeYear) setMonth('');

    if (!wholeYear) {
      setMonth(`${+year - 1}/09`);
    }
  }, [wholeYear, year]);

  return {
    wholeYear,
    month,
    handleMonthChange,
    handleToggleWholeYear,
    year,
  };
};

export default useYearDetails;
