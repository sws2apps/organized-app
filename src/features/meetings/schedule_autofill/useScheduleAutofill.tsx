import { useState } from 'react';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { ScheduleAutofillType } from './index.types';
import { schedulesStartAutofill } from '@services/app/autofill';
import { languageGroupsState } from '@states/field_service_groups';
import { useAtomValue } from 'jotai';

const useScheduleAutofill = (
  meeting: ScheduleAutofillType['meeting'],
  onClose: ScheduleAutofillType['onClose']
) => {
  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const languageGroups = useAtomValue(languageGroupsState);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleStartAutoFill = async () => {
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      await schedulesStartAutofill(startWeek, endWeek, meeting, languageGroups);

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
    handleStartAutoFill,
  };
};

export default useScheduleAutofill;
