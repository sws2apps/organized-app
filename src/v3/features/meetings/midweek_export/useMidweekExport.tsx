import { useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { MidweekExportType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';

const useMidweekExport = (onClose: MidweekExportType['onClose']) => {
  const { t } = useAppTranslation();

  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportS140, setExportS140] = useState(false);
  const [exportS89, setExportS89] = useState(false);

  const handleSetStartMonth = (value: string) => setStartMonth(value);

  const handleSetEndMonth = (value: string) => setEndMonth(value);

  const handleToggleS140 = () => setExportS140((prev) => !prev);

  const handleToggleS89 = () => setExportS89((prev) => !prev);

  const handleExportSchedule = async () => {
    if (startMonth.length === 0 || endMonth.length === 0) return;
    if (!exportS140 && !exportS89) return;

    try {
      setIsProcessing(true);

      // se

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    handleSetStartMonth,
    handleSetEndMonth,
    isProcessing,
    handleExportSchedule,
    exportS140,
    exportS89,
    handleToggleS140,
    handleToggleS89,
  };
};

export default useMidweekExport;
