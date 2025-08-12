import { useEffect, useState } from 'react';
import { YearDetailsProps } from './index.types';

const useYearDetails = ({ year }: YearDetailsProps) => {
  const [wholeYear, setWholeYear] = useState(true);
  const [month, setMonth] = useState('');
  const [publisherGroup, setPublisherGroup] = useState('all');
  const [period, setPeriod] = useState('serviceYear');

  const handleMonthChange = (value: string) => setMonth(value);
  const handleToggleWholeYear = (value: boolean) => setWholeYear(value);
  const handlePublisherGroupChange = (value: string) =>
    setPublisherGroup(value);
  const handlePeriodChange = (value: string) => setPeriod(value);

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
    publisherGroup,
    period,
    handlePublisherGroupChange,
    handlePeriodChange,
  };
};

export default useYearDetails;
