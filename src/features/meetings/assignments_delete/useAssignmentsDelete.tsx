import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { SchedWeekType } from '@definition/schedules';
import { AssignmentsDeleteType } from './index.types';
import {
  scheduleDeleteMidweekWeekAssignments,
  scheduleDeleteWeekendAssignments,
  schedulesBuildHistoryList,
} from '@services/app/schedules';

const useAssignmentsDelete = (
  meeting: AssignmentsDeleteType['meeting'],
  onClose: AssignmentsDeleteType['onClose']
) => {
  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const schedules = useAtomValue(schedulesState);

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleDeleteMeetingAssignments = async (weeksList: SchedWeekType[]) => {
    for await (const schedule of weeksList) {
      if (meeting === 'midweek') {
        await scheduleDeleteMidweekWeekAssignments(schedule);
      }

      if (meeting === 'weekend') {
        await scheduleDeleteWeekendAssignments(schedule);
      }
    }

    // load assignment history
    const history = schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  const handleClearAssignments = async () => {
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      const weeksList = schedules.filter(
        (record) => record.weekOf >= startWeek && record.weekOf <= endWeek
      );

      await handleDeleteMeetingAssignments(weeksList);

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
    handleClearAssignments,
  };
};

export default useAssignmentsDelete;
