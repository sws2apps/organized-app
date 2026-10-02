import { InformationBoardCategory } from '@definition/information_board';
import BranchLetters from '@features/congregation/information_board/branch_letters';
import FrequentlyUsedInformation from '@features/congregation/information_board/frequently_used_information';
import GeneralInformation from '@features/congregation/information_board/general_information';
import LocalAnnouncements from '@features/congregation/information_board/local_announcements';
import {
  infoBoardAddAnnouncementState,
  infoBoardSelectedCategory,
} from '@states/information_board';
import { useAtom, useAtomValue } from 'jotai';
import { ReactNode, useCallback, useState } from 'react';

const useInformationBoard = () => {
  const activeCategory = useAtomValue(infoBoardSelectedCategory);
  const [addAnnouncement, setAddAnnouncement] = useAtom(
    infoBoardAddAnnouncementState
  );

  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

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
    setAddAnnouncement({ open: true, announcementId: null });
  }, [setAddAnnouncement]);

  return {
    currentCategory,
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
    handleOpenAddAnnouncement,
    addAnnouncementOpen: addAnnouncement.open,
  };
};

export default useInformationBoard;
