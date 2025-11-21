import { useCallback, useState } from 'react';
import { useCurrentUser } from '@hooks/index';

const useFieldServiceMeetings = () => {
  const { isSecretary, isGroup } = useCurrentUser();

  // -------------------------------------------------------------------------
  // State Management (UI only)
  // -------------------------------------------------------------------------

  const [exportOpen, setExportOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const canManageMeetings = !isGroup && isSecretary;

  // -------------------------------------------------------------------------
  // Dialog Handlers
  // -------------------------------------------------------------------------

  const handleOpenExport = useCallback(() => {
    setExportOpen(true);
  }, []);

  const handleCloseExport = useCallback(() => {
    setExportOpen(false);
  }, []);

  const handleOpenPublish = useCallback(() => {
    setPublishOpen(true);
  }, []);

  const handleClosePublish = useCallback(() => {
    setPublishOpen(false);
  }, []);

  return {
    // UI State
    exportOpen,
    publishOpen,
    canManageMeetings,

    // UI Handlers
    handleOpenExport,
    handleCloseExport,
    handleOpenPublish,
    handleClosePublish,
  };
};

export default useFieldServiceMeetings;
