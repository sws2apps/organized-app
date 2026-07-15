import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { congAccountConnectedState } from '@states/app';

const useMeetingDuties = () => {
  const isConnected = useAtomValue(congAccountConnectedState);

  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [autofillOpen, setAutofillOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const handleOpenQuickSettings = () => setQuickSettingsOpen(true);

  const handleCloseQuickSettings = () => setQuickSettingsOpen(false);

  const handleOpenAutofill = () => setAutofillOpen(true);

  const handleCloseAutofill = () => setAutofillOpen(false);

  const handleOpenPublish = () => setPublishOpen(true);

  const handleClosePublish = () => setPublishOpen(false);

  return {
    isConnected,
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
    autofillOpen,
    handleOpenAutofill,
    handleCloseAutofill,
    publishOpen,
    handleOpenPublish,
    handleClosePublish,
  };
};

export default useMeetingDuties;
