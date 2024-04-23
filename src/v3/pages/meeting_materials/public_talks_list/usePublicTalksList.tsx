import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PublicTalksViewType } from '@definition/public_talks';
import { publicTalksState } from '@states/publicTalks';

const usePublicTalksList = () => {
  const talksList = useRecoilValue(publicTalksState);

  const [currentView, setCurrentView] = useState<PublicTalksViewType>('list');

  const handleToggleView = () => {
    setCurrentView((prev) => {
      if (prev === 'list') return 'table';
      if (prev === 'table') return 'list';
    });
  };

  return { talksList, handleToggleView, currentView };
};

export default usePublicTalksList;
