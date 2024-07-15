import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { schedulesState } from '@states/schedules';
import { SchedWeekType } from '@definition/schedules';
import { AssignmentsDeleteType } from './index.types';
import { scheduleDeleteMidweekWeekAssignments } from '@services/app/schedules';

const useAssignmentsDelete = (meeting: AssignmentsDeleteType['meeting'], onClose: AssignmentsDeleteType['onClose']) => {
  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleDeleteMidweek = async (weeksList: SchedWeekType[]) => {
    for await (const schedule of weeksList) {
      await scheduleDeleteMidweekWeekAssignments(schedule);
    }
  };

  const handleClearAssignments = async () => {
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      const weeksList = schedules.filter((record) => record.weekOf >= startWeek && record.weekOf <= endWeek);

      if (meeting === 'midweek') {
        await handleDeleteMidweek(weeksList);
      }

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
    handleSetStartWeek,
    handleSetEndWeek,
    isProcessing,
    handleClearAssignments,
  };
};

export default useAssignmentsDelete;
