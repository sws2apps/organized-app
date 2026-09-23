import { useState } from 'react';

const useAnnouncementCard = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return {
    deleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
  };
};

export default useAnnouncementCard;
