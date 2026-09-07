import { InformationBoardCategory } from '@definition/information_board';
import BranchLetters from '@features/congregation/information_board/branch_letters';
import FrequentlyUsedInformation from '@features/congregation/information_board/frequently_used_information';
import GeneralInformation from '@features/congregation/information_board/general_information';
import LocalAnnouncements from '@features/congregation/information_board/local_announcements';
import { infoBoardSelectedCategory } from '@states/information_board';
import { useAtomValue } from 'jotai';
import { ReactNode, useCallback, useState } from 'react';

const useInformationBoard = () => {
  const activeCategory = useAtomValue(infoBoardSelectedCategory);

  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [addAnnouncementOpen, setAddAnnouncementOpen] = useState(false);

  const categoriesPages: Record<InformationBoardCategory, ReactNode> = {
    general_information: <GeneralInformation />,
    local_announcements: <LocalAnnouncements />,
    branch_letters: <BranchLetters />,
    frequently_used_information: <FrequentlyUsedInformation />,
  };

  const currentCategory = categoriesPages[activeCategory];

  const handleOpenQuickSettings = useCallback(() => {
    setQuickSettingsOpen(true);
  }, []);

  const handleCloseQuickSettings = useCallback(() => {
    setQuickSettingsOpen(false);
  }, []);

  const handleOpenAddAnnouncement = useCallback(() => {
    setAddAnnouncementOpen(true);
  }, []);

  const handleCloseAddAnnouncement = useCallback(() => {
    setAddAnnouncementOpen(false);
  }, []);

  return {
    currentCategory,
    quickSettingsOpen,
    addAnnouncementOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
    handleOpenAddAnnouncement,
    handleCloseAddAnnouncement,
  };
};

export default useInformationBoard;
