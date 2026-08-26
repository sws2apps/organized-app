import { InformationBoardCategory } from '@definition/information_board';
import GeneralInformation from '@features/congregation/information_board/general_information';
import { infoBoardSelectedCategory } from '@states/information_board';
import { useAtomValue } from 'jotai';
import { ReactNode, useCallback, useState } from 'react';

const useInformationBoard = () => {
  const activeCategory = useAtomValue(infoBoardSelectedCategory);

  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [addAnnouncementOpen, setAddAnnouncementOpen] = useState(false);

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
