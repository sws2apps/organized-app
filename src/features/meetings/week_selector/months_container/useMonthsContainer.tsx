import { useState } from 'react';

const useMonthsContainer = () => {
  const [currentExpanded, setCurrenExpanded] = useState('');

  const handleSetExpanded = (value: string) => setCurrenExpanded(value);

  return {
    currentExpanded,
    handleSetExpanded,
  };
};

export default useMonthsContainer;
