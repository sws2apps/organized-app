import { useState } from 'react';
import { ScheduleExportType } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useScheduleExport = (onClose: ScheduleExportType['onClose']) => {
  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleExportSchedule = async () => {
    if (isProcessing) return;
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    handleSetStartWeek,
    handleSetEndWeek,
    isProcessing,
    handleExportSchedule,
  };
};

export default useScheduleExport;
