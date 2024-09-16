import { useState } from 'react';

const usePublisherRecords = () => {
  const [exportOpen, setExportOpen] = useState(false);

  const handleOpenExport = () => setExportOpen(true);

  const handleCloseExport = () => setExportOpen(false);

  return { exportOpen, handleOpenExport, handleCloseExport };
};

export default usePublisherRecords;
