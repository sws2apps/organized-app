import { useState } from 'react';
import { YearDetailsProps } from './index.types';
import { useCallback } from 'react';

const useYearDetails = ({ year }: YearDetailsProps) => {
  const [selectedPublishers, setSelectedPublishers] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('service-year');

  const handleChangeSelectedPublishers = useCallback((e) => {
    setSelectedPublishers(e.target.value);
  }, []);

  const handleChangeSelectedMonth = useCallback((e) => {
    setSelectedMonth(e.target.value);
  }, []);

  const wholeYear = selectedMonth === 'service-year';

  return {
    year,
    selectedPublishers,
    selectedMonth,
    handleChangeSelectedPublishers,
    handleChangeSelectedMonth,
    wholeYear,
  };
};

export default useYearDetails;
