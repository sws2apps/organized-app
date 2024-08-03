import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sourcesFormattedState } from '@states/sources';

const useWeekend = () => {
  const sources = useRecoilValue(sourcesFormattedState);

  const [openAutofill, setOpenAutofill] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  const hasWeeks = sources.length > 0;

  const handleOpenAutofill = () => setOpenAutofill(true);

  const handleCloseAutofill = () => setOpenAutofill(false);

  const handleOpenExport = () => setOpenExport(true);

  const handleCloseExport = () => setOpenExport(false);

  return {
    hasWeeks,
    handleCloseAutofill,
    handleOpenAutofill,
    openAutofill,
    openExport,
    handleOpenExport,
    handleCloseExport,
  };
};

export default useWeekend;
