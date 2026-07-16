import { useCallback, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { fieldServiceMeetingsEditingIdState } from '@states/field_service_meetings';
import useFieldServiceMeetingsPermissions from '@features/congregation/field_service_meetings/usePermissions';

const useFieldServiceMeetings = () => {
  const { isSecretary, isGroup } = useCurrentUser();
  const { canCreate } = useFieldServiceMeetingsPermissions();

  const setEditingMeetingId = useSetAtom(fieldServiceMeetingsEditingIdState);

  // Discard any open add/edit form when the page unmounts so it does not
  // reappear on the next visit (the editing id lives in a shared atom).
  useEffect(() => {
    return () => setEditingMeetingId(null);
  }, [setEditingMeetingId]);

  const [exportOpen, setExportOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  // Exporting the schedule stays with secretaries/admins; creating meetings is
  // governed by the role-aware permissions (group overseers, service overseer…).
  const canExport = !isGroup && isSecretary;
  const canManageMeetings = canCreate;

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
