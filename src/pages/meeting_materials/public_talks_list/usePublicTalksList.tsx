import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { PublicTalksViewType } from '@definition/public_talks';
import { publicTalksLocaleState } from '@states/public_talks';

const usePublicTalksList = () => {
  const talksList = useAtomValue(publicTalksLocaleState);

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
