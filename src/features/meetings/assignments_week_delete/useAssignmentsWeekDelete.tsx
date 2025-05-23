import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { SchedWeekType } from '@definition/schedules';
import {
  scheduleDeleteMidweekWeekAssignments,
  scheduleDeleteWeekendAssignments,
  scheduleDeleteWeekendOutgoingTalk,
  schedulesBuildHistoryList,
} from '@services/app/schedules';
import { AssignmentsWeekDeleteType } from './index.types';

const useAssignmentsWeekDelete = (
  week: AssignmentsWeekDeleteType['week'],
  meeting: AssignmentsWeekDeleteType['meeting'],
  onClose: AssignmentsWeekDeleteType['onClose'],
  schedule_id: AssignmentsWeekDeleteType['schedule_id']
) => {
  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const schedules = useAtomValue(schedulesState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteAssignments = async (schedule: SchedWeekType) => {
    if (meeting === 'midweek') {
      await scheduleDeleteMidweekWeekAssignments(schedule);
    }

    if (meeting === 'weekend' && !schedule_id) {
      await scheduleDeleteWeekendAssignments(schedule);
    }

    if (meeting === 'weekend' && schedule_id) {
      await scheduleDeleteWeekendOutgoingTalk(schedule, schedule_id);
    }

    // load assignment history
    const history = schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  const handleClearAssignments = async () => {
    try {
      setIsProcessing(true);

      const schedule = schedules.find((record) => record.weekOf === week);

      await handleDeleteAssignments(schedule);

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
    isProcessing,
    handleClearAssignments,
  };
};

export default useAssignmentsWeekDelete;
