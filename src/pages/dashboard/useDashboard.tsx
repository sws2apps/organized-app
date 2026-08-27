import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  congNewState,
  firstnameState,
  settingsState,
  shortDateFormatState,
  userLocalUIDState,
} from '@states/settings';
import { isMyAssignmentOpenState } from '@states/app';
import { assignmentsHistoryState } from '@states/schedules';
import { formatDate } from '@utils/date';
import { isTest } from '@constants/index';
import { resolveAssignmentDate } from '@utils/assignments';

const useDashboard = () => {
  const setIsMyAssignmentOpen = useSetAtom(isMyAssignmentOpenState);

  const firstName = useAtomValue(firstnameState);
  const isCongNew = useAtomValue(congNewState);
  const userUID = useAtomValue(userLocalUIDState);
  const assignmentsHistory = useAtomValue(assignmentsHistoryState);
  const shortDateFormat = useAtomValue(shortDateFormatState);
  const settings = useAtomValue(settingsState);

  const [searchParams, setSearchParams] = useSearchParams();

  const isMigrated = useMemo(() => {
    return settings.cong_settings.cong_migrated ?? false;
  }, [settings]);

  const initialSnackValue = useMemo(() => {
    return !isMigrated && isCongNew && !isTest;
  }, [isCongNew, isMigrated]);

  const [newCongSnack, setNewCongSnack] = useState(initialSnackValue);

  const countFutureAssignments = useMemo(() => {
    const now = new Date();

    const remapAssignmentsDate = assignmentsHistory.map((record) =>
      resolveAssignmentDate(record, shortDateFormat)
    );

    const personAssignments = remapAssignmentsDate.filter(
      (record) =>
        record.assignment.person === userUID &&
        record.weekOf >= formatDate(now, 'yyyy/MM/dd')
    );

    return personAssignments.length;
  }, [assignmentsHistory, shortDateFormat, userUID]);

  const handleCloseNewCongNotice = async () => {
    setNewCongSnack(false);
  };

  const handleOpenMyAssignments = async () => {
    setIsMyAssignmentOpen(true);
  };

  // Handle PWA shortcut deep-link for "My assignments".
  // Unlike other shortcuts that navigate to dedicated routes,
  // assignments open as a modal on the dashboard, hence the query param approach.
  useEffect(() => {
    if (searchParams.get('action') === 'assignments') {
      setIsMyAssignmentOpen(true);

      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, setIsMyAssignmentOpen]);

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
