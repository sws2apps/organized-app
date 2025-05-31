import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  incomingCongSpeakersState,
  isAddingCongregationState,
} from '@states/speakers_congregations';

const useOtherCongregations = () => {
  const [isAdding, setIsAdding] = useAtom(isAddingCongregationState);

  const incomingCongs = useAtomValue(incomingCongSpeakersState);

  const [currentExpanded, setCurrenExpanded] = useState('');

  const handleIsAddingClose = () => setIsAdding(false);

  const handleSetExpanded = (value: string) => setCurrenExpanded(value);

  return {
    incomingCongs,
    isAdding,
    handleIsAddingClose,
    currentExpanded,
    handleSetExpanded,
  };
};

export default useOtherCongregations;
