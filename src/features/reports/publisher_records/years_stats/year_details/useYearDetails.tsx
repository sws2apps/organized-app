import { useState } from 'react';
import { YearDetailsProps } from './index.types';

const useYearDetails = ({ year }: YearDetailsProps) => {
  const [publisherGroup, setPublisherGroup] = useState('all');
  const [period, setPeriod] = useState('serviceYear');

  const handlePublisherGroupChange = (value: string) => setPublisherGroup(value);
  const handlePeriodChange = (value: string) => setPeriod(value);

  return {
    year,
    publisherGroup,
    period,
    handlePublisherGroupChange,
    handlePeriodChange,
  };
};

export default useYearDetails;
