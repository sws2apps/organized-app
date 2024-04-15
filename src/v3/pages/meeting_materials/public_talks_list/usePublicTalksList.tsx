import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congAccountConnectedState } from '@states/app';
import { publicTalksState } from '@states/publicTalks';
import { PublicTalksViewType } from '@definition/public_talks';

const usePublicTalksList = () => {
  const isConnected = useRecoilValue(congAccountConnectedState);
  const talksList = useRecoilValue(publicTalksState);

  const [currentView, setCurrentView] = useState<PublicTalksViewType>('list');

  const handleToggleView = () => {
    setCurrentView((prev) => {
      if (prev === 'list') return 'table';
      if (prev === 'table') return 'list';
    });
  };

  return { isConnected, talksList, handleToggleView, currentView };
};

export default usePublicTalksList;
