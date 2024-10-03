import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import {
  accountTypeState,
  settingsState,
  userLocalUIDState,
} from '@states/settings';
import { congAccountConnectedState } from '@states/app';
import { formatDate } from '@services/dateformat';
import usePerson from '@features/persons/hooks/usePerson';

const useCurrentUser = () => {
  const {
    personIsEnrollmentActive,
    personIsBaptizedPublisher,
    personIsPublisher,
  } = usePerson();

  const userUID = useRecoilValue(userLocalUIDState);
  const persons = useRecoilValue(personsState);
  const settings = useRecoilValue(settingsState);
  const connected = useRecoilValue(congAccountConnectedState);
  const accountType = useRecoilValue(accountTypeState);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === userUID);
  }, [persons, userUID]);

  const first_report = useMemo(() => {
    if (!person) return;

    // get all status history
    let history = [
      ...person.person_data.publisher_unbaptized.history,
      ...person.person_data.publisher_baptized.history,
    ];

    history = history.filter(
      (record) => !record._deleted && record.start_date?.length > 0
    );

    history.sort((a, b) => a.start_date.localeCompare(b.start_date));

    if (history.length === 0) return;

    const firstDate = new Date(history.at(0).start_date);

    return formatDate(firstDate, 'yyyy/MM');
  }, [person]);

  const enable_AP_application = useMemo(() => {
    if (!connected) return false;

    if (!person) return false;

    if (!settings.cong_settings.data_sync.value) return false;

    const isBaptized = personIsBaptizedPublisher(person);

    if (!isBaptized) return false;

    const isAP = personIsEnrollmentActive(person, 'AP');
    const isFMF = personIsEnrollmentActive(person, 'FMF');
    const isFR = personIsEnrollmentActive(person, 'FR');
    const isFS = personIsEnrollmentActive(person, 'FS');

    const hasEnrollments = isAP || isFMF || isFR || isFS;

    return !hasEnrollments;
  }, [
    connected,
    person,
    personIsBaptizedPublisher,
    personIsEnrollmentActive,
    settings,
  ]);

  const isPublisher = useMemo(() => {
    if (!person) return false;

    return personIsPublisher(person);
  }, [person, personIsPublisher]);

  const userRole = useMemo(() => {
    return settings.user_settings.cong_role;
  }, [settings]);

  const isAdmin = useMemo(() => {
    return userRole.some(
      (role) =>
        role === 'admin' || role === 'coordinator' || role === 'secretary'
    );
  }, [userRole]);

  const isElder = useMemo(() => {
    if (isAdmin) return true;

    return userRole.includes('elder');
  }, [isAdmin, userRole]);

  const isServiceCommittee = useMemo(() => {
    if (isAdmin) return true;

    // only check for service overseer since coordinator and secretary are already admin
    return userRole.includes('service_overseer');
  }, [isAdmin, userRole]);

  const isPersonEditor = useMemo(() => {
    if (isAdmin) return true;

    return userRole.some(
      (role) => role === 'midweek_schedule' || role === 'weekend_schedule'
    );
  }, [isAdmin, userRole]);

  const isAttendanceEditor = useMemo(() => {
    if (isAdmin) return true;

    return userRole.includes('attendance_tracking');
  }, [isAdmin, userRole]);

  const isAppointed = useMemo(() => {
    if (isAdmin) return true;

    return userRole.some((role) => role === 'elder' || role === 'ms');
  }, [isAdmin, userRole]);

  const isMidweekEditor = useMemo(() => {
    if (isAdmin) return true;

    return userRole.includes('midweek_schedule');
  }, [isAdmin, userRole]);

  const isWeekendEditor = useMemo(() => {
    if (isAdmin) return true;

    return userRole.includes('weekend_schedule');
  }, [isAdmin, userRole]);

  return {
    person,
    first_report,
    enable_AP_application,
    isAdmin,
    isPublisher,
    isServiceCommittee,
    isElder,
    isPersonEditor,
    isAttendanceEditor,
    isAppointed,
    isMidweekEditor,
    isWeekendEditor,
    accountType,
  };
};

export default useCurrentUser;
