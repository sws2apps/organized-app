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
import { useCurrentUser } from '@hooks/index';
import usePerson from '@features/persons/hooks/usePerson';

const useDashboard = () => {
  const { person } = useCurrentUser();

  const { personIsPublisher } = usePerson();

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

  const publisher = useMemo(() => {
    if (!person) return false;

    const isPublisher = personIsPublisher(person);
    return isPublisher;
  }, [person, personIsPublisher]);

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
    publisher,
  };
};

export default useDashboard;
