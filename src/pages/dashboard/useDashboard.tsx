import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  congNewState,
  firstnameState,
  settingsState,
  userLocalUIDState,
} from '@states/settings';
import { isMyAssignmentOpenState } from '@states/app';
import { assignmentsHistoryState } from '@states/schedules';
import { getWeekDate } from '@utils/date';
import { isDemo } from '@constants/index';
import { formatDate } from '@services/dateformat';

const useDashboard = () => {
  const setIsMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const firstName = useRecoilValue(firstnameState);
  const isCongNew = useRecoilValue(congNewState);
  const userUID = useRecoilValue(userLocalUIDState);
  const assignmentsHistory = useRecoilValue(assignmentsHistoryState);
  const settings = useRecoilValue(settingsState);

  const isMigrated = useMemo(() => {
    return settings.cong_settings.cong_migrated ?? false;
  }, [settings]);

  const initialSnackValue = useMemo(() => {
    return !isMigrated && isCongNew && !isDemo;
  }, [isCongNew, isMigrated]);

  const [newCongSnack, setNewCongSnack] = useState(initialSnackValue);

  const countFutureAssignments = useMemo(() => {
    const now = formatDate(getWeekDate(), 'yyyy/MM/dd');

    const personAssignments = assignmentsHistory.filter(
      (record) =>
        record.assignment.person === userUID &&
        formatDate(new Date(record.weekOf), 'yyyy/MM/dd') >= now
    );

    return personAssignments.length;
  }, [assignmentsHistory, userUID]);

  const handleCloseNewCongNotice = async () => {
    setNewCongSnack(false);
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
    isMigrated,
    newCongSnack,
  };
};

export default useDashboard;
