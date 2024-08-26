import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesFormattedState } from '@states/sources';
import { congAccountConnectedState } from '@states/app';

const useWeekend = () => {
  const sources = useRecoilValue(sourcesFormattedState);
  const isConnected = useRecoilValue(congAccountConnectedState);

  const [openAutofill, setOpenAutofill] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  const hasWeeks = sources.length > 0;

  const handleOpenQuickSettings = () => setQuickSettingsOpen(true);

  const handleCloseQuickSettings = () => setQuickSettingsOpen(false);

  const handleOpenAutofill = () => setOpenAutofill(true);

  const handleCloseAutofill = () => setOpenAutofill(false);

  const handleOpenExport = () => setOpenExport(true);

  const handleCloseExport = () => setOpenExport(false);

  const handleOpenPublish = () => setOpenPublish(true);

  const handleClosePublish = () => setOpenPublish(false);

  return {
    hasWeeks,
    handleCloseAutofill,
    handleOpenAutofill,
    openAutofill,
    openExport,
    handleOpenExport,
    handleCloseExport,
    openPublish,
    handleOpenPublish,
    handleClosePublish,
    isConnected,
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  };
};

export default useWeekend;
