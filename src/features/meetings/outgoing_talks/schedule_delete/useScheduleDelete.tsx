import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { ScheduleDeleteType } from './index.types';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';

const useScheduleDelete = ({
  onClose,
  schedule_id,
  week,
}: ScheduleDeleteType) => {
  const setAssignmentsHistory = useSetAtom(assignmentsHistoryState);

  const schedules = useAtomValue(schedulesState);

  const [isProcessing, setIsProcessing] = useState(false);

  const schedule = schedules.find((record) => record.weekOf === week);

  const handleDeleteSchedule = async () => {
    try {
      setIsProcessing(true);

      const outgoingTalks = structuredClone(
        schedule.weekend_meeting.outgoing_talks
      );
      const outgoingSchedule = outgoingTalks.find(
        (record) => record.id === schedule_id
      );

      outgoingSchedule._deleted = true;
      outgoingSchedule.updatedAt = new Date().toISOString();

      await dbSchedUpdate(week, {
        'weekend_meeting.outgoing_talks': outgoingTalks,
      });

      // load assignment history
      const history = schedulesBuildHistoryList();
      setAssignmentsHistory(history);

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
    handleDeleteSchedule,
  };
};

export default useScheduleDelete;
