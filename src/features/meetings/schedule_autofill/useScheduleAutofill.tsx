import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { ScheduleAutofillType } from './index.types';
import { schedulesStartAutofill } from '@services/app/autofill';
import { selectedWeekState } from '@states/schedules';

const useScheduleAutofill = (
  meeting: ScheduleAutofillType['meeting'],
  onClose: ScheduleAutofillType['onClose']
) => {
  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const setSelectedWeek = useSetAtom(selectedWeekState);

  const handleSetStartWeek = (value: string) => {
    setStartWeek(value);
    if (value > endWeek) setEndWeek('');
  };

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const canAutofill =
    !!startWeek && !!endWeek && startWeek <= endWeek && !isProcessing;
  const handleStartAutoFill = async () => {
    if (!canAutofill) return;
    try {
      setIsProcessing(true);

      await schedulesStartAutofill(startWeek, endWeek, meeting);

      setSelectedWeek(startWeek);

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      setIsProcessing(false);
      onClose?.();
      const errMessage = error instanceof Error ? error.message : String(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(errMessage),
        severity: 'error',
      });
    }
  };

  return {
    startWeek,
    endWeek,
    canAutofill,
    handleSetStartWeek,
    handleSetEndWeek,
    isProcessing,
    handleStartAutoFill,
  };
};

export default useScheduleAutofill;
