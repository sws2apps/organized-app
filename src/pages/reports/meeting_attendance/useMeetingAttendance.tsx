import { useState } from 'react';

const useMeetingAttendance = () => {
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  const handleOpenQuickSettings = () => setQuickSettingsOpen(true);

  const handleCloseQuickSettings = () => setQuickSettingsOpen(false);

  return {
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  };
};

export default useMeetingAttendance;
