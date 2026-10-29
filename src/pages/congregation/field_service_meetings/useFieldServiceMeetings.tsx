import { useCallback, useState } from 'react';
import useFieldServiceMeetingsPermissions from '@features/congregation/field_service_meetings/usePermissions';

const useFieldServiceMeetings = () => {
  const { canCreate } = useFieldServiceMeetingsPermissions();

  const [exportOpen, setExportOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  // Exporting and recurring times follow the scheduling rights.
  const canExport = canCreate;
  const canManageMeetings = canCreate;
  const canOpenQuickSettings = canCreate;

  const handleOpenExport = useCallback(() => {
    setExportOpen(true);
  }, []);

  const handleCloseExport = useCallback(() => {
    setExportOpen(false);
  }, []);

  const handleOpenQuickSettings = useCallback(() => {
    setQuickSettingsOpen(true);
  }, []);

  const handleCloseQuickSettings = useCallback(() => {
    setQuickSettingsOpen(false);
  }, []);

  return {
    exportOpen,
    quickSettingsOpen,
    canExport,
    canManageMeetings,
    canOpenQuickSettings,

    handleOpenExport,
    handleCloseExport,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  };
};

export default useFieldServiceMeetings;
