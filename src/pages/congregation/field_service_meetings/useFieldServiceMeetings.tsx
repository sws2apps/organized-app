import { useCallback, useState } from 'react';
import { useCurrentUser } from '@hooks/index';
import useFieldServiceMeetingsPermissions from '@features/congregation/field_service_meetings/usePermissions';

const useFieldServiceMeetings = () => {
  const { isSecretary, isGroup } = useCurrentUser();
  const { canCreate, canEditGroupTimes } = useFieldServiceMeetingsPermissions();

  const [exportOpen, setExportOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  // Exporting stays with secretaries/admins; adding follows the role rules.
  const canExport = !isGroup && isSecretary;
  const canManageMeetings = canCreate;
  // Quick settings only holds the recurring times: anyone who cannot change
  // them would open a panel of read-only rows.
  const canOpenQuickSettings = canEditGroupTimes();

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
