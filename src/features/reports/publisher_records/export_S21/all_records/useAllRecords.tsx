import { useState } from 'react';
import { AllRecordsProps } from './index.types';

const useAllRecords = ({ action }: AllRecordsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    setIsProcessing(true);

    await action();
  };

  return { handleExport, isProcessing };
};

export default useAllRecords;
