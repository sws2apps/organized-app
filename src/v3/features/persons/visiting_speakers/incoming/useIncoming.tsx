import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { incomingCongSpeakersState, isAddingCongregationState } from '@states/speakers_congregations';
import { congAccountConnectedState } from '@states/app';

const useIncoming = () => {
  const [isAdding, setIsAdding] = useRecoilState(isAddingCongregationState);

  const incomingCongs = useRecoilValue(incomingCongSpeakersState);
  const congAccountConnected = useRecoilValue(congAccountConnectedState);

  const [currentExpanded, setCurrenExpanded] = useState('');

  const handleIsAddingClose = () => setIsAdding(false);

  const handleSetExpanded = (value: string) => setCurrenExpanded(value);

  return { incomingCongs, isAdding, handleIsAddingClose, currentExpanded, handleSetExpanded, congAccountConnected };
};

export default useIncoming;
