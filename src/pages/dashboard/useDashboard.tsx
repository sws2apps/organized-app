import { useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  congNewState,
  firstnameState,
  userLocalUIDState,
} from '@states/settings';
import { isMyAssignmentOpenState } from '@states/app';
import { assignmentsHistoryState } from '@states/schedules';
import { getWeekDate } from '@utils/date';

const useDashboard = () => {
  const setIsMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const firstName = useRecoilValue(firstnameState);
  const isCongNew = useRecoilValue(congNewState);
  const userUID = useRecoilValue(userLocalUIDState);
  const assignmentsHistory = useRecoilValue(assignmentsHistoryState);

  const countFutureAssignments = useMemo(() => {
    const now = getWeekDate().toISOString();

    const personAssignments = assignmentsHistory.filter(
      (record) =>
        record.assignment.person === userUID &&
        new Date(record.weekOf).toISOString() >= now
    );

    return personAssignments.length;
  }, [assignmentsHistory, userUID]);

  const handleCloseNewCongNotice = async () => {
    await dbAppSettingsUpdate({ 'cong_settings.cong_new': false });
  };

  const handleOpenMyAssignments = async () => {
    setIsMyAssignmentOpen(true);
  };

  return {
    firstName,
    isCongNew,
    handleCloseNewCongNotice,
    handleOpenMyAssignments,
    countFutureAssignments,
  };
};

export default useDashboard;
