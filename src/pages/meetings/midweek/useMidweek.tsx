import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesFormattedState } from '@states/sources';
import { congAccountConnectedState } from '@states/app';

const useMidweek = () => {
  const sources = useRecoilValue(sourcesFormattedState);
  const isConnected = useRecoilValue(congAccountConnectedState);

  const [openAutofill, setOpenAutofill] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  const [openWeekView, setOpenWeekView] = useState(true);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  const handleOpenQuickSettings = () => setQuickSettingsOpen(true);

  const handleCloseQuickSettings = () => setQuickSettingsOpen(false);

  const hasWeeks = sources.length > 0;

  const handleOpenAutofill = () => setOpenAutofill(true);

  const handleCloseAutofill = () => setOpenAutofill(false);

  const handleOpenExport = () => setOpenExport(true);

  const handleCloseExport = () => setOpenExport(false);

  const handleOpenPublish = () => setOpenPublish(true);

  const handleClosePublish = () => setOpenPublish(false);

  const handleOpenWeekView = () => setOpenWeekView(true);

  const handleCloseWeekView = () => setOpenWeekView(false);

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
    openWeekView,
    handleOpenWeekView,
    handleCloseWeekView,
  };
};

export default useMidweek;
