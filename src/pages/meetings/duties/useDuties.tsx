import { useState } from 'react';

const useMeetingDuties = () => {
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [autofillOpen, setAutofillOpen] = useState(false);

  const handleOpenQuickSettings = () => setQuickSettingsOpen(true);

  const handleCloseQuickSettings = () => setQuickSettingsOpen(false);

  const handleOpenAutofill = () => setAutofillOpen(true);

  const handleCloseAutofill = () => setAutofillOpen(false);

  return {
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
    autofillOpen,
    handleOpenAutofill,
    handleCloseAutofill,
  };
};

export default useMeetingDuties;
