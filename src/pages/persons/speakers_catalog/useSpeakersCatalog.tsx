import { useSetAtom } from 'jotai';
import { isAddingCongregationState } from '@states/speakers_congregations';
import { useState } from 'react';

const useSpeakersCatalog = () => {
  const setIsAdding = useSetAtom(isAddingCongregationState);

  const handleIsAddingOpen = () => setIsAdding(true);

  const [isDataExchangeOpen, setIsDataExchangeOpen] = useState(false);

  const handleOpenExchange = () => setIsDataExchangeOpen(true);

  const handleCloseExchange = () => setIsDataExchangeOpen(false);

  return {
    handleIsAddingOpen,
    handleOpenExchange,
    handleCloseExchange,
    isDataExchangeOpen,
  };
};

export default useSpeakersCatalog;
