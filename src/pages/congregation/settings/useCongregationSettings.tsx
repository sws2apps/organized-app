import { useState } from 'react';

const useCongregationSettings = () => {
  const [isDataExchangeOpen, setIsDataExchangeOpen] = useState(false);

  const handleOpenExchange = () => setIsDataExchangeOpen(true);

  const handleCloseExchange = () => setIsDataExchangeOpen(false);

  return { isDataExchangeOpen, handleOpenExchange, handleCloseExchange };
};

export default useCongregationSettings;
