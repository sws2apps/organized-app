import { useState } from 'react';
import { PeriodOption } from './index.types';

const useYearDetails = (year: string, initialPeriod: PeriodOption) => {
  const [publisherGroup, setPublisherGroup] = useState('all');
  const [period, setPeriod] = useState<PeriodOption>(initialPeriod);

  const handlePublisherGroupChange = (value: string) => setPublisherGroup(value);
  const handlePeriodChange = (value: PeriodOption) => setPeriod(value);

  return {
    year,
    publisherGroup,
    period,
    handlePublisherGroupChange,
    handlePeriodChange,
  };
};

export default useYearDetails;
