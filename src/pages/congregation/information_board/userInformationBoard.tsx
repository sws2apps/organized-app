import { InformationBoardCategory } from '@definition/information_board';
import GeneralInformation from '@features/congregation/information_board/general_information';
import { infoBoardSelectedCategory } from '@states/information_board';
import { useAtomValue } from 'jotai';
import { ReactNode, useCallback, useState } from 'react';

const useInformationBoard = () => {
  const activeCategory = useAtomValue(infoBoardSelectedCategory);

  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  const categoriesPages: Record<InformationBoardCategory, ReactNode> = {
    general_information: <GeneralInformation />,
    local_announcements: null,
    branch_letters: null,
    frequently_used_information: null,
  };

  const currentCategory = categoriesPages[activeCategory];

  const handleOpenQuickSettings = useCallback(() => {
    setQuickSettingsOpen(true);
  }, []);

  const handleCloseQuickSettings = useCallback(() => {
    setQuickSettingsOpen(false);
  }, []);

  return {
    currentCategory,
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  };
};

export default useInformationBoard;
