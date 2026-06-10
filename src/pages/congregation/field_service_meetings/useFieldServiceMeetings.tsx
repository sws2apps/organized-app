import { useCallback, useState } from 'react';
import { useCurrentUser } from '@hooks/index';
import useFieldServiceMeetingsPermissions from '@features/congregation/field_service_meetings/usePermissions';

const useFieldServiceMeetings = () => {
  const { isSecretary, isGroup } = useCurrentUser();
  const { canCreate } = useFieldServiceMeetingsPermissions();

  // -------------------------------------------------------------------------
  // State Management (UI only)
  // -------------------------------------------------------------------------

  const [exportOpen, setExportOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  // Exporting the schedule stays with secretaries/admins; creating meetings is
  // governed by the role-aware permissions (group overseers, service overseer…).
  const canExport = !isGroup && isSecretary;
  const canManageMeetings = canCreate;

  // -------------------------------------------------------------------------
  // Dialog Handlers
  // -------------------------------------------------------------------------

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
    // UI State
    exportOpen,
    quickSettingsOpen,
    canExport,
    canManageMeetings,

    // UI Handlers
    handleOpenExport,
    handleCloseExport,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  };
};

export default useFieldServiceMeetings;
